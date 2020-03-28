let log = console.log;
let burgerBar = $('.burger-bar');
let navTags = $('.nav-tags');

$(burgerBar).on('click', e => {
  $(navTags).toggle();
});


// landing page
