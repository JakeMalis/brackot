function loadTournamentInfo() {
  var url = new URL(window.location.href);
  var tournamentId = url.searchParams.get("tournamentId");

  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(function(doc) {
    document.getElementById("tournamentTitle").innerHTML = doc.data().name;
    document.getElementById("prizingQuick").innerHTML = ((doc.data().earnings[1]) + (doc.data().earnings[2]) + (doc.data().earnings[3])) + " Star Coins";
    document.getElementById("participantsQuick").innerHTML = (doc.data().players.length) + " Participants";
    document.getElementById("tournamentInfoDescription").innerHTML = doc.data().description;
    document.getElementById("tournamentInfoFirstPrizing").innerHTML = doc.data().earnings[1] + " Star Coins";

    if (doc.data().game == "SMASH") {
      document.getElementById("gameQuick").innerHTML = "Super Smash Bros. Ultimate";
    }
    else if (doc.data().game == "CSGO") {
      document.getElementById("gameQuick").innerHTML = "Counter-Strike: Global Offensive";
    }
    else if (doc.data().game == "LEAGUE") {
      document.getElementById("gameQuick").innerHTML = "League of Legends";
    }
    else if (doc.data().game == "ROCKET") {
      document.getElementById("gameQuick").innerHTML = "Rocket League";
    }
    else {
      document.getElementById("gameQuick").innerHTML = doc.data().game.substring(0,1) + doc.data().game.substring(1).toLowerCase();
    }

    var date = new Date(doc.data().date.toDate());
    var hour, meridiem;

    if ((date.getHours() - 12) <= 0) {
      hour = date.getHours();
      meridiem = "A.M."
    }
    else {
      hour = date.getHours() - 12;
      meridiem = "P.M."
    }

    document.getElementById("dateAndTimeQuick").innerHTML = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear() + ' @ ' + hour + ':' + date.getMinutes() + ' ' + meridiem;

    if (doc.data().earnings[2] != 0) {
      document.getElementById("tournamentInfoSecondPrizing").innerHTML = doc.data().earnings[2] + " Star Coins";
    } else { $('#secondPlace').remove(); }

    if (doc.data().earnings[3] != 0) {
      document.getElementById("tournamentInfoThirdPrizing").innerHTML = doc.data().earnings[3] + " Star Coins";
    } else { $('#thirdPlace').remove(); }

    document.getElementById("tournamentInfoDescription").className = "headerImage " + doc.data().game.toLowerCase() + "Wallpaper";

    if ((doc.data().players).includes(firebase.auth().currentUser.uid)) {
      document.getElementById("tournamentSignUpButton").className = 'tournamentCardButtonSigned';
      document.getElementById("tournamentSignUpButton").innerHTML = "✓ Signed Up";
      document.getElementById("tournamentSignUpButton").disabled = true;
    }
  });
}

function enroll() {
  var url = new URL(window.location.href);
  var tournamentId = url.searchParams.get("tournamentId");

  firebase.firestore().collection("tournaments").doc(tournamentId).update({
    players: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
  }).then(function() {
    document.getElementById("tournamentSignUpButton").className = 'tournamentCardButtonSigned';
    document.getElementById("tournamentSignUpButton").innerHTML = "✓ Signed Up";
    document.getElementById("tournamentSignUpButton").disabled = true;
    sendConfirmationEmail(tournamentId);
  });
}

function sendConfirmationEmail(tournamentId) {
  var game, date, name, tournamentImage;

  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(function(doc) {
    tournamentImage = "https://firebasestorage.googleapis.com/v0/b/all-star-esports/o/games%2F" + doc.data().game + "-gameplay.jpg?alt=media";

    if (doc.data().game == "SMASH") {
      game = "Super Smash Bros. Ultimate";
    }
    else if (doc.data().game == "CSGO") {
      game = "Counter-Strike: Global Offensive";
    }
    else if (doc.data().game == "LEAGUE") {
      game = "League of Legends";
    }
    else if (doc.data().game == "ROCKET") {
      game = "Rocket League";
    }
    else {
      game = doc.data().game.substring(0,1) + doc.data().game.substring(1).toLowerCase();
    }

    date = new Date(doc.data().date.toDate());
    var hour, meridiem;

    if ((date.getHours() - 12) <= 0) {
      hour = date.getHours();
      meridiem = "A.M."
    }
    else {
      hour = date.getHours() - 12;
      meridiem = "P.M."
    }

    date = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear() + ' @ ' + hour + ':' + date.getMinutes() + ' ' + meridiem;

    name = doc.data().name;
  }).then(function() {
    firebase.firestore().collection("mail").add({
      toUids: [firebase.auth().currentUser.uid],
      template: {
        name: 'tournament_confirmation',
        data: {
          game: game,
          name: name,
          date: date,
          id: tournamentId,
          tournamentImage: tournamentImage,
          email: firebase.auth().currentUser.email
        }
      }
    });
  });
}
