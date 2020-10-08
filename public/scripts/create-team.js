var profilePicture;

function personalizeElements() {
  document.getElementById('teamAvatarUploader').addEventListener("change", selectImage);

  games.forEach((game) => {
    gameFileName = (game.toLowerCase()).replace(/ /g, "").replace("-","").replace(".","").replace("'","");
    $("#createTeamGameCarousel").append('<label id="create' + gameFileName + 'TeamLabel" class="createTournamentGamesLabel uncheckedGamesLabel"><input onclick="animateGameCarousel(this.id)" id="create' + gameFileName + 'TeamInput" name="newTeamGame" class="createTournamentGamesRadio" type="checkbox" value="' + game + '"></input><picture><source srcset="../media/game_images/' + gameFileName + '.webp" type="image/webp"><img class="createTournamentGamesImage" src="../media/game_images/' + gameFileName + '.jpg"></picture></label>');
  });
}

function animateGameCarousel(selected){
  var clicked = "#" + selected;
  var clickedLabel = clicked.replace("Input", "Label")
  if($(clicked).is(":checked")){
      $(clickedLabel).removeClass('uncheckedGamesLabel');
      console.log("Checked");
  }
  else{
    $(clickedLabel).addClass('uncheckedGamesLabel');
    console.log("No longer checked");
  }
}

function animateSocialMedia(selected){
  var clicked = "#" + selected + "Icon";
  $(clicked).toggleClass(selected + 'Icon');
  $("#" + selected + "Title").toggleClass('noDisplay');
  $("#" + selected + "Link").toggleClass('noDisplay');
}

function animateTeamPrivacy(selected){
  var clicked = "#" + selected + "TeamLabel";
  $('.teamPrivacyLabel').removeClass('createTournamentLabelChecked');
  $(clicked).addClass('createTournamentLabelChecked');
}

function searchGameCreateTeam(searchbar) {
    var value = $(searchbar).val().toLowerCase();
    $("#createTeamGameCarousel > label").each(function() {
      if ($(this).attr("id").toLowerCase().replace('label', '').replace('createteam', '').search(value) > -1) { $(this).show(); }
      else { $(this).hide(); }
  });
}

function selectImage(image) {
  profilePicture = image.target.files[0]
}

function addTeam() {
  try {
    var teamName = document.getElementById('teamName').value;
    if(teamName == "") throw "Incomplete Form Error";

    var privacy = "public";
    var teamDescription = document.getElementById('teamDescription').value;

    var facebookLink = document.getElementById('facebookLink').value;
    var twitterLink = document.getElementById('twitterLink').value;
    var instagramLink = document.getElementById('instagramLink').value;
    var youtubeLink = document.getElementById('youtubeLink').value;
    var redditLink = document.getElementById('redditLink').value;
    var twitchLink = document.getElementById('twitchLink').value;
    var discordLink = document.getElementById('discordLink').value;

    var teamGames = $("#createTeamGameCarousel input:checkbox:checked").map(function(){
      return $(this).val();
    }).get();
    console.log(teamGames);

    if((teamDescription == "")){
      teamDescription = "No description offered";
    }

    firebase.firestore().collection("teams").add({
        verified: false,
        creator: firebase.auth().currentUser.uid,
        creatorName: firebase.auth().currentUser.displayName,
        description: teamDescription,
        name: teamName,
        teamMembers: [firebase.auth().currentUser.uid],
        teamAdmins: [firebase.auth().currentUser.uid],
        games: teamGames,
        privacy: privacy,
        stats: {
          upcomingTournaments: 0,
          tournamentsJoined: 0,
          tournamentsCreated: 0,
          wins: 0
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
    }).then(function(docRef) {
        document.getElementById("alertBox").style.display = "block";
        if(document.getElementById("alertBox").classList.contains("errorAlert")){document.getElementById("alertBox").classList.remove("errorAlert");}
        document.getElementById("alertTextBold").innerHTML = "Update: ";
        document.getElementById("alertText").innerHTML = "Your team has been created!";

        firebase.app().storage("gs://brackot-teams-storage").ref(docRef.id).child("profile").put(profilePicture).then((snapshot) => {
          console.log('pfp uploaded');
          //Do stuff to set current page's images to the profile without having to refresh.
        });
        /*
        if (the team creator didn't upload a picture) {
          firebase.storage().ref(docRef.id).child("profile").put("../media/BrackotLogo2.jpg").then((snapshot) => {
            //Do stuff to set current page's images to the profile without having to refresh.
          });
        }
        else {
          firebase.storage().ref(docRef.id).child("profile").put(profile.target.files[0]).then((snapshot) => {
            //Do stuff to set current page's images to the profile without having to refresh.
          });
        }
        */
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
