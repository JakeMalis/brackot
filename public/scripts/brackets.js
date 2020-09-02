var shuffledParticipants = [];
var numParticipants = 0;


class MatchCard extends React.Component {
  render() {
    return (
      <div className={"match " + "match" + this.props.roundNumber + this.props.empty} id={"matchCard" + this.props.matchNumber}>
        <UpperParticipant participantNumber={this.props.participants[0].uid} matchNumber={this.props.matchNumber} />
        <LowerParticipant participantNumber={this.props.participants[1].uid} matchNumber={this.props.matchNumber} />
      </div>
    );
  }
}

class UpperParticipant extends React.Component {
  render() {
    return(
      <React.Fragment>
        <div className={"participant UpperHalf"}><img className="participantProfilePic" id={"participantLogo" + this.props.participantNumber}></img><p className="teamName" id={"participantName" + this.props.participantNumber}></p><p className="score whiteText" id={"participant" + this.props.participantNumber + "Match" + this.props.matchNumber + "Score"}></p></div>
      </React.Fragment>
    );
  }
}


class LowerParticipant extends React.Component {
  render() {
    return(
      <React.Fragment>
        <div className={"participant LowerHalf"}><img className="participantProfilePic" id={"participantLogo" + this.props.participantNumber}></img><p className="teamName" id={"participantName" + this.props.participantNumber}></p><p className="score whiteText" id={"participant" + this.props.participantNumber + "Match" + this.props.matchNumber + "Score"}></p></div>
      </React.Fragment>
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

async function renderMatchCards() {
  var tournament = firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B");

  for (var round = 1; round <= getByesAndRounds()[1]; round++){
    var MatchColumnCards = [];
    var matchNumber = 1;
    tournament.get().then(function(doc) {
      var matchupsRound = "matchUpsRound" + round;
      var matchups = doc.data().matchupsRound;
      matchups.forEach(function(entry) {
        var upperParticipant, lowerParticipant;
        var participants = [];

        if ((entry.playerOne === null) && (entry.playerTwo === null)) { var empty = " emptySpace"; } else { var empty = ""; }

        upperParticipant = { uid: entry.playerOne };
        participants.push(upperParticipant);
        lowerParticipant = { uid: entry.playerTwo };
        participants.push(lowerParticipant);

        MatchColumnCards.push(<MatchCard roundNumber={round} matchNumber={matchNumber} empty={empty} participants={participants} />);
        matchNumber++;
      });
    }).then(function() {
      ReactDOM.render(
        MatchColumnCards,
        document.getElementById("matchColumn" + round)
      );
    });
  }
}



function personalizeElements() {
  firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").get().then(function(doc){
    shuffledParticipants = doc.data().players;
    numParticipants = doc.data().players.length;
  }).then(function() {
    shuffleParticipants();

    var byes = getByesAndRounds()[0];
    var rounds = getByesAndRounds()[1];
    var firstRound = createInitialMatches();
    var secondRound = [];

    firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").update({
      shuffledParticipants: shuffledParticipants,
      matchupsRound1: firstRound
    }).then(function() {
      console.log('Uploaded 1st round')
    });
    if(byes > 0 && numParticipants > 2){
      secondRound = implementByes();
      firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").update({
        matchupsRound2: secondRound
      }).then(function() {
        console.log('Uploaded 2nd round')
      });
    }
    else if(numParticipants > 2){
      secondRound = nextRound(firstRound);
      firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").update({
        matchupsRound2: secondRound
      }).then(function() {
        console.log('Uploaded 2nd round')
      });
    }

    var matches = [];

    if(rounds > 2){
      matches = nextRound(secondRound);
      firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").update({
        matchupsRound3: matches
      }).then(function() {
        console.log('Uploaded 3rd round')
      });
    }
    if(rounds > 3){
      matches = nextRound(matches);
      firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").update({
        matchupsRound4: matches
      }).then(function() {
        console.log('Uploaded 4th round')
      });
    }
    if(rounds > 4){
      matches = nextRound(secondRound);
      firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").update({
        matchupsRound5: matches
      }).then(function() {
        console.log('Uploaded 5th round')
      });
    }
    if(rounds > 5){
      matches = nextRound(matches);
      firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").update({
        matchupsRound6: matches
      }).then(function() {
        console.log('Uploaded 6th round')
      });
    }
    if(rounds > 6){
      matches = nextRound(matches);
      firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").update({
        matchupsRound7: matches
      }).then(function() {
        console.log('Uploaded 7th round')
      });
    }
    if(rounds > 7){
      matches = nextRound(secondRound);
      firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").update({
        matchupsRound8: matches
      }).then(function() {
        console.log('Uploaded 8th round')
      });
    }
    if(matches.length == 1){
      var winner = [assignWinner(matches[0])];
      firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").update({
        matchupsRound9: winner
      }).then(function() {
        console.log('Uploaded final round')
      });
    }

  });
}

function match(p1, p2) {
  this.playerOne = p1;
  this.playerTwo = p2;
  var playerOneScore = null;
  var playerTwoScore = null;

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
  else{
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
  if(matchUp.playerOneScore > matchUp.playerTwoScore){
    return matchUp.playerOne;
  }
  else if(matchUp.playerOneScore < matchUp.playerTwoScore){
    return matchUp.plaayerTwoScore;
  }
  else if(matchUp.playerOneScore == null && matchUp.playerTwoScore == null){
  }
  return matchUp.playerOne;
}


function implementByes(){    /* creates second round of matches */
  var matches = [];
  var initialMatches = createInitialMatches();
  var byes = getByesAndRounds()[0];
  var numOfWinners = (numParticipants-byes)/2;
  var count = 1;

  for(var x = 0; x < 2*numOfWinners; x+=2){
    matches.push(Object.assign({}, new match(assignWinner(initialMatches[x]), shuffledParticipants[shuffledParticipants.length - count])));
    count++;
  }

  for(var y = 0; y < byes - numOfWinners; y+=2){
    matches.push(Object.assign({}, new match(shuffledParticipants[2*numOfWinners + y], shuffledParticipants[2*numOfWinners + y + 1])));
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
  var modal = document.getElementById("matchModal");
}



function openMatchModal() {
  var modal = document.getElementById("matchModal");
  modal.style.display = "block";
}

function closeMatchModal() {
  var modal = document.getElementById("matchModal");
  var span = document.getElementsByClassName("close")[0];

  span.onclick = function() {
  modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      }
    }
}
