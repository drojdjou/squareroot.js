module.exports = function(grunt) {

  grunt.initConfig({

    uglify: {
      my_target: {
        files: {
          'soundviz-min.js': [
            'js/effects/*.js',
            'js/audio/*.js',
            'js/geometry/*.js',
            'js/objects/*.js',
            'js/*js'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify']);
};