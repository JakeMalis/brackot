window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) { personalizeElements(); loadHeader(); }
      else { window.location = "login.html"; }
  });
}

function loadHeader() {
  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;

  firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
     if (idTokenResult.claims.subscription == "unlimited") {
       document.getElementById("unlimitedIcon").style.visibility = "visible";
     }
  });
}
