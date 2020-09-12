window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
      var path = window.location.pathname;
      var page = path.split("/").pop();

      if (user && (page === "")) { loadHeader(); }
      else if (user && !(page === "")) { personalizeElements(); loadHeader(); }
      else if (!(user) && (page === "tournaments")) { personalizeElements(); }
      else if (!(user) && (!(page === "tournaments") && !(page === ""))) { window.location = "login.html"; }
  });
}

async function loadHeader() {
  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
  document.getElementById("profilePicTab").style.display = "inline-block";
  document.getElementById("loginTab").style.display = "none";

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
