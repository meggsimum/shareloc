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
        src: ['lib/ol-3.9.0.js',
              'lib/jquery.min-1.11.1.js',
              'lib/bootstrap.min-3.2.0.js',
              'src/shareloc.js',
              'src/layers.js',
              'src/map-api.js',
              'src/permalink.js',
              'src/api-creator-app.js'],
        dest: 'build/src/<%= pkg.name %>-creator.js'
      },
      cssmain: {
        src: ['lib/ol-3.9.0.css',
              'lib/bootstrap.min-3.2.0.css',
              'res/css/api-creator.css'],
        dest: 'build/res/css/<%= pkg.name %>-creator.css'
      },
      jsshare: {
        src: ['lib/ol-3.9.0.js',
              'lib/jquery.min-1.11.1.js',
              'lib/bootstrap.min-3.2.0.js',
              'src/shareloc.js',
              'src/layers.js',
              'src/map-api.js',
              'src/permalink.js',],
        dest: 'build/src/<%= pkg.name %>.js'
      },
      cssshare: {
        src: ['lib/ol-3.9.0.css',
              'lib/bootstrap.min-3.2.0.css',
              'res/css/share.css'],
        dest: 'build/res/css/<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        banner: '// <%= pkg.name %> (v<%= pkg.version %>) \n' +
                '// License <%= pkg.licenses[0].type %>, <%= pkg.licenses[0].url %>  \n' +
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
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'preprocess:dev']);
  grunt.registerTask('build', ['jshint', 'preprocess:dist', 'concat', 'uglify', 'copy:img', 'copy:conf']);

};
