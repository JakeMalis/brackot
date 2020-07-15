window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) { document.getElementById("avatar").src = firebase.auth().currentUser.photoURL; }
      else { window.location = "login.html"; }
  });
}

function addTournament() {
  firebase.firestore().collection("tournaments").doc(document.getElementById('dateSimple').value + "-" + document.getElementById('game').value).set({
      date: document.getElementById('dateSimple').value,
      elegant_date: document.getElementById('dateElegant').value,
      game: document.getElementById('game').value,
      name: document.getElementById('tournamentName').value,
      time: document.getElementById('time').value,
      players: ["admin"],
      earnings: {
          1: parseInt(document.getElementById('firstEarnings').value),
          2: parseInt(document.getElementById('secondEarnings').value),
          3: parseInt(document.getElementById('thirdEarnings').value)
      },
      platform: {
          pc: document.getElementById("pc").selected,
          xbox: document.getElementById("xbox").selected,
          ps: document.getElementById("ps").selected,
          switch: document.getElementById("switch").selected,
          mobile: document.getElementById("mobile").selected
      },
      unlimited: document.getElementById("unlimited").checked,
      type: document.getElementById('participantType').value
  }).then(function() {
      alert("Added tournament!");
  }).catch(function(error) {
          console.error("Error writing document: ", error);
  });
}
