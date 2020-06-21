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
  setTimeout(function(){
      initApp();
  }, 250);
}

function personalizeElements() {
  var userDocument = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

  userDocument.get().then(function(doc) {
    document.getElementById("firstGreetingMessage").innerHTML = "Welcome to your dashboard, " + doc.data().first;
    console.log("Document data:", doc.data().first);
  });

  document.getElementById("name").innerHTML = firebase.auth().currentUser.displayName;
  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
}
