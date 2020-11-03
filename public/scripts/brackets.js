var clickedRound = 0;
var clickedMatch = 0;

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
      <div className={"match " + "match" + this.props.roundNumber} id={"matchCardRound" + this.props.roundNumber + "Match" + this.props.matchNumber} onClick={() => { openMatchModal("matchCardRound" + this.props.roundNumber + "Match" + this.props.matchNumber)}}>
        <UpperParticipant picture={this.props.participants[0].picture} name={this.props.participants[0].name} score={this.props.participants[0].score} visibility={this.props.participants[0].visibility} roundNumber={this.props.roundNumber} key={this.props.matchNumber + " " + this.props.participants[0].uid}/>
        <LowerParticipant picture={this.props.participants[1].picture} name={this.props.participants[1].name} score={this.props.participants[1].score} visibility={this.props.participants[1].visibility} roundNumber={this.props.roundNumber} key={this.props.matchNumber + " " + this.props.participants[1].uid}/>
      </div>
    );
  }
}

class UpperParticipant extends React.Component {
  render() {
    return(
      <div className={"participant UpperHalf " + this.props.visibility}>
        <img className="participantProfilePic" src={this.props.picture}></img>
        <p className="teamName">{this.props.name}</p>
        <p className="score whiteText">{this.props.score}</p>
      </div>
    );
  }
}

class LowerParticipant extends React.Component {
  render() {
    return(
      <div className={"participant LowerHalf " + this.props.visibility}>
        <img className="participantProfilePic" src={this.props.picture}></img>
        <p className="teamName">{this.props.name}</p>
        <p className="score whiteText">{this.props.score}</p>
      </div>
    );
  }
}

/*================================================USE THIS CONNECTOR IF THERE IS ONE PARENT MATCH=================================================*/
class UpperConnector extends React.Component {
  render() {
    return (
      <div className="topConnector" id={"upperconnector" + this.props.connectorNumber}>
        <div className={"connectorUpperLeft " + this.props.visibility} id={"connectorUpperLeft" + this.props.connectorNumber}></div>
        <div className={"connectorUpperRight " + this.props.visibility} id={"connectorUpperRight" + this.props.connectorNumber}></div>
      </div>
    );
  }
}

/*================================================USE THIS CONNECTOR IF THERE IS ONE PARENT MATCH=================================================*/
class LowerConnector extends React.Component {
  render() {
    return (
      <div className="bottomConnector" id={"lowerconnector" + this.props.connectorNumber}>
        <div className={"connectorLowerLeft " + this.props.visibility} id={"connectorLowerLeft" + this.props.connectorNumber}></div>
        <div className={"connectorLowerRight " + this.props.visibility} id={"connectorLowerRight" + this.props.connectorNumber}></div>
      </div>
    );
  }
}

/*================================================USE THIS CONNECTOR IF THERE ARE TWO PARENT MATCHES=================================================*/
class Connector extends React.Component {
  render() {
    return (
      <div className={"connector " + "connector" + this.props.roundNumber + " " +  + this.props.visibility} id={"connector" + this.props.connectorNumber}>
        <div className={"connectorLeftTop"} id={"connectorLeftTop"}></div>
        <div className={"connectorRight"} id={"connectorRight"}></div>
        <div className={"connectorLeftBottom"} id={"connectorLeftBottom"}></div>
      </div>
    );
  }
}

/* ====================================================WORK IN PROGRESS COMPONENT BELOW====================================
***************************************************************************************************************************
***************************************************************************************************************************
***************************************************************************************************************************
***************************************************************************************************************************
*/
class LeaderboardCard extends React.Component {
  render() {
    return (
      <div className={"leaderboardCard " + this.props.specialPlacement} id={"leaderboardCard" + this.props.participantNumber}>
        <img className="participantProfilePic" id={"upperParticipantProfilePicRound" + this.props.roundNumber + "Match" + this.props.matchNumber + "-" + this.props.participantNumber} src="media/BrackotLogo2.jpg"></img>
        <p className="teamName" id={"upperParticipantNameRound" + this.props.roundNumber + "Match" + this.props.matchNumber + "-" + this.props.participantNumber}></p>
        <p className="score whiteText" id={"upperParticipantScoreRound" + this.props.roundNumber + "Match" + this.props.matchNumber + "-" + this.props.participantNumber}></p>
      </div>
    );
  }
}

