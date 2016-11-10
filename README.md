# Lo Vendo App

## Tech Stack 
    - Angular 1.5.8
    - Underscore 1.8.3
    - Bower 1.7.2
    - Express 4.14.0
    - Gulp 3.5.6
        - Sass 2.0.4
        - Concat 2.2.0
        - rename 1.2.0
        - tiny-lr 1.0.2
        
To get it working, simply

`npm install`

`gulp install` or `bower install`

Then setting up your environment (ex: `gulp env-dev`)
And finally: `gulp serve` or `npm start`

## Environment
The settings folder contain files for every possible app environment. In this files we can global values specific for each environment.
(ex: api_url)

## File Tree

```
    - app/
    | -- assets/
    | -- modules/
    | -- services/
    | -- shared/
    | -- app.js
    | -- app.scss
    | -- index.html
    | -- module_definitions.js
    | -- routes.js
    - build/
    - node_modules/
    - routes/
    | -- api.js
    - settings/
    | -- settings.dev.js
    | -- settings.production.js
    | -- settings.staging.js
    - bower.json
    - Dockerfile (containerization maybe?)
    - package.json
    - README.md
```