import { spawn } from 'node:child_process';

const testFiles = ['./tests/auth.test.js', './tests/product.test.js'];

const child = spawn(process.execPath, ['--test', ...testFiles], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'test',
  },
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
