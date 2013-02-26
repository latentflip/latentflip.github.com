(function() {
  var setupAnalyser;

  setupAnalyser = function(context, inputNode) {
    var analyser, callbacks, fftData, fftSize, timeData;
    fftSize = 1024;
    analyser = context.createAnalyser();
    analyser.fftSize = fftSize;
    inputNode.connect(analyser);
    timeData = new Uint8Array(fftSize);
    fftData = new Float32Array(fftSize);
    callbacks = {
      time: [],
      fft: []
    };
    setInterval(function() {
      var cb, _i, _j, _len, _len1, _ref, _ref1, _results;
      if (callbacks.time.length) {
        analyser.getByteTimeDomainData(timeData);
        _ref = callbacks.time;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cb = _ref[_i];
          cb(timeData);
        }
      }
      if (callbacks.fft.length) {
        analyser.getBytefftDomainData(fftData);
        _ref1 = callbacks.fft;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          cb = _ref1[_j];
          _results.push(cb(fftData));
        }
        return _results;
      }
    }, 1000 / 20);
    return {
      on: function(event, cb) {
        return callbacks[event].push(cb);
      }
    };
  };

  module.exports = {
    setup: setupAnalyser
  };

}).call(this);
