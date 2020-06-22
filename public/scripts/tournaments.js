var documentExists;
var valorant;
var smash;
var fortnite;
var overwatch;

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
          var eventDocument = firebase.firestore().collection("tournaments").doc("currentTournaments");
          eventDocument.get().then(function(doc) {
              valorant = doc.data().tournamentIDs.valorant;
              smash = doc.data().tournamentIDs.smash;
              fortnite = doc.data().tournamentIDs.fortnite;
              overwatch = doc.data().tournamentIDs.overwatch;
          });
          setTimeout(function(){
              personalizeElements();
          }, 1000);
      }
      else {
        window.location = "login.html";
      }
  });
}

window.onload = function() {
  setTimeout(function(){
      initApp();
  }, 1000);
}

function fortniteEnroll() {
  firebase.firestore().collection("tournaments").doc(fortnite).collection("players").doc(firebase.auth().currentUser.uid).set({
    enrolled: true,
    name: firebase.auth().currentUser.displayName
  });
  document.getElementById("fortniteBtn").classList.toggle('tournamentCardButton');
  document.getElementById("fortniteBtn").innerHTML = "✓ Signed Up";
}


function personalizeElements() {
  var fortniteDocument = firebase.firestore().collection("tournaments").doc(fortnite);
  fortniteDocument.get().then(function(doc) {
    document.getElementById("fortniteEvent").innerHTML = doc.data().name;
    document.getElementById("fortniteDate").innerHTML = doc.data().date + " @ " + doc.data().time;
  });


  fortniteDocument.collection("players").get().then(function(doc) {
    document.getElementById("fortniteParticipants").innerHTML = doc.size + " Participants";
  });

  fortniteDocument.collection("players").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
    if (doc.exists) {
      document.getElementById("fortniteBtn").classList.toggle('tournamentCardButtonSigned');
      document.getElementById("fortniteBtn").innerHTML = "✓ Signed Up";
      document.getElementById("fortniteBtn").disabled = true;
    }
  });

  document.getElementById("avatar").src = firebase.auth().currentUser.photoURL;
}
