var shuffledParticipants = [];
var numParticipants = 0;

function personalizeElements() {
  firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").get().then(function(doc){
    shuffledParticipants = doc.data().players;
    numParticipants = doc.data().players.length;
  });

  shuffleParticipants();
  createInitialMatches();
  implementByes();
  var matches = checkByes();  //add something to print or save each round
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
}


function createInitialMatches(){
  var matches = [];
  var byes = getByesAndRounds()[0];
  for(int m = 0; m < numParticipants - byes; m+=2){
    matches.push([shuffledParticipants[m], shuffledParticipants[m+1]);
  }

  /*for(int i = 0; i < byes; i++){
    matches.push([shuffledParticipants[i+byes]])
  }*/

  return matches;
}


function assignWinner([playerOne, playerTwo]){
  /* if winning button pressed return true else return false
   if both press true send an error
   if neither has won return an empty slot
  */

  var winner;

  return winner;
}


function implementByes(){    /* creates second round of matches */
  var matches = [];
  var numOfWinners = createInitialMatches().length;
  var count = 0;
  var index = numParticipants - getByesAndRounds()[0];

  while(count < 2 * numOfWinners){
    matches.push([assignWinner(createInitialMatches()[count]), assignWinner(createInitialMatches()[count+1]]);
    count+=2;
  }

  if(numOfWinners % 2 != 0){
    matches.push([assignWinner(createInitialMatches()[count]), shuffledParticipants[index + 1] ]);
    index++;
  }

  while(index < numParticipants){
    matches.push([shuffledParticipants[index], shuffledParticipants[index + 1]]);
    index+=2;
  }

  return matches;
}

function checkByes(){
  var matches = [];
  if(getByesAndRounds()[0] != 0){
    var secondRoundMatches = implementByes();
    for(int x = 0; x < secondRoundMatches.length; x+=2){
      matches.push([assignWinner(secondRoundMatches[x]), assignWinner(secondRoundMatches[x+1])]);
      return matches;
    }
  }
  else{
    var previous = createInitialMatches();
    for(int y = 0; y < previous.length; y+=2){
      matches.push([assignWinner(previous[x], assignWinner(previous[x+1]])));
      return matches;
    }
  }
}

function nextRound(lastRound){
  for(int z = 0; z < lastRound.length; z+=2){
    var matches = [];
    matches.push([assignWinner(lastRound[z], lastRound[z+1])]);
    return matches;
  }
}
