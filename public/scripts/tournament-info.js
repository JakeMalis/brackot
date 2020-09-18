var tournamentId;

function personalizeElements() {
  var url = new URL(window.location.href);
  tournamentId = url.searchParams.get("tournamentId");

// The point of this code is to declare functions from other files. NOTE FROM JORDAN: you don't need to.  in fact, it throws an error anyways.
/*
$.getScript('brackets.js', function() {
  startTournament();
  renderMatchCards();
});
$.getScript('participantCards.js', function() {
  renderParticipants();
});
*/
  renderParticipants();


  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(function(doc) {
    document.getElementById("tournamentTitle").innerHTML = doc.data().name;
    var firstPlacePrize = (doc.data().earnings[1]);
    var secondPlacePrize = (doc.data().earnings[2]);
    var thirdPlacePrize = (doc.data().earnings[3]);
    if((firstPlacePrize == ("" || null || 0)) && (secondPlacePrize == ("" || null || 0)) && (thirdPlacePrize == ("" || null || 0))){
      $('#prizingQuickListItem').remove();
      $('#tournamentInfoSubheaderPrizes').remove();
      $('#prizingList').remove();
    }
    else{
      document.getElementById("prizingQuick").innerHTML = "Prizing Offered";
      if (doc.data().earnings[1] != ("" || null || 0)) {
        document.getElementById("tournamentInfoFirstPrizing").innerHTML = doc.data().earnings[1];
      }
      else{
        $('#firstPlace').remove();
      }
      if (doc.data().earnings[2] != ("" || null || 0)) {
        document.getElementById("tournamentInfoSecondPrizing").innerHTML = doc.data().earnings[2];
      }
      else{
        $('#secondPlace').remove();
      }
      if (doc.data().earnings[3] != ("" || null || 0)) {
        document.getElementById("tournamentInfoThirdPrizing").innerHTML = doc.data().earnings[3];
      }
      else{
        $('#thirdPlace').remove();
      }
    }
    document.getElementById("participantsQuick").innerHTML = (doc.data().players.length) + " Participants";
    document.getElementById("tournamentInfoDescription").innerHTML = doc.data().description;

    if (doc.data().game == "Counter-Strike Global Offensive") {
      document.getElementById("gameQuick").innerHTML = "Counter-Strike: Global Offensive";
    }
    else {
      document.getElementById("gameQuick").innerHTML = doc.data().game;
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

    document.getElementById("dateAndTimeQuick").innerHTML = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' @ ' + hour + ':' + String(date.getMinutes()).padStart(2, "0") + ' ' + meridiem;

    document.getElementById("tournamentInfoWallpaper").className = "headerImage tournamentInfoWallpaper " + (doc.data().game.toLowerCase()).replace(/ /g, "").replace("-","").replace(".","") + "InfoWallpaper";

    if (doc.data().tournamentStarted == false) {
      if (doc.data().creator === firebase.auth().currentUser.uid) {
        document.getElementById("tournamentSignUpButton").innerHTML = "Start Tournament";
        document.getElementById("tournamentSignUpButton").onclick = function() { startTournament(); };
      }
      else if ((!(doc.data().creator === firebase.auth().currentUser.uid)) && (!(doc.data().players).includes(firebase.auth().currentUser.uid))) {
        document.getElementById("tournamentSignUpButton").innerHTML = "Sign Up";
        document.getElementById("tournamentSignUpButton").onclick = function() { enroll(); };
      }
      else if ((doc.data().players).includes(firebase.auth().currentUser.uid)) {
        document.getElementById("tournamentSignUpButton").className = 'tournamentCardButton tournamentCardButtonSigned';
        document.getElementById("tournamentSignUpButton").innerHTML = "";
        document.getElementById("tournamentSignUpButton").onclick = function() { unenroll(); };
      }
    }
    else if (doc.data().tournamentStarted == true) {
      document.getElementById("tournamentSignUpButton").className = 'tournamentCardButton tournamentCardButtonInProgress';
      document.getElementById("tournamentSignUpButton").innerHTML = "Tournament In Progress";
      document.getElementById("tournamentSignUpButton").disabled = true;

      document.getElementById("bracketNavbar").style.display = "inline-block";
      renderMatchCards();
    }

    shuffledParticipants = doc.data().players;
    numParticipants = doc.data().players.length;
  });


}

function enroll() {
  firebase.firestore().collection("tournaments").doc(tournamentId).update({
    players: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
  }).then(function() {
    document.getElementById("tournamentSignUpButton").className = 'tournamentCardButton tournamentCardButtonSigned';
    document.getElementById("tournamentSignUpButton").innerHTML = "";
    document.getElementById("tournamentSignUpButton").disabled = true;
    sendConfirmationEmail(tournamentId);
  });
}

function unenroll(){
  firebase.firestore().collection("tournaments").doc(tournamentId).update({
    players: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
  }).then(function() {
    document.location.reload(false);
  });
}

function sendConfirmationEmail(tournamentId) {
  var game, date, name, tournamentImage;

  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(function(doc) {
    game = doc.data().game;

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

    date = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' @ ' + hour + ':' + String(date.getMinutes()).padStart(2, "0") + ' ' + meridiem;

    name = doc.data().name;

    var gsReference = firebase.storage().refFromURL("gs://brackot/game-images/" + (doc.data().game.toLowerCase()).replace(/ /g, "").replace("-","").replace(".","") + ".jpg");
    gsReference.getDownloadURL().then(async function(url) {
      firebase.firestore().collection("mail").add({
        toUids: [firebase.auth().currentUser.uid],
        template: {
          name: 'tournament_confirmation',
          data: {
            game: game,
            name: name,
            date: date,
            id: tournamentId,
            tournamentImage: url,
            email: firebase.auth().currentUser.email
          }
        }
      });
    });
  });
}

function setTab(tab) {
  if(tab === "overview") {
    document.getElementById("overviewTab").style.display = "block";
    document.getElementById("participantsTab").style.display = "none";
    document.getElementById("bracketTab").style.display = "none";

    document.getElementById("overviewNavbar").className = "quickNavbarItem quickNavbarItemSelected";
    document.getElementById("participantsNavbar").className = "quickNavbarItem";
    document.getElementById("bracketNavbar").className = "quickNavbarItem";
  }
  else if(tab === "participants") {
    document.getElementById("overviewTab").style.display = "none";
    document.getElementById("participantsTab").style.display = "block";
    document.getElementById("bracketTab").style.display = "none";

    document.getElementById("overviewNavbar").className = "quickNavbarItem";
    document.getElementById("participantsNavbar").className = "quickNavbarItem quickNavbarItemSelected";
    document.getElementById("bracketNavbar").className = "quickNavbarItem";
  }
  else if(tab === "bracket") {
    document.getElementById("overviewTab").style.display = "none";
    document.getElementById("participantsTab").style.display = "none";
    document.getElementById("bracketTab").style.display = "block";

    document.getElementById("overviewNavbar").className = "quickNavbarItem";
    document.getElementById("participantsNavbar").className = "quickNavbarItem";
    document.getElementById("bracketNavbar").className = "quickNavbarItem quickNavbarItemSelected";
  }
}
