window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) { personalizeElements(); }
      else { window.location = "login.html"; }
  });
  document.getElementById('newTournamentSubmitButton').addEventListener("click", addTournament);
}

function addTournament() {
  var simpleEventName = document.getElementById('dateSimple').value + "-" + document.getElementById('game').value
  firebase.firestore().collection("tournaments").doc(simpleEventName).set({
      date: document.getElementById('dateElegant').value,
      game: document.getElementById('game').value,
      name: document.getElementById('tournamentName').value,
      time: document.getElementById('time').value,
      earnings: {
          1: document.getElementById('firstEarnings').value,
          2: document.getElementById('secondEarnings').value,
          3: document.getElementById('thirdEarnings').value
      }
  }).then(function() {
      console.log("Document successfully written!");
  }).catch(function(error) {
          console.error("Error writing document: ", error);
  });
}
