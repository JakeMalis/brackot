
//I'm trying to figure out how to convert the header into a solid header after scrolling the page a little bit.
/*
$(function() {
    $(window).on("scroll", function() {
        if($(window).scrollTop() > 50) {
            $(".topNavbar").addClass("solidNavbar");
        } else {
           $(".topNavbar").removeClass("solidNavbar");
        }
    });
});*/

function toggleMenu(){
  var expandedTopbar = document.getElementById("topbarExpansion");
  expandedTopbar.classList.toggle("showExpansion");
}
