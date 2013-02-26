(function() {
  var linear;

  linear = function() {
    var domain, fn, range;
    domain = [0, 1];
    range = [0, 1];
    fn = function(value) {
      return range[0] + (value - domain[0]) * (range[1] - range[0]) / (domain[1] - domain[0]);
    };
    fn.domain = function(newDomain) {
      if (!newDomain) {
        return domain;
      } else {
        domain = newDomain;
        return fn;
      }
    };
    fn.range = function(newRange) {
      if (!newRange) {
        return range;
      } else {
        range = newRange;
        return fn;
      }
    };
    return fn;
  };

  module.exports = {
    linear: linear
  };

}).call(this);
