(function() {
  var genRainbow, hexToRGB, incrementor;

  hexToRGB = function(hexString) {
    if (hexString[0] === '#') {
      hexString = hexString.slice(1);
    }
    return [parseInt(hexString.slice(0, 2), 16), parseInt(hexString.slice(2, 4), 16), parseInt(hexString.slice(4, 6), 16)];
  };

  incrementor = function(color, towards) {
    var current, next;
    current = [color[0], color[1], color[2]];
    next = function() {
      var allDone, i, _fn, _i;
      allDone = 0;
      _fn = function(i) {
        if (current[i] < towards[i]) {
          return current[i]++;
        } else if (current[i] > towards[i]) {
          return current[i]--;
        } else {
          return allDone++;
        }
      };
      for (i = _i = 0; _i <= 2; i = ++_i) {
        _fn(i);
      }
      if (allDone === 3) {
        return 'done';
      }
      return current;
    };
    return next;
  };

  genRainbow = function() {
    var col, color, cols, inc, next, position;
    cols = ['#0081F5', '#5000F5', '#7D05F5', '#F50419', '#F57900', '#F5E600', '#00F50C'];
    cols = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = cols.length; _i < _len; _i++) {
        col = cols[_i];
        _results.push(hexToRGB(col));
      }
      return _results;
    })();
    color = cols[0];
    position = 0;
    inc = incrementor([0, 0, 0], cols[0]);
    next = function() {
      var newColor;
      newColor = inc();
      if (newColor === 'done') {
        position = (position + 1) % cols.length;
        newColor = cols[position];
        inc = incrementor(color, newColor);
      }
      color = newColor;
      return color;
    };
    return next;
  };

  module.exports = {
    genRainbow: genRainbow,
    hexToRGB: hexToRGB,
    incrementor: incrementor
  };

}).call(this);
