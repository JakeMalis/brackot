function personalizeElements() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd
  }
  if(mm<10){
    mm='0'+mm
  }

  today = yyyy+'-'+mm+'-'+dd;
  document.getElementById("date").setAttribute("min", today);
}

function animateGameCarousel(selected){
  var colored = "#" + selected;
  $('.createTournamentGamesLabel').addClass('uncheckedGamesLabel');
  $(colored).removeClass('uncheckedGamesLabel');
}

function animatePrizing(selected){
  var clicked = "#" + selected + "Label";
  $('.prizingLabel').removeClass('createTournamentLabelChecked');
  $(clicked).addClass('createTournamentLabelChecked');
  if ($('#prizing').prop("checked") == true){
    $('#newTournamentPrizingRow').css("display", "inline-block");
  }
  else{
    $('#newTournamentPrizingRow').css("display", "none");
  }
}

function animatePlatform(selected){
  var clicked = "#" + selected + "Label";
  $(clicked).toggleClass('createTournamentLabelChecked');
}

function animateParticipantType(selected){
  var clicked = "#" + selected + "Label";
  $('.participantLabel').removeClass('createTournamentLabelChecked');
  $(clicked).addClass('createTournamentLabelChecked');
}

function addTournament() {
  var date = document.getElementById("date").value, time = document.getElementById("time").value;

  var firstEarnings = document.getElementById('firstEarnings').value;
  var secondEarnings = document.getElementById('secondEarnings').value;
  var thirdEarnings = document.getElementById('thirdEarnings').value;

  firebase.firestore().collection("tournaments").add({
      creator: firebase.auth().currentUser.uid,
      creatorName: firebase.auth().currentUser.displayName,
      date: new Date(date + " " + time),
      description: document.getElementById('tournamentDescription').value,
      game: document.querySelector('input[name="newTournamentGame"]:checked').value,
      name: document.getElementById('tournamentName').value,
      players: [],
      platform: {
          pc: document.getElementById("pc").checked,
          xbox: document.getElementById("xbox").checked,
          ps: document.getElementById("ps").checked,
          switch: document.getElementById("switch").checked,
          mobile: document.getElementById("mobile").checked
      },
      earnings: {
          1: firstEarnings,
          2: secondEarnings,
          3: thirdEarnings
      },
      tournamentStarted: false,
      unlimited: document.getElementById("unlimited").checked,
      type: document.querySelector('input[name="newTournamentParticipantType"]:checked').value
  }).then(function() {
      alert("Added tournament!");
  }).catch(function(error) {
          console.error("Error writing document: ", error);
  });
}
