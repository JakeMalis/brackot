
//I'm trying to figure out how to convert the header into a solid header after scrolling the page a little bit.
$(window).on("scroll", function () {
    if ($(this).scrollTop() > 50) {
        $("#topbar").addClass("solidNavbar");
    }
    else {
        $("#topbar").removeClass("solidNavbar");
    }
});

function toggleMenu(){
  var expandedTopbar = document.getElementById("topbarExpansion");
  expandedTopbar.classList.toggle("showExpansion");
}
