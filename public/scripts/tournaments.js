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
    refreshTournaments();
    sendConfirmationEmail(tournamentNumber);
  });
}

function sendConfirmationEmail(tournamentNumber) {
  const tournament = tournaments[tournamentNumber - 1];
  var tournamentId = (tournament.date + "-" + tournament.game);
  var game = tournament.game;
  var date = tournament.elegant_date;
  var name = tournament.name;

  if (game == "FORTNITE") {
    var tournamentImage = "https://firebasestorage.googleapis.com/v0/b/all-star-esports/o/games%2FFORTNITE-gameplay.jpg?alt=media&token=e06d4b77-d426-4bd3-83d6-361d8f62a7b8"
  }
  else if (game == "OVERWATCH") {
    var tournamentImage = "https://firebasestorage.googleapis.com/v0/b/all-star-esports/o/games%2FOVERWATCH-gameplay.jpg?alt=media&token=24429097-5f08-4194-96ef-4fb0aeeace32"
  }
  else if (game == "SMASH") {
    var tournamentImage = "https://firebasestorage.googleapis.com/v0/b/all-star-esports/o/games%2FSMASH-gameplay.jpg?alt=media&token=2e09bb3a-810e-4a10-bb48-814b5ed61504"
  }
  else if (game == "VALORANT") {
    var tournamentImage = "https://firebasestorage.googleapis.com/v0/b/all-star-esports/o/games%2FVALORANT-gameplay.jpg?alt=media&token=f16058d0-9651-4450-913b-a7bc4efaf462"
  }

  firebase.firestore().collection("mail").doc(firebase.auth().currentUser.uid + "-" + tournamentId).set({
    toUids: [firebase.auth().currentUser.uid],
    template: {
      name: 'tournament_confirmation',
      data: {
        game: game,
        name: name,
        date: date,
        tournamentImage: tournamentImage,
        email: firebase.auth().currentUser.email
      }
    }
  });

}

function refreshTournaments() {
  var tournamentNumber = 1;
  firebase.firestore().collection("tournaments").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        tournaments.push(doc.data());

        document.getElementById("tournamentCard" + tournamentNumber).style.visibility = "visible";
        document.getElementById("tournamentWallpaper" + tournamentNumber).src = "/media/game_wallpapers/" + doc.data().game + "-" + "gameplay.jpg";
        document.getElementById("tournamentTitle" + tournamentNumber).innerHTML = doc.data().name;
        document.getElementById("tournamentGame" + tournamentNumber).innerHTML = doc.data().game;
        document.getElementById("tournamentDate" + tournamentNumber).innerHTML = doc.data().elegant_date;
        document.getElementById("tournamentParticipants" + tournamentNumber).innerHTML = (doc.data().players.length - 1) + " Participants";


        if ((doc.data().players).includes(firebase.auth().currentUser.uid)) {
          document.getElementById("tournamentCardButton" + tournamentNumber).className = 'tournamentCardButtonSigned';
          document.getElementById("tournamentCardButton" + tournamentNumber).innerHTML = "✓ Signed Up";
          document.getElementById("tournamentCardButton" + tournamentNumber).disabled = true;
        }

        tournamentNumber++;
    });
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
        document.getElementById("tournamentParticipants" + tournamentNumber).innerHTML = (doc.data().players.length - 1) + " Participants";


        if ((doc.data().players).includes(firebase.auth().currentUser.uid)) {
          document.getElementById("tournamentCardButton" + tournamentNumber).className = 'tournamentCardButtonSigned';
          document.getElementById("tournamentCardButton" + tournamentNumber).innerHTML = "✓ Signed Up";
          document.getElementById("tournamentCardButton" + tournamentNumber).disabled = true;
        }

        tournamentNumber++;
    });
  });
}
