# Grunt + Browserify + s3 

## Rough outline of asset deployment strategy

### Goals

* Separate front end "client" deployment and build process from backend deployment. 
* Not necessarily have to create two completely distinct applications (because of authentication difficulties etc), but could go in that direction if needed.
* Migratable to from the asset pipeline & compatible with rails.
* Support coffeescript, sass compilation.
* Allow lightweight "staging" clients to be deployed using the existing backend. Ideally even use the production backend with a development client.
* Fast compilation and deployment.
* Smooth development flow.
* Some kind of modular system (amd/commonjs) for more reusable & testable JavaScript.
* Supports testing

### Tools

* Browserify for compiling commonjs JavaScript into browser happy builds
* Grunt for plugging everything together and deploying
* Using Alex Sexton's scout strategy (http://alexsexton.com/blog/2013/03/deploying-javascript-applications/)
* Karma for unit testing
* Deploy builds to s3 directories served with cloudfront to reduce latency

### Status

* Pretty darn awesome, so much nicer than the asset pipeline for sure.
* Still figuring out the testing flow (as well as just how to do JS testing).
* Still a little rough around the edges, and now in production, and pretty happy with it.


## What's it look like

Below are the scoutfile, gruntfile, and rails application layout.

### The scoutfile:

  * The scoutfile is cached for a very short time period (the minimum time you would like between redeploys (for now I don't cache it at all).
  * It's responsible for loading in the current builds of compiled css and js files from cloudfront.
  * The builds are deployed by grunt to `s3/envs/<environment>/b<timestamp>/app-min.(js|css)`.
  * <environment> and <timestamp> are set by grunt and interpolated into the scoutfile as it is deployed.
  * The scoutfile itself is deployed to `s3/envs/<environment>/scout.js`
  * Because we can deploy to arbitrary environments we can point the rails app to custom javascript client builds. By default I have it point to the `production` environement, but by appending `?scout=staging` or `?scout=sometest` I can load the app with a custom js build for testing etc. 
  * I even have a custom `scout-dev.js` file which will point the production backend to a server running on localhost which is serving up the current dev build. Really nice for testing bugfixes/styles etc with live data.


```javascript
(function() {
  var firstScriptTag = document.getElementsByTagName('script')[0],
      baseUrl = '//mydomain.cloudfront.net/envs/<%= deployEnv %>/b<%= buildNumber %>/',
      package = 'app-min.js',
      css = 'app-min.css';

  var js = document.createElement('js');
  var jsPackage = 'app-min.js';
  js.src = baseUrl + package;
  js.type = 'text/javajs';
  onjsLoad(js, window.$F.go);
  insertTag(js);

  var css = document.createElement("link");
  var cssPackage = 'app-min.css';
  ss.type = "text/css";
  ss.rel = "stylesheet";
  ss.href = baseUrl + css;
  insertTag(ss)

  function insertTag(tag) {
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function onScriptLoad(scriptEl, cb) {
    if ( typeof scriptEl.addEventListener !== "undefined" ) {
      scriptEl.addEventListener("load", cb, false)
    } else {
      scriptEl.onreadystatechange = function(){
        scriptEl.onreadystatechange = null;
        ieLoadBugFix(scriptEl, cb);
      }
    }
  }

  function ieLoadBugFix(scriptEl, cb) {
    if (scriptEl.readyState=='loaded' || scriptEl.readyState == 'completed') {
      cb();
    } else {
      setTimeout(function() { ieLoadBugFix(scriptEl, cb) }, 100);
    }
  };

})();
```

### Gruntfile

  * There's a lot in the gruntfile. The best thing with grunt is to start small and build it up as you grow confidence.
  * The frontend app and gruntfile are held in a `/frontend` app within my rails app.
  * The app gets built and minified into `/frontend/.build` and copied to s3 from there.
  * For library files, which depend on things being attached to `window` (think jQuery, jQuery plugins, backbone & plugins etc). I don't bother requiring those with browserify, I just concatenate them into a `stdlib.js` before the browserify build.
  * The app is built with browserify, and compiled from coffeescript with a browserify transform (coffeeify).
 
  * The deploy steps are roughly:
    * `env:production` - set which environment to deploy to
    * `clean` - empties `./frontend/.build`
    * `browserify:frontend` - compile the browserify build into the build directory.
    * `uglify` - minify the js file
    * `concat:stdlib` - concatenate the required libraries
    * `concat:build` - concatenate the stdlib and browserify bundles together.
    * `concat:scout` - interpolate the scout file with the current build number (timestamp) and environment
    * `compass:dist` - compile the main sass files into the build directory.
    * s3 the scoutfile, minified css and js and images over to s3 into the `env/<environment>/b<timestamp>` directory.
    * The client will now pick up the new scoutfile (it's not cached, and load in the new version of the app.

  * In development:
    * We run most of the relevant things from above
    * We run a server on localhost, which serves the assets for either the development backend, or the production backend with `?scout=dev` set.
    * We use grunt's watch plugin, to watch for file changes and recompile appropriately.

```javascript
module.exports = (grunt) ->

  for dep, ver of require('./package.json').devDependencies
    if dep.match /^grunt-/
      grunt.loadNpmTasks(dep)
  

  grunt.initConfig
    buildNumber: new Date().valueOf()
    buildDir: './.build'
    deployEnv: 'staging'
    aws: grunt.file.readJSON('./keys/grunt-aws.json')

    # Clean out the build directory
    clean: ['<%= buildDir %>']

    # Build stylesheets
    compass:
      options:
        specify: [
          'sass/app.scss',
          'sass/print.scss'
        ]

      dist:
        options:
          environment: 'production'

      dev:
        options:
          environment: 'development'

    s3:
      options:
        key: '<%= aws.key %>'
        secret: '<%= aws.secret %>'
        bucket: '<%= aws.bucket %>'
        access: '<%= aws.access %>'
        gzip: true

      images:
        upload: [
          src: 'public/images/*.*'
          dest: 'images'
        ]
      dev:
        upload: [
          src: '<%= buildDir %>/scout-dev.js'
          dest: 'scout-dev.js'
          headers:
            'Cache-Control': "public, max-age=0"
        ]
      build:
        upload: [
          src: '<%= buildDir %>/scout-min.js'
          dest: 'envs/<%= deployEnv %>/scout-min.js'
          headers:
            'Cache-Control': "public, max-age=0"
        ,
          src: '<%= buildDir %>/b/app-min.js'
          dest: 'envs/<%= deployEnv %>/b<%= buildNumber %>/app-min.js'
          headers:
            'Cache-Control': "public, max-age=31556926"
        ,
          src: '<%= buildDir %>/b/app-min.css'
          dest: 'envs/<%= deployEnv %>/b<%= buildNumber %>/app-min.css'
          headers:
            'Cache-Control': "public, max-age=31556926"
        ,
          src: '<%= buildDir %>/b/print-min.css'
          dest: 'envs/<%= deployEnv %>/b<%= buildNumber %>/print-min.css'
          headers:
            'Cache-Control': "public, max-age=31556926"
        ]

    cssmin:
      frontend:
        files:
          '<%= buildDir %>/b/app-min.css' : '<%= buildDir %>/b/app.css'
          '<%= buildDir %>/b/print-min.css' : '<%= buildDir %>/b/print.css'

    concat:
      options:
        nonull: true
      stdlib:
        src: require('./stdlib.js').files
        dest: '<%= buildDir %>/b/stdlib.js'
      scout:
        src: 'scout.js'
        dest: '<%= buildDir %>/scout.js'
        options:
          process: true
      scoutDev:
        src: 'scout-dev.js'
        dest: '<%= buildDir %>/scout-dev.js'
      build:
        src: ['<%= buildDir %>/b/stdlib.js', '<%= buildDir %>/b/float-bundle.js']
        dest: '<%= buildDir %>/b/app.js'

    uglify:
      frontend:
        files:
          '<%= buildDir %>/b/app-min.js' : '<%= buildDir %>/b/app.js'
          '<%= buildDir %>/scout-min.js' : '<%= buildDir %>/scout.js'

    browserify:
      options:
        aliasMappings: [
          cwd: 'app/helpers'
          src: ['**/*.coffee']
          dest: 'helpers/'
          ext: '.coffee'
        ]
      
      frontend:
        dest: '<%= buildDir %>/b/float-bundle.js'
        src: 'app/main.coffee'
        options:
          transform: ['browserify-eco', 'coffeeify']
          debug: true
          sourceMapRoot: '.'

      karma:
        dest: 'specs/specs-bundle.js'
        src: 'specs/**/*.coffee'
        options:
          transform: ['browserify-eco', 'coffeeify']
          debug: false
          multifile: true

    coffeelint:
      app: ['app/**/*.coffee']
      specs: ['specs/**/*.coffee']
      options: grunt.file.readJSON('./lintconfig.json')

    karma:
      unit:
        configFile: 'karma.conf.js'
        background: true

    watch:
      browserify:
        files: ['app/**/*.*', 'specs/**/*.coffee']
        options:
          livereload: true

      karma:
        files: ['specs/specs-bundle.js', 'karma.conf.js']
        tasks: ['karma:unit:run']

      stdlib:
        files: ['stdlib.js', 'libs/**/*.*']
        tasks: ['concat:stdlib']

      compass:
        files: ['sass/**/*.*']
        tasks: ['compass']

  grunt.event.on 'watch', ->
    delete require.cache[require.resolve('./stdlib.js')]
    grunt.config ['concat', 'stdlib', 'src'], require('./stdlib.js').files


  grunt.registerTask('default', ['test'])



  grunt.registerTask 'server', 'Start web server', ->
    express = require('express')
    https = require('https')
    http = require('http')
    fs = require('fs')
    url = require('url')
    app = express()
            .use( (req,res,next) ->
              buildDir = __dirname + '/.build'
              publicDir = __dirname + ''
              resource_url = url.parse(req.url).pathname

              if (fs.existsSync(buildDir + resource_url))
                fs.createReadStream(buildDir + resource_url).pipe(res)
              else if (fs.existsSync(publicDir + resource_url))
                fs.createReadStream(publicDir + resource_url).pipe(res)
              else
                grunt.log.ok('Not found '+publicDir+resource_url)
                next()
            )

    options = {
      key: fs.readFileSync(__dirname + '/keys/devssl/key.pem')
      cert: fs.readFileSync(__dirname + '/keys/devssl/cert.pem')
    }

    http.createServer(app).listen(35628, ( -> grunt.log.ok('Server started on 35628')))
    #https.createServer(options, app).listen(35628, ( -> grunt.log.ok('Server started on 35628')))


  grunt.registerTask 'env', 'Set deployment environment', (name, val) ->
    grunt.log.ok "Setting deployEnv to #{name}"
    grunt.config.set 'deployEnv', name

  grunt.registerTask('test', ['concat', 'compass:dev', 'coffeelint', 'browserify', 'karma', 'watch'])
  grunt.registerTask('dev', ['concat', 'server', 'compass:dev', 'coffeelint', 'browserify:frontend', 'watch'])
  grunt.registerTask('build', ['concat', 'compass:dev',  'coffeelint', 'browserify:frontend'])
    
  grunt.registerTask('prepare-deploy', [
    'clean',
    'browserify:frontend',
    'compass:dist',
    'concat:stdlib',
    'concat:build',
    'concat:scout',
    'concat:scoutDev',
    'uglify',
    'cssmin'
  ])
  grunt.registerTask('deploy', ['prepare-deploy', 's3:build'])
  grunt.registerTask('deploy:dev', ['env:dev', 'concat:scoutDev', 's3:dev'])
  grunt.registerTask('deploy:staging', ['env:staging', 'deploy'])
  grunt.registerTask('deploy:production', ['env:production', 'deploy'])

```

## Snippet from application.html.erb which loads the scoutfiles.

* This is ugly, but basically:
  * In production
    * By default load `s3/env/production/scout.js`
  * In production for admin users
    * If `?scout=<env>` is set in the url, load that scoutfile instead.
    * But if `?scout=dev` load the special scoutfile which loads js files from localhost.
  * In development load the scoutfile from the local server running from grunt.

```javascript
<% if params[:scout] and current_user.admin? %>
  <% if params[:scout] == 'dev' %>
    <script src='https://dlyc0fg6gcuom.cloudfront.net/scout-dev.js'></script>
  <% else %>
    <script src='<%= "https://dlyc0fg6gcuom.cloudfront.net/envs/#{params[:scout]}/scout-min.js" %>'></script>
  <% end %>
<% else %>
  <% if Rails.env.development? %>
    <script src='//localhost:35628/scout-dev.js'></script>
  <% else %>
    <script src='https://dlyc0fg6gcuom.cloudfront.net/envs/production/scout-min.js'></script>
  <% end %>
<% end %>
```
