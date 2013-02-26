hexToRGB = (hexString) ->
  hexString = hexString.slice(1) if hexString[0] == '#'
  [
    parseInt hexString[0..1], 16
    parseInt hexString[2..3], 16
    parseInt hexString[4..5], 16
  ]

incrementor = (color, towards) ->
  current = [color[0], color[1], color[2]]
  next = ->
    allDone = 0
    for i in [0..2]
      do (i) ->
        if current[i] < towards[i]
          current[i]++
        else if current[i] > towards[i]
          current[i]--
        else
          allDone++ 
    return 'done' if allDone == 3
    return current
    
  return next

genRainbow = ->
  cols = ['#0081F5','#5000F5','#7D05F5','#F50419','#F57900','#F5E600','#00F50C']
  cols = (hexToRGB(col) for col in cols)

  color = cols[0]
  position = 0
  inc = incrementor([0,0,0], cols[0])

  next = ->
    newColor = inc()
    if newColor == 'done'
      position = (position + 1) % cols.length
      newColor = cols[position]
      inc = incrementor(color, newColor)
    color = newColor
    return color

  return next

module.exports = { genRainbow, hexToRGB, incrementor }
