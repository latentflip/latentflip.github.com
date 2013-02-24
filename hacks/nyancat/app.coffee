$ = require 'jquery-browserify'
headtrackr = require('headtrackr')

video = document.getElementById('inputVideo')
canvas = document.getElementById('inputCanvas')
effects = document.getElementById('effectCanvas')
context = effects.getContext('2d')



htracker = new headtrackr.Tracker()
htracker.init(video, canvas)
htracker.start()

resize2 = (i) ->
  cc = document.createElement("canvas")
  cc.width = i.width / 2
  cc.height = i.height / 2
  ctx = cc.getContext("2d")
  ctx.drawImage(i, 0, 0, cc.width, cc.height)
  cc




sparklePos = [0,0]
drawing = new Image()
drawing.src = "nyancat2.png"
$(document).on 'facetrackingEvent', (ev) ->
  cat = drawing

  ev = ev.originalEvent
  #context.strokeRect(ev.x-ev.width/2, ev.y-ev.height/2, ev.width, ev.height)
  sparklePos = [ev.x-cat.width/2, ev.y-cat.height/2-40]
  context.clearRect(0,0,320,240)
  context.drawImage(cat, sparklePos...)
