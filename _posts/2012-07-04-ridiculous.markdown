---
date: 2012-07-04
layout: text
title: I'm just going to leave this here&#58;
---

If you aren't interested in Ruby, metaprogramming, or ridiculous things, move swiftly on ;)

---

So @MattWynne totally [nerd-sniped](http://xkcd.com/356/) me this evening, by 
asking this:

> Is is possible to dynamically add ActiveModel::Naming 
> compliance to an object at runtime? My meta-fu is 
> letting me down.

As far as I can figure out, it's not doable, but I 
can get 'pretty' close, here's what I learned:

<!-- more -->


ActiveModel::Naming is normally invoked like this:

    class Foo
      extend ActiveModel::Naming
    end

Which lets you do things like:

    Foo.model_name #=> 'Foo'
    
    x = Foo.new
    x.class.model_name #=> 'Foo'

So how can we add this functionality at runtime? The 
obvious way is:

    x = Foo.new
    x.class.extend(ActiveModel::Naming)

But if we do that, then we may as well have done it 
initially, as we are modifying the _class_ not 
just the instance. This will affect all 'Foo's in 
our system, which isn't really what we want.

We could try to modify the eigenclass of an 
instance, like so:

    require 'active_support/all'
    require 'active_model'
    
    class Foo
      def eigen
        class << self
          self
        end
      end
    end
    
    x = Foo.new
    x.eigen.extend(ActiveModel::Naming)
    
But when doing a classwise lookup, ruby uses the actual 
class, not the eigen class:

    x.class.model_name #=> wrap2.rb:14:in `<main>': undefined 
                       #   method `model_name' for Foo:Class 
                       # (NoMethodError)

So, we could override `Foo#class`, to return the eigenclass 
(now we are getting a bit crazy):

    require 'active_support/all'
    require 'active_model'
    
    class Foo
      def eigen
        class << self
          self
        end
      end
      def class
        eigen
      end
    end
    
    x = Foo.new
    x.eigen.extend(ActiveModel::Naming)

But this doesn't work either, as now ActiveModel::Naming 
get's confused as it's not in a named class:

    x.class.model_name #=> Class name cannot be blank. You 
                       #   need to supply a name argument 
                       #   when anonymous class given 
                       #   (ArgumentError)


So the best I can come up with is what is in the file 
below. This instantiates a wrapper class with the same 
name (dynamically) as the original class, extends it 
with ActiveRecord::Naming, and forwards all calls to 
the original. The one caveat is that our class is now 
within a module, so the names will have the module name 
in... I don't know how this affects `form_for`, etc

<div class='gist' data-gist='3049516'></div>
