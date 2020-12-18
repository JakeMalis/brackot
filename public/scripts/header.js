var path = window.location.pathname;
var page = path.split("/").pop();

firebase.auth().onAuthStateChanged(function (user) {
  var path = window.location.pathname;
  var page = path.split("/").pop();

  if (user) {
    setTimeout(() => {
      const blockerModal = document.getElementById("auth-modal");
      if (blockerModal.style.display === "block")
        blockerModal.style.display = "none";
    }, 500);
  }

  if (user && page === "") {
    loadHeader();
  } else if (user && !(page === "")) {
    personalizeElements();
    loadHeader();
  } else if (!user && page === "tournaments") {
    personalizeElements();
  }
  if (
    !user &&
    !(page === "") &&
    !(page === "tournaments") &&
    !(page === "privacy-policy") &&
    !(page === "terms-of-service")
  ) {
    setTimeout(() => {
      const blockerModal = document.getElementById("auth-modal");
      blockerModal.style.display = "block";
    }, 500);
  }
});

async function loadHeader() {
  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
  document.getElementById("profilePicTab").style.display = "inline-block";
  document.getElementById("loginTab").style.display = "none";

  async function getCustomClaimRole() {
    await firebase.auth().currentUser.getIdToken(true);
    const decodedToken = await firebase.auth().currentUser.getIdTokenResult();
    return decodedToken.claims.stripeRole;
  }
  getCustomClaimRole();

  firebase
    .auth()
    .currentUser.getIdTokenResult()
    .then((idTokenResult) => {
      if (idTokenResult.claims.stripeRole == "unlimited") {
        document.getElementById("unlimitedIcon").style.visibility = "visible";
      }
    });
}
