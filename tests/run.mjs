import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const loaderUrl = 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./tests/loader.mjs"));';

const args = [
  '--experimental-strip-types',
  '--import',
  loaderUrl,
  '--test',
  'tests/phone.test.mjs',
  'tests/orders-store.test.mjs',
  'tests/track-api.test.mjs',
  'tests/middleware-auth.test.mjs',
];

const result = spawnSync(process.execPath, args, {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env },
});

process.exit(result.status ?? 0);
