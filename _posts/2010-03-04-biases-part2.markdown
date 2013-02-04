---
date: 2010-03-04
layout: text
title: Biases, part 2
---

###It's always about money
As well as cognitive bias (see [Biases, part 1](http://blog.latentflip.com/post/424956944/biases-part1)), there is also plenty of physical bias in the world. 

A simple example is a weighted coin. A regular coin has a 50% chance of coming up heads, and a 50% chance of coming up tails. However, by cleverly distributing a coins mass, it is possible to make a coin that has a *bias* towards either heads or tails. The brilliant John von Neumann once posed a puzzle that went something like the following.

>Suppose Alice and Bob want to toss a coin to decide who pays for pizza, but the only coin they can find is Bob's trick weighted coin, which comes up heads more often than not. How can they use the coin to fairly decide who pays?

<!-- more -->

###Thinking in probabilities
* Clearly they cannot just toss the coin once as whoever got to call the toss would have an advantage.
* They *could* toss the coin 100 times to see how unfair the coin was (this was my initial thought) but that doesn't actually help them devise a fair toss.
* It turns out the solution involves looking over multiple tosses for a transition (from heads->tails; or tails->heads), rather than considering the individual toss.

####An Example
Consider the following (weighted) sequence which Bob's coin might generate. I have labelled heads as 1, tails as 0, and the transitions are marked with arrows (which hopefully line up).
<pre>
111111011101111101101111110111
     &darr;&uarr;&darr;&uarr;   &darr;&uarr;&darr;&uarr;    &darr;&uarr;
</pre>
* Clearly the coin is weighted (5 tails to 25 heads).
* But (unsurprisingly) the number of ups and downs is the same (5 a piece).
* Therefore Alice and Bob can use a transition to determine who pays, not an individual toss of the coin.

####The Solution
So the solution is to call heads or tails, then toss the coin twice, and look for a transition. The four possible results are:

* Heads, Heads: Ignore the "toss" and try again.
* Heads, Tails: Call this result "heads wins".
* Tails, Heads: Call this result "tails wins".
* Tails, Tails: As for *HH* ignore this toss and try again.

###A little maths.
At first the solution seems a little counter intuitive. It seems that if the coin is biased towards heads, then surely the first throw will almost always be heads, meaning that 'tails->heads' would be less likely. Remember though that the second throw will also probably be a head, so lots of heads first throws will be discarded anyway.

A little maths (for those so inclined) may make it a little clearer.

* Say that the percentage chance of heads being thrown is H%.
* And the percentage chance of tails being thrown is T%.
* And clearly H% + T% = 100% (we will always throw a head or a tail).

We can then look at how likely each of the four outcomes are:

* Heads, Heads = H*H%
* Heads, Tails = H*T%
* Tails, Heads = T*H%
* Tails, Tails = T*T%

Therefore the odds of *Heads,&nbsp;Tails*&nbsp;=&nbsp;odds&nbsp;of&nbsp;*Tails,&nbsp;Heads*, and the "toss" is fair. Problem solved.

###Who cares?
Good question. It turns out that Mr von Neumman's puzzle is quite useful to electronic engineers. 

Sometimes we have to generate *random and unbiased* sequences. We are often capable of generating random (or at least, random enough) sequences, but it is often difficult to do so without introducing bias. By using this nice little trick and only considering the transitions, we can overcome this problem. 

In my next post I will discuss what this all means mathematically in a little more depth.





