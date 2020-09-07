window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) { personalizeElements(); loadHeader(); }
      else { window.location = "login.html"; }
  });
}

async function loadHeader() {
  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
  
  async function getCustomClaimRole() {
    await firebase.auth().currentUser.getIdToken(true);
    const decodedToken = await firebase.auth().currentUser.getIdTokenResult();
    return decodedToken.claims.subscription;
  }
  getCustomClaimRole();

  firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
     if (idTokenResult.claims.subscription == "unlimited") {
       document.getElementById("unlimitedIcon").style.visibility = "visible";
     }
  });
}
