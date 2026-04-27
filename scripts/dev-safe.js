const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const cwd = process.cwd();
const devDir = path.join(cwd, '.next-dev');
const legacyDir = path.join(cwd, '.next');

for (const target of [devDir, legacyDir]) {
  try {
    fs.rmSync(target, { recursive: true, force: true });
  } catch (error) {
    console.warn(`Unable to clear ${path.basename(target)} before dev start:`, error.message);
  }
}

const args = ['next', 'dev', ...process.argv.slice(2)];
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const child = spawn(command, args, {
  stdio: 'inherit',
  cwd,
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
