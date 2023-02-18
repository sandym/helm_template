

## Helper to work with helm charts interactively.

Setup:
```
npm install
```

Run:
```
CHART={helm chart path} VALUES={values yaml} INSTANCE={Release Name} npm start
```

It will run `helm template` on each file edit and put the result in a file named
`tmpl.yaml` at the same level as the chart.
