var shuffledParticipants = [];
var numParticipants = 0;
var tempMatch = new match(null, null);

class EmptyMatchCard extends React.Component {
  render() {
    return (
      <div className={"match " + "match" + this.props.roundNumber + " empty"} id={"matchCardRound" + this.props.roundNumber + "Match" + this.props.matchNumber}></div>
    );
  }
}

class MatchCard extends React.Component {
  render() {
    return (
      <div className={"match " + "match" + this.props.roundNumber + this.props.empty} id={"matchCardRound" + this.props.roundNumber + "Match" + this.props.matchNumber} onClick={() => { openMatchModal("matchCardRound" + this.props.roundNumber + "Match" + this.props.matchNumber)}}>
        <UpperParticipant participantNumber={this.props.participants[0].uid} roundNumber={this.props.roundNumber} matchNumber={this.props.matchNumber} />
        <LowerParticipant participantNumber={this.props.participants[1].uid} roundNumber={this.props.roundNumber} matchNumber={this.props.matchNumber} />
      </div>
    );
  }
}

class UpperParticipant extends React.Component {
  render() {
    return(
      <div className={"participant UpperHalf"}>
        <img className="participantProfilePic" id={"upperParticipantProfilePicRound" + this.props.roundNumber + "Match" + this.props.matchNumber + "-" + this.props.participantNumber} src="media/BrackotLogo2.jpg"></img>
        <p className="teamName" id={"upperParticipantNameRound" + this.props.roundNumber + "Match" + this.props.matchNumber + "-" + this.props.participantNumber}></p>
        <p className="score whiteText" id={"upperParticipantScoreRound" + this.props.roundNumber + "Match" + this.props.matchNumber + "-" + this.props.participantNumber}></p>
      </div>
    );
  }
}

class LowerParticipant extends React.Component {
  render() {
    return(
      <div className={"participant LowerHalf"}>
        <img className="participantProfilePic" id={"lowerParticipantProfilePicRound" + this.props.roundNumber + "Match" + this.props.matchNumber + "-" + this.props.participantNumber} src="media/BrackotLogo2.jpg"></img>
        <p className="teamName" id={"lowerParticipantNameRound" + this.props.roundNumber + "Match" + this.props.matchNumber + "-" + this.props.participantNumber}></p>
        <p className="score whiteText" id={"lowerParticipantScoreRound" + this.props.roundNumber + "Match" + this.props.matchNumber + "-" + this.props.participantNumber}></p>
      </div>
    );
  }
}

class Connector extends React.Component {
  render() {
    return (
      <div className={"connector " + "connector" + this.props.roundNumber} id={"connector" + this.props.matchNumber}>
        <div className="connectorLeft"></div>
        <div className="connectorRight"></div>
      </div>
    );
  }
}

/*
variable names: roundNumber, matchNumber, participantNumber, half, empty

classNames = The rectangle containing two participants within it is called a match.  Every match has the class match.
              Depending on what round the match is in, it will have ANOTHER class, called match(insertRoundNumberHere).
              Finally, if the match is an empty space, and it is merely a space placeholder, and nobody will EVER players
              in that spot, then you add the class emptySpace as well.
EXAMPLES
match match2  -  a match in the second round with people playing in it
match match4  -  a match in the fourth round with people playing in it
match match1 emptySpace  -  an empty space of nothing at all used for spacing in the first round


              Now, for participants.  Each match has two participant elements within it.
              Participant elements have the class participant, and also have either the class upperHalf or lowerHalf
              Finally, there will be slots for participants that are TEMPORARILY empty, waiting for the next winner to
              fill that spot. In that case, the participant also has the class noParticipant, until someone fills it,
              at which point it is removed.
EXAMPLES
participant upperHalf  -  the first person in the index of a match, filling the "upper" spot in the match
participant lowerHalf  -  the second person in the index of a match, filling the "lower" spot in the match
participant upperHalf noParticipant  -  the upper half of a match doesn't have its player yet from the last match
                                         therefore, it has the noParticipant class to leave an empty spot in upperHalf
*/

