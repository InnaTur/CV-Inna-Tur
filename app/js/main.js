$(document).ready(function(){

  $(".logo,.menu__link").click(function(event) {
    event.preventDefault();
    const target = $(this).attr("href");
    const windowHeight = $(window).height();
    const targetPosition = $(target).offset().top;
    const scrollTo = targetPosition - (windowHeight / 7);
    $("html, body").animate({
      scrollTop: scrollTo
    }, 1000);
  });

  $('.burger-menu').click(function(){
    $(this).toggleClass('active');
    $('.menu').toggleClass('active');
  });

  $('.menu__link').click(function(){
    $('.menu').removeClass('active');
    $('.burger-menu').removeClass('active');
  });

  function moveElements() {
    if (window.matchMedia('(max-width: 810px)').matches) {
        $('.contacts-box').appendTo('.menu');
    } else {
        $('.contacts-box').appendTo('.summary__content');
    }
    
  }

  moveElements(); 

  $(window).resize(function(){
    moveElements(); 
  });

  window.addEventListener('load', function() {
    if (window.innerWidth > 810) {
        var wow = new WOW({
            boxClass: 'wow',
            animateClass: 'animate__animated',
            offset: 150,
            mobile: true,
            live: true
        });
        wow.init();
    }
  });


  $('.back-to-top').click(function () {
    $('body,html').animate({ scrollTop: 0 }, 1000);
  });

  $(window).scroll(function() {
    let scrollPosition = $(window).scrollTop();

    if (scrollPosition > 800) {
      $('.back-to-top').addClass('active');
    } else {
      $('.back-to-top').removeClass('active');
    }
  });
  
});




