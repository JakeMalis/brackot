function detoggleGame() {
  var gamePopup = document.getElementById("gamePopup");
  var gameLabel = document.getElementById("gameButtonLabel");

  $(gamePopup).removeClass("show");
  $(gameLabel).removeClass("filterButtonLabelActive");
}

function detoggleDate() {
  var datePopup = document.getElementById("datePopup");
  var dateLabel = document.getElementById("dateButtonLabel");

  $(datePopup).removeClass("show");
  $(dateLabel).removeClass("filterButtonLabelActive");
}

function toggleGamePopup() {
  detoggleDate();
  var popup = document.getElementById("gamePopup");
  popup.classList.toggle("show");

  var label = document.getElementById("gameButtonLabel");
  label.classList.toggle("filterButtonLabelActive");
}

function toggleDatePopup() {
  detoggleGame();
  var popup = document.getElementById("datePopup");
  popup.classList.toggle("show");

  var label = document.getElementById("dateButtonLabel");
  label.classList.toggle("filterButtonLabelActive");
}

function changeGame(game) {
  document.getElementById("gameLabelField").innerHTML = game;
}

function changeDate(range) {
  document.getElementById("dateLabelField").innerHTML = range;
}
