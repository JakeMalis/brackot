function personalizeElements() {
  //shuffleParticipants();
}

function findCenterY(element){
  var div = $(element)[0].getBoundingClientRect();
  var divY = div.top + div.height/2;
  return divY;
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
  var shuffledParticipants = [];
  firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").get().then(function(doc){
    shuffledParticipants = doc.data().players;
    for(var i = doc.data().players.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * i);
      const temp = shuffledParticipants[i];
      shuffledParticipants[i] = shuffledParticipants[j];
      shuffledParticipants[j] = temp;
    }

      /* Set the players attribute */
  });

//  shuffledParticipants.forEach(async function (element) {
  //  console.log(element);
    /
    firebase.firestore().collection("tournaments").doc("Sscjc6eqIdlQLMMZrD3B").update({
        shuffledParticipants: shuffledParticipants;
    });
    */
  });

}

function getByesAndRounds(numParticipants){
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


function createInitialMatches(shuffledParticipants){

  var count = shuffledParticipants.length - getByesAndRounds(shuffledParticipants.length)[0];
  var matches = [];

  while(count > 0){
    matches.push([shuffledParticipants.pop(), shuffledParticipants.pop()]);
    count = count - 2;
  }

  return matches;
}

function findWinner(index){
  var playerOne = createInitialMatches(shuffledParticipants)[index].pop();
  var playerTwo = createInitialMatches(shuffledParticipants)matches[index].pop();

  /* if winning button pressed return true else return false*/
  /* if both press true send an error */
  var winner;

  return winner;
}

function implementByes(shuffledParticipants){    /* creates second round of matches */
  var matches = [];
  var rounds = getByesAndRounds(shuffledParticipants).pop;
  var numOfWinners = createInitialMatches(shuffledParticipants).length;

  for(int x = 0; x <= numOfWinners - 2; x+=2){
    matches.push([findWinner(x), findWinner(x+1)]);
  }

  if




}







}