//Local functions used to render the bracket and other client-side functions
function renderMatchCards() {
  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(async (doc) => {
    const bracket = Object.keys(doc.data().bracket).map(round => {
      return doc.data().bracket[round];
    });

    var rounds = bracket.map(function(rounds) {
      return Object.keys(rounds).sort().map(function(round) {
        return rounds[round];
      });
    });

    rounds.forEach(async (round, roundNumber) => {
      var MatchColumnCards = [];
      var ConnectorColumnConnectors = [];
      var matchNumber = 0;
      var connectorNumber = 0;

      await Promise.all(round.map(async (matchup) => {
        var upperParticipant, lowerParticipant;
        var participants = [];

        if (!((matchup.playerOne === null) && (matchup.playerTwo === null))) {

          var playerOneName = await firebase.firestore().runTransaction(async (transaction) => {
            return await transaction.get(firebase.firestore().collection("users").doc(matchup.playerOne)).then(creatorDoc => {
              return creatorDoc.data().name;
            })
          });
          var playerTwoName = await firebase.firestore().runTransaction(async (transaction) => {
            return await transaction.get(firebase.firestore().collection("users").doc(matchup.playerTwo)).then(creatorDoc => {
              return creatorDoc.data().name;
            })
          });

          var playerOneProfilePicture = await firebase.storage().refFromURL("gs://brackot-app.appspot.com/" + matchup.playerOne + "/profile").getDownloadURL().then(function (url) {
            return String(url);
          }).catch((error) => {
            return "../media/BrackotLogo2.jpg";
          });

          var playerTwoProfilePicture = await firebase.storage().refFromURL("gs://brackot-app.appspot.com/" + matchup.playerTwo + "/profile").getDownloadURL().then(function (url) {
            return String(url);
          }).catch((error) => {
            return "../media/BrackotLogo2.jpg";
          });

          //Player Scores?


          if ((matchup.playerOne === null) && (matchup.playerTwo === null) && (roundNumber !=1)) {
            MatchColumnCards.push(<EmptyMatchCard roundNumber={roundNumber} matchNumber={matchNumber} key={matchNumber}/>);
            if((matchNumber % 2 != 0) && (roundNumber != getByesAndRounds()[1])){ ConnectorColumnConnectors.push(<Connector roundNumber={roundNumber} connectorNumber={connectorNumber} visibility={"visible"} key={connectorNumber}/>); }
          }
          else if ((matchup.playerOne === null) && (matchup.playerTwo === null)){
            MatchColumnCards.push(<EmptyMatchCard roundNumber={roundNumber} matchNumber={matchNumber} key={matchNumber}/>);
            if(matchNumber % 2 != 0){ ConnectorColumnConnectors.push(<UpperConnector roundNumber={roundNumber} connectorNumber={connectorNumber} visibility={"hidden"} key={connectorNumber}/>); }
            else{ ConnectorColumnConnectors.push(<LowerConnector roundNumber={roundNumber} connectorNumber={connectorNumber} visibility={"hidden"} key={connectorNumber}/>); }
          }
          else {
            upperParticipant = {
              uid: matchup.playerOne,
              picture: playerOneProfilePicture,
              name: playerOneName,
              score: 3
            };
            participants.push(upperParticipant);
            lowerParticipant = {
              uid: matchup.playerTwo,
              picture: playerTwoProfilePicture,
              name: playerTwoName,
              score: 2
            };
            participants.push(lowerParticipant);
            MatchColumnCards.push(<MatchCard roundNumber={roundNumber} matchNumber={matchNumber} participants={participants} key={matchNumber}/>);
            if((matchNumber % 2 != 0) && (roundNumber == 1)){
              ConnectorColumnConnectors.push(<UpperConnector roundNumber={roundNumber} connectorNumber={connectorNumber} visibility={"visible"} key={connectorNumber}/>);
            }
            else if(round == 1){
              ConnectorColumnConnectors.push(<LowerConnector roundNumber={roundNumber} connectorNumber={connectorNumber} visibility={"visible"} key={connectorNumber}/>);
            }
            else if((matchNumber % 2 != 0) && (roundNumber != getByesAndRounds()[1])){
              ConnectorColumnConnectors.push(<Connector roundNumber={roundNumber} connectorNumber={connectorNumber} visibility={"visible"} key={connectorNumber}/>);
            }
          }
          matchNumber++;
          connectorNumber++;
        }
      })).then(() => {
        roundNumber++;
        ReactDOM.render(
          MatchColumnCards,
          document.getElementById("matchColumn" + roundNumber)
        );
        ReactDOM.render(
          ConnectorColumnConnectors,
          document.getElementById("connectorColumn" + roundNumber)
        );
      });
    });
  });
}

