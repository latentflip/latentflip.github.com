setupAnalyser = (context, inputNode) ->
  fftSize = 1024
  analyser = context.createAnalyser()
  analyser.fftSize = fftSize
  inputNode.connect(analyser)
  
  timeData = new Uint8Array(fftSize)
  fftData = new Float32Array(fftSize)
  
  callbacks =
    time: []
    fft: []

  setInterval ->
    if callbacks.time.length
      analyser.getByteTimeDomainData(timeData)   
      cb(timeData) for cb in callbacks.time

    if callbacks.fft.length
      analyser.getBytefftDomainData(fftData)   
      cb(fftData) for cb in callbacks.fft

  , 1000/20#((1000/context.sampleRate)*fftSize)

  {
    on: (event, cb) -> callbacks[event].push(cb)
  }

module.exports = { setup: setupAnalyser }
