module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/*.js'],
      options: {
        globals: {
          jQuery: true,
          /*console: true,*/
          module: true
        }
      }
    },
    concat: {
      jsmain: {
        src: ['node_modules/openlayers/dist/ol.js',
              'node_modules/jquery/dist/jquery.min.js',
              'node_modules/bootstrap/dist/js/bootstrap.min.js',
              'src/shareloc.js',
              'src/layers.js',
              'src/map-api.js',
              'src/permalink.js',
              'src/api-creator-app.js'],
        dest: 'build/src/<%= pkg.name %>-creator.js'
      },
      cssmain: {
        src: ['node_modules/openlayers/dist/ol.css',
              'node_modules/bootstrap/dist/css/bootstrap.min.css',
              'res/css/api-creator.css'],
        dest: 'build/res/css/<%= pkg.name %>-creator.css'
      },
      jsshare: {
        src: ['node_modules/openlayers/dist/ol.js',
              'node_modules/jquery/dist/jquery.min.js',
              'node_modules/bootstrap/dist/js/bootstrap.min.js',
              'src/shareloc.js',
              'src/layers.js',
              'src/map-api.js',
              'src/permalink.js',],
        dest: 'build/src/<%= pkg.name %>.js'
      },
      cssshare: {
        src: ['node_modules/openlayers/dist/ol.css',
              'node_modules/bootstrap/dist/css/bootstrap.min.css',
              'res/css/share.css'],
        dest: 'build/res/css/<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        banner: '// <%= pkg.name %> (v<%= pkg.version %>) \n' +
                '// License BSD, see <%= pkg.license %>  \n' +
                '// Build on <%= grunt.template.today("yyyy-mm-dd") %> \n'
      },
      build: {
        files: {
          'build/src/<%= pkg.name %>-creator.min.js': 'build/src/<%= pkg.name %>-creator.js',
          'build/src/<%= pkg.name %>.min.js': 'build/src/<%= pkg.name %>.js'
        }
      }
    },
    copy: {
      img: {
        files: [{
          flatten: true,
          expand: true,
          src: [
            'res/img/*.png'
          ],
          dest: 'build/res/img/'
        }]
      },
      favIcon: {
        files: [{
          flatten: true,
          expand: true,
          src: [
            'res/img/shareloc-logo-mini.png'
          ],
          dest: 'build/'
        }]
      },
      conf: {
        files: [{
          flatten: true,
          expand: true,
          src: [
            'conf/layers.json'
          ],
          dest: 'build/conf/'
        }]
      }
    },
    preprocess: {
      dev: {
        options: {
          inline: true,
          context: {
            NODE_ENV: 'develop'
          }
        },
        files: [{
           src: 'tpl/index.html',
           dest: 'index.html'
        }, {
          src: 'tpl/share.html',
          dest: 'share.html'
        }]
      },
      dist: {
        options: {
          inline: true,
          context: {
            NODE_ENV: 'production'
          }
        },
        files: [{
          src: 'tpl/index.html',
          dest: 'build/index.html'
        }, {
          src: 'tpl/share.html',
          dest: 'build/share.html'
        }]
      }
    },
    connect: {
      server: {
        options: {
          hostname: '*',
          port: 7000,
          keepalive: true
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'preprocess:dev', 'connect:server']);
  grunt.registerTask('build', ['jshint', 'preprocess:dist', 'concat', 'uglify', 'copy:img', 'copy:favIcon', 'copy:conf']);

};
