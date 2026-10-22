import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
if (!existsSync('.env')) {
  writeFileSync(
    '.env',
    readFileSync('.env.example', 'utf8').replace(
      'replace-with-a-random-secret-at-least-32-characters',
      randomBytes(32).toString('hex'),
    ),
  );
  console.log('Created .env with a random local rate-limit secret.');
}
const run = (command, args) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) process.exit(result.status || 1);
};
if ((readFileSync('.env', 'utf8').match(/^AUTH_SECRET="?([^"\r\n]*)/m)?.[1]?.length || 0) < 32) {
  writeFileSync(
    '.env',
    readFileSync('.env', 'utf8').replace(/^AUTH_SECRET=.*\r?\n?/m, '') +
      `\nAUTH_SECRET="${randomBytes(32).toString('hex')}"\n`,
  );
}
run('docker', ['compose', 'up', '-d', '--wait', 'db']);
run('npx', ['prisma', 'generate']);
run('npx', ['prisma', 'migrate', 'deploy']);
