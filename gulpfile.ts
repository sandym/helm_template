/*
	Helper script to work on a helm chart. It runs `helm template` on every
	file edit. Just look at `tmpl.yaml` to see real-time manifest updates.

    start:
		CHART={helm chart path} VALUES={values yaml} gulp
*/

var gulp = require('gulp'); 
var execSync = require('child_process').execSync;
var fs = require('fs');

const hemlDirectory = process.env['CHART'];
const values = process.env['VALUES'];

gulp.task( 'default', function( cb : any )
	{
		gulp.watch( `${hemlDirectory}/**`,
			{ ignoreInitial: false },
			function( cb : any )
			{
				var cmd = 'helm template';
				if (values)
				{
					values.split(',').forEach( (v) => {
						cmd += ` --values=#=${v}`;
					});
				}
				cmd += ` ${hemlDirectory}/.`;
				var tmpl = execSync( cmd ).toString();
				fs.writeFileSync( `${hemlDirectory}/../tmpl.yaml`, tmpl );
				cb();
			}
		);
		cb();
	}
);
