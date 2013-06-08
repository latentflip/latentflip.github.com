var Instrumentor = (function() {

  var Instrumentor = function(s, m) {
    this.scope = s;
    this.msgbus = m;
    this.existingKeys = {};
  }

  Instrumentor.prototype.instrumentFn = function(name) {
    var self = this;
    var fn = self.scope[name]

    self.scope[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      self.msgbus.emit( 'function:call', { name: name, args: args } )
      delay(150);
      var result = fn.apply(null, arguments);
      delay(150);
      self.msgbus.emit( 'function:return', { name: name, result: result } )
      return result;
    }
  }

  Instrumentor.prototype.start = function() {
    var self = this;
    for (var key in self.scope) {
      if (self.scope[key]) {
        self.existingKeys[key] = true;
      }
    }
  }

  Instrumentor.prototype.run = function() {
    var self = this,
        toInstrument = [];

    for (var key in self.scope) {
      if (!self.existingKeys[key] && self.scope[key]) {
        self.instrumentFn(key, self.scope)
     }
    }
  }

  return Instrumentor;
})();
