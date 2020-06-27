window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) { personalizeElements(); }
      else { window.location = "login.html"; }
  });
}

function fortniteEnroll() {
  firebase.firestore().collection("tournaments").doc(fortnite).collection("players").doc(firebase.auth().currentUser.uid).set({
    enrolled: true,
    name: firebase.auth().currentUser.displayName
  }).then(function() {
    document.getElementById("fortniteBtn").classList.toggle('tournamentCardButton');
    document.getElementById("fortniteBtn").innerHTML = "✓ Signed Up";
  });
}


function personalizeElements() {
  firebase.firestore().collection("tournaments").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        console.log(doc.id, " => ", doc.data());
    });
});

  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
}
