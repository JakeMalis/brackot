const tournaments = new Array();

window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) { loadData(); }
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

function loadData() {
  firebase.firestore().collection("tournaments").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        //console.log(doc.id, " => ", doc.data());
        tournaments.push(doc.data());
    });
  }).then(function() {
      loadCards();
  }).then(function() {
      personalizeElements();
  });
}

function loadCards() {
  for (index = 0; index < tournaments.length; index++) {
    document.getElementById("tournamentCard" + (index + 1)).style.visibility = "visible";
  }
}

function personalizeElements() {
  for (index = 0; index < tournaments.length; index++) {
    const tournament = tournaments[index];
    var tournamentId = (tournament.date + "-" + tournament.game);

    var tournamentDocument = firebase.firestore().collection("tournaments").doc(tournamentId);
    tournamentDocument.collection("players").get().then(function(doc) {
      document.getElementById("tournamentWallpaper" + index).src = "/media/game_wallpapers/" + "fortnite" + "gameplay.png";
      document.getElementById("tournamentTitle" + index).innerHTML = tournament.name;
      document.getElementById("tournamentGame" + index).innerHTML = tournament.game;
      document.getElementById("tournamentDate" + index).innerHTML = tournament.elegant_date;
      document.getElementById("tournamentParticipants" + index).innerHTML = doc.size + " Participants";
    });
    tournamentDocument.collection("players").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
      if (doc.exists) {
        document.getElementById("tournamentCardButton" + index).classList.toggle('tournamentCardButtonSigned');
        document.getElementById("tournamentCardButton" + index).innerHTML = "✓ Signed Up";
        document.getElementById("tournamentCardButton" + index).disabled = true;
      }
    });
  }

  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
}
