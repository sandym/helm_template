

## Helper to work with helm charts interactively.

Setup:
```
npm install
```

Run:
```
npm start -- --values {values yaml} --namespace {name} {helm chart path}
```

It will run `helm template` on each file edit and put the result in a file named
`tmpl.yaml` at the same level as the chart.
