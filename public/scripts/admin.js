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
  document.getElementById('addTournament').addEventListener("click", addTournament);
}

window.onload = function() {
  setTimeout(function(){
      initApp();
  }, 500);
}

function addTournament() {
  db.collection("tournaments").doc( + document.getElementById('dateSimple').value).set({
      date: document.getElementById('first-name').value,
      last: document.getElementById('last-name').value,
      email: document.getElementById('email').value,
      state: document.getElementById('state').value,
      highschool: document.getElementById('highschool').value
  }).then(function() {
      console.log("Document successfully written!");
  }).catch(function(error) {
          console.error("Error writing document: ", error);
  });
}
