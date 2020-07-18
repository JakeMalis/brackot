function personalizeElements() {
  var boost;
  firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
    document.getElementById("firstGreetingMessage").innerHTML = "Welcome back, " + doc.data().first + "!";
    document.getElementById("notifications").innerHTML = doc.data().notifications;
    document.getElementById("matches").innerHTML = doc.data().matches;
    document.getElementById("coins").innerHTML = doc.data().coins;
    document.getElementById("wins").innerHTML = doc.data().wins;

    boost = doc.data().boost;
    if (boost === true) {
      $('#noBoostActiveText').hide();
      $('#boostActiveText').show();
    }
  });
}
