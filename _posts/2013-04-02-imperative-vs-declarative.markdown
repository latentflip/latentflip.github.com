---
title: Imperative vs Declarative
date: 2013-04-02
layout: text
executable: false
---

Let's generalize and say that there are two ways in which we can write code: imperative and declarative.

We could define the difference as follows:

* **Imperative programming**: telling the "machine" _how_ to do something, and as a result _what_ you want to happen will happen.
* **Declarative programming**: telling the "machine"<sup>1</sup> _what_ you would like to happen, and let the computer figure out _how_ to do it.

<sup>1</sup> Computer/database/programming language/etc

## Examples of imperative and declarative code

Taking a simple example, let's say we wish to double all the numbers in an array.

We could do this in an imperative style like so:

{% highlight javascript %}
var numbers = [1,2,3,4,5]
var doubled = []

for(var i = 0; i < numbers.length; i++) {
  var newNumber = numbers[i] * 2
  doubled.push(newNumber)
}
console.log(doubled) //=> [2,4,6,8,10]
{% endhighlight %}

We explicitly iterate over the length of the array, pull each element out of the array, double it, and add the doubled value to the new array, mutating the `doubled` array at each step until we are done.

A more declarative approach might use the `Array.map` function and look like:

{% highlight javascript %}
var numbers = [1,2,3,4,5]
 
var doubled = numbers.map(function(n) {
  return n * 2
})
console.log(doubled) //=> [2,4,6,8,10]
{% endhighlight %}

`map` creates a new array from an existing array, where each element in the new array is created by passing the elements of the original array into the function passed to `map` (`function(n) { return n*2 }` in this case).

What the `map` function does is abstract away the process of explicitly iterating over the array, and lets us focus on _what_ we want to happen. Note that the function we pass to map is pure; it doesn't have any side effects (change any external state), it just takes in a number and returns the number doubled.

There are other common declarative abstractions for lists that are available in languages with a functional bent. For example, to add up all the items in a list imperatively we could do this:

{% highlight javascript %}
var numbers = [1,2,3,4,5]
var total = 0

for(var i = 0; i < numbers.length; i++) {
  total += numbers[i]
}
console.log(total) //=> 15
{% endhighlight %}

Or we could do it declaratively, using the `reduce` function:

{% highlight javascript %}
var numbers = [1,2,3,4,5]

var total = numbers.reduce(function(sum, n) {
  return sum + n
});
console.log(total) //=> 15
{% endhighlight %}

`reduce` boils a list down into a single value using the given function. It takes the function and applies it to all the items in the array. On each invocation, the first argument (`sum` in this case) is the result of calling the function on the previous element, and the second (`n`) is the current element. So in this case, for each element we add `n` to `sum` and return that on each step, leaving us with the sum of the entire array at the end.

Again, `reduce` abstracts over the _how_ and deals with the iteration and state management side of things for us, giving us a generic way of collapsing a list to a single value. All we have to do is specify _what_ we are looking for.

## Strange?

If you have not seen `map` or `reduce` before, this _will_ feel and look strange at first, I guarantee it. As programmers we are very used to specifying _how_ things should happen. "Iterate over this list", "if this then that", "update this variable with this new value". Why should you have to learn this slightly bizarre looking abstraction when you already know how to tell the machine how to do things?

In many situations imperative code is fine. When we write business logic we usually have to write mostly imperative code, as there will not exist a more generic abstraction over our business domain.

But if we take the time to learn (or build!) declarative abstractions we can take dramatic and powerful shortcuts when we write code. Firstly, we can usually write less of it, which is a quick win. But we also get to think and operate at a higher level, up in the clouds of _what_ we want to happen, and not down in the dirty of `how` it should happen.


## SQL

You may not realise it, but one place where you have already used declarative abstractions effectively is in SQL.

You can think of SQL as a declarative query language for working with sets of data. Would you write an entire application in SQL? Probably not. But for working with sets of related data it is incredibly powerful.

Take a query like:

{% highlight javascript %}
SELECT * from dogs
INNER JOIN owners
WHERE dogs.owner_id = owners.id
{% endhighlight %}

Imagine trying to write the logic for this yourself imperatively:

{% highlight javascript %}
//dogs = [{name: 'Fido', owner_id: 1}, {...}, ... ]
//owners = [{id: 1, name: 'Bob'}, {...}, ...]

var dogsWithOwners = []
var dog, owner

for(var di=0; di < dogs.length; di++) {
  dog = dogs[di]

  for(var oi=0; oi < owners.length; oi++) {
    owner = owners[oi]
    if (owner && dog.owner_id == owner.id) {
      dogsWithOwners.push({
        dog: dog,
        owner: owner
      })
    }
  }}
}
{% endhighlight %}

Yuck! Now, I'm not saying that SQL is always easy to understand, or necessarily obvious when you first see it, but it's a lot clearer than that mess.

