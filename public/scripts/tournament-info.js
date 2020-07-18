window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
        loadTournamentInfo();
      }
      else { window.location = "login.html"; }
  });
}

function loadTournamentInfo() {
  var url = new URL(window.location.href);
  var tournamentId = url.searchParams.get("tournamentId");

  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(function(doc) {
    document.getElementById("tournamentTitle").innerHTML = doc.data().name;
    document.getElementById("prizingQuick").innerHTML = ((doc.data().earnings[1]) + (doc.data().earnings[2]) + (doc.data().earnings[3])) + " Star Coins";
    document.getElementById("participantsQuick").innerHTML = (doc.data().players.length - 1) + " Participants";
    document.getElementById("gameQuick").innerHTML = doc.data().game;
    document.getElementById("dateAndTimeQuick").innerHTML = (doc.data().elegant_date) + " at " + (doc.data().time) + " EST";
    document.getElementById("tournamentInfoDescription").innerHTML = doc.data().description;
    document.getElementById("tournamentInfoFirstPrizing").innerHTML = doc.data().earnings[1] + " Star Coins";

    if (doc.data().earnings[2] != 0) {
      document.getElementById("tournamentInfoSecondPrizing").innerHTML = doc.data().earnings[2] + " Star Coins";
    } else { $('#secondPlace').remove(); }

    if (doc.data().earnings[3] != 0) {
      document.getElementById("tournamentInfoThirdPrizing").innerHTML = doc.data().earnings[3] + " Star Coins";
    } else { $('#thirdPlace').remove(); }


    if (doc.data().game == "FORTNITE") {
      document.getElementById("tournamentInfoDescription").className = "headerImage fortniteWallpaper";
    }
    else if (doc.data().game == "OVERWATCH") {
      document.getElementById("tournamentInfoDescription").className = "headerImage overwatchWallpaper";
    }
    else if (doc.data().game == "SMASH") {
      document.getElementById("tournamentInfoDescription").className = "headerImage smashWallpaper";
    }
    else if (doc.data().game == "VALORANT") {
      document.getElementById("tournamentInfoDescription").className = "headerImage valorantWallpaper";
    }
  });
}
