

Helper to work with helm charts interactively.

Setup:
```
npm install
```

Run:
```
CHART={helm chart path} VALUES={values yaml} npm watch
```

It will run `helm template` on each file edit and put the result in a file named `tmpl.yaml` at the same level as the chart.
