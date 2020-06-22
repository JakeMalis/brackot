function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
        return (true)
    }
    return (false)
}

function createUser() {
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
      }
    );
  }
  else if (validateEmail(document.getElementById('email').value) === false) {
      alert('Email address is not valid');
  }
}

function register() {
  var role = "player";
  var fortnite = document.getElementById("fortnite").checked;
  var overwatch = document.getElementById("overwatch").checked;
  var smash = document.getElementById("smash").checked;
  var valorant = document.getElementById("valorant").checked;

  firebase.auth().currentUser.sendEmailVerification();
  firebase.auth().currentUser.updateProfile({
    displayName: document.getElementById('first-name').value + " " + document.getElementById('last-name').value,
    photoURL: "https://cdn.discordapp.com/attachments/720005730765111376/724418307129606155/profileicon_.png"
  });
  if (role = "player") {
    db.collection("users").doc(firebase.auth().currentUser.uid).set({
        first: document.getElementById('first-name').value,
        last: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        state: document.getElementById('state').value,
        highschool: document.getElementById('highschool').value,
        role: role,
        coins: 0,
        notifications: 0,
        matches: 0,
        wins: 0,
        boost: false,
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
  else if (role = "coach") {
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
  setTimeout(function(){
      window.location = "index.html";
  }, 1000);
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
  document.getElementById('userCreate').addEventListener("click", createUser);
}

window.onload = function() {
  initApp();
}
