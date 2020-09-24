function addTeam() { try{
  var teamName = document.getElementById('teamName').value;
  if(teamName == "") throw "Incomplete Form Error";

  var privacy = "public";
  var teamDescription = document.getElementById('teamDescription').value;

  var discordLink = "";
  var facebookLink = "";
  var twitterLink = "";
  var instagramLink = "";
  var redditLink = "";
  var youtubeLink = "";
  var twitchLink = "";

  if((teamDescription == "")){
    teamDescription = "No description offered";
  }

  firebase.firestore().collection("teams").add({
      creator: firebase.auth().currentUser.uid,
      creatorName: firebase.auth().currentUser.displayName,
      description: teamDescription,
      name: teamName,
      teamMembers: [],
      teamAdmins: [],
      privacy: privacy,
      stats: {
        upcomingTournaments: 0,
        tournamentsCreated: 0,
        wins: 0,
        playersHosted: 0
      },
      social: {
        discord: discordLink,
        facebook: facebookLink,
        twitter: twitterLink,
        instagram: instagramLink,
        reddit: redditLink,
        youtube: youtubeLink,
        twitch: twitchLink
      }
  }).then(function() {
      document.getElementById("alertBox").style.display = "block";
      if(document.getElementById("alertBox").classList.contains("errorAlert")){document.getElementById("alertBox").classList.remove("errorAlert");}
      document.getElementById("alertTextBold").innerHTML = "Update: ";
      document.getElementById("alertText").innerHTML = "Your team has been created!";
  }).catch(function(error) {
      console.error("Error writing document: ", error);
  });
  }
  catch(error){
    document.getElementById("alertBox").style.display = "block";
    document.getElementById("alertBox").classList.add("errorAlert");
    document.getElementById("alertTextBold").innerHTML = "Error: ";
    document.getElementById("alertText").innerHTML = "Unable to create a team given the submitted information. All of the required fields must be complete before submitting.";
    alert(error);
  }
}
