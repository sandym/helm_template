

## Helper to work with helm charts interactively.

Helper app to work on a helm chart. It runs `helm template` on every
file edit. Just look at `tmpl.yaml` to see real-time manifest updates.

Setup, build and deploy:
```
> npm install
> npm run build
> npm link
```

Run:
```
> helm_template --values {values yaml} --namespace {name} {helm chart path}
```

It will run `helm template` on each file edit and put the result in a file named
`output.yaml` at the same level as the chart.


