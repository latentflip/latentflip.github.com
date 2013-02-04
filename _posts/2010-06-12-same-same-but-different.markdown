---
date: 2010-06-12
layout: text
title: Same-same, but different
---

Whenever I have a merge conflict after merging from a branch into another with git, I get confused which bits came from where:

<script src="http://gist.github.com/435934.js?file=gistfile1.diff"></script>

In retrospect it's actually pretty straightforward. HEAD always refers to your current branch in git, so from <<<< to ==== is what was in the branch you started in, and ==== to >>>> is what was in the branch you came from.

Easy. When you know how.
