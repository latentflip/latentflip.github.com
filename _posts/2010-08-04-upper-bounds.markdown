---
date: 2010-08-04
layout: text
alias: /post/902965714/upper-bounds
title: Upper Bounds
categories: [essay]
---

One of my favorite lecturers from university was Dr Iain Lindsay, who taught 4th year Digital System Design. 

Judged against most of the other lecturers, who droned along to a set of dry powerpoint slides, his teaching style must have seemed "eccentric" to most of his students. Instead of a projector he scrawled across the blackboard, full academic gown flowing behind him. Where others would stick to a script defined by their slides, Iain's discussions would flow, and loop, and shoot off at seemingly irrelevant tangents, which later turned out to be deeply insightful. 

But to me, the real gems were the course notes. Each week he would hand out what is best described as a non-fiction novella: pages and pages of witty prose complete with hand-drawn diagrams. Every point he made or figure he quoted would be referenced in the footnotes, such that on some pages the footnotes made up half the content of the page. 

Typically these footnotes would be references to ancient books or datasheets, but not always. Lewis Carroll's _Alice In Wonderland_ was invoked to debate whether any two events can be truly synchronous; _[Buridan's Ass](http://en.wikipedia.org/wiki/Buridan's_ass)_ and WWII trench warfare were used to illustrate metastability and there were countless poems and other delighters.

One footnote that has stuck with me, and I keep stumbling across examples of, discussed the concept of [Zero One Infinity](http://en.wikipedia.org/wiki/Zero_One_Infinity) in system and software design. I forget the original footnote now, but it went something like this:

> Systems should be built to handle exactly one instance of an entity, an infinite number, or none at all. Setting an arbitrary limit is foolish and will inevitably be wrong.

It is easy to underestimate how often we ignore the infinity part of this concept. This is because very few things in daily life would actually require an _infinite_ limit, but that is somewhat missing the point. The problem is not that we need an infinite limit, but that whatever finite limit we choose, will inevitably not be large enough at some point. This will require either an inordinate amount of code & effort to deal with a mostly unusued case, or we can ignore the code and get mischeivous errors popping up.

Some classic examples:

* *Storing people's names in a database*: Easy right? You probably need 30 characters, maybe 40 at a push? Then you had better hope that famous painter _Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Cipriano de la Santísima Trinidad Clito Ruiz y Picasso_ never wants to use your application.
* *Hard drive space*: Supposedly Bill Gates once said "640K of memory should be enough for anybody". Sadly it seems to be a mis-quote, but I am sure others have made this mistake in the past, and will in the future.
* *Tennis Scores*: When the scoreboards were designed at Wimbledon they (arguably sensibly) only left two placeholders to represent the number of games played in the set, placing an upper bound of 99 games. During the 3-day marathon game between Isner and Mahut the number of games in the final set reached a stunning 70 to 68. <br/><strike>Sadly they didn't quite break the upper limit of the scoreboard, but it was much closer than I imagined the designers ever thought it would get.</strike><br/>As pointed out by Simon in the comments the scoreboard did indeed break and had to be reprogrammed, as it was only programmed to go up to 47!

---
I will end with a final footnote from the course notes. It is the start of a Monty Python song that was used to illustrate some chicken-egg problem with sequence design:

_Horace ate himself one day. He didn't stop to say his grace. He just sat down and ate his face..._





