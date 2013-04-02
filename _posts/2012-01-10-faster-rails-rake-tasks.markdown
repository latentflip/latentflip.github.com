---
date: 2012-01-10
layout: text
alias: /post/15622557834/faster-rails-rake-tasks
title: Faster rake tasks in Rails
categories: [thought]
---

Rake tasks are awesome for project specific scripts among other things, but in rails projects they suck for short tasks that don't depend on rails. Here's why:

1. You type `rake my_task_that_doesnt_depend_on_the_rails_environment`
2. Rails loads (10-20 seconds)
3. Only then does your superfast rake task run. Boring!

Looking for a solution I came across Xavier Shay's [attempt](http://rhnh.net/2010/09/07/speeding-up-rails-rake) to deal with this. 

His solution is to maintain a list of rails tasks which depend on Rails (like `rake db:migrate`) in your Rakefile, and have the Rails environment autoload when any of those tasks are called. Any tasks in lib/tasks will now run nice and fast.

This helped, but it means you have to maintain a list of all the Rails tasks you may want to use (and any rake tasks included by gems used in your app) in your Gemfile, or remember to append `LOAD_RAILS=1` to your rake call to force rails to load.

Because I can't be bothered trying to remember which of my tasks depend on rails, I modified his Rakefile to autoload the Rails environment if Rake can't find a task (on the assumption that it'll be hidden in Rails/gem somewhere. This has the side-benefit of loading the `:environment` task, that any tasks which require the Rails environment depend on, if and when needed.

If you have any thoughts I'd love to hear them, the [gist is here](https://gist.github.com/1584072).

<script src="https://gist.github.com/1584072.js?file=Rakefile"></script>



