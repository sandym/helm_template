#!/usr/bin/env node

import { Command } from 'commander';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import watcher from '@parcel/watcher';

const program = new Command();

function collect(value : string, previous : string[]) {
  return previous.concat([value]);
}

program
  .description('Run `helm template` command on file edit.')
  .option('--values <values>', 'YAML values file', collect, [])
  .option('--set <set>', 'Single value to set', collect, [])
  .option('--namespace <namespace>', 'Single value to set')
  .argument('<chart>', 'helm chart path');

program.parse();

const options = program.opts();

// find output file path
const chartPath = program.args[0] as string;
const fileOutput = path.dirname(chartPath) + '/output.yaml';

// build the commands
let templateCmd = 'helm template ';
let lintCmd = 'helm lint ';
if (options.values) {
  options.values.forEach((value : String) => {
	templateCmd += `--values ${value} `;
	lintCmd += `--values ${value} `;
  });
}
if (options.set) {
  options.set.forEach((value : String) => {
	templateCmd += `--set ${value} `;
	lintCmd += `--set ${value} `;
  });
}
if (options.namespace) {
  templateCmd += `--namespace ${options.namespace} `;
  lintCmd += `--namespace ${options.namespace} `;
}
templateCmd += chartPath;
lintCmd += chartPath;

console.log(`Running command: ${templateCmd}`);
console.log(`Output will be saved to: ${fileOutput}`);

// execute the command
function runCommand() {
  try {
	const output = execSync(templateCmd, { stdio: 'inherit' }).toString();
	fs.writeFileSync( fileOutput, output );
	const lint = execSync( lintCmd ).toString().split(/\r?\n/);
	lint.forEach( (part, index) =>
			{
				lint[index] = `# ${part}`;
			}, lint );
	lint.unshift( '####', '#' );
	lint.push( '####' );
	fs.appendFileSync( fileOutput, lint.join('\n') );	
  } catch (error) {
	console.error(`Error executing command: ${error}`);
  }
}

runCommand();

// watch chartPath
let inProgress = false;
let subscription = await watcher.subscribe(chartPath,
	(err, events) => {
	    if ( inProgress )
            return;
		inProgress = true;
		// console.log(events);
		setTimeout( () => {
			console.log(`Detected changes in ${chartPath}. Re-running command...`);
			runCommand();
			inProgress = false;
		}, 100);
});
