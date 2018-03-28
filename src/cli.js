// @flow
import meow from 'meow';
import path from 'path';
import chalk from 'chalk';
import paranormal, { type ParanormalOptions } from './';

function cliToOptions(input, flags): ParanormalOptions {
  let match = input;
  let cwd;

  if (typeof flags.cwd === 'undefined') {
    cwd = process.cwd();
  } else if (typeof flags.cwd === 'string') {
    cwd = path.resolve(process.cwd(), flags.cwd);
  } else {
    throw new Error(`The flag \`--cwd=<path>\` requires a path`);
  }

  let watch;
  if (typeof flags.watch === 'undefined') {
    watch = false;
  } else if (typeof flags.watch === 'boolean') {
    watch = flags.watch;
  } else {
    throw new Error(`The flag \`--watch/-w\` does not accept an argument`);
  }

  return { match, cwd, watch };
}

export default async function cli(argv: Array<string>) {
  let start = Date.now();

  let { pkg, input, flags } = meow({
    argv,
    help: `
      Usage
        $ paranormal <...globs> <...flags>

      Flags
        --watch, -w   Watch files and update on changes
        --cwd <dir>   Set the current working directory
    `,
  });

  console.error(
    chalk.bold.cyan(
      `👻  Paranormal ${pkg.version} (node: ${process.versions.node})`,
    ),
  );

  let opts = cliToOptions(input, flags);

  await paranormal(opts);

  if (!opts.watch) {
    let timing = (Date.now() - start) / 1000;
    let rounded = Math.round(timing * 100) / 100;

    console.error(chalk.dim(`💀  Done in ${rounded}s.`));
  }
}
