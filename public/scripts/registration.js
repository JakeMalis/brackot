function createUser() {
  var errorThrown = false;
  firebase.auth().createUserWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value).catch(
    function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/email-already-in-use') {
          errorThrown = true;
          alert('Email already in use');
        }
        else if (errorCode == 'auth/invalid-email') {
          errorThrown = true;
          alert('Email address is invalid.');
        }
        else if (errorCode == 'auth/weak-password') {
          errorThrown = true;
            alert('Password too weak');
        }
        else {
          errorThrown = true;
            alert(errorMessage);
        }
    }
  );
  setTimeout(function(){
      if (errorThrown == false) { next(); }
  }, 500);
}

function register() {
  var role = "player";
  var fortnite = document.getElementById("fortnite").checked;
  var overwatch = document.getElementById("overwatch").checked;
  var smash = document.getElementById("smash").checked;
  var valorant = document.getElementById("valorant").checked;

  firebase.auth().currentUser.sendEmailVerification();
  firebase.auth().currentUser.updateProfile({
    displayName: document.getElementById('first-name').value + " " + document.getElementById('last-name').value
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

function uploadAvatar(avatar) {
  var storageReference = firebase.storage().ref(firebase.auth().currentUser.uid + ".png");
  var image = avatar.target.files[0];

  storageReference.put(image).then(function(snapshot) {
    console.log('Uploaded profile image!');
    snapshot.ref.getDownloadURL().then(function(url){
        firebase.auth().currentUser.updateProfile({
            photoURL: url
        });
        document.getElementById("addProfilePic").src = url;
    });
  });
}

function skipAvatar() {
  firebase.auth().currentUser.updateProfile({
      photoURL: "https://cdn.discordapp.com/attachments/720005730765111376/724418307129606155/profileicon_.png"
  });
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
  document.getElementById('avatarUploader').addEventListener("change", uploadAvatar);
}

window.onload = function() {
  initApp();
}
