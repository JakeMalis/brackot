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

  firebase.firestore().collection("tournaments").doc(tournamentId).update({
    players: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
  }).then(function() {
    document.getElementById("tournamentCardButton" + tournamentNumber).classList.toggle('tournamentCardButtonSigned');
    document.getElementById("tournamentCardButton" + tournamentNumber).innerHTML = "✓ Signed Up";
    document.getElementById("tournamentCardButton" + tournamentNumber).disabled = true;
  });
}

function loadTournaments() {
  var tournamentNumber = 1;
  firebase.firestore().collection("tournaments").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        tournaments.push(doc.data());

        document.getElementById("tournamentCard" + tournamentNumber).style.visibility = "visible";
        document.getElementById("tournamentWallpaper" + tournamentNumber).src = "/media/game_wallpapers/" + doc.data().game + "-" + "gameplay.jpg";
        document.getElementById("tournamentTitle" + tournamentNumber).innerHTML = doc.data().name;
        document.getElementById("tournamentGame" + tournamentNumber).innerHTML = doc.data().game;
        document.getElementById("tournamentDate" + tournamentNumber).innerHTML = doc.data().elegant_date;
        document.getElementById("tournamentParticipants" + tournamentNumber).innerHTML = doc.data().players.length + " Participants";


        if ((doc.data().players).includes(firebase.auth().currentUser.uid)) {
          document.getElementById("tournamentCardButton" + tournamentNumber).classList.toggle('tournamentCardButtonSigned');
          document.getElementById("tournamentCardButton" + tournamentNumber).innerHTML = "✓ Signed Up";
          document.getElementById("tournamentCardButton" + tournamentNumber).disabled = true;
        }

        tournamentNumber++;
    });
  });
}
