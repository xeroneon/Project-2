$(document).ready(function(){
  $('.modal').modal();
});

$(function () {
  menu = $("nav ul");

  $("body").on("click","#openup", function (e) {
      e.preventDefault();
      menu.slideToggle();
  });

  $(window).resize(function () {
      var w = $(this).width();
      if (w > 480 && menu.is(":hidden")) {
          menu.removeAttr("style");
      }
  });

  $("body").on("click","nav li", function (e) {
      var w = $(window).width();
      if (w < 480) {
          menu.slideToggle();
      }
  });

  $(".open-menu").height($(window).height());
});