But it's not just shorter and easier to read, SQL gives us plenty of other benefits. Because we have abstracted over the _how_ we can focus on the _what_ and let the database optimise the _how_ for us. 

If we were to use it, our imperative example would be slow because we would have to iterate over the full list of owners for every dog in the list. 

But in the SQL example we can let the database deal with _how_ to get the correct results. If it makes sense to use an index (providing we've set one up) the database can do so, resulting in a large performance gain. If it's just done the same query a second ago it might serve it from a cache almost instantly. By letting go of _how_ we can get a whole host of benefits by letting computers do the hardwork, with little cognitive overhead.

## d3.js

Another place where declarative approaches are really powerful is in user interfaces, graphics and animations.

Coding user interfaces is hard work. Because we have user interaction and we want to make nice dynamic user interactions, we typically end up with a lot of state management, and generic _how_ code that could be abstracted away, but frequently isn't.

A great example of a declarative abstraction is [d3.js](http://d3js.org/). D3 is a library that helps you build interactive and animated visualisations of data using JavaScript and (typically) SVG.

The first time (and fifth time, and possibly even the tenth time) you see or try and write d3 code your head will hurt. Like SQL, d3 is an incredibly powerful abstraction over visualising data that deals with almost all of the _how_ for you, and lets you just say what you want to happen.

Here's an example (I recommend [viewing the demo](http://bl.ocks.org/latentflip/5285027) for some context). This is a d3 visualization that draws a circles for each object in the `data` array. To demonstrate what's going on we add a circle every second.

The interesting bit of code is:
{% highlight javascript %}

//var data = [{x: 5, y: 10}, {x: 20, y: 5}]

var circles = svg.selectAll('circle')
                    .data(data)

circles.enter().append('circle')
           .attr('cx', function(d) { return d.x })
           .attr('cy', function(d) { return d.y })
           .attr('r', 0)
        .transition().duration(500)
          .attr('r', 5)
{% endhighlight %}

It's not essential to understand exactly what's going on here (it will take a while to get your head around regardless), but the gist of it is this:

First we make a selection object of all the svg `circle`s in the visualisation (initially there will be none). Then we bind some data to the selection (our data array).

D3 keeps track of which data point is bound to which circle in the diagram. So initially we have two datapoints, but no circles; we can then use the `.enter()` method to get the datapoints which have "entered". For those points, we say we would like a circle added to the diagram, centered on the `x` and `y` values of the datapoint, with an initial radius of `0` but transitioned over half a second to a radius of `5`.

### So why is this interesting?

Look through the code again and think about whether we are describing _what_ we want our visualisation to look like, or _how_ to draw it? You'll see that there is almost no _how_ code at all. We are just describing at quite a high level _what_ we want: 

> I want this data drawn as circles, centered on the point specified in the data, and if there are any new circles you should add them and animate their radius.

This is awesome, we haven't written a single loop, there is no state management here. Coding graphics is often hard, confusing and ugly, but here d3 has abstracted away most of the crap and left us to just specify _what_ we want.

Now, is d3.js easy to understand? Nope, it definitely takes a while to learn. And most of that learning is in giving up your desire to specify _how_ things should happen and instead learning how to specify _what_ you want. 

Initially this is hard work, but after a few hours something magical happens - you become really, really productive. By abstracting away the how d3.js really lets you focus on _what_ you want to see, which frankly is the only thing you should care about when designing something like a visualisation. It frees you from the fiddly details of the _how_ and lets you interact with the problem at a much higher level, opening up the possibilities for creativity.

## Finally

Declarative programming allows us to describe _what_ we want, and let the underlying software/computer/etc deal with _how_ it should happen.

In many areas, as we have seen, this can lead to some real improvements in how we write code, not just in terms of fewer lines of code, or (potentially) performance, but by writing code at a higher level of abstraction we can focus much more on _what_ we want, which ultimately is all we should really care about as problem solvers.

The problem is, as programmers we are very used to describing the _how_. It makes us feel good and comfortable - powerful, even - to be able to control what is happening, and not leave it to some magic process we can't see or understand. 

Sometimes it's okay to hold on to the _how_. If we need to fine tune code for high performance we might need to specify the _what_ in more detail. Or for business logic, where there isn't anything that a generic declarative library could abstract over, we're left writing imperative code.

But frequently we can, and I'd argue should, look for declarative approaches to writing code, nd if we can't find them, we should be building them. Will it be hard at first? Yes, almost certainly! But as we've seen with SQL and D3.js the long term benefits can be huge!

<p class='acknowledgements'>
Huge thanks to <a href='http://twitter.com/srbaker'>@srbaker</a>, <a href='http://twitter.com/maniacyak'>@maniacyak</a> and <a href='http://twitter.com/jcoglan'>@jcoglan</a> for their thoughts, encouragement and editing of this post.
</p>
