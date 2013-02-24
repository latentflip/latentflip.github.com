$ = require 'jquery-browserify'
headtrackr = require 'headtrackr'
_ = require 'underscore'

video = document.getElementById('inputVideo')
canvas = document.getElementById('inputCanvas')
effects = document.getElementById('effectCanvas')
context = effects.getContext('2d')



htracker = new headtrackr.Tracker( calcAngles: true )
htracker.init(video, canvas)
htracker.start()





navigator.webkitGetUserMedia {audio:true}, (stream) ->
  aContext = new webkitAudioContext()
  sourceNode = aContext.createMediaStreamSource(stream)

  analyser = aContext.createAnalyser()
  analyser.smoothingTimeConstant = 0.1
  sourceNode.connect(analyser)

  fftBins = new Float32Array(analyser.fftSize)
  setInterval ->
    analyser.getFloatFrequencyData(fftBins)
    max = _.chain(fftBins).filter((v) -> v < 0).max().value()

    max = (80 + max)/2
    max = Math.max(0, max)
    nyan.jawOffset = max
  , 100


headPos = [0,0]
jawOffset = 0
drawing_head = new Image()
drawing_head.src = "nyancathead2.png"
drawing_jaw = new Image()
drawing_jaw.src = "nyancatjaw2.png"
nyan =
  jawOffset: 0
  width: 10
  height: 10
drawing_head.onload = ->
  nyan =
    width: drawing_head.width
    height: drawing_head.height

lastRotate = null

$(document).on 'facetrackingEvent', (ev) ->
  ev = ev.originalEvent
  face = ev
  face.angle = face.angle - (Math.PI/2)

  height = face.height
  width = nyan.width * (height / nyan.height)
  offset = nyan.jawOffet * (height/nyan.height)

  if lastRotate
    context.translate(lastRotate.x, lastRotate.y)
    context.rotate(-1*lastRotate.angle)
    context.translate(-1*lastRotate.x, -1*lastRotate.y)
    context.clearRect(0,0,640,480)

  context.translate(face.x, face.y)
  context.rotate(face.angle)
  context.translate(-1*face.x, -1*face.y)
  lastRotate =
    angle: face.angle
    x: face.x
    y: face.y


  headPos = [ev.x-width/2, ev.y-height/2-(0.15*height), width, height]
  jawPos = [ev.x-width/2, ev.y-(height/2)-(0.15*height)+nyan.jawOffset, width, height]
  context.drawImage(drawing_head, headPos...)
  context.drawImage(drawing_jaw, jawPos...)


