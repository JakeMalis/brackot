const tournaments = new Array();

window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
        loadTournaments();
      }
      else { window.location = "login.html"; }
  });
}

function enroll(tournamentNumber) {
  const tournament = tournaments[tournamentNumber - 1];
  var tournamentId = (tournament.date + "-" + tournament.game);

  firebase.firestore().collection("tournaments").doc(tournamentId).collection("players").doc(firebase.auth().currentUser.uid).set({
    name: firebase.auth().currentUser.displayName
  }).then(function() {
    document.getElementById("tournamentCardButton" + tournamentNumber).classList.toggle('tournamentCardButton');
    document.getElementById("tournamentCardButton" + tournamentNumber).innerHTML = "✓ Signed Up";
  });
}

function loadTournaments() {
  firebase.firestore().collection("tournaments").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        console.log(doc.id, " => ", doc.data());
        tournaments.push(doc.data());
    });
  }).then(function() {
      personalizeElements();
  });
}

function personalizeElements() {
  for (index = 0; index < tournaments.length; index++) {
    const tournament = tournaments[index];
    var tournamentId = (tournament.date + "-" + tournament.game);
    var cardNumber = index + 1;

    document.getElementById("tournamentCard" + cardNumber).style.visibility = "visible";

    document.getElementById("tournamentWallpaper" + cardNumber).src = "/media/game_wallpapers/" + tournament.game + "-" + "gameplay.jpg";
    document.getElementById("tournamentTitle" + cardNumber).innerHTML = tournament.name;
    document.getElementById("tournamentGame" + cardNumber).innerHTML = tournament.game;
    document.getElementById("tournamentDate" + cardNumber).innerHTML = tournament.elegant_date;

    var tournamentDocument = firebase.firestore().collection("tournaments").doc(tournamentId);

    tournamentDocument.collection("players").get().then(function(doc) {
      document.getElementById("tournamentParticipants" + cardNumber).innerHTML = doc.size + " Participants";
    });

    tournamentDocument.collection("players").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
      if (doc.exists) {
        document.getElementById("tournamentCardButton" + cardNumber).classList.toggle('tournamentCardButtonSigned');
        document.getElementById("tournamentCardButton" + cardNumber).innerHTML = "✓ Signed Up";
        document.getElementById("tournamentCardButton" + cardNumber).disabled = true;
      }
    });
  }
}
