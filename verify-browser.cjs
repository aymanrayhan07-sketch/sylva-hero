const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9222;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('1. Launching headless Edge...');
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1600,900',
    'http://localhost:5173/'
  ]);

  browserProc.on('error', err => {
    console.error('Failed to start browser:', err);
  });

  let version = null;
  for (let i = 0; i < 20; i++) {
    try {
      version = await getJson(`http://127.0.0.1:${port}/json/version`);
      if (version) break;
    } catch (e) {
      await sleep(500);
    }
  }

  if (!version) {
    console.error('Browser failed to start in time');
    browserProc.kill();
    process.exit(1);
  }

  console.log('Browser connected:', version.Browser);

  await sleep(2000);
  const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
  const pageTarget = targets.find(t => t.type === 'page');
  if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
    console.error('No page target found');
    browserProc.kill();
    process.exit(1);
  }

  console.log('2. Connecting CDP WebSocket to', pageTarget.title, '...');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const callbacks = new Map();
  const consoleLogs = [];
  const errors = [];

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  ws.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    } else if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
      consoleLogs.push(`[${msg.params.type}] ${text}`);
      if (msg.params.type === 'error') {
        errors.push(`Console error: ${text}`);
      }
    } else if (msg.method === 'Runtime.exceptionThrown') {
      errors.push(`Exception: ${msg.params.exceptionDetails.text}`);
    }
  };

  await sendCommand('Runtime.enable');
  await sendCommand('Page.enable');
  await sendCommand('DOM.enable');

  console.log('3. Waiting for page and iframe to load...');
  await sleep(4000);

  // Evaluate state in parent window
  const parentCheck = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const iframe = document.querySelector('iframe');
      if (!iframe) return { iframeFound: false };
      return {
        iframeFound: true,
        iframeSrc: iframe.src,
        iframeWidth: iframe.clientWidth,
        iframeHeight: iframe.clientHeight,
        ready: iframe.parentElement.getAttribute('data-state')
      };
    })()`,
    returnByValue: true
  });
  console.log('Parent inspection:', parentCheck.result?.value);

  // Take screenshot
  console.log('4. Capturing screenshot...');
  const screenshotResult = await sendCommand('Page.captureScreenshot', { format: 'png' });
  if (screenshotResult.data) {
    fs.writeFileSync('screenshot.png', Buffer.from(screenshotResult.data, 'base64'));
    console.log('Screenshot saved to screenshot.png (size:', screenshotResult.data.length, 'base64 bytes)');
  }

  // Simulate mouse movement for parallax & dock interaction
  console.log('5. Testing mouse interaction...');
  await sendCommand('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 800,
    y: 200
  });
  await sleep(500);

  await sendCommand('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 644,
    y: 360
  });
  await sleep(1000);

  // Capture second screenshot after interaction
  const screenshotAfter = await sendCommand('Page.captureScreenshot', { format: 'png' });
  if (screenshotAfter.data) {
    fs.writeFileSync('screenshot-interacted.png', Buffer.from(screenshotAfter.data, 'base64'));
    console.log('Screenshot after interaction saved to screenshot-interacted.png');
  }

  ws.close();
  browserProc.kill();

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log('Console logs captured:', consoleLogs.length);
  consoleLogs.forEach(l => console.log('  ', l));
  console.log('Errors captured:', errors.length);
  errors.forEach(e => console.error('  ', e));

  if (errors.length === 0 && parentCheck.result?.value?.iframeFound) {
    console.log('\nSUCCESS: Page rendered successfully with zero errors and working interaction!');
  } else {
    console.error('\nFAILURE: Inspection detected errors.');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
