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
            verifyEmail();
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
            })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
        }, 450);
        setTimeout(function(){
            window.location = "dashboard/index.html";
        }, 750);
    }
    else if (validateEmail(document.getElementById('email').value) === false) {
        alert('Email address is not valid');
    }
}

function verifyEmail() {
    firebase.auth().currentUser.sendEmailVerification().then(
        function(){
            alert('Verification Email Sent');
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
        }
    });
}

window.onload = function() {
    initApp();
}
