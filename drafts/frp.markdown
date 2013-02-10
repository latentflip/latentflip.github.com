---
layout: code
title: FRP
---

<script src="https://raw.github.com/raimohanska/bacon.js/master/dist/Bacon.js"> </script> 

High level - avoid the irrelevant.

But what is irrelevant?

What is "abstract" for UI?

Events
Combiners
Properties

What is FRP?
- Dynamic/evolving values, are first class _things_.
- Basic values (constant, time varying).
- Events

Domain specific languages that capture the notion of time-varying values.

---
from ftp://ftp.cs.brown.edu/pub/techreports/03/cs03-20.pdf

Reactive systems are:

- concurrent
- continuous
- inverted control structure

## Example (Vegan)

{% highlight javascript %}
var values = { in1: 0, in2: 0, in3: 0 }

var evToFloat = function(ev) {
  return parseFloat($(ev.currentTarget).val());
}

$('#jqueryDemo .in1').change(function(ev) {
  values.in1 = evToFloat(ev);
  updateTotal();
});

$('#jqueryDemo .in2').change(function(ev) {
  values.in2 = evToFloat(ev);
  updateTotal();
});

$('#jqueryDemo .in3').change(function(ev) {
  values.in3 = evToFloat(ev);
  updateTotal();
});

var updateTotal = function() {
  $('#jqueryDemo .result').text(values.in1 + values.in2 + values.in3);
}

//Kick off the app
$('#jqueryDemo').show();
updateTotal();
{% endhighlight %}

<div id="jqueryDemo" style="display: none">
<h3>My calculator</h3>
<input class="in1"/> + <input class="in2"/> + <input class="in3"/> = <span class="result"></span>
</div>


## Example (With Bacon)

{% highlight javascript %}
var values = { in1: 0, in2: 0, in3: 0 }

var evToFloat = function(ev) {
  return parseFloat($(ev.currentTarget).val());
}

var in1 = $('#baconDemo .in1')
            .asEventStream('change', evToFloat)
            .toProperty(0)

var in2 = $('#baconDemo .in2')
            .asEventStream('change', evToFloat)
            .toProperty(0)

var in3 = $('#baconDemo .in3')
            .asEventStream('change', evToFloat)
            .toProperty(0)

var result = Bacon.combineWith( [in1, in2, in3],
              function(a, b) {
                return a + b;
              }
            )

result = result.toProperty(0)

result.log()

result.assign( $('#baconDemo .result'), 'text' )

$('#baconDemo').show();
{% endhighlight %}

<div id="baconDemo" style="display: none">
<h3>My calculator</h3>
<input class="in1"/> + <input class="in2"/> + <input class="in3"/> = <span class="result"></span>
</div>


### Okay, that's kind of interesting, but the benefits are perhaps not _hugely_ obvious.

How about we make our little "spreadsheet" multiple user. For simplicity, let's just say that our "other user" changes the first element to 5 every 2 seconds.

## Example (Vegan)

{% highlight javascript %}
var values = { in1: 0, in2: 0, in3: 0 }

var evToFloat = function(ev) {
  return parseFloat($(ev.currentTarget).val());
}

$('#jqueryDemo2 .in1').change(function(ev) {
  values.in1 = evToFloat(ev);
  updateTotal();
});

$('#jqueryDemo2 .in2').change(function(ev) {
  values.in2 = evToFloat(ev);
  updateTotal();
});

$('#jqueryDemo2 .in3').change(function(ev) {
  values.in3 = evToFloat(ev);
  updateTotal();
});

var updateTotal = function() {
  $('#jqueryDemo2 .result').text(values.in1 + values.in2 + values.in3);
}

//Add multi-user
setInterval(function() {
  $('#jqueryDemo2 .in1').val(5).change();
}, 2000);

$('#jqueryDemo2').show();
updateTotal();
{% endhighlight %}

<div id="jqueryDemo2" style="display: none">
<h3>My calculator</h3>
<input class="in1"/> + <input class="in2"/> + <input class="in3"/> = <span class="result"></span>
</div>
