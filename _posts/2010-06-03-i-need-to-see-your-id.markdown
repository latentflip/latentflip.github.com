---
date: 2010-06-03
layout: text
title: Sorry Sir, I need to see your Id.
---

I just bumped into the following little "bug" in my rails app. I was getting the id of a related object to use to fill a newly added column in a migration, and suddenly far too many of the objects were linked to id=4. (Take particular note of the final line).

<script src="http://gist.github.com/423842.js"></script>

So what's going on? It turns out that as well as a database "id" (if the object is stored in the database), every object has an object_id (which is also accessible through .id if the object is not an ActiveRecord model).

So when we do: *jonny.parent.id* we are actually getting the id of the _nil_ object (since *jonny.parent* returns nil). This id is always 4, hence the confusion.

By doing: *jonny.parent_id* instead, we don't try and actually retrieve the parent object, but just look at the database row to get the value.

Admittedly you will get a warning if you do _nil.id_ : _warning: Object#id will be deprecated; use Object#object_id_, not that I spotted the warning.

So maybe this issue will disappear in the future, if _.id_ gets removed from the Ruby syntax, but until then consider yourself warned.

