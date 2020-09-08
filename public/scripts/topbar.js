
//I'm trying to figure out how to convert the header into a solid header after scrolling the page a little bit.
window.addEventListener("scroll", function () {
    if ($(this).scrollTop() > 50) {
      $("#topNavbar").addClass("solidNavbar");
    }
    else if (!$("#topbarExpansion").hasClass("showExpansion")) {
      $("#topNavbar").removeClass("solidNavbar");
    }
});

function toggleMenu(){
  var expandedTopbar = document.getElementById("topbarExpansion");
  expandedTopbar.classList.toggle("showExpansion");
  $("#topNavbar").addClass("solidNavbar");
}
