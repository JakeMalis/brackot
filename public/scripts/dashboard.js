function personalizeElements() {
  var boost;
  firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
    document.getElementById("firstGreetingMessage").innerHTML = "Welcome back, " + doc.data().first + "!";
    document.getElementById("notifications").innerHTML = doc.data().stats.notifications;
    document.getElementById("matches").innerHTML = doc.data().stats.matches;
    document.getElementById("coins").innerHTML = doc.data().stats.coins;
    document.getElementById("wins").innerHTML = doc.data().stats.wins;

    boost = doc.data().subscription.boost;
    if (boost === true) {
      $('#noBoostActiveText').hide();
      $('#boostActiveText').show();
    }
  });
}
