window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) { document.getElementById("avatar").src = firebase.auth().currentUser.photoURL; personalizeElements(); }
      else { window.location = "login.html"; }
  });
}

function personalizeElements() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd
  }
  if(mm<10){
    mm='0'+mm
  }

  today = yyyy+'-'+mm+'-'+dd;
  document.getElementById("date").setAttribute("min", today);
}

function addTournament() {
  var date = document.getElementById("date").value, time = document.getElementById("time").value;

  firebase.firestore().collection("tournaments").add({
      creator: firebase.auth().currentUser.uid,
      date: new Date(date + " " + time),
      game: document.getElementById('game').value,
      name: document.getElementById('tournamentName').value,
      players: [],
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
