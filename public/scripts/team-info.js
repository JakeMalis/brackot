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

    //document.getElementById("tournamentInfoWallpaper").className = "headerImage tournamentInfoWallpaper " + (doc.data().game.toLowerCase()).replace(/ /g, "").replace("-","").replace(".","") + "InfoWallpaper";
  });


}
