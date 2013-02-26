var App = require('./app');

$(function() {
  $('a[rel=startApp]').click( function(ev) {
    ev.stopPropagation()
    ev.preventDefault()
    $(this).remove()
    App.init()
  });

  $('a[rel=show-code]').click( function() {
    var $gist = $('#the-code');
    if ($gist.is(':visible')) {
      $gist.slideUp();
      $(this).attr('data-content', 'view')
    } else {
      $gist.slideDown(200);
      $(this).attr('data-content', 'hide')
    }
    
  });


});
$('a[href="#comments"]').click(function(e) {
  e.preventDefault();
  $('html, body').animate({
    scrollTop: $("a[name=comments]").offset().top
  }, 500);
});
