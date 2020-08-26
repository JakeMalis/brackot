

/* shuffleParticipants */
function shuffleParticipants(){
  firebase.firestore().collection("tournaments").doc("N5zMErfmRQVRsWfJ76xM").get().then(function(doc){

    doc.data().players
    var shuffled = array[];
    for(let i = doc.data().players.length; i > )
    shuffled.add(players);



    for(let i = shuffled.length — 1; i > 0; i--){
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      players[i] = array[j];
      array[j] = temp;

      /* Set the players attribute */
}



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
