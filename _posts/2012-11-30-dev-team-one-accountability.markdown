---
date: 2012-11-30
layout: text
alias: /post/36873527940/dev-team-one-accountability
title: The dev team of one&#58; accountability
categories: [essay]
---

Being in a technical team of one can really suck sometimes.

One of the problems I have is accountability. I am not directly accountable, nor working with, anyone in particular. The only people I am really dealing with on a technical difficulty are _past me_ and _future me_.

The trouble is, I am not very nice to _future me_, and _past me_ is not very nice to me. I am in fact, considerably more less nice to _future me_ than I would be to probably any other human on earth. I screw up his code base, check in code when the tests don't all work, write some of the crappiest git commits possible. Here are a choice few:

* "err": (3 changed files with 38 additions and 9 deletions)
* "close": (4 changed files with 3 additions and 122 deletions)
* "Smart decimals": (9 changed files with 73 additions and 47 deletions)

Thanks, douchebag.

But, recently the wonderful [Steven Baker](http://stevenrbaker.com/) offered to help out with Float from time to time, so I gave him access to our GitHub repo. It didn't occur to me that he would now see all my crappy commits in his GitHub feed until this happened:

<blockquote class="twitter-tweet" data-in-reply-to="271207001852366849"><p>@<a href="https://twitter.com/philip_roberts">philip_roberts</a> Anothing tip: commit message should say “why”. Look at your latest commit, the diff and the message both tell me what.</p>&mdash; Steven R. Baker (@srbaker) <a href="https://twitter.com/srbaker/status/271207749600301056" data-datetime="2012-11-21T11:05:40+00:00">November 21, 2012</a></blockquote>
<script src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Since then I have been _much_ more considerate about the commit messages I post. Just knowing that they will show up in _his_ feed is enough to make me take the few extra seconds to do a good job.

This has got me thinking about two things:

1. There must be lots of other ways to build this kind of mini, friendly, accountability in to my workflow, to keep me on the right track.
2. If anyone else needs a commit message over-seer I will happily help you out!
