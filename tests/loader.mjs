import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const srcDir = path.resolve(process.cwd(), 'src');

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server') {
    return nextResolve('next/server.js', context);
  }
  let target = specifier;
  if (target.startsWith('@/')) {
    target = path.join(srcDir, target.slice(2));
  }
  if (target.startsWith('file:///')) {
    const filePath = new URL(target).pathname;
    const norm = process.platform === 'win32' && filePath.startsWith('/') ? filePath.slice(1) : filePath;
    target = norm;
  }
  if (!target.startsWith('node:') && !target.startsWith('http') && !target.match(/^[a-z0-9@_-]+$/i)) {
    if (!existsSync(target)) {
      if (existsSync(target + '.ts')) target = target + '.ts';
      else if (existsSync(target + '.tsx')) target = target + '.tsx';
      else if (existsSync(target + '.js')) target = target + '.js';
      else if (existsSync(path.join(target, 'index.ts'))) target = path.join(target, 'index.ts');
    }
    if (existsSync(target)) {
      return nextResolve(pathToFileURL(target).href, context);
    }
  }
  return nextResolve(specifier, context);
}
