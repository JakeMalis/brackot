function passwordSignIn() {
  if (document.getElementById("rememberMe").checked) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
      firebase.auth().signInWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value).catch(
          function (error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              if (errorCode == 'auth/wrong-password') {
                  alert('Incorrect password')
              }
              else if (errorCode == 'auth/invalid-email') {
                  alert('Email address is invalid')
              }
              else {
                  alert(errorCode);
              }
      });
    });
  }
  else {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function() {
      firebase.auth().signInWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value).catch(
          function (error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              if (errorCode == 'auth/wrong-password') {
                  alert('Incorrect password')
              }
              else if (errorCode == 'auth/invalid-email') {
                  alert('Email address is invalid')
              }
              else {
                  alert(errorCode);
              }
      });
    });
  }
}

function signInGooglePopup() {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  firebase.auth().signInWithPopup(provider);
}

window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) { if (user) { window.location = "dashboard.html"; }});
}
