/*
	Helper script to work on a helm chart. It runs `helm template` on every
	file edit. Just look at `tmpl.yaml` to see real-time manifest updates.

    start:
		CHART={helm chart path} VALUES={values yaml} npm start
*/

const chokidar = require( 'chokidar' );
const execSync = require( 'child_process' ).execSync;
const fs = require( 'fs' );

const hemlDir = process.env['CHART'];
const values = process.env['VALUES'];
const instance = process.env['INSTANCE'];
const tmplFile = `${hemlDir}/../tmpl.yaml`;

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
				if ( values )
				{
					values.split( ',' ).forEach( ( v ) => {
						tmplCmd += ` --values ${hemlDir}/${v}`;
						lintCmd += ` --values ${hemlDir}/${v}`;
					});
				}
				if ( instance )
				{
					tmplCmd += ` --name-template ${instance}`;
				}
				tmplCmd += ` ${hemlDir}/.`;
				lintCmd += ` ${hemlDir}/.`;
				console.log( `RUNNING: ${tmplCmd}` );
				try
				{
					const tmpl = execSync( tmplCmd ).toString();
					fs.writeFileSync( tmplFile, tmpl );
					const lint = execSync( lintCmd ).toString();
					fs.appendFileSync( tmplFile, lint );
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
