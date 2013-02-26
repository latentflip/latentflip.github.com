(function() {
  var $, analyser, canvas, color, ctx, rainbow, scale, screenSize, setupStream, showEnableAudioMessage, xScale, yScale, _;

  color = require('./color');

  scale = require('./scale');

  _ = require('underscore');

  analyser = require('./analyser');

  $ = require('jquery-browserify');

  showEnableAudioMessage = _.once(function() {
    return $('h1').show();
  });

  screenSize = (function() {
    var d, e, g, w, x, y;
    w = window;
    d = document;
    e = d.documentElement;
    g = d.getElementsByTagName('body')[0];
    x = w.innerWidth || e.clientWidth || g.clientWidth;
    y = w.innerHeight || e.clientHeight || g.clientHeight;
    return {
      x: x,
      y: y
    };
  })();

  canvas = document.getElementById('canvas');

  canvas.width = screenSize.x;

  canvas.height = screenSize.y;

  ctx = canvas.getContext('2d');

  yScale = scale.linear().domain([0, 255]).range([canvas.height * 1.25, canvas.height * -0.25]);

  xScale = scale.linear().domain([0, 1024]).range([0, canvas.width]);

  rainbow = color.genRainbow();

  setupStream = function(stream) {
    var a, context, micNode, startupTimeout, timedOut;
    context = new webkitAudioContext();
    micNode = context.createMediaStreamSource(stream);
    a = analyser.setup(context, micNode);
    timedOut = false;
    startupTimeout = setTimeout((function() {
      return timedOut = true;
    }), 5000);
    return a.on('time', function(timeData) {
      var fill, max;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(0.01);
      ctx.translate(-1 * canvas.width / 2, -1 * canvas.height / 2);
      ctx.beginPath();
      ctx.strokeStyle = "rgb(" + (rainbow().join(',')) + ")";
      ctx.moveTo(xScale(0), yScale(timeData[0]));
      _.each(timeData, function(v, i) {
        if (i !== 0) {
          return ctx.lineTo(xScale(i), yScale(v));
        }
      });
      ctx.stroke();
      max = _.max(timeData) - 127;
      console.log(max, timedOut);
      if (max === 1 && timedOut) {
        showEnableAudioMessage();
      }
      fill = "rgb(" + max + "," + (Math.floor(Math.random() * 255)) + ",255)";
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, max, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      return ctx.fillRect(-canvas.width, -canvas.height, 2 * canvas.width, 2 * canvas.height);
    });
  };

  navigator.webkitGetUserMedia({
    audio: true
  }, setupStream);

}).call(this);
