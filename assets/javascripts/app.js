var blog = angular.module('blog', []);

blog.controller('PostCtrl', function() { });

function getName(obj) { 
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((obj).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

function stringifySomething(something, nest) {
  window.console.log("Trying to stringify", something);
  if (typeof something === "function") {
    return something.toString();
  } else if (typeof something == "object") {
    return stringifyObject(something, nest);
  } else if (typeof something == "string") {
    return "'"+something.toString()+"'";
  } else {
    return something.toString();
  }
}

function stringifyObject(obj, nest) {
  if (nest) {
    var names = [];
    names = _(obj).keys().slice(0,3);
    var ellipses = names.length > 3 ? ", ...}" : "}";
    names = names.slice(0,3);

    var objName = getName(obj);
    objName = objName === "Object" ? "" : objName;
    return objName + "{" +
            _.map(names, function(n) {
              return n + ": " + stringifySomething(obj[n]);
            }).join(', ') +
          ellipses;
  } else {
    return getName(obj);
  }
}

blog.directive('code', function() {
  function runTheCode(code, output) {
    var console = {}
    console.log = function() {
      output.show();
      var args = Array.prototype.slice.call(arguments);
      window.console.log("Displaying", args);
      
      args = args.map(function(arg) { return stringifySomething(arg, true) });

      var currentText = output.text();
      if (currentText.length) { currentText += "\n"; }
      output.text( currentText + '> ' + args.join(', ') );
    }
    eval(code);
  }

  return {
    restrict: 'E',
    link: function(scope, element) {
            var output = $('<pre class="code-output">').hide();
            var button = $('<button>Run me</button>');

            if( element.parent().is('pre') ) {
              output.insertAfter( element.closest('.highlight') );
              element.closest('.highlight').append(button);
              button.on('click', function() {
                runTheCode(element.text(), output);
              });
            }
          }
  }
});

function slugify(text) {
  text = text.toLowerCase();
  text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
  text = text.replace(/-/gi, "_");
  text = text.replace(/\s/gi, "-");
  return text;
}

blog.directive('h2', function() {
  return {
    restrict: 'E',
    link: function(scope, element) {
      var slug = slugify(element.text());
      var anchor = $('<a name="'+slug+'" href="#'+slug+'" class="permalink""> Link to this section</a>')
      element.append(anchor);
      if(window.location.hash === '#'+slug) {
        window.location.hash = '';
        window.location.hash = '#'+slug;
      }
    }
  }
});
