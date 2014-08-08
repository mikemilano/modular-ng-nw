module.exports = function(grunt) {
  var dist = '' + (process.env.SERVER_BASE || 'dist_dev');
  var config = {
    pkg: grunt.file.readJSON('package.json'),
    banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
      "<%= grunt.template.today(\"yyyy-mm-dd\") %>\n" +
      "<%= pkg.homepage ? \"* \" + pkg.homepage + \"\\n\" : \"\" %>" +
      "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>" +
      " Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %> */\n",
    files: {
      html: {
        src: 'src/index.html'
      },
      js: {
        vendor: [
          'bower_components/angular/angular.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/lodash/dist/lodash.js',
          'bower_components/angular-bootstrap/ui-bootstrap.js',
          'bower_components/ngAutocomplete/src/ngAutocomplete.js'
        ],
        src: [
          'src/modules/*/*.js',
          'src/app.js'
        ]
      },
      templates: {
        src: 'src/**/*.html'
      },
      less: {
        src: [
          'src/css/style.less',
          'bower_components/bootstrap/less/bootstrap.less'
        ]
      }
    },
    bower: {
      install: {
      }
    },
    newer: {
      timestamps: 'generated/timestamps'
    },
    jshint: {
      all: ['Gruntfile.js', '<%= files.js.src %>']
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/img',
          src: ['{,*/}*.{png,jpg,jpeg}'],
          dest: 'generated/img'
        }]
      }
    },
    less: {
      options: {
        paths: ['src/css'],
        ieCompat: false
      },
      dev: {
        src: '<%= files.less.src %>',
        dest: 'generated/css/style.css'
      },
      dist: {
        options: {
          cleancss: true,
          compress: true
        },
        src: '<%= files.less.src %>',
        dest: 'generated/css/style.css'
      }
    },
    ngtemplates: {
      app: {
        cwd: 'src',
        src: '**/*.html',
        dest: 'generated/templates.js',
        options:    {
          htmlmin:  { collapseWhitespace: true, collapseBooleanAttributes: true }
        }
      }
    },
    concat: {
      js: {
        src: ['<%= files.js.vendor %>', '<%= files.js.src %>'],
        dest: 'generated/app.min.js'
      }
    },
    concat_sourcemap: {
      options: {
        sourcesContent: true
      },
      app: {
        src: ['<%= files.js.vendor %>'],
        dest: 'generated/vendor.js'
      }
    },
    watch: {
      options: {
        livereload: true
      },
      html: {
        files: ['<%= files.html.src %>'],
        tasks: ['copy']
      },
      js: {
        files: ['<%= files.js.src %>'],
        tasks: ['concat']
      },
      templates: {
        files: ['<%= files.templates.src %>'],
        tasks: ['ngtemplates']
      },
      less: {
        files: ['<%= files.less.src %>'],
        tasks: ['less:dev']
      }
    },
    copy: {
      main: {
        files: [
          {src: ['src/index.html'], dest: 'generated/index.html'},
          {src: ['src/package.json'], dest: 'generated/package.json'}
        ]
      }
    },
    serve: {
      base: 'generated',
      web: {
        port: 8000
      }
    },
    clean: {
      workspaces: ['dist', 'generated']
    },
    open: {
      dev: {
        path: "http://localhost:<%= serve.web.port %>"
      }
    },
    browserify: {
      js: {
        src: 'src/app.js',
        dest: 'generated/app.js'
      }
    },
    nodewebkit: {
      options: {
        // Versions listed here: http://dl.node-webkit.org/
        version: 'v0.10.1',
        platforms: ['win','osx', 'linux32', 'linux64'],
        buildDir: 'dist'
      },
      src: ['generated/**/**']
    }
  };

  // initialize task config
  grunt.initConfig(config);

  // load local tasks
  grunt.loadTasks('tasks');

  // loads all grunt-* tasks based on package.json definitions
  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

  // create workflows
  grunt.registerTask('default', ['bower', 'newer:jshint', 'less:dev', 'ngtemplates', 'concat_sourcemap', 'browserify', 'copy', 'nodewebkit', 'serve', 'open', 'watch']);
  grunt.registerTask('build', ['clean', 'bower', 'jshint', 'less:dist', 'ngtemplates', 'concat_sourcemap', 'browserify', 'copy', 'nodewebkit']);
  grunt.registerTask('prodsim', ['build', 'serve', 'open', 'watch']);
};