function renderMatchCards() {
  firebase.firestore().collection("tournaments").doc("ryFCOXeP97rqHQeVFl0s").get().then(function(doc) {
    for (var round = 1; round <= getByesAndRounds()[1]; round++){
      var MatchColumnCards = [];
      var ConnectorColumnConnectors = [];
      var matchNumber = 1;
      var connectorNumber = 1;

      if (round == 1) { var matchups = doc.data().matchupsRound1; }
      else if (round == 2) { var matchups = doc.data().matchupsRound2; }
      else if (round == 3) { var matchups = doc.data().matchupsRound3; }
      else if (round == 4) { var matchups = doc.data().matchupsRound4; }
      else if (round == 5) { var matchups = doc.data().matchupsRound5; }
      else if (round == 6) { var matchups = doc.data().matchupsRound6; }
      else if (round == 7) { var matchups = doc.data().matchupsRound7; }
      else if (round == 8) { var matchups = doc.data().matchupsRound8; }
      else if (round == 9) { var matchups = doc.data().matchupsRound9; }

      matchups.forEach(function(entry) {
        var upperParticipant, lowerParticipant;
        var participants = [];

        if ((entry.playerOne === null) && (entry.playerTwo === null)) {
          MatchColumnCards.push(<EmptyMatchCard roundNumber={round} matchNumber={matchNumber} />);
        }

        else {
          upperParticipant = { uid: entry.playerOne };
          participants.push(upperParticipant);
          lowerParticipant = { uid: entry.playerTwo };
          participants.push(lowerParticipant);
          MatchColumnCards.push(<MatchCard roundNumber={round} matchNumber={matchNumber} empty="" participants={participants} />);
        }
        matchNumber++;
      });
      ReactDOM.render(
        MatchColumnCards,
        document.getElementById("matchColumn" + round)
      );
      /*ReactDOM.render(
        document.getElementById("connectorColumn" + round)
      );*/
    }
  }).then(function() {
    loadMatchData();
  });
}

function loadMatchData() {
  firebase.firestore().collection("tournaments").doc("ryFCOXeP97rqHQeVFl0s").get().then(function(doc) {
    for (var round = 1; round <= getByesAndRounds()[1]; round++){
      var matchNumber = 1;

      if (round == 1) { var matchups = doc.data().matchupsRound1; }
      else if (round == 2) { var matchups = doc.data().matchupsRound2; }
      else if (round == 3) { var matchups = doc.data().matchupsRound3; }
      else if (round == 4) { var matchups = doc.data().matchupsRound4; }
      else if (round == 5) { var matchups = doc.data().matchupsRound5; }
      else if (round == 6) { var matchups = doc.data().matchupsRound6; }
      else if (round == 7) { var matchups = doc.data().matchupsRound7; }
      else if (round == 8) { var matchups = doc.data().matchupsRound8; }
      else if (round == 9) { var matchups = doc.data().matchupsRound9; }

      matchups.forEach(function(entry) {
        var upperParticipant, lowerParticipant;
        var participants = [];
        if (!((entry.playerOne === null) && (entry.playerTwo === null))) { tempCode(entry, matchNumber, round); }
        matchNumber++;
      });
    }
  });
}

async function tempCode(entry, matchNumber, round) {
  firebase.firestore().collection("users").doc(entry.playerOne).get().then(function(userDoc) {
    document.getElementById("upperParticipantNameRound" + round + "Match" + matchNumber + "-" + entry.playerOne).innerHTML = userDoc.data().name;
    document.getElementById("upperParticipantScoreRound" + round + "Match" + matchNumber + "-" + entry.playerOne).innerHTML = entry.playerOneScore;
    /*====================================GRAB USER PROFILE PICTURE========================================================== */
    var gsReference = firebase.storage().refFromURL("gs://all-star-esports.appspot.com/" + entry.playerOne + "/profile");
    gsReference.getDownloadURL().then(function (url) {
      document.getElementById("upperParticipantProfilePicRound" + round + "Match" + matchNumber + "-" + entry.playerOne).src = url;
    }).catch(
      e => {
        console.log(e);
      })

  });


  firebase.firestore().collection("users").doc(entry.playerTwo).get().then(function(userDoc) {
    document.getElementById("lowerParticipantNameRound" + round + "Match" + matchNumber + "-" + entry.playerTwo).innerHTML = userDoc.data().name;
    document.getElementById("lowerParticipantScoreRound" + round + "Match" + matchNumber + "-" + entry.playerTwo).innerHTML = entry.playerTwoScore;
    /*====================================GRAB USER PROFILE PICTURE========================================================== */
    var gsReference = firebase.storage().refFromURL("gs://all-star-esports.appspot.com/" + entry.playerTwo + "/profile");
    gsReference.getDownloadURL().then(function (url) {
      document.getElementById("lowerParticipantProfilePicRound" + round + "Match" + matchNumber + "-" + entry.playerTwo).src = url;
    }).catch(
      e => {
        console.log(e);
      })


  });
}



