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
  console.log(tournamentId);

  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(function(doc) {
    document.getElementById("tournamentTitle").innerHTML = doc.data().name;
    document.getElementById("participantsQuick").innerHTML = (doc.data().players.length - 1) + " Participants";
    document.getElementById("gameQuick").innerHTML = doc.data().game;
    document.getElementById("dateAndTimeQuick").innerHTML = (doc.data().elegant_date) + " at " + (doc.data().time) + " EST";
    document.getElementById("tournamentInfoFirstPrizing").innerHTML = doc.data().earnings[1] + " Star Coins";
    document.getElementById("tournamentInfoSecondPrizing").innerHTML = doc.data().earnings[2] + " Star Coins";
    document.getElementById("tournamentInfoThirdPrizing").innerHTML = doc.data().earnings[3] + " Star Coins";
    document.getElementById("tournamentInfoDescription").innerHTML = doc.data().description;

    

    /*
    if (doc.data().game == "FORTNITE") {
      var tournamentImage = "https://firebasestorage.googleapis.com/v0/b/all-star-esports/o/games%2FFORTNITE-gameplay.jpg?alt=media&token=e06d4b77-d426-4bd3-83d6-361d8f62a7b8"
    }
    else if (doc.data().game == "OVERWATCH") {
      var tournamentImage = "https://firebasestorage.googleapis.com/v0/b/all-star-esports/o/games%2FOVERWATCH-gameplay.jpg?alt=media&token=24429097-5f08-4194-96ef-4fb0aeeace32"
    }
    else if (doc.data().game == "SMASH") {
      var tournamentImage = "https://firebasestorage.googleapis.com/v0/b/all-star-esports/o/games%2FSMASH-gameplay.jpg?alt=media&token=2e09bb3a-810e-4a10-bb48-814b5ed61504"
    }
    else if (doc.data().game == "VALORANT") {
      var tournamentImage = "https://firebasestorage.googleapis.com/v0/b/all-star-esports/o/games%2FVALORANT-gameplay.jpg?alt=media&token=f16058d0-9651-4450-913b-a7bc4efaf462"
    }
    */
  });
}
