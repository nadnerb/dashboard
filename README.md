# dupondi.us dashboard


## Deployment

```
cap deploy
```

# Skeleton

```
curl -v -H "Accept: application/json" -H "Content-type: application/json" -X POST -d
'{"name":"babyskeleton"}'  http://localhost:5000/skeleton.json
```


# RequireJS - Production Mode

From root directory:

```
node app/assets/build/r.js -o app/assets/build/build.js
```
