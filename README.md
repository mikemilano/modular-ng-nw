A Modular Oriented AngularJS Seed
=================================

This project was inspired by best practices research based on reports
by those who've been in the trenches with AngularJS, then implemented
with my own opinion based on team development, maintainability, and integration.

The idea is that routes, controllers, directives, tests, templates etc... of a
common context are organized within the same directory.

```
.
├── index.html
├── app.js
└── modules
    └── main
        ├── main.html
        ├── main.js
        └── test
            └── e2e
                └── main.spec.js
```

## Setup
```
git clone git@github.com:mikemilano/modular-ng.git
cd modular-ng/
npm install
```

## Run
This will build the project. Releases will be put in the `./dist` directory.
```
grunt build
```

## Add dependencies
Install a dependency with bower:
```
bower install lodash --save
```
Then, add the path to the dependency in `files.js.vendor.src` array of `Gruntfile.js`.

## Testing
By default, the protractor config is setup to look for all tests defined in `tests/e2e`,
as well as tests defined in modules.
```
cd test/
protractor protractor.conf.js
```