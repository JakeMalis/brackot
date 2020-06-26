function passwordSignIn() {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      firebase.auth().signInWithEmailAndPassword(email, password).catch(
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
}

window.onload = function() {
  document.getElementById('loginBtn').addEventListener("click", passwordSignIn);
  firebase.auth().onAuthStateChanged(function(user) { if (user) { window.location = "index.html"; }});
}
