function handleSignIn() {
  if (document.getElementById("rememberMe").checked) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() { authenticateUser(); });
  }
  else {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function() { authenticateUser(); });
  }
}

function authenticateUser() {
  firebase.auth().signInWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value).catch(
      function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if ((errorCode == 'auth/wrong-password') || (errorCode == 'auth/invalid-email')) {
            document.getElementById("alertBox").style.display = "block";
            document.getElementById("alertBox").classList.add("errorAlert");
            document.getElementById("alertTextBold").innerHTML = "Error: ";
            document.getElementById("alertText").innerHTML = "Username or password is incorrect.";
            var email = document.getElementById('email');
            email.style.borderColor = '#f44336';
            email.classList.add('error');
            setTimeout(function() {
              email.classList.remove('error');
            }, 300);
          }
          else {
            document.getElementById("alertBox").style.display = "block";
            document.getElementById("alertBox").classList.add("errorAlert");
            document.getElementById("alertTextBold").innerHTML = "Error: ";
            document.getElementById("alertText").innerHTML = errorCode;
          }
  });
}

window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user) { if (user) { window.location = "dashboard.html"; }});
}
