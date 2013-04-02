---
date: 2011-02-20
layout: text
alias: /post/3409125475/reading-rails
title: Reading Rails
categories: [thought]
---

I have been reading through the Rails source code today to spot bits of ruby/conventions/etc I haven't seen before. Here are the ones I have got so far. 

* ActiveSupport adds Hash#symbolize_keys which returns a hash with the keys symbolized
* If you are setting up constants in a class, it might be a good idea to freeze them so they don't get changed later

        ADAPTER_NAME = 'PostgreSQL'.freeze

* You can use a rescue in a method to catch things without requiring a begin

        def a_method(a)
          if a
            raise 'AnException'
          else
            puts 'a was false'
          end
        rescue
          'Rescued'
        end

        a_method(true) #=> 'Rescued'
        a_method(false) #=> 'a was false'

* is_a? and kind_of? are the same method.
* is_a? or kind_of? will check if the object is a member of that class anywhere on the inheritance chain. instance_of? checks if the object is exactly the class supplied:
        a_num = 5

        a_num.class #=> "Fixnum"
        a_num.is_a?(Integer) #=> true
        a_num.instance_of?(Integer) #=> false

* If you want to pass a multi-line string (here doc) to a method you can use this odd looking syntax:

        query(<<-SQL, name)
          SELECT blah
            FROM table
           WHERE ...
        SQL

* You can use ranges, or comma seperated lists in switch statements.

        case limit
          when 1..2; 'small'
          when 3..4; 'bigger'
          when 5..6; 'biggest'
        end

* Anywhere you need a comma seperated list (like the previous point) but you have an array, you can use the splat operator.

        SMALL = [1,2]
        BIGGER = [3,4]
        BIGGEST = [5,6]

        case limit
          when *SMALL; 'small'
          when *BIGGER; 'bigger'
          when *BIGGEST; 'biggest'
        end

* autoload may be a more efficient method of including modules than require. The difference is that using autoload, the module will only be included if the module is actually accessed.
  
        #instead of
        require 'awesome_module'
        class ThisIsAClass
          include AwesomeModule
        end

        #you can do
        require 'awesome_module'
        class ThisIsAClass
          autoload AwesomeModule, 'awesome_module'
        end

  * See also:
    * [The basics](http://www.rubyinside.com/ruby-techniques-revealed-autoload-1652.html)
    * [Some more tips](http://www.subelsky.com/2008/05/using-rubys-autoload-method-to.html)
    * [Concerns about autoload + threads](https://redmine.ruby-lang.org/issues/show/921)

* You can set a callback on a class which gets called when the class is subclassed.

        class Foo
          def self.inherited(subclass)
            puts "New subclass: #{subclass}"
          end
        end

        class Bar < Foo
        end 
        #=> New subclass: Bar

        class Baz < Bar
        end
        #=> New subclass: Baz

* Object.inherited is used by activerecord to fill up an array (stored in a class variable) of all the Models that exist. This is used at the very least to reset all the models' instance variables in the application.


