function personalizeElements() {
  //shuffleParticipants();
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
        shuffledParticipants: shuffledParticipants
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
  /* rounds returns number of rounds in the tournament */
  /* byes returns number of players that need byes in the first round */
}


function createMatches(shuffledParticipants){
  getByesAndRounds(shuffledParticipants.length);

  var count = shuffledParticipants.length;
  var matches = arr{}

  while(count > 0){
    var
    count--;
  }


}
