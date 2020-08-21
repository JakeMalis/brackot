function toggleGamePopup() {
  var popup = document.getElementById("gamePopup");
  popup.classList.toggle("show");

  var label = document.getElementById("gameButtonLabel");
  label.classList.toggle("filterButtonLabelActive")
}

function toggleDatePopup() {
  var popup = document.getElementById("datePopup");
  popup.classList.toggle("show");

  var label = document.getElementById("dateButtonLabel");
  label.classList.toggle("filterButtonLabelActive")
}
