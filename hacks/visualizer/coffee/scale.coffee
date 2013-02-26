linear = ->
  domain = [0,1]
  range = [0,1]


  fn = (value) ->
    range[0] + (value - domain[0]) * (range[1] - range[0])/(domain[1] - domain[0])


  fn.domain = (newDomain) ->
    if !newDomain
      return domain
    else
      domain = newDomain
      fn
  fn.range = (newRange) ->
    if !newRange
      range
    else
      range = newRange
      fn

  return fn

module.exports = {linear}
