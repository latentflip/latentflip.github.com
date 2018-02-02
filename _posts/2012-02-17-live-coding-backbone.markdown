---
date: 2012-02-17
layout: text
alias: /post/17761189113/live-coding-backbone
title: A few live coding tips
categories: [thought]
---

Last night at [Scotrug](http://scotrug.org) I live coded some of [ToDoMVC](http://addyosmani.github.com/todomvc/) in Backbone.js to introduce Rubyists to Backbone and how it looks & feels.

Since it went surprisingly well, I thought I'd share a few quick tips:

### Keep it simple ###
The todo list app I wrote is very simple (and I didn't even finish it), but complex enough to demonstrate the basic elements and power of backbone.

The power of live coding isn't to show off how fast you can type, how complicated you can make something, or even really to show people code, but to give you a stage to talk through the elements and design choices of what you're building. The simpler it is, the more time and energy you'll have to talk.

### Think of your audience ###
I thought pretty hard about what I could expect my audience to know, and what I couldn't. You want to remove as much extraneous talk and code as possible - so if you're confident that most people will know something, don't just throw it in anyway. Keeping it out will keep their minds clear for the important stuff - and give you less code to make mistakes on.

The flip side of course is that you need to make sure you set the stage for what you are doing, and don't assume too much of your audience, or you'll lose them quickly.


### Think like a beginner ###
In the demo, I did a lot of back and forth between writing a little bit of JS in VIM, then using Chrome's console to play with the code I had just written ([here's](http://blog.dotsmart.net/2011/09/30/change-font-size-in-chrome-devtools/) a quick guide to increasing the font size so the audience can read it). I got a couple of compliments on that approach, I think because it helped me drive home the point at each step - rather than just diving ahead and writing the whole app at once.

I also added a couple of small "deliberate mistakes", mostly around JavaScript's async nature, to keep people thinking, and not just drifting off because everything was going too smoothly.


### Practice, publicly ###
My preparation for the demo went something like: 

* Built the app up from scratch completely, keeping a README explaining what I was doing and why, and carefully committing at every logical step.
* Dumping it all and doing the same thing again from scratch a couple of days later.
* Going through the commit logs and deciding what stuff was extraneous, and where I should actually start my live coding (I didn't want people to get bored watching me setup a rails app).
* I then put a shout out on twitter to see if anyone wanted a one-on-one tutorial. Thankfully @ryanstenhouse did. So I took him through the demo from start to end in a bar. This was the best prep. I did: it added a bit of pressure, and weeded out a few more mistakes I was likely to make. His enthusiasm also gave me the confidence that it was a good idea, and people would find it interesting. It also meant I had an ally in the audience who could help spot my bugs if something went really wrong.
* I did a final run through, recording myself via quicktime to get an idea of how long it might take, and to help me focus on slowing down and not making mistakes.


### And finally... ###
Pray that the demo gods are on your side...

Look out for the video which should be popping up online in the next week or so.


