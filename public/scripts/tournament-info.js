var tournamentId;

function personalizeElements() {
  var url = new URL(window.location.href);
  tournamentId = url.searchParams.get("tournamentId");

  
  initChat();
  renderChat();
  renderParticipants();

  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(function(doc) {
    document.getElementById("tournamentTitle").innerHTML = doc.data().name;

    var entryFee = (doc.data().entryFee);
    if(entryFee == 0){
      $('#entryFeeQuickListItem').remove();
    }
    else{
      document.getElementById("entryFeeQuick").innerHTML = "$" + entryFee + " Entry Fee";
    }
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
        document.getElementById("tournamentInfoFirstPrizing").innerHTML = firstPlacePrize;
      }
      else{
        $('#firstPlace').remove();
      }
      if (doc.data().earnings[2] != ("" || null || 0)) {
        document.getElementById("tournamentInfoSecondPrizing").innerHTML = secondPlacePrize;
      }
      else{
        $('#secondPlace').remove();
      }
      if (doc.data().earnings[3] != ("" || null || 0)) {
        document.getElementById("tournamentInfoThirdPrizing").innerHTML = thirdPlacePrize;
      }
      else{
        $('#thirdPlace').remove();
      }
    }
    document.getElementById("participantsQuick").innerHTML = (doc.data().players.length) + " Participants";
    document.getElementById("tournamentInfoDescription").innerHTML = doc.data().description;

    var game = (doc.data().game);
    if (game == "Counter-Strike Global Offensive") {
      document.getElementById("gameQuick").innerHTML = "Counter-Strike: Global Offensive";
    }
    else {
      document.getElementById("gameQuick").innerHTML = game;
    }

    var date = new Date(doc.data().date.toDate());
    var hour, meridiem;

    if ((date.getHours() == 0)){
      hour = 12;
      meridiem = "A.M."
    }
    else if ((date.getHours() - 12) < 0) {
      hour = date.getHours();
      meridiem = "A.M."
    }
    else if ((date.getHours() - 12) == 0) {
      hour = date.getHours();
      meridiem = "P.M."
    }
    else {
      hour = date.getHours() - 12;
      meridiem = "P.M."
    }

    document.getElementById("dateAndTimeQuick").innerHTML = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' @ ' + hour + ':' + String(date.getMinutes()).padStart(2, "0") + ' ' + meridiem;

    document.getElementById("tournamentInfoWallpaper").className = "headerImage tournamentInfoWallpaper " + (doc.data().game.toLowerCase()).replace(/ /g, "").replace("-","").replace(".","") + "InfoWallpaper";

    if (doc.data().tournamentStatus == 'notStarted') {
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
    else if (doc.data().tournamentStatus == 'inProgress') {
      document.getElementById("tournamentSignUpButton").className = 'tournamentCardButton tournamentCardButtonInProgress';
      document.getElementById("tournamentSignUpButton").innerHTML = "Tournament In Progress";
      document.getElementById("tournamentSignUpButton").disabled = true;

      document.getElementById("bracketNavbar").style.display = "inline-block";
      renderMatchCards();
    }
    else if (doc.data().tournamentStatus == 'completed') {
      document.getElementById("tournamentSignUpButton").className = 'tournamentCardButton tournamentCardButtonInProgress';
      document.getElementById("tournamentSignUpButton").innerHTML = "Tournament Completed";
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
    document.getElementById("chatTab").style.display = "none";

    document.getElementById("overviewNavbar").className = "quickNavbarItem quickNavbarItemSelected";
    document.getElementById("participantsNavbar").className = "quickNavbarItem";
    document.getElementById("bracketNavbar").className = "quickNavbarItem";
    document.getElementById("chatNavbar").className = "quickNavbarItem";
  }
  else if(tab === "participants") {
    
    document.getElementById("overviewTab").style.display = "none";
    document.getElementById("participantsTab").style.display = "block";
    document.getElementById("bracketTab").style.display = "none";
    document.getElementById("chatTab").style.display = "none";

    document.getElementById("overviewNavbar").className = "quickNavbarItem";
    document.getElementById("participantsNavbar").className = "quickNavbarItem quickNavbarItemSelected";
    document.getElementById("bracketNavbar").className = "quickNavbarItem";
    document.getElementById("chatNavbar").className = "quickNavbarItem";
  }
  else if(tab === "bracket") {
    
    document.getElementById("overviewTab").style.display = "none";
    document.getElementById("participantsTab").style.display = "none";
    document.getElementById("bracketTab").style.display = "block";
    document.getElementById("chatTab").style.display = "none";

    document.getElementById("overviewNavbar").className = "quickNavbarItem";
    document.getElementById("participantsNavbar").className = "quickNavbarItem";
    document.getElementById("bracketNavbar").className = "quickNavbarItem quickNavbarItemSelected";
    document.getElementById("chatNavbar").className = "quickNavbarItem";
  }
  else if(tab === "chat") {
    
    document.getElementById("overviewTab").style.display = "none";
    document.getElementById("participantsTab").style.display = "none";
    document.getElementById("bracketTab").style.display = "none";
    document.getElementById("chatTab").style.display = "block";

    document.getElementById("overviewNavbar").className = "quickNavbarItem";
    document.getElementById("participantsNavbar").className = "quickNavbarItem";
    document.getElementById("bracketNavbar").className = "quickNavbarItem";
    document.getElementById("chatNavbar").className = "quickNavbarItem quickNavbarItemSelected";
    
  }
}


function openEntryFeeModal(match) {
  var modal = document.getElementById("entryFeeModal");
  modal.style.display = "block";

  var tournamentEntryFee;
  var tournamentTitle;
  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(function(doc){

  });
}

function closeEntryFeeModal() {
  var modal = document.getElementById("entryFeeModal");
  modal.style.display = "none";
}
