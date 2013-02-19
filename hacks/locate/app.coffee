f =
  floor: (v) -> Math.floor(v)

directionS = $(window).asEventStream('deviceorientation').map('.originalEvent')
bearingS = directionS.map (ev) -> ev.alpha

bearingSmoothS = bearingS.slidingWindow(1).map( (vs) ->
                                              _.inject(vs, ((s,n) -> s + n), 0) / vs.length
                                         )

bearingS.map(f.floor).assign( $('.bearing-smooth'), 'text' )
bearingSmoothS.map(f.floor).assign( $('.bearing'), 'text' )


ratioBetweenBearings = (value, range) ->
  [lower,upper] = range
  lower += 360 if lower < 0
  upper += 360 if upper < 0

  # so we now have
  # 10 - 100
  # 100 - 190
  # 280 - 10
  # 315 - 45
  # 355 - 350
  # 350 - 355
  if lower < upper
    lower += 360

  lower += 360 if lower < upper
  
  value += 360 
    

bearingToPosition = (camera, bearing) ->
  viewWindow = 90
  width = 500
  
  domain = [(camera - viewWindow/2)%360 , (camera + viewWindow/2)%360]
  console.log(domain)
  range = [0, 500]

  scale = d3.scale.linear()
              .domain(domain)
              .range(range)

  scale(bearing)


$('.screen h1').each ->
  $el = $(this)
  pos = $el.data('deg')
  
  bearingSmoothS.onValue (camera) ->
    left = bearingToPosition(camera, pos)
    $el.css(left: left)
  
  