function personalizeElements() {
  firebase.firestore().collection("tournaments").doc("ryFCOXeP97rqHQeVFl0s").get().then(function(doc){
    shuffledParticipants = doc.data().players;
    numParticipants = doc.data().players.length;
  }).then(function() {

    shuffleParticipants();

    var byes = getByesAndRounds()[0];
    var rounds = getByesAndRounds()[1];
    var firstRound = createInitialMatches();
    var secondRound = [];

    firebase.firestore().collection("tournaments").doc("ryFCOXeP97rqHQeVFl0s").update({
      shuffledParticipants: shuffledParticipants,
      matchupsRound1: firstRound
    }).then(function() {
      console.log('Uploaded 1st round')
    });
    if(numParticipants > 2){
      secondRound = implementByes();
      firebase.firestore().collection("tournaments").doc("ryFCOXeP97rqHQeVFl0s").update({
        matchupsRound2: secondRound
      }).then(function() {
        console.log('Uploaded 2nd round')
      });
    }

    var matches = [];

    if(rounds > 2){
      matches = nextRound(secondRound);
      firebase.firestore().collection("tournaments").doc("ryFCOXeP97rqHQeVFl0s").update({
        matchupsRound3: matches
      }).then(function() {
        console.log('Uploaded 3rd round')
      });
    }
    if(rounds > 3){
      matches = nextRound(matches);
      firebase.firestore().collection("tournaments").doc("ryFCOXeP97rqHQeVFl0s").update({
        matchupsRound4: matches
      }).then(function() {
        console.log('Uploaded 4th round')
      });
    }
    if(rounds > 4){
      matches = nextRound(secondRound);
      firebase.firestore().collection("tournaments").doc("ryFCOXeP97rqHQeVFl0s").update({
        matchupsRound5: matches
      }).then(function() {
        console.log('Uploaded 5th round')
      });
    }
    if(rounds > 5){
      matches = nextRound(matches);
      firebase.firestore().collection("tournaments").doc("ryFCOXeP97rqHQeVFl0s").update({
        matchupsRound6: matches
      }).then(function() {
        console.log('Uploaded 6th round')
      });
    }
    if(rounds > 6){
      matches = nextRound(matches);
      firebase.firestore().collection("tournaments").doc("ryFCOXeP97rqHQeVFl0s").update({
        matchupsRound7: matches
      }).then(function() {
        console.log('Uploaded 7th round')
      });
    }
    if(rounds > 7){
      matches = nextRound(secondRound);
      firebase.firestore().collection("tournaments").doc("ryFCOXeP97rqHQeVFl0s").update({
        matchupsRound8: matches
      }).then(function() {
        console.log('Uploaded 8th round')
      });
    }
    if(matches.length == 1){
      var winner = [assignWinner(matches[0])];
      firebase.firestore().collection("tournaments").doc("ryFCOXeP97rqHQeVFl0s").update({
        matchupsRound9: winner
      }).then(function() {
        console.log('Uploaded final round')
        //assignScores();
        renderMatchCards();
      });
    }

    //renderMatchCards();
  });
}

function match(p1, p2) {
  this.playerOne = p1;
  this.playerTwo = p2;
  this.playerOneScore = null;
  this.playerTwoScore = null;

}


function shuffleParticipants(){
  for(var i = numParticipants - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i);
    const temp = shuffledParticipants[i];
    shuffledParticipants[i] = shuffledParticipants[j];
    shuffledParticipants[j] = temp;
  }
}


