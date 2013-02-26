module.exports = (grunt) ->

  #Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    shell:
      browserify:
        command: 'browserify js/main.js > bundle.js'

    coffee:
      glob_to_multiple:
        cwd: 'coffee'
        expand: true
        src: ['*.coffee']
        dest: './js'
        ext: '.js'

    watch:
      coffee:
        files: 'coffee/*.coffee'
        tasks: ['coffee']

      scripts:
        files: 'js/*.js'
        tasks: ['shell:browserify']
        options:
          interrupt: true

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-shell')
  grunt.registerTask('default', ['coffee', 'shell:browserify'])
