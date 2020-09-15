function createUser() {
  firebase.auth().createUserWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value).catch(
    function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
          document.getElementById("alertBox").style.display = "block";
          document.getElementById("alertBox").classList.add("errorAlert");
          document.getElementById("alertTextBold").innerHTML = "Error: ";
          document.getElementById("alertText").innerHTML = "The email address you have entered is invalid. Please ensure you are entering a real email address.";
          var email = document.getElementById('email');
          email.style.borderColor = '#f44336';
          email.classList.add('error');
          setTimeout(function() {
            email.classList.remove('error');
          }, 300);
        }
        else if (errorCode == 'auth/email-already-in-use') {
          document.getElementById("alertBox").style.display = "block";
          document.getElementById("alertBox").classList.add("errorAlert");
          document.getElementById("alertTextBold").innerHTML = "Error: ";
          document.getElementById("alertText").innerHTML = "The email address you have entered is already in use. Please try using another email address.";
          var email = document.getElementById('email');
          email.style.borderColor = '#f44336';
          email.classList.add('error');
          setTimeout(function() {
            email.classList.remove('error');
          }, 300);
        }
        else if (errorCode == 'auth/weak-password') {
          document.getElementById("alertBox").style.display = "block";
          document.getElementById("alertBox").classList.add("errorAlert");
          document.getElementById("alertTextBold").innerHTML = "Error: ";
          document.getElementById("alertText").innerHTML = "The password you have entered is too weak. Please enter a more secure password.";
          var password = document.getElementById('password');
          password.style.borderColor = '#f44336';
          password.classList.add('error');
          setTimeout(function() {
            email.classList.remove('error');
          }, 300);
          error.preventDefault();
        }
    }
  );
  firebase.auth().onAuthStateChanged(function(user) { if (user) {
    firebase.auth().currentUser.sendEmailVerification();
    firebase.auth().currentUser.updateProfile({
      displayName: document.getElementById('name').value
    });
    firebase.auth().currentUser.updateProfile({
        photoURL: "media/BrackotLogo2.jpg"
    });
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        stats: {
          tournamentsJoined: 0,
          tournamentsCreated: 0,
          matchesPlayed: 0,
          playersHosted: 0,
          bugsReported: 0,
          coins: 0,
          notifications: 0,
          wins: 0
        },
        email_preferences: {
          announcements: true,
          newsletter: true,
          thirdparty: true
        }
    }).then(function() {
      window.location = "dashboard.html";
    });
  }});
}

function openModal() {
  if (document.getElementById('team').value !== "") {
    var teamExists = false;
    firebase.firestore().collection("teams").where("name", "==", document.getElementById('team').value).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if (doc.exists) {
          $("#allTeams").hide();
          teamExists = true;
          console.log(teamExists);
          if (doc.data().privacy === "public") {
            $('#joinPublicTeamModal').modal();
            document.getElementById("joinPublicTeamName").innerHTML = document.getElementById('team').value
          }
          else if (doc.data().privacy === "private") {
            $('#joinPrivateTeamModal').modal();
            document.getElementById("joinPrivateTeamName").innerHTML = document.getElementById('team').value
          }
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
  else { alert("Please enter team name") }
}

function createTeam() {
  if (document.getElementById("public").checked) {
    firebase.firestore().collection("teams").add({
        privacy: "public",
        players: [firebase.auth().currentUser.uid],
        name: document.getElementById('team').value
    }).then(function() {
      $('#createTeamModal').modal("hide");
      next();
    });
  }
  else {
    if (document.getElementById('createTeamPassword').value !== "") {
      firebase.firestore().collection("teams").add({
          privacy: "private",
          password: document.getElementById('createTeamPassword').value,
          players: [firebase.auth().currentUser.uid],
          name: document.getElementById('team').value
      }).then(function() {
        $('#createTeamModal').modal("hide");
        next();
      });
    }
    else { alert("Please enter team PIN") }
  }
}

function joinTeam() {
  firebase.firestore().collection("teams").where("name", "==", document.getElementById('team').value).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      if (doc.data().privacy === "private") {
        if (doc.data().password === document.getElementById('joinTeamPassword').value) {
          $('#joinPrivateTeamModal').modal("hide");
          firebase.firestore().collection("teams").doc(doc.id).update({
            players: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
          });
          next();
        }
        else {
          alert('Incorrect team password');
        }
      }
      else if (doc.data().privacy === "public") {
        $('#joinPublicTeamModal').modal("hide");
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
            teams: [firebase.firestore().doc('teams/' + doc.id)]
        });
        firebase.firestore().collection("teams").doc(doc.id).update({
          players: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
        });
        next();
      }
    });
  });
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
      });
    });
  });
}

window.onload = function() {
  //document.getElementById('avatarUploader').addEventListener("change", uploadAvatar);

  //Code for team joining/creation
  /*

  loadExistingTeams();

  if(team.value.length == 0) {
    allTeams.style.display = "none";
  }
  else {
    allTeams.style.display = "block";
  }


  $('#private').on('click', function() {
      document.getElementById('createTeamPassword').style.visibility = "visible";
  });

  $('#public').on('click', function() {
      document.getElementById('createTeamPassword').style.visibility = "hidden";
  });
  */
}