function getByesAndRounds(){
  var byes = 0;
  var rounds = 0;
  var test = true;
  while (test) {
    if (Math.pow(2, rounds) < numParticipants){
      rounds++;
    }
    else{
      byes = Math.pow(2, rounds) - numParticipants;
      test = false;
    }
  }
  return [byes, rounds];
  /* rounds returns number of rounds in the tournament */
  /* byes returns number of players that need byes in the first round */
}

function createInitialMatches(){
  var matches = [];
  var byes = getByesAndRounds()[0];
  var initialNumRounds = (numParticipants - byes)/2;
  if(byes >= initialNumRounds){
    for(var x = 0; x < 2 * initialNumRounds; x+=2){
      matches.push(Object.assign({}, new match(shuffledParticipants[x], shuffledParticipants[x+1])));
      matches.push(Object.assign({}, new match(null, null)));
    }
    for(var y = 0; y < byes - initialNumRounds; y+=2){
      matches.push(Object.assign({},new match(null, null)));
    }
  }
  else if (byes == 0){
    for(var v = 0; v < 2*initialNumRounds; v+=2){
      matches.push(Object.assign({}, new match(shuffledParticipants[v], shuffledParticipants[v+1])));
    }
  }
  else {
    for(var z = 0; z < 2 * byes; z+=2){
      matches.push(Object.assign({},new match(shuffledParticipants[z], shuffledParticipants[z+1])));
      matches.push(Object.assign({},Object.assign({}, new match(null, null))));
    }
    for(var w = 0; w < 2 * (initialNumRounds - byes); w+=2){
      var indexStart = 2 * (byes + 1) - 1;
      matches.push(Object.assign({}, new match(shuffledParticipants[indexStart + w], shuffledParticipants[indexStart + w+1])));
    }
  }

  return matches;
}


function assignWinner(matchUp){
  /*
  if(matchUp.playerOneScore > matchUp.playerTwoScore){
    return matchUp.playerOne;
  }
  else if(matchUp.playerOneScore < matchUp.playerTwoScore){
    return matchUp.plaayerTwoScore;
  }
  else if(matchUp.playerOneScore == null && matchUp.playerTwoScore == null){
    return null;
  }*/
  return matchUp.playerOne;
}


function implementByes(){    /* creates second round of matches */
  var matches = [];
  var initialMatches = createInitialMatches();
  var byes = getByesAndRounds()[0];
  var numOfWinners = (numParticipants-byes)/2;
  var count = 1;
  if(byes == 0){
    for(var w = 0; w < numOfWinners; w+=2){
      matches.push(Object.assign({}, new match(assignWinner(initialMatches[w]), assignWinner(initialMatches[w+1]))));
    }
  }
  else if(numOfWinners - byes >= 2){
    for(var z = 0; z < byes; z+=2){
      matches.push(Object.assign({}, new match(assignWinner(initialMatches[z]), shuffledParticipants[shuffledParticipants.length - count])));
      count++;
    }
    for(var v = 2*byes; v < numOfWinners + byes; v+=2){
      matches.push(Object.assign({}, new match(assignWinner(initialMatches[v]), assignWinner(initialMatches[v+1]))));
    }
  }
  else {
    for(var x = 0; x < 2*numOfWinners; x+=2){
      matches.push(Object.assign({}, new match(assignWinner(initialMatches[x]), shuffledParticipants[shuffledParticipants.length - count])));
      count++;
    }
    for(var y = 0; y < byes - numOfWinners; y+=2){
      matches.push(Object.assign({}, new match(shuffledParticipants[2*numOfWinners + y], shuffledParticipants[2*numOfWinners + y + 1])));
    }
  }

  return matches;
}


function nextRound(lastRound){
  var matches = [];
  if(lastRound.length > 1){
    for(var z = 0; z < lastRound.length; z+=2){
      matches.push(Object.assign({},new match(assignWinner(lastRound[z]), assignWinner(lastRound[z+1]))));
    }
    return matches;
  }
  return assignWinner(lastRound[0]);
}

function assignScores(){

}


