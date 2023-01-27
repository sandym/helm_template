/*
	Helper script to work on a helm chart. It runs `helm template` on every
	file edit. Just look at `tmpl.yaml` to see real-time manifest updates.

    start:
		CHART={helm chart path} VALUES={values yaml} gulp
*/

var gulp = require('gulp'); 
var exec = require('child_process').exec;
var fs = require('fs');

const hemlDir = process.env['CHART'];
const values = process.env['VALUES'];

gulp.task( 'default', async () =>
	{
		gulp.watch( `${hemlDir}/**`,
			{ ignoreInitial: false },
			async () =>
			{
				var cmd = 'helm template';
				if (values)
				{
					values.split(',').forEach( (v) => {
						cmd += ` --values=#=${v}`;
					});
				}
				cmd += ` ${hemlDir}/.`;
				const tmpl = await exec( cmd ).toString();
				await fs.promises.writeFile( `${hemlDir}/../tmpl.yaml`, tmpl );
			}
		);
	}
);
