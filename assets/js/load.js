$(document).ready(function() {
  console.log('Ready.');

  $('.js-nav-btn').click(function(event) {
    event.preventDefault();
    $('body').toggleClass('nav-visible');
  });
});