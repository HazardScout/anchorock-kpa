# anchrock dev team X kpa dev team

> Project is an NPM package. It integrates with third parties commonly used by Anchorock customers.

# Updates + Deployment

> This project is not deployed directly. Instead, it's an NPM package that requires the `dist` folder to be recompiled for any code changes.

```bash
# rebuild the dist folder content
npm run build

# commit changes to main branch
git add --all
git commit -am "chore: rebuild dist"

# from consumer repo (WEB)
# note: npm update anchorock-kpa, does not work in this instance

rm -rf node_modules/anchorock-kpa
rm package-lock.json
npm i
```

# DEBUG

```bash
# to capture all logs
NODE_DEBUG=log*

# to capture specific data types
NODE_DEBUG=log:*:project
NODE_DEBUG=log:*:user

# to capture specific service: spectrum, rivet...
NODE_DEBUG=log:rivet:project
NODE_DEBUG=log:rivet:user
```
