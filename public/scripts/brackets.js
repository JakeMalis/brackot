var shuffledParticipants = [];
var numParticipants = 0;

class MatchCard extends React.Component {
  render() {
    return (
        <div className={"match " + this.props.matchClass + " match" + this.props.roundNumber} id={"matchCard" + this.props.matchNumber}>
          <div class={"participant " + this.props.half + "Half"}><img class="participantProfilePic" id={"participantLogo" + this.props.participantNumber}><p class="teamName" id={"participantName" + this.props.participantNumber}></p><p class="score whiteText" id={"participant" + this.props.participantNumber + "Match" + this.props.matchNumber + "Score"}></p></div>
          <div class={"participant " + this.props.half + "Half"}><img class="profilePic" id={"participantLogo" + this.props.participantNumber}><p class="teamName" id={"participantName" + this.props.participantNumber}></p><p class="score whiteText" id={"participant" + this.props.participantNumber + "Match" + this.props.matchNumber + "Score"}></p></div>
        </div>
    );
  }
}

async function renderMatchCards() {
  var participantNumber = 1;
  query.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        TournamentCardArray.push(<TournamentCard tournamentNumber={doc.data().number} />);
        participantNumber++
    });
  }).then(function() {
    ReactDOM.render(
      TournamentCardArray,
      document.getElementById("row")
    );
  });
}



function personalizeElements() {
  firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").get().then(function(doc){
    shuffledParticipants = doc.data().players;
    numParticipants = doc.data().players.length;
  });

  shuffleParticipants();
  createInitialMatches();
  implementByes();

  var rounds = getByesAndRounds()[1];
  if(rounds > 3){
      for(int x = 0; x < rounds - 3; x++){
        matches = nextRound(matches);   //add something to print or save each round
      }

  }

}

function findCenterY(element){
  var div = $(element)[0].getBoundingClientRect();
  var divY = div.top + div.height/2;
  return divY;
}

function setConnectorHeight(parent1, parent2, connector){
  document.getElementById(connector).style.height = heightBetween(parent1, parent2);
}

function heightBetween(element1, element2){
  // find the vertical center of each element
  var divY1 = findCenterY(element1);
  var divY2 = findCenterY(element2);
  // find the distance between the two vertical centers
  var distance = (divY1 - divY2);
  return distance;
}


/* shuffleParticipants */
function shuffleParticipants(){
  for(var i = doc.data().players.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i);
    const temp = shuffledParticipants[i];
    shuffledParticipants[i] = shuffledParticipants[j];
    shuffledParticipants[j] = temp;
  }

//  shuffledParticipants.forEach(async function (element) {
  //  console.log(element);
    /*
    firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").update({
        shuffledParticipants: shuffledParticipants;
    });
    */
  };

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


function createInitialMatches(){
  var matches = [];
  var byes = getByesAndRounds()[0];
  var initialNumRounds = (numParticipants - byes)/2;
  if(byes >= initialNumRounds){
    for(int x = 0; x < 2 * initialNumRounds; x+=2){
      matches.push([shuffledParticipants[x], shuffledParticipants[x+1]]);
      matches.push([[], []]);
    }
    for(int y = 0; y < byes - initialNumRounds; y+=2){
      matches.push([[],[]]);
    }
  }
  else{
    for(int z = 0; z < 2 * byes; z+=2){
      matches.push([shuffledParticipants[z], shuffledParticipants[z+1]]);
      matches.push([[], []]);
    }
    for(int w = 0; w < 2 * (initialNumRounds - byes); w+=2){
      var indexStart = 2 * (byes + 1) - 1;
      matches.push([shuffledParticipants[indexStart + w], shuffledParticipants[indexStart + w+1]]);
    }
  }
  return matches;
}


function assignWinner([playerOne, playerTwo]){
  /* if winning button pressed return true else return false
   if both press true send an error
   if neither has won return an empty slot [ , ]
  */

  var winner;

  return winner;
}


function implementByes(){    /* creates second round of matches */
  var matches = [];
  var initialMatches = createInitialMatches();
  var byes = getByesAndRounds()[0];
  var numOfWinners = (numParticipants-byes)/2;
  var count = 1;

  for(int x = 0; x < 2*numOfWinners; x+=2){
    matches.push([assignWinner(initialMatches()[count]), shuffledParticipants[shuffledParticipants.length - count]]);
    count++;
  }

  for(int y = 0; y < byes - numofWinners; y+=2){
    matches.push([shuffledParticipants[2*numOfWinners + y], shuffledParticipants[2*numOfWinners + y + 1]]);
  }

  return matches;
}


function nextRound(lastRound){
  var matches = [];
  for(int z = 0; z < lastRound.length; z+=2){
    matches.push([assignWinner(lastRound[z], lastRound[z+1])]);
    return matches;
  }
}
