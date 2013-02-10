---
layout: code
title: Enemy of the state
---

State

We hear a lot about state. And if you are anything like me you probably think you have a pretty reasonable idea of what "state" generally means, but you may not have thought about it all that much. And trying to explaining why state is good or bad might be tough. Or you might have heard about things like Haskell, which don't have "state". What does that even _mean_?

Unless you came directly from a computer science background (I certainly didn't) you most likely started writing programs like this.

{% highlight javascript %}
var name = prompt("What's your name");

if (name === "Phil") {
  console.log("Man, you smell good");
} else {
  console.log("Guh, go take a shower");
}
{% endhighlight %}

Then you learned about functions, so you start wrapping things in functions to make them a bit easier to re-use:

{% highlight javascript %}
function smellChecker() {
  var name = prompt("What's your name");

  if (name === "Phil") {
    console.log("Man, you smell good");
  } else {
    console.log("Guh, go take a shower");
  }
}

smellChecker()
{% endhighlight %}

Then you learned about objects, and you realised you can wrap functions and "state" up into an object. So for our smell checker we might want to configure "who" smells good:

{% highlight javascript %}
smellChecker = {
  smellsOkay: "Phil",

  check: function(name) {
    if (name === this.smellsOkay) {
      console.log("Man, you smell good", name);
    } else {
      console.log("Guh, go take a shower", name);
    }
  }
}

smellChecker.check("Phil")

//Change smells okay
smellChecker.smellsOkay = "Pete"
smellChecker.check("Phil")

{% endhighlight %}

And as long as you keep writing "Business Logic" type apps, this never gets old, right. It just kinda works.

* We can save things in local variables and use them later:

{% highlight javascript %}
var priceOfEggs = 5;

console.log('3 eggs cost ' + 3*priceOfEggs);
console.log('5 eggs cost ' + 5*priceOfEggs);
{% endhighlight %}

* We can do clever things with variable scope:

{% highlight javascript %}
var priceOfEggs = 5;

function countTotal(n) {
  console.log(n + ' eggs cost ' + n*priceOfEggs);
}

countTotal(5);
countTotal(2);

{% endhighlight %}

And this is all fine and well, as long as we keep writing code that runs from top to bottom. But then, along comes the UI. And UI makes things hard. Really hard. But _why_?

//*

## Attack of the callback

Top to bottom code is easy to reason about and easy to follow. This happens, then that happens then, this happens. We can literally _see_ in what order, and when things are going to happen.

But as soon as we have user interaction. we don't have top to bottom any more. The user might click on any part of our app at any time. This means we have to deal with things asynchronously, which is a fancy way of saying, not in any particular order, not at any given time, and maybe not even at all.

Typically in JavaScript we deal with this with _The Callback_. Now if you've used jQuery you know what a callback is. It's that functiony bit in here right: `$('button').click(function(){})`. That much is obvious.

But let's think about what's actually going on here.

* We are defining a new function, and not executing it immediately. So we are saying, here's some things to do (inside the function body), but don't do them now, do them later whenever.
* A callback is just a function. It "becomes" a callback by the context it's used in. If the function is executed as a result of something else happening, rather than our own code, it's a callback.
* More subtly we are also capturing the scope.

Callbacks aren't inherently _a bad thing_ though. This callback is just fine, no problems here:

{% highlight javascript %}
  var theCallback = function() {
    console.log('The callback ran');
  };
  
  // `theCallback` will be called asynchronously
  // (after 500 milliseconds)
  setTimeout(theCallback, 500);

  // Note how this is output before the callback 
  // output, even though we called it after the
  // callback (in the code anyway)
  console.log('Immediately after the setTimeout call');
{% endhighlight %}


## Let's make it harder

Okay let's try and make it a little bit harder.


{% highlight javascript %}
  var num_eggs = 0;
  var price_eggs = 0;

  var updateTotal = function() {
    var newTotal = num_eggs * price_eggs;
    $('#total').text( newTotal.toFixed(2) );
  }

  $('#price_eggs').change(function() {
    price_eggs = parseFloat( $(this).val() );
    updateTotal();
  });

  $('#num_eggs').change(function() {
    num_eggs = parseInt( $(this).val() );
    updateTotal();
  });

  //Show the app
  $('#eggsapp').show();
  updateTotal();
{% endhighlight %}

<div id="eggsapp" style="display: none">
  <h3>Egg Counter</h3>
  <table>
    <tr>
      <td>
        <select id="price_eggs">
          <option>Choose your eggs</option>
          <option value="5">Free-range eggs (£5)</option>
          <option value="0.2">Rotten eggs (£0.20)</option>
        </select>
      </td>
      <td>
        <select id="num_eggs">
          <option>How many?</option>
          <option value="1">One</option>
          <option value="6">Half a dozen</option>
          <option value="12">A full dozen</option>
        </select>
      </td>
      <td font-size="small">Total: <span id="total"></span></td>
    </tr>
  </table>
</div>