/* THIS IS THE ID OF A MATCH CARD         matchCardRound" + this.props.roundNumber + "Match" + this.props.matchNumber */
function openMatchModal(match) {
  var modal = document.getElementById("matchModal");
  modal.style.display = "block";

  var round = parseInt(match.substring(14,15));
  var matchNum = parseInt(match.substring(20)) - 1;

  firebase.firestore().collection("tournaments").doc("ryFCOXeP97rqHQeVFl0s").get().then(function(doc){
      var matchInfo;
      if(round == 1){matchInfo = doc.data().matchupsRound1}
      if(round == 2){matchInfo = doc.data().matchupsRound2}
      if(round == 3){matchInfo = doc.data().matchupsRound3}
      if(round == 4){matchInfo = doc.data().matchupsRound4}
      if(round == 5){matchInfo = doc.data().matchupsRound5}
      if(round == 6){matchInfo = doc.data().matchupsRound6}
      if(round == 7){matchInfo = doc.data().matchupsRound7}
      if(round == 8){matchInfo = doc.data().matchupsRound8}
      if(round == 9){matchInfo = doc.data().matchupsRound9}


      var player1ID = matchInfo[matchNum].playerOne;
      var player2ID = matchInfo[matchNum].playerTwo;
      var player1Score = matchInfo[matchNum].playerOneScore;
      var player2Score = matchInfo[matchNum].playerTwoScore;

      document.getElementById("upperParticipantScoreModal").innerHTML = player1Score;
      document.getElementById("lowerParticipantScoreModal").innerHTML = player2Score;


      firebase.firestore().collection("users").doc(player1ID).get().then(function(userDoc){
        document.getElementById("upperParticipantNameModal").innerHTML = userDoc.data().name;
      });
      firebase.firestore().collection("users").doc(player2ID).get().then(function(userDoc){
        document.getElementById("lowerParticipantNameModal").innerHTML = userDoc.data().name;
      });


      /*====================================GRAB USER PROFILE PICTURE========================================================== */
      var upperReference = firebase.storage().refFromURL("gs://brackot-app.appspot.com/" + player1ID + "/profile");
      upperReference.getDownloadURL().then(function (url) {
        document.getElementById("upperParticipantPicModal").src = url;
      }).catch(
        e => {
          console.log(e);
        })

      var lowerReference = firebase.storage().refFromURL("gs://brackot-app.appspot.com/" + player2ID + "/profile");
      lowerReference.getDownloadURL().then(function (url) {
        document.getElementById("lowerParticipantPicModal").src = url;
      }).catch(
        e => {
          console.log(e);
        })


    });
}

function closeMatchModal() {
  var modal = document.getElementById("matchModal");
  modal.style.display = "none";
}

function editMatchScores() {
  document.getElementById("editScoresButton").style.display = "none";
  document.getElementById("submitResultsButton").style.display = "block";
  document.getElementById("upperParticipantScoreInput").style.display = "inline-block";
  document.getElementById("lowerParticipantScoreInput").style.display = "inline-block";
  document.getElementById("upperParticipantScoreModal").style.display = "none";
  document.getElementById("lowerParticipantScoreModal").style.display = "none";
}

function saveMatchScores() {
  document.getElementById("editScoresButton").style.display = "block";
  document.getElementById("submitResultsButton").style.display = "none";
  document.getElementById("upperParticipantScoreInput").style.display = "none";
  document.getElementById("lowerParticipantScoreInput").style.display = "none";
  document.getElementById("upperParticipantScoreModal").style.display = "inline-block";
  document.getElementById("lowerParticipantScoreModal").style.display = "inline-block";
  /*
  CHECK WHICH MATCH WITH IFS THEN PUT THIS IS EACH IF (player1Score should be replaced with the score maybe take it as a parameter depends how you're doing it with the modal)*/
  firebase.firestore().collection("tournaments").doc("ryFCOXeP97rqHQeVFl0s").update({
    matchupsRound1: document.getElementById("upperParticipantScoreInput").value,
    matchupsRound2: document.getElementById("lowerParticipantScoreInput").value
  }).then(function() {
    console.log('Uploaded scores!')
  });
}
