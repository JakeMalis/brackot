window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) { personalizeElements(); loadHeader(); }
      else { window.location = "login.html"; }
  });
}

function loadHeader() {
  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;

  firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
    if (doc.data().subscription.unlimited == true) {
      document.getElementById("unlimitedIcon").style.visibility = "visible";
    }
  });
}