function openMatchModal(match) {
  var modal = document.getElementById("matchModal");
  modal.style.display = "block";

  var round = parseInt(match.substring(14,15));
  var matchNum = parseInt(match.substring(20)) - 1;
  clickedRound = round;
  clickedMatch = matchNum + 1;

  console.log(clickedMatch);

  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(function(doc) {
    const bracket = Object.keys(doc.data().bracket).map(round => {
      return doc.data().bracket[round];
    });
    const rounds = bracket.map(function(rounds) {
      return Object.keys(rounds).sort().map(function(round) {
        return rounds[round];
      });
    });
    const matchup = rounds[clickedRound][clickedMatch];

    var player1ID = matchup.playerOne;
    var player2ID = matchup.playerTwo;
    var player1Score = matchup.playerOneScore;
    var player2Score = matchup.playerTwoScore;

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

//Functions done locally reagrding updating data that need to be moved to a cloud function
function startTournament() {
  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(function(doc){
    shuffledParticipants = doc.data().players;
    numParticipants = doc.data().players.length;
  }).then(function() {
    shuffleParticipants();

    var byes = getByesAndRounds()[0];
    var rounds = getByesAndRounds()[1];
    var firstRound = createInitialMatches();
    var secondRound = [];


    var roundMatches = [];



    firebase.firestore().collection("tournaments").doc(tournamentId).update({
      tournamentStarted: true,
      shuffledParticipants: shuffledParticipants,
      matchupsRound1: firstRound
    }).then(function() {
      console.log('Uploaded 1st round')
      if (!(numParticipants > 2)) { renderMatchCards(); }
    });
    if(numParticipants > 2){
      secondRound = implementByes();
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound2: secondRound
      }).then(function() {
        console.log('Uploaded 2nd round')
        renderMatchCards();
      });
    }

    if(rounds > 2){
      roundMatches = nextRound(secondRound);
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound3: roundMatches
      }).then(function() {
        console.log('Uploaded 3rd round')
        renderMatchCards();
      });
    }
    if(rounds > 3){
      roundMatches = nextRound(roundMatches);
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound4: roundMatches
      }).then(function() {
        console.log('Uploaded 4th round')
        renderMatchCards();
      });
    }
    if(rounds > 4){
      roundMatches = nextRound(roundMatches);
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound5: roundMatches
      }).then(function() {
        console.log('Uploaded 5th round')
        renderMatchCards();
      });
    }
    if(rounds > 5){
      roundMatches = nextRound(roundMatches);
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound6: roundMatches
      }).then(function() {
        console.log('Uploaded 6th round')
        renderMatchCards();
      });
    }
    if(rounds > 6){
      roundMatches = nextRound(roundMatches);
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound7: roundMatches
      }).then(function() {
        console.log('Uploaded 7th round')
        renderMatchCards();
      });
    }
    if(rounds > 7){
      roundMatches = nextRound(roundMatches);
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound8: roundMatches
      }).then(function() {
        console.log('Uploaded 8th round')
        renderMatchCards();
      });
    }
    if(rounds > 8){
      roundMatches = nextRound(roundMatches);
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound9: roundMatches
      }).then(function() {
        console.log('Uploaded 9th round')
        renderMatchCards();
      });
    }
  });
  document.getElementById("bracketNavbar").style.display = "inline-block";
  document.getElementById("tournamentSignUpButton").className = 'tournamentCardButton tournamentCardButtonInProgress';
  document.getElementById("tournamentSignUpButton").innerHTML = "Tournament In Progress";
  document.getElementById("tournamentSignUpButton").disabled = true;
}

