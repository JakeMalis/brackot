var teamId;
const db = firebase.firestore();
const team = {
    'members' : []
};

function personalizeElements() {
  updateMembers();
  var url = new URL(window.location.href);
  teamId = url.searchParams.get("teamId");

  firebase.firestore().collection("teams").doc(teamId).get().then(async function(doc) {
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

    document.getElementById('teamInfoProfilePic').src = await firebase.storage().refFromURL("gs://brackot-teams-storage/" + doc.id + "/profile").getDownloadURL().then(function (url) {
      return String(url);
    }).catch((error) => {
      return "../media/BrackotLogo2.jpg";
    });


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


const setTab = (tab) => {
  //takes and input and makes various components visible base on the input
  if(tab === "overview") {
    document.getElementById("teamOverviewTab").style.display = "block";
    document.getElementById("teamMembersTab").style.display = "none";
    document.getElementById("teamChatTab").style.display = "none";
    document.getElementById("teamTournamentsTab").style.display = "none";

    document.getElementById("teamOverviewTab").className = "quickNavbarItem quickNavbarItemSelected";
    document.getElementById("teamMembersTab").className = "quickNavbarItem";
    document.getElementById("teamChatTab").className = "quickNavbarItem";
    document.getElementById("teamTournamentsTab").className = "quickNavbarItem";
  }
  else if(tab === "teamMembers") {
    
    document.getElementById("teamOverviewTab").style.display = "none";
    document.getElementById("teamMembersTab").style.display = "block";
    document.getElementById("teamChatTab").style.display = "none";
    document.getElementById("teamTournamentsTab").style.display = "none";

    document.getElementById("teamOverviewTab").className = "quickNavbarItem";
    document.getElementById("teamMembersTab").className = "quickNavbarItem  quickNavbarItemSelected";
    document.getElementById("teamChatTab").className = "quickNavbarItem";
    document.getElementById("teamTournamentsTab").className = "quickNavbarItem";
  }
  else if(tab === "teamChat") {
    
    document.getElementById("teamOverviewTab").style.display = "none";
    document.getElementById("teamMembersTab").style.display = "none";
    document.getElementById("teamChatTab").style.display = "block";
    document.getElementById("teamTournamentsTab").style.display = "none";

    document.getElementById("teamOverviewTab").className = "quickNavbarItem";
    document.getElementById("teamMembersTab").className = "quickNavbarItem";
    document.getElementById("teamChatTab").className = "quickNavbarItem quickNavbarItemSelected";
    document.getElementById("teamTournamentsTab").className = "quickNavbarItem";
  }
  else if(tab === "teamTournaments") {
    
    document.getElementById("teamOverviewTab").style.display = "none";
    document.getElementById("teamMembersTab").style.display = "none";
    document.getElementById("teamChatTab").style.display = "none";
    document.getElementById("teamTournamentsTab").style.display = "block";

    document.getElementById("teamOverviewTab").className = "quickNavbarItem";
    document.getElementById("teamMembersTab").className = "quickNavbarItem";
    document.getElementById("teamChatTab").className = "quickNavbarItem";
    document.getElementById("teamTournamentsTab").className = "quickNavbarItem quickNavbarItemSelected";
  }
}

const updateMembers = () => {
    db.collection('teams').doc(teamId).onSnapshot(() => {
        team.members = []
        team.members = db.collection('teams').doc(teamId).data().teamMembers
        ReactDOM.render(
          <teamMembersTab/>,
          document.getElementById("teamMembersTab")
      );
    })
}
class TeamMessage extends React.Component {
  render(){
      return (
          <div>
              {   
                  /*
                      maps through the conversations object putting each message in a div
                  */
                      user.teamConversations.map(con =>
                          <div className = {con.sentUID == firebase.auth().currentUser.uid
                              ? 'userBubble' : 'foreignBubble'}>
                  {
                  //if the sentUID of the message is the same as the UID of the user who is currently logged in it 
                  //puts the message on the right if not it puts it on the left
                  }
                          <p className="messageBlurb">{con.message}</p>
                          
                          </div>
                      )    
              }
          </div>
      );
  }
}
class TeamOverviewTab extends React.component {
    render() {
      return(
        <div>
          
        </div>
      )
    }
}
class TeamMembersTab extends React.component {
    render() {
      return(
        <div>
          {
            //takes list of team member uids
            //then takes the list and converts each one invidiually to a username and puts that in a div
            team.members.map(member =>
              <div className = {member == firebase.auth().currentUser.uid ? 'userInMemberList' : 'memberList'}>
                  <p className="messageBlurb">{db.collections('users').doc(member).data().username}</p>
                
              </div>
          )}
        </div>
      )
  }
}
class TeamChatTab extends React.component {
  render() {
    return(
        <TeamMembers/>
    )
  }
}
class TeamTournamentTab extends React.component {
    render() {
      return(
        <div>
          
        </div>
      )
    }
}
class YourTeamCard extends React.component {
    render() {
      return (
          <div>
            <ul class="quickNavbar">
                <li id="teamOverviewNavbar" class="quickNavbarItem quickNavbarItemSelected"><a class="quickNavbarItemLink" onclick={setTab('overview')}><p class="quickNavbarItemText">Overview</p></a></li>
                <li id="teamMembersNavbar" class="quickNavbarItem"><a class="quickNavbarItemLink" onclick={setTab('teamMembers')}><p class="quickNavbarItemText">Members</p></a></li>
                <li id="teamChatNavbar" class="quickNavbarItem"><a class="quickNavbarItemLink" onclick={setTab('teamChat')}><p class="quickNavbarItemText">Chat</p></a></li>
                <li id="teamTournamentsNavbar" class="quickNavbarItem"><a class="quickNavbarItemLink" onclick={setTab('teamTournaments')}><p class="quickNavbarItemText">Tournaments</p></a></li>
            </ul>
            <div id="teamOverviewTab"></div>
            <div id="teamMembersTab"></div>
            <div id='teamChatTab'></div>
            <div id='teamTournamentsTab'></div>
          </div>
      )
    }
}
