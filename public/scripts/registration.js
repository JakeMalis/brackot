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
        else if (errorCode == 'auth/email-already-in-use') {
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
    firebase.auth().currentUser.sendEmailVerification();
    firebase.auth().currentUser.updateProfile({
      displayName: document.getElementById('first-name').value + " " + document.getElementById('last-name').value
    });
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
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
        first: document.getElementById('first-name').value,
        last: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
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
        }
    });
  }});
}

function openModal() {
  var teamExists = false;
  firebase.firestore().collection("teams").where("name", "==", document.getElementById('team').value).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      if (doc.exists) {
        $("#allTeams").hide();
        $('#joinTeamModal').modal();
        teamExists = true;
      }
    });
  }).then(function() {
    if (!teamExists) {
      $("#allTeams").hide();
      $('#createTeamModal').modal();
      document.getElementById("newTeamName").innerHTML = document.getElementById('team').value;
    }
  });
}

function createTeam() {
  if (document.getElementById("public").checked) {
    var privacy = "public";
    firebase.firestore().collection("teams").add({
        privacy: "public",
        players: [firebase.auth().currentUser.uid],
        name: document.getElementById('team').value
    }).then(function(team) {
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
          teams: [firebase.firestore().doc('teams/' + team.id)]
      });
    });
  }
  else {
    var privacy = "private";
    firebase.firestore().collection("teams").add({
        privacy: "private",
        pin: 3332,
        players: [firebase.auth().currentUser.uid],
        name: document.getElementById('team').value
    }).then(function(team) {
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
          teams: [firebase.firestore().doc('teams/' + team.id)]
      });
    });
  }
}

function joinTeam() {
  firebase.firestore().collection("teams").where("name", "==", document.getElementById('team').value).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
            teams: [firebase.firestore().doc('teams/' + doc.id)]
        });
        firebase.firestore().collection("teams").doc(doc.id).update({
          players: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
        });
    });
  });
}

function register() {
  if (document.getElementById("player").checked) {
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
        role: "player",
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
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
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

function loadExistingTeams() {
  firebase.firestore().collection("teams").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        $("#allTeams").append('<li><a class="teamName">' + doc.data().name + '</a></li>');
    });
  }).then(function() {
    $(function(){
      $('.teamName').on('click', function() {
          $("#team").val($(this).text());
          $("#allTeams").hide();
          $('#joinTeamModal').modal();
      });
    });
  });
}

window.onload = function() {
  document.getElementById('submitRegistrationButton').addEventListener("click", register);
  document.getElementById('userCreate').addEventListener("click", createUser);
  document.getElementById('avatarUploader').addEventListener("change", uploadAvatar);

  loadExistingTeams();

  if(team.value.length == 0) {
    allTeams.style.display = "none";
  }
  else {
    allTeams.style.display = "block";
  }
}
