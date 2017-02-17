# Lo Vendo App

## Tech Stack 
    - Angular 1.5.9
    - Angular UI Router 0.3.1
    - Angular Sanitize 1.5.9
    - Angular Message 1.5.9
    - Angular JWT 0.1.8
    - Angular Bootstrap 2.2.0
    - Angular Animate 1.5.9
    - Angular Slick Carousel 3.1.7
    - Angular Loading Bar 0.9.0
    - Angular i18n 1.5.9
    - Google Maps Utility Library
    - Underscore 1.8.3
    - Bower 1.7.2
    - Express 4.14.0
    - Mongoose 4.6.6
    - Passport 0.3.2
    - Passport-Local 1.0.0
    - JSONwebtoken 7.1.9
    - rfr 1.2.3
    - shelljs 0.3.0
    - through2 2.0.2
    - request 2.79.0
    - though2 2.0.0
    - Gulp 3.5.6
        - Sass 2.0.4
        - Concat 2.2.0
        - rename 1.2.0
        - tiny-lr 1.0.2
        - cssnano 2.0.0
        - filter 3.0.1
        - inject 3.0.0
        - ng-annotate 1.1.0
        - plumber 1.0.1
        - rename 1.2.0
        - shell 0.5.1
        - util 2.2.14
        - watch 4.3.5
        

        
To get it working, simply

`npm install` and then `bower install`

Then set up your environment (ex: `gulp env-dev`)
And finally: `gulp serve`

To run all commands at once, simply use `npm start`

## Environment
The settings folder contain files for every possible app environment. In this files we can set global values for each environment.
(ex: api_url)

## Client
The client uses AngularJS with a modular project architecture approach.

## Server
The server will run locally on port 3000. It uses uses token authentication to protect certain endpoints of the API. To know exactly what technologies
are being used, please refer to the TechStack section.

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
    - controllers/
    - helpers/
    - models/
    - node_modules/
    - routes/
    | -- config/
    - settings/
    | -- settings.dev.js
    | -- settings.production.js
    | -- settings.staging.js
    - bower.json
    - package.json
    - README.md
```