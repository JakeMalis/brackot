//This janky code doesn't work quite yet - to fix, first override the !important visibility on the arrows.

function scrollCarouselRight(){
  $('#leftArrow').removeClass("hiddenArrow");
  var carousel = document.getElementById("browseGamesCarousel");
  carousel.scrollLeft += 576;
  var maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

  if(carousel.scrollLeft == maxScrollLeft){
    $('#rightArrow').addClass("hiddenArrow");
  }
}

function scrollCarouselLeft(){
  $('#rightArrow').removeClass("hiddenArrow");
  var carousel = document.getElementById("browseGamesCarousel");
  carousel.scrollLeft -= 576;

  var temp = carousel.scrollLeft;

  if(temp == 0){
    $('#leftArrow').addClass("hiddenArrow");
  }
}
