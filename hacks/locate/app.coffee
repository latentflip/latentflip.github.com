f =
  floor: (v) -> Math.floor(v)

directionS = $(window).asEventStream('deviceorientation').map('.originalEvent')

bearingS = directionS.map (ev) -> ev.alpha

bearingSmoothS = bearingS.slidingWindow(25).map( (vs) ->
                                              _.inject(vs, ((s,n) -> s + n), 0) / vs.length
                                         )

bearingS.map(f.floor).assign( $('.bearing-smooth'), 'text' )
bearingSmoothS.map(f.floor).assign( $('.bearing'), 'text' )
