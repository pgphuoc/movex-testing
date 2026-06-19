const fs = require('fs');
const path = require('path');

class ModuleReporter {
  constructor() {
    this.testsByFile = {};
  }

  onTestEnd(test, result) {
    const file = test.location.file;
    if (!this.testsByFile[file]) {
      this.testsByFile[file] = [];
    }

    // Extract error
    let error = null;
    if (result.errors && result.errors.length > 0) {
      error = result.errors.map(e => e.message || e.value).join('\n');
    }

    // Extract attachments (screenshot, video, api-log)
    let screenshot = null;
    let video = null;
    let apiLog = null;
    
    // Prioritize permanent screenshot from reports/screenshots/
    const match = test.title.match(/^([A-Z0-9-]+):/);
    const testId = match ? match[1] : null;
    const safeTitleName = test.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
    const screenshotFilename = testId ? `${testId}.png` : `${safeTitleName}.png`;
    const permScreenshotPath = path.join(__dirname, '..', 'reports', 'screenshots', screenshotFilename);
    
    if (fs.existsSync(permScreenshotPath)) {
      screenshot = `reports/screenshots/${screenshotFilename}`;
    } else if (result.attachments) {
      let screenshotAttachment = result.attachments.find(a => a.name === 'screenshot' || (a.contentType && a.contentType.includes('image')));
      if (screenshotAttachment && fs.existsSync(screenshotAttachment.path)) {
        try {
          const targetPath = path.join(__dirname, '..', 'reports', 'screenshots', screenshotFilename);
          const targetDir = path.dirname(targetPath);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          fs.copyFileSync(screenshotAttachment.path, targetPath);
          screenshot = `reports/screenshots/${screenshotFilename}`;
        } catch (e) {
          console.warn(`Failed to copy screenshot for ${test.title}:`, e.message);
          screenshot = screenshotAttachment.path;
          if (path.isAbsolute(screenshot)) {
            screenshot = path.relative(path.join(__dirname, '..'), screenshot).replace(/\\/g, '/');
          }
        }
      }
    }

    if (result.attachments) {
      const videoAttachment = result.attachments.find(a => a.name === 'video' || (a.contentType && a.contentType.includes('video')));
      if (videoAttachment && fs.existsSync(videoAttachment.path)) {
        try {
          const videoFilename = testId ? `${testId}.webm` : `${safeTitleName}.webm`;
          const targetPath = path.join(__dirname, '..', 'reports', 'videos', videoFilename);
          const targetDir = path.dirname(targetPath);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          fs.copyFileSync(videoAttachment.path, targetPath);
          video = `reports/videos/${videoFilename}`;
        } catch (e) {
          console.warn(`Failed to copy video for ${test.title}:`, e.message);
          video = videoAttachment.path;
          if (path.isAbsolute(video)) {
            video = path.relative(path.join(__dirname, '..'), video).replace(/\\/g, '/');
          }
        }
      }
      
      const apiLogAttachment = result.attachments.find(a => a.name === 'api-log');
      if (apiLogAttachment) {
        if (apiLogAttachment.body) {
          apiLog = typeof apiLogAttachment.body === 'string' ? apiLogAttachment.body : apiLogAttachment.body.toString('utf8');
        } else if (apiLogAttachment.path) {
          try {
            apiLog = fs.readFileSync(apiLogAttachment.path, 'utf8');
          } catch (e) {
            console.warn('Could not read api-log attachment:', e.message);
          }
        }
      }
    }

    // Extract skip reason
    let skipReason = null;
    if (test.annotations && test.annotations.length > 0) {
      const skipAnno = test.annotations.find(a => a.type === 'skip' || a.type === 'fixme');
      if (skipAnno) {
        skipReason = skipAnno.description || null;
      }
    }

    // Status mapping
    let status = 'skipped';
    if (result.status === 'passed') status = 'passed';
    else if (result.status === 'failed' || result.status === 'timedOut') status = 'failed';
    else if (result.status === 'skipped') status = 'skipped';

    this.testsByFile[file].push({
      title: test.title,
      status,
      duration: result.duration,
      error,
      screenshot,
      video,
      apiLog,
      skipReason
    });
  }

  onEnd(result) {
    const reportsDir = path.join(__dirname, '..', 'reports', 'modules');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    for (const file in this.testsByFile) {
      const relPath = path.relative(path.join(__dirname, '..'), file).replace(/\\/g, '/');
      // Determine module ID from path e.g. specs/pricing/pricing.spec.js -> pricing
      const parts = relPath.split('/');
      const moduleId = parts[1]; // 'pricing', 'cost', etc.
      
      if (moduleId) {
        const destFile = path.join(reportsDir, `${moduleId}.json`);
        
        // Calculate summary
        const tests = this.testsByFile[file];
        const passed = tests.filter(t => t.status === 'passed').length;
        const failed = tests.filter(t => t.status === 'failed').length;
        const skipped = tests.filter(t => t.status === 'skipped').length;

        const data = {
          moduleId,
          specFile: relPath,
          lastRun: new Date().toISOString().slice(0, 19).replace('T', ' '),
          summary: {
            passed,
            failed,
            skipped,
            total: tests.length
          },
          tests
        };
        fs.writeFileSync(destFile, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Saved module report: ${destFile}`);
      }
    }
  }
}

module.exports = ModuleReporter;