/* *** SAVE MATCH SCORES functions ***
   - uploads scores edited in match modal to firebase
   - changes scores in match object (allows the assign winner function to work)
*/
function saveMatchScores() {
  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(function(doc){
    var matches;
    var nextMatches; //this will store the entire round of matches in the round following 'matches'
    var round = clickedRound;
    var maxRound = getByesAndRounds()[1];
    var matchNum = clickedMatch;
    var nextMatchNum = Math.floor(matchNum / 2);
    if(round == 1){matches = doc.data().matchupsRound1; if(round < maxRound) {nextMatches = doc.data().matchupsRound2;}}
    if(round == 2){matches = doc.data().matchupsRound2; if(round < maxRound) {nextMatches = doc.data().matchupsRound3;}}
    if(round == 3){matches = doc.data().matchupsRound3; if(round < maxRound) {nextMatches = doc.data().matchupsRound4;}}
    if(round == 4){matches = doc.data().matchupsRound4; if(round < maxRound) {nextMatches = doc.data().matchupsRound5;}}
    if(round == 5){matches = doc.data().matchupsRound5; if(round < maxRound) {nextMatches = doc.data().matchupsRound6;}}
    if(round == 6){matches = doc.data().matchupsRound6; if(round < maxRound) {nextMatches = doc.data().matchupsRound7;}}
    if(round == 7){matches = doc.data().matchupsRound7; if(round < maxRound) {nextMatches = doc.data().matchupsRound8;}}
    if(round == 8){matches = doc.data().matchupsRound8; if(round < maxRound) {nextMatches = doc.data().matchupsRound9;}}
    if(round == 9){matches = doc.data().matchupsRound9;}
    var newScore1 = document.getElementById('upperParticipantScoreInput').value;
    var newScore2 = document.getElementById('lowerParticipantScoreInput').value;
    document.getElementById("upperParticipantScoreModal").innerHTML = newScore1;
    document.getElementById("lowerParticipantScoreModal").innerHTML = newScore2;
    if(matches[matchNum].playerOneScore != newScore1){
      matches[matchNum].playerOneScore = newScore1;
    }
    if(matches[matchNum].playerTwoScore != newScore2){
      matches[matchNum].playerTwoScore = newScore2;
    }

    if(round < maxRound){
      if (nextMatches != (null || undefined)){
        if((matchNum % 2) == 0){
          nextMatches[nextMatchNum].playerOne = assignWinner(matches[matchNum]);
        }
        else{
          nextMatches[nextMatchNum].playerTwo = assignWinner(matches[matchNum]);
        }
      }
    }

    if(round == 1){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound1: matches,
      }).then(function() {
        console.log('Uploaded scores!')
      });
    }
    if((round == 1) && (round < maxRound)){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound2: nextMatches
      }).then(function() {
      });
    }
    if(round == 2){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound2: matches
      }).then(function() {
      });
    }
    if((round == 2) && (round < maxRound)){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound3: nextMatches
      }).then(function() {
      });
    }
    if(round == 3){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound3: matches
      }).then(function() {
      });
    }
    if((round == 3) && (round < maxRound)){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound4: nextMatches
      }).then(function() {
      });
    }
    if(round == 4){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound4: matches
      }).then(function() {
      });
    }
    if((round == 4) && (round < maxRound)){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound5: nextMatches
      }).then(function() {
      });
    }
    if(round == 5){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound5: matches
      }).then(function() {
      });
    }
    if((round == 5) && (round < maxRound)){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound6: nextMatches
      }).then(function() {
      });
    }
    if(round == 6){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound6: matches
      }).then(function() {
      });
    }
    if((round == 6) && (round < maxRound)){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound7: nextMatches
      }).then(function() {
      });
    }
    if(round == 7){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound7: matches
      }).then(function() {
      });
    }
    if((round == 7) && (round < maxRound)){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound8: nextMatches
      }).then(function() {
      });
    }
    if(round == 8){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound8: matches,
        matchupsRound9: nextMatches
      }).then(function() {
      });
    }
    if((round == 8) && (round < maxRound)){
      firebase.firestore().collection("tournaments").doc(tournamentId).update({
        matchupsRound9: nextMatches
      }).then(function() {
      });
    }
  }).then(function() {
    renderMatchCards();
  });


  document.getElementById("editScoresButton").style.display = "block";
  document.getElementById("submitResultsButton").style.display = "none";
  document.getElementById("upperParticipantScoreInput").style.display = "none";
  document.getElementById("lowerParticipantScoreInput").style.display = "none";
  document.getElementById("upperParticipantScoreModal").style.display = "inline-block";
  document.getElementById("lowerParticipantScoreModal").style.display = "inline-block";
}


/*==================================================INCOMPLETE AND NEEDS TO BE COMPLETED=========================================================*/
/*
function renderConnectors(){
  for (var round = 1; round <= getByesAndRounds()[1] - 1; round++){
    firebase.firestore().collection("tournaments").doc(tournamentId).get().then(function(doc){
      var length = doc.data().matchupsRound2.length;
    });
      var Connectors = [];
      Connectors.push(<Connector roundNumber={round} connectorNumber={connectorNumber} visibility="" />);
  }
  var firstRound = createInitialMatches();
  for(int x = 0; x < firstRound.length; x++){
    if(firstRound[x].playerOne != null && firstRound[x+1].playerOne != null){
      //show both connectors
    }
    else if(firstRound[x].playerOne != null && firstRound[x+1].playerOne == null){
      //show only top connector
    }
    else if(firstRound[x].playerOne == null && firstRound[x+1].playerOne != null){
      //show only bottom connector
    }
  }
}
*/

var currentMobileRound = 1;
function changeRoundMobile(action){
  firebase.firestore().collection("tournaments").doc(tournamentId).get().then(function(doc){
    var maxRound = getByesAndRounds()[1];
    document.getElementById("matchColumn" + currentMobileRound).style.display = "none";
    if((action == "previous") && (currentMobileRound > 1)){
      currentMobileRound -= 1;
    }
    if((action == "next") && (currentMobileRound < maxRound)){
      currentMobileRound += 1;
    }
    document.getElementById("matchColumn" + currentMobileRound).style.display = "inline-block";
    if(currentMobileRound != maxRound){
      document.getElementById("bracketRoundMobileText").innerHTML = "Round " + currentMobileRound;
    }
    else{
      document.getElementById("bracketRoundMobileText").innerHTML = "Final Round";
    }
  });
}
