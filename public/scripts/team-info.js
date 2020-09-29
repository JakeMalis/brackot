var teamId;

function personalizeElements() {
  var url = new URL(window.location.href);
  teamId = url.searchParams.get("teamId");

  firebase.firestore().collection("teams").doc(teamId).get().then(function(doc) {
    document.getElementById("teamInfoName").innerHTML = doc.data().name;
    document.getElementById("teamInfoMembers").innerHTML = (doc.data().teamMembers.length);

    var privacy = doc.data().privacy;
    if(privacy == "public"){
      document.getElementById("teamInfoPrivacy").innerHTML = "Public";
      $("#teamInfoPublicIcon").removeClass("noDisplay");
    }
    else{
      document.getElementById("teamInfoPrivacy").innerHTML = "Private";
      $("#teamInfoPrivateIcon").removeClass("noDisplay");
    }

    var facebook = doc.data().social.facebook;
    var twitter = doc.data().social.twitter;
    var instagram = doc.data().social.instagram;
    var youtube = doc.data().social.youtube;
    var reddit = doc.data().social.reddit;
    var twitch = doc.data().social.twitch;
    var discord = doc.data().social.discord;
    if(facebook != ""){ $('#teamInfoFacebook').removeClass("noDisplay"); $("#teamInfoFacebook").attr("href", facebook); }
    if(twitter != ""){ $('#teamInfoTwitter').removeClass("noDisplay"); $("#teamInfoTwitter").attr("href", twitter); }
    if(instagram != ""){ $('#teamInfoInstagram').removeClass("noDisplay"); $("#teamInfoInstagram").attr("href", instagram); }
    if(youtube != ""){ $('#teamInfoYoutube').removeClass("noDisplay"); $("#teamInfoYoutube").attr("href", youtube); }
    if(reddit != ""){ $('#teamInfoReddit').removeClass("noDisplay"); $("#teamInfoReddit").attr("href", reddit); }
    if(twitch != ""){ $('#teamInfoTwitch').removeClass("noDisplay"); $("#teamInfoTwitch").attr("href", twitch); }
    if(discord != ""){ $('#teamInfoDiscord').removeClass("noDisplay"); $("#teamInfoDiscord").attr("href", discord); }

    if (doc.data().games != undefined){
      $('#teamInfoGamesRow').removeClass("noDisplay");
      doc.data().games.forEach((game) => {
        gameFileName = (game.toLowerCase()).replace(/ /g, "").replace("-","").replace(".","").replace("'","");
        $("#teamInfoGameCarousel").append('<label id="teamInfo' + gameFileName + 'Label" class="teamInfoGamesLabel"><picture><source srcset="../media/game_images/' + gameFileName + '.webp" type="image/webp"><img class="teamInfoGamesImage" src="../media/game_images/' + gameFileName + '.jpg"></picture></label>');
      });
    }



    if (doc.data().creator === firebase.auth().currentUser.uid) {
      document.getElementById("teamSignUpButton").innerHTML = "Edit Team";
      document.getElementById("teamSignUpButton").onclick = function() { editTeam(); };
    }
    else if ((!(doc.data().teamMembers).includes(firebase.auth().currentUser.uid)) && ((doc.data().privacy) == "public")) {
      document.getElementById("teamSignUpButton").innerHTML = "Join Team";
      document.getElementById("teamSignUpButton").onclick = function() { joinPublicTeam(); };
    }
    else if ((!(doc.data().teamMembers).includes(firebase.auth().currentUser.uid)) && ((doc.data().privacy) == "private")) {
      document.getElementById("teamSignUpButton").innerHTML = "Join Team";
      document.getElementById("teamSignUpButton").onclick = function() { joinPrivateTeam(); };
    }
    else if ((doc.data().teamMembers).includes(firebase.auth().currentUser.uid)) {
      document.getElementById("teamSignUpButton").className = 'tournamentCardButton teamCardButtonJoined';
      document.getElementById("teamSignUpButton").innerHTML = "";
      document.getElementById("teamSignUpButton").onclick = function() { leaveTeam(); };
    }


    //document.getElementById("tournamentInfoWallpaper").className = "headerImage tournamentInfoWallpaper " + (doc.data().game.toLowerCase()).replace(/ /g, "").replace("-","").replace(".","") + "InfoWallpaper";
  });


}

function joinPublicTeam() {
  firebase.firestore().collection("teams").doc(teamId).update({
    teamMembers: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
  }).then(function() {
    document.getElementById("teamSignUpButton").className = 'tournamentCardButton teamCardButtonJoined';
    document.getElementById("teamSignUpButton").innerHTML = "";
    document.getElementById("teamSignUpButton").disabled = true;
  });
}

function leaveTeam(){
  firebase.firestore().collection("teams").doc(teamId).update({
    teamMembers: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
  }).then(function() {
    document.location.reload(false);
  });
}
