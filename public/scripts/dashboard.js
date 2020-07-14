window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) { personalizeElements(); }
      else { window.location = "login.html"; }
  });
}

function personalizeElements() {
  var userDocument = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
  var boost = false;

  userDocument.get().then(function(doc) {
    document.getElementById("firstGreetingMessage").innerHTML = "Welcome back, " + doc.data().first + "!";
    document.getElementById("notifications").innerHTML = doc.data().notifications;
    document.getElementById("matches").innerHTML = doc.data().matches;
    document.getElementById("coins").innerHTML = doc.data().coins;
    document.getElementById("wins").innerHTML = doc.data().wins;
  });

  userDocument.get().then(function(doc) {
    boost = doc.data().boost;
    if (boost === true) {
      $('#noBoostActiveText').hide();
      $('#boostActiveText').show();
    }
  });

  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
}
