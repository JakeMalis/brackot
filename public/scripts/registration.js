function createUser() {
  firebase.auth().createUserWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value).catch(
    function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
          var email = document.getElementById('email');
          email.style.backgroundColor = '#ffdddd';
          email.classList.add('error');
          setTimeout(function() {
            email.classList.remove('error');
          }, 300);
          error.preventDefault();
        }
        else if (errorCode == 'auth/weak-password') {
          var password = document.getElementById('password');
          password.style.backgroundColor = '#ffdddd';
          password.classList.add('error');
          setTimeout(function() {
            email.classList.remove('error');
          }, 300);
          error.preventDefault();
        }
        else {
          alert(errorMessage);
        }
    }
  );
  firebase.auth().onAuthStateChanged(function(user) { if (user) {
    next();
    firebase.firestore().collection("mail").doc(firebase.auth().currentUser.uid + "-welcome").set({
      to: document.getElementById('email').value,
      template: {
        name: 'welcome',
        data: {
          first: document.getElementById('first-name').value,
          email: firebase.auth().currentUser.email
        }
      }
    });
  }});
}

function register() {
  firebase.auth().currentUser.sendEmailVerification();
  firebase.auth().currentUser.updateProfile({
    displayName: document.getElementById('first-name').value + " " + document.getElementById('last-name').value
  });
  if (document.getElementById("player").checked) {
    db.collection("users").doc(firebase.auth().currentUser.uid).set({
        first: document.getElementById('first-name').value,
        last: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        team: document.getElementById('team').value,
        role: "player",
        coins: 0,
        notifications: 0,
        matches: 0,
        wins: 0,
        boost: false,
        unlimited: false,
        email_preferences: {
          announcements: true,
          newsletter: true,
          thirdparty: true
        },
        games: {
            fortnite: document.getElementById("fortnite").checked,
            overwatch: document.getElementById("overwatch").checked,
            smash: document.getElementById("smash").checked,
            valorant: document.getElementById("valorant").checked
        }
    }).then(function() {
        window.location = "index.html";
    });
  }
  else if (document.getElementById("coach").checked) {
    db.collection("users").doc(firebase.auth().currentUser.uid).set({
        first: document.getElementById('first-name').value,
        last: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        team: document.getElementById('team').value,
        email_preferences: {
          announcements: true,
          newsletter: true,
          thirdparty: true
        },
        role: "coach"

    }).then(function() {
        window.location = "index.html";
    });
  }
}

function uploadAvatar(avatar) {
  var storageReference = firebase.storage().ref(firebase.auth().currentUser.uid);
  var avatarReference = storageReference.child("profile");
  var image = avatar.target.files[0];
  document.getElementById("submitRegistrationButton").disabled = true;
  document.getElementById("submitRegistrationButton").value = "Uploading Avatar...";

  avatarReference.put(image).then(function(snapshot) {
    console.log('Uploaded profile image!');
    snapshot.ref.getDownloadURL().then(function(url){
        firebase.auth().currentUser.updateProfile({
            photoURL: url
        });
        document.getElementById("addProfilePic").src = url;
        document.getElementById("submitRegistrationButton").disabled = false;
    });
  });
}

window.onload = function() {
  document.getElementById('submitRegistrationButton').addEventListener("click", register);
  document.getElementById('userCreate').addEventListener("click", createUser);
  document.getElementById('avatarUploader').addEventListener("change", uploadAvatar);

  if(team.value.length == 0) {
    allTeams.style.display = "none";
  }
  else {
    allTeams.style.display = "block";
  }
}
