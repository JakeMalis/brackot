function initApp() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          user.providerData.forEach(function (profile) {
            console.log("Sign-in provider: " + profile.providerId);
            console.log("  Provider-specific UID: " + profile.uid);
            console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            console.log("  Photo URL: " + profile.photoURL);
          });
      }
      else {
        window.location = "login.html";
      }
  });
  document.getElementById('newTournamentSubmitButton').addEventListener("click", addTournament);
}

window.onload = function() {
  setTimeout(function(){
      initApp();
  }, 500);
}

function addTournament() {
  var simpleEventName = document.getElementById('game').value + "-" + document.getElementById('dateSimple').value
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
