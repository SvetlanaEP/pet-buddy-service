let navMain = document.querySelector('.main-nav');
let navToggle = document.querySelector('.main-nav__toggle');

navMain.classList.remove('main-nav--nojs');

navToggle.addEventListener('click', function () {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
  }
});
let menuLink = document.querySelectorAll('.site-menu__item');

menuLink.forEach((link) => {
  link.querySelector('a').addEventListener('click', () => {
    document.querySelector('html').style.overflow = 'auto';
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
    document.querySelector('html').style.overflow = 'auto';
  })
})

