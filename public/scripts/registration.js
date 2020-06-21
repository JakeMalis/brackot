function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
        return (true)
    }
    return (false)
}

function register() {
    var fortnite = false;
    var overwatch = false;
    var smash = false;
    var valorant = false;

    if (document.getElementById('player').checked) {
        var role = "player";
        var fortnite = document.getElementById("fortnite").checked;
        var overwatch = document.getElementById("overwatch").checked;
        var smash = document.getElementById("smash").checked;
        var valorant = document.getElementById("valorant").checked;
    }
    else if (document.getElementById('coach').checked) {
        var role = "coach";
    }

    if (validateEmail(document.getElementById('email').value) === true) {
        firebase.auth().createUserWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value).catch(
            function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    alert('Password too weak')
                }
                else {
                    alert(errorMessage);
                }
            });
        setTimeout(function(){
            firebase.auth().currentUser.sendEmailVerification();
            firebase.auth().currentUser.updateProfile({
              displayName: document.getElementById('first-name').value + " " + document.getElementById('last-name').value,
              photoURL: "https://cdn.discordapp.com/attachments/720005730765111376/723733915990360135/blank-profile-picture-973460_640.png"
            });
            if (document.getElementById('player').checked) {
              db.collection("users").doc(firebase.auth().currentUser.uid).set({
                  first: document.getElementById('first-name').value,
                  last: document.getElementById('last-name').value,
                  email: document.getElementById('email').value,
                  state: document.getElementById('state').value,
                  highschool: document.getElementById('highschool').value,
                  role: role,
                  games: {
                      fortnite: fortnite,
                      overwatch: overwatch,
                      smash: smash,
                      valorant: valorant
                  }
              }).then(function() {
                  console.log("Document successfully written!");
              }).catch(function(error) {
                      console.error("Error writing document: ", error);
              });
            }
            else if (document.getElementById('coach').checked) {
              db.collection("users").doc(firebase.auth().currentUser.uid).set({
                  first: document.getElementById('first-name').value,
                  last: document.getElementById('last-name').value,
                  email: document.getElementById('email').value,
                  state: document.getElementById('state').value,
                  highschool: document.getElementById('highschool').value,
                  role: role
              }).then(function() {
                  console.log("Document successfully written!");
              }).catch(function(error) {
                      console.error("Error writing document: ", error);
              });
            }
            console.log("Added documents");
        }, 350);
        setTimeout(function(){
            window.location = "index.html";
        }, 1000);
    }
    else if (validateEmail(document.getElementById('email').value) === false) {
        alert('Email address is not valid');
    }
}

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
      }
  });
  document.getElementById('submitRegistrationButton').addEventListener("click", register);
}

window.onload = function() {
  initApp();
}
