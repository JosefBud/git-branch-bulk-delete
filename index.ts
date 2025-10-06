import { checkbox, confirm } from '@inquirer/prompts';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs/promises';

const ANSI = {
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  NC: '\x1b[0m', // no color
};

const PROTECTED_BRANCHES = [
  'main',
  'master',
  'development',
  'dev',
  'production',
  'prod',
  'staging',
];

const possiblePath = process.argv.at(-1);
if (!possiblePath) {
  console.error('No arguments found, somehow. How did you run this? Sorcery?');
  process.exit(1);
}

if (possiblePath === 'index.ts' || possiblePath.endsWith('index.ts')) {
  console.error('No path argument found. Please provide a path.');
  console.error(
    `e.g. ${ANSI.YELLOW}git-branch-d $(pwd)${ANSI.NC} - where ${ANSI.YELLOW}git-branch-d${ANSI.NC} is an alias to the start script - to delete branches in your current directory.`,
  );
  process.exit(1);
}

const pathExists = await fs.exists(possiblePath);
if (!pathExists) {
  console.error(
    `The path provided, ${ANSI.YELLOW}${possiblePath}${ANSI.RED}, does not exist.${ANSI.NC}`,
  );
  process.exit(1);
}

const stats = await fs.stat(possiblePath);
if (!stats.isDirectory()) {
  console.error(
    `${ANSI.YELLOW}${possiblePath}${ANSI.RED} is not a directory${ANSI.NC}`,
  );
  process.exit(1);
}

const gitDirExists = await fs.exists(path.join(possiblePath, '.git'));
if (!gitDirExists) {
  console.error(
    `No .git directory exists at ${ANSI.YELLOW}${possiblePath}${ANSI.NC}`,
  );
  process.exit(1);
}

const branchOutput = execSync('git branch', {
  encoding: 'utf8',
  cwd: possiblePath,
});
const branches = branchOutput
  .split('\n')
  .map((branch) => branch.replace(/^\*?\s*/, '').trim())
  .filter(
    (branch) => branch.length > 0 && !PROTECTED_BRANCHES.includes(branch),
  );

if (!branches.length) {
  console.warn(
    `No unprotected branches found at ${ANSI.YELLOW}${possiblePath}${ANSI.NC}`,
  );
  process.exit(0);
}

const selectedBranches = await checkbox({
  message: `Select which branches you want to delete.`,

  choices: branches.map((branch) => ({
    name: branch,
    value: branch,
  })),
  loop: false,
  pageSize: 10,
});

if (!selectedBranches.length) {
  console.log(`${ANSI.GREEN}No branches selected. Exiting.${ANSI.NC}`);
  process.exit(0);
}

const confirmation = await confirm({
  message:
    'Selected branches:\n' +
    selectedBranches.map((b) => `    • ${b}`).join('\n') +
    '\nAre you sure you want to irreversibly delete the above branches?',
  default: true,
});

if (!confirmation) {
  console.log(`${ANSI.GREEN}No branches deleted.${ANSI.NC}`);
  process.exit(0);
}

const commandToRun = `git branch -D ${selectedBranches.join(' ')}`;
const output = execSync(commandToRun, {
  encoding: 'utf-8',
  cwd: possiblePath,
  stdio: 'pipe',
});
console.log(output);
