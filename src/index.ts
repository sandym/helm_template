/*
	Helper script to work on a helm chart. It runs `helm template` on every
	file edit. Just look at `tmpl.yaml` to see real-time manifest updates.

    start:
		CHART={helm chart path} VALUES={values yaml} npm run watch
*/

const chokidar = require('chokidar');
const execSync = require('child_process').execSync;
const fs = require('fs');

const hemlDir = process.env['CHART'];
const values = process.env['VALUES'];

const watcher = chokidar.watch(`${hemlDir}/**`, {
	persistent: true
});

var inProgress = false;
watcher.on('all',
	async () =>
	{
		if (inProgress)
			return;
		inProgress = true;

		setTimeout(() =>
		{
			fs.writeFileSync( `${hemlDir}/../tmpl.yaml`, '' );
			var cmd = 'helm template';
			if (values)
			{
				values.split(',').forEach( (v) => {
					cmd += ` --values=${hemlDir}/${v}`;
				});
			}
			cmd += ` ${hemlDir}/.`;
			const tmpl = execSync( cmd ).toString();
			fs.writeFileSync( `${hemlDir}/../tmpl.yaml`, tmpl );
			inProgress = false;
		}, 100 );
	}
);
