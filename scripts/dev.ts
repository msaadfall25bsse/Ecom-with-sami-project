import { spawn } from 'child_process';

console.log('\x1b[36m%s\x1b[0m', '==================================================');
console.log('\x1b[36m%s\x1b[0m', '🚀 Launching SAMI Full-Stack Dev Environment');
console.log('\x1b[36m%s\x1b[0m', '   - Backend API Server: http://localhost:5000');
console.log('\x1b[36m%s\x1b[0m', '   - Frontend Web App:   http://localhost:3000');
console.log('\x1b[36m%s\x1b[0m', '==================================================\n');

const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

// 1. Start Backend API Server with watch mode
const serverProcess = spawn(npxCmd, ['tsx', 'watch', 'server/index.ts'], {
  stdio: 'inherit',
  shell: isWin,
  env: { ...process.env, PORT: '5000' }
});

// 2. Start Vike Frontend Dev Server
const viteProcess = spawn(npxCmd, ['vike', 'dev'], {
  stdio: 'inherit',
  shell: isWin
});

const cleanup = () => {
  if (serverProcess && !serverProcess.killed) {
    try { serverProcess.kill(); } catch {}
  }
  if (viteProcess && !viteProcess.killed) {
    try { viteProcess.kill(); } catch {}
  }
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
