$(document).ready(function(){

var input = $("input[type=text]");
input.focusin(function() {
    $(this).addClass("blueBottomBorder");
    $(this).removeClass("roundedBottomBorder12");
});
input.focusout(function() {
    $(this).removeClass("blueBottomBorder");
    $(this).addClass("roundedBottomBorder12");
});

)};
