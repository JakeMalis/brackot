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
          personalizeElements();
      }
      else {
        window.location = "login.html";
      }
  });
}

window.onload = function() {
  initApp();
}

function personalizeElements() {
  var userDocument = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
  var boost = false;

  userDocument.get().then(function(doc) {
    document.getElementById("firstGreetingMessage").innerHTML = "Welcome back, " + doc.data().first + "!";
  });

  userDocument.get().then(function(doc) {
    document.getElementById("notifications").innerHTML = doc.data().notifications;
  });

  userDocument.get().then(function(doc) {
    document.getElementById("matches").innerHTML = doc.data().matches;
  });

  userDocument.get().then(function(doc) {
    document.getElementById("coins").innerHTML = doc.data().coins;
  });

  userDocument.get().then(function(doc) {
    document.getElementById("wins").innerHTML = doc.data().wins;
  });

  userDocument.get().then(function(doc) {
    boost = doc.data().boost;
    if (boost === true) {
      $('#noBoostActiveText').hide();
      $('#boostActiveText').show();
    }
  });

  // Shows the user's full name
  //document.getElementById("name").innerHTML = firebase.auth().currentUser.displayName;
  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
}
