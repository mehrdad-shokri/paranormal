// @flow
import promisify from 'typeable-promisify';
import fs, { type FSWatcher } from 'fs';
import _mkdirp from 'mkdirp';
import tempy from 'tempy';
import globby from 'globby';
import micromatch from 'micromatch';
import path from 'path';
import chokidar from 'chokidar';

export function readFile(filePath: string) {
  return promisify(cb => fs.readFile(filePath, cb));
}

export function writeFile(filePath: string, fileContents: string | Buffer) {
  return promisify(cb => fs.writeFile(filePath, fileContents, cb));
}

export function stat(filePath: string) {
  return promisify(cb => fs.stat(filePath, cb));
}

export function lstat(filePath: string) {
  return promisify(cb => fs.lstat(filePath, cb));
}

export function readdir(filePath: string) {
  return promisify(cb => fs.readdir(filePath, cb));
}

export function unlink(filePath: string) {
  return promisify(cb => fs.unlink(filePath, cb));
}

export function mkdirp(dirPath: string) {
  return promisify(cb => _mkdirp(dirPath, cb));
}

export function tempdir() {
  return tempy.directory();
}

export async function findGlobPatterns(cwd: string, patterns: Array<string>) {
  let matches = await globby(patterns, { cwd });
  return matches.map(match => path.join(cwd, match));
}

export function matchesGlobPatterns(filePath: string, patterns: Array<string>) {
  return micromatch.every(filePath, patterns);
}

export function watchDirectory(dirPath: string): FSWatcher {
  return chokidar.watch(dirPath, {
    recursive: true,
    encoding: 'utf8',
    persistent: true,
    ignoreInitial: true,
  });
}
