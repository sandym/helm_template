/*
	Helper script to work on a helm chart. It runs `helm template` on every
	file edit. Just look at `tmpl.yaml` to see real-time manifest updates.
*/

const chokidar = require( 'chokidar' );
const execSync = require( 'child_process' ).execSync;
const fs = require( 'fs' );

const hemlDir = process.argv.pop();
const tmplFile = `${hemlDir}/../tmpl.yaml`;

var args = ' ';
process.argv.slice( 2 ).forEach((arg : string) =>
{
	args += ` '${arg}'`;
});

const watcher = chokidar.watch(
	`${hemlDir}/**`,
	{ persistent: true }
);

var inProgress = false;
watcher.on( 'all',
	() =>
	{
		if ( inProgress )
			return;
		inProgress = true;

		setTimeout(
			() =>
			{
				fs.writeFileSync( tmplFile, '' );
				var tmplCmd = 'helm template';
				var lintCmd = 'helm lint';
				tmplCmd += `${args} ${hemlDir}/.`;
				lintCmd += `${args} ${hemlDir}/.`;
				console.log( `RUNNING: ${tmplCmd}` );
				try
				{
					const tmpl = execSync( tmplCmd ).toString();
					fs.writeFileSync( tmplFile, tmpl );
					const lint = execSync( lintCmd ).toString().split(/\r?\n/);
					lint.forEach( function(part, index)
						{
							this[index] = `# ${part}`;
						}, lint );
					lint.unshift( '####', '#' );
					lint.push( '####' );
					fs.appendFileSync( tmplFile, lint.join('\n') );
				}
				catch ( err )
				{
					console.log( err.message );
				}
				inProgress = false;
			}, 100
		);
	}
);
