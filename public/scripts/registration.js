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
  firebase.auth().onAuthStateChanged(async function(user) { if (user) {
    await user.updateProfile({
      displayName: document.getElementById('name').value
    });
    window.location = "dashboard";
  }});
}
