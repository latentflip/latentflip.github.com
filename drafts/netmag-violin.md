I love thinking about how we can visualise code. It can help us spot performance issues and bugs, or help us better understand—and be more creative—with our code.

Violin is my experiment in visualising JavaScript. It takes an application and draws a graph showing all of the objects and functions in the app. What's really cool is that as you interact with the application, the graph animates in realtime to show the creation of new objects and execution of functions.

Violin automatically finds and rewrites the functions so that when they are called they also update and animate the graph. This is nice as it means you don't have to change how your code is written—Violin does all that work for you! In the demo, I've used BackBone to write a simple to-do list style app, and the graph is drawn using D3.js.

At the moment Violin is just an experiment, but there's a lot more fun to be had using and writing tools like this. My hope is that some of the new features in ECMAScript 5, and tools like Esprima (a JavaScript parser), could help us make even more useful tools like Violin in the future.
