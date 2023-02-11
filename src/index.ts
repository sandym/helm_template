/*
	Helper script to work on a helm chart. It runs `helm template` on every
	file edit. Just look at `tmpl.yaml` to see real-time manifest updates.

    start:
		CHART={helm chart path} VALUES={values yaml} npm run watch
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
				var cmd = 'helm template';
				if ( values )
				{
					values.split( ',' ).forEach( ( v ) => {
						cmd += ` --values ${hemlDir}/${v}`;
					});
				}
				if ( instance )
				{
					cmd += ` --name-template ${instance}`;
				}
				cmd += ` ${hemlDir}/.`;
				console.log( `RUNNING: ${cmd}` );
				try
				{
					const tmpl = execSync( cmd ).toString();
					fs.writeFileSync( tmplFile, tmpl );
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
