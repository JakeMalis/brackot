var tournamentId;
var disputeId;

function personalizeElements() {
  var url = new URL(window.location.href);
  tournamentId = url.searchParams.get("tournamentId");

  // The point of this code is to delcare functions from other files.
  $.getScript('brackets.js', function() {
    startTournament();
    renderMatchCards();
    openMatchModal();
    makePlayerWinner();
  });
  $.getScript('participantCards.js', function() {
    renderParticipants();
  });

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

      let findUserMatch = [];
      let round = "";
      let matchNumber = 0;
      for (let i = 9; i >= 1; i--) {
        let indexName = `matchupsRound${i}`;
        if(findUserMatch && findUserMatch.length >= 1) break;
        if(typeof doc.data()[indexName] === 'undefined') continue;
        doc.data()[indexName].map( (matchData, index) => {
          if( (matchData.playerOne == firebase.auth().currentUser.uid
            || matchData.playerTwo == firebase.auth().currentUser.uid)
            && matchData.timeToUpdateScore != null) {
            round = i;
            matchNumber = index;
            findUserMatch.push(matchData)
          }
        })
      }
  
      if(findUserMatch.length > 0) {
        for (let i = 0; i < findUserMatch.length; i++) {
          if(findUserMatch[i].disputeId) {
            disputeId = findUserMatch[i].disputeId;
            firebase.firestore().collection("matchDisputes").doc(disputeId).get().then(dispute => {
              if( (dispute.data().playerOne == firebase.auth().currentUser.uid && dispute.data().playerOneProof == null)
                || (dispute.data().playerTwo == firebase.auth().currentUser.uid && dispute.data().playerTwoProof == null) ) {
                if(!dispute.data().isResolved) {
                  if(dispute.data().proofUpdateTime) {
                    const currentDate = new Date();
                    const diffTime = Math.abs(currentDate - new Date(dispute.data().proofUpdateTime.seconds*1000));
                    const diffInMins = 10 - Math.ceil(diffTime / (1000 * 60));
                    if(diffInMins >= 0 && diffInMins <= 10) {
                      document.getElementById("alertBox").style.display = "block";
                      document.getElementById("alertBox").classList.add("errorAlert");
                      document.getElementById("alertTextBold").innerHTML = "Alert: ";
                      document.getElementById("alertText").innerHTML = `Current match has dispute between you and your opponent. Please update a picture/screenshot of your actual game score for verification. <button style="background-color: inherit; border: none; font-size: inherit; color: rgba(35,242,172,1);" onclick="openUploadDisputeProofModal(${round}, ${matchNumber})"> Update Proof </button>`;
                    } else {
                      if(dispute.data().playerOneProof != null) makePlayerWinner(dispute.data().playerOne)
                      else if(dispute.data().playerTwoProof != null) makePlayerWinner(dispute.data().playerTwo)
                    }
                  } else {
                    document.getElementById("alertBox").style.display = "block";
                    document.getElementById("alertBox").classList.add("errorAlert");
                    document.getElementById("alertTextBold").innerHTML = "Alert: ";
                    document.getElementById("alertText").innerHTML = `Current match has dispute between you and your opponent. Please update a picture/screenshot of your actual game score for verification. <button style="background-color: inherit; border: none; font-size: inherit; color: rgba(35,242,172,1);" onclick="openUploadDisputeProofModal(${round}, ${matchNumber})"> Update Proof </button>`;
                  }
                }
              }
            })
          } else {
            if((findUserMatch[i].playerTwo == firebase.auth().currentUser.uid || findUserMatch[i].playerOne == firebase.auth().currentUser.uid) && findUserMatch[i].playerUpdateScore != firebase.auth().currentUser.uid) {
              const currentDate = new Date();
              const diffTime = Math.abs(currentDate - new Date(findUserMatch[i].timeToUpdateScore.seconds*1000));
              const diffInMins = 10 - Math.ceil(diffTime / (1000 * 60));
              if(diffInMins >= 0 && diffInMins <= 10) {
                document.getElementById("alertBox").style.display = "block";
                document.getElementById("alertBox").classList.add("errorAlert");
                document.getElementById("alertTextBold").innerHTML = "Alert: ";
                document.getElementById("alertText").innerHTML = `Your opponent has updated the scores, and you have ${diffInMins} minutes left to update the score. <button style="background-color: inherit; border: none; font-size: inherit; color: rgba(35,242,172,1);" onclick='openMatchModal("matchCardRound${round}Match${matchNumber+1}")'> Upload Score </button>`;
              }
            } else {
              if(doc.data()[`matchupsRound${round+1}`]) {
                let data = [];
                doc.data()[`matchupsRound${round+1}`].map(nextRoundData => {
                  if(nextRoundData.playerOne == firebase.auth().currentUser.uid || nextRoundData.playerTwo == firebase.auth().currentUser.uid) {
                    data.push(nextRoundData)
                  }
                })
                if(data && data.length <= 0) {
                  let nextRoundData = doc.data()[`matchupsRound${round + 1}`];
                  let moveWinnerToNextRoundMatch = Math.ceil(matchNumber/2);
                  if( (matchNumber % 2) == 0) nextRoundData[moveWinnerToNextRoundMatch].playerOne = assignWinner(findUserMatch[i]);
                  else nextRoundData[moveWinnerToNextRoundMatch].playerTwo = assignWinner(findUserMatch[i]);
                  let indexName = `matchupsRound${round + 1}`;
                  firebase.firestore().collection("tournaments").doc(tournamentId).update({
                    [indexName]: nextRoundData
                  }).then(function() {
                    console.log("Updated scores")
                  });
                }
              } else {
                let nextRound = round + 1;
                let totalMatches = doc.data()[`matchupsRound${round}`].length;
                let nextRoundMatches = Math.ceil(totalMatches / 2);
                let nextRoundData = [];
                for (let i = 0; i < nextRoundMatches; i++) {
                  nextRoundData.push(Object.assign({}, new match(null, null)))
                }
                let moveWinnerToNextRoundMatch = Math.ceil(matchNumber/2);
                if( (matchNumber % 2) == 0) nextRoundData[moveWinnerToNextRoundMatch].playerOne = assignWinner(findUserMatch[i]);
                else nextRoundData[moveWinnerToNextRoundMatch].playerTwo = assignWinner(findUserMatch[i]);
                let indexName = `matchupsRound${nextRound}`;
                firebase.firestore().collection("tournaments").doc(tournamentId).update({
                  [indexName]: nextRoundData
                }).then(function() {
                  console.log("Updated scores")
                });
              }
            }
          }
        }
  
      }
  
      if(firebase.auth().currentUser.uid == doc.data().creator) {
        console.log("here");
        for (let i = 9; i >= 1; i--) {
          let indexName = `matchupsRound${i}`;
          if(typeof doc.data()[indexName] === 'undefined') continue;
          doc.data()[indexName].map( (matchData, index) => {
            if(matchData.disputeId != null) {
              firebase.firestore().collection("matchDisputes").doc(matchData.disputeId).get().then(data => {
                if(data.data().playerOneProof != null && data.data().playerTwoProof != null) {
                  document.getElementById("alertBox").style.display = "block";
                  document.getElementById("alertBox").classList.add("errorAlert");
                  document.getElementById("alertTextBold").innerHTML = "Alert: ";
                  document.getElementById("alertText").innerHTML = `There is a dispute raised by players in round no ${i}. Please click on resolve it. <button style="background-color: inherit; border: none; font-size: inherit; color: rgba(35,242,172,1);" onclick="openModalToResolveDispute('${matchData.disputeId}')"> Details </button>`;
                }
              })
            }
          })
        }
      }

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
function openUploadDisputeProofModal() {
  var modal = document.getElementById("screenshotModal");
  firebase.firestore().collection("matchDisputes").doc(disputeId).get().then(doc => {
    if(doc.data().playerOne == firebase.auth().currentUser.uid && doc.data().playerOneProof != null) {
      document.getElementById("screenshotDisplay").src = doc.data().playerOneProof;
    } else if(doc.data().playerTwo == firebase.auth().currentUser.uid && doc.data().playerTwoProof != null) {
      document.getElementById("screenshotDisplay").src = doc.data().playerTwoProof;
    }
  })
  modal.style.display = "block";
}

function closeUploadDisputeProofModal() {
  var modal = document.getElementById("screenshotModal");
  modal.style.display = "none";
}

function uploadDisputeScreenshot() {
  let storageRef = firebase.app().storage("gs://brackot-match-disputes").ref(disputeId);
  let screenshotRef = storageRef.child(firebase.auth().currentUser.uid);
  let image = document.getElementById('proofUploader').files[0];
  screenshotRef.put(image).then(function(snapshot) {
    console.log('Uploaded profile image!');
    snapshot.ref.getDownloadURL().then(function(url){
      firebase.firestore().collection("matchDisputes").doc(disputeId).get().then(doc => {
        if(doc.data().playerOne == firebase.auth().currentUser.uid) {
          firebase.firestore().collection("matchDisputes").doc(disputeId).update({
            playerOneProof: url,
            proofUpdateTime: new Date()
          });
        } else {
          firebase.firestore().collection("matchDisputes").doc(disputeId).update({
            playerTwoProof: url,
            proofUpdateTime: new Date()
          });
        }
      })
      document.getElementById("screenshotDisplay").src = url;
    });
  })
}

function openModalToResolveDispute(disputeData) {
  firebase.firestore().collection("matchDisputes").doc(disputeData).get().then(doc => {
    var modal = document.getElementById("disputeResolveModal");
    document.getElementById("screenshotDisplayPlayerOne").src = doc.data().playerOneProof;
    document.getElementById("screenshotDisplayPlayerTwo").src = doc.data().playerTwoProof;
    document.getElementById("screenshotDisplayPlayerOneBtn").onclick = () => makePlayerWinner(doc.data().playerOne);
    document.getElementById("screenshotDisplayPlayerTwoBtn").onclick = () => makePlayerWinner(doc.data().playerTwo);
    modal.style.display = "block";
  })
}

function closeResolveDisputeModal() {
  var modal = document.getElementById("disputeResolveModal");
  modal.style.display = "none";
}
