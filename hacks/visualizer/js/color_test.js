(function() {
  var assert, color, generator, i, incrementor, _i;

  assert = require('assert');

  color = require('./color');

  assert.equal(color.hexToRGB('#FF6600').join(','), "255,102,0");

  incrementor = color.incrementor([250, 50, 0], [255, 51, 0]);

  assert.equal(incrementor().join(','), "251,51,0");

  assert.equal(incrementor().join(','), "252,51,0");

  generator = color.genRainbow();

  for (i = _i = 0; _i <= 500; i = ++_i) {
    console.log(generator());
  }

}).call(this);
