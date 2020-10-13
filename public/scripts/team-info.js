var teamId;
const db = firebase.firestore();
const team = {
    'members' : [],
    'tournaments': []
};

function personalizeElements() {
  updateMembers();
  updateTeamTournaments();
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


const setTeamTab = (tab) => {
  //takes and input and makes various components visible base on the input
  if(tab === "overview") {
    document.getElementById("teamOverviewTab").style.display = "block";
    document.getElementById("teamMembersTab").style.display = "none";
    document.getElementById("teamChatTab").style.display = "none";
    document.getElementById("teamTournamentsTab").style.display = "none";
    //displays the team overview tab and makes all the other tabs invisible

    document.getElementById("teamOverviewTab").className = "quickNavbarItem quickNavbarItemSelected";
    document.getElementById("teamMembersTab").className = "quickNavbarItem";
    document.getElementById("teamChatTab").className = "quickNavbarItem";
    document.getElementById("teamTournamentsTab").className = "quickNavbarItem";
    //displays the team overview NavbarItem as highlighted 
  }
  else if(tab === "teamMembers") {
    
    document.getElementById("teamOverviewTab").style.display = "none";
    document.getElementById("teamMembersTab").style.display = "block";
    document.getElementById("teamChatTab").style.display = "none";
    document.getElementById("teamTournamentsTab").style.display = "none";
    //displays the team members tab and makes all the other tabs invisible

    document.getElementById("teamOverviewTab").className = "quickNavbarItem";
    document.getElementById("teamMembersTab").className = "quickNavbarItem  quickNavbarItemSelected";
    document.getElementById("teamChatTab").className = "quickNavbarItem";
    document.getElementById("teamTournamentsTab").className = "quickNavbarItem";
    //displays the team members NavbarItem as highlighted
  }
  else if(tab === "teamChat") {
    
    document.getElementById("teamOverviewTab").style.display = "none";
    document.getElementById("teamMembersTab").style.display = "none";
    document.getElementById("teamChatTab").style.display = "block";
    document.getElementById("teamTournamentsTab").style.display = "none";
    //displays the team chat tab and makes all the other tabs invisible

    document.getElementById("teamOverviewTab").className = "quickNavbarItem";
    document.getElementById("teamMembersTab").className = "quickNavbarItem";
    document.getElementById("teamChatTab").className = "quickNavbarItem quickNavbarItemSelected";
    document.getElementById("teamTournamentsTab").className = "quickNavbarItem";
    //displays the team chat NavbarItem as highlighted
  }
  else if(tab === "teamTournaments") {
    
    document.getElementById("teamOverviewTab").style.display = "none";
    document.getElementById("teamMembersTab").style.display = "none";
    document.getElementById("teamChatTab").style.display = "none";
    document.getElementById("teamTournamentsTab").style.display = "block";
    //displays the team tournaments tab and makes all the other tabs invisible

    document.getElementById("teamOverviewTab").className = "quickNavbarItem";
    document.getElementById("teamMembersTab").className = "quickNavbarItem";
    document.getElementById("teamChatTab").className = "quickNavbarItem";
    document.getElementById("teamTournamentsTab").className = "quickNavbarItem quickNavbarItemSelected";
    //displays the team tournaments NavbarItem as highlighted
  }
}

const updateMembers = () => {
    //sets up an event listener
    db.collection('teams').doc(teamId).onSnapshot(() => {
        team.members = []
        //clears the team members list 
        team.members = db.collection('teams').doc(teamId).data().teamMembers
        //replaces the team members list with the team members list from the database
        ReactDOM.render(
          <TeamMembersTab/>,
          document.getElementById("teamMembersTab")
        );
        //re-renders the TeamMembersTab every time there is an update to the team member list
    })
}


const updateTeamTournaments = () => {
  //sets up an event listener for the tournaments a team is in 
  firebase.firestore().collection("tournaments")
  .where(teamId, "in", "participants")
  .onSnapshot((querySnapshot) => {
      //when the team tournemnt list changes it 
      team.tournaments = []
      querySnapshot.forEach((doc) => {
          team.tournaments.push(doc)
          //for each document with the teams ID in its participants field it adds the tournament info to the team.tournaments object
      })
      ReactDOM.render(
        <TeamTournamentTab/>,
        document.getElementById('teamTournamentsTab')
      //once the team.tournaments object is updated the function renders it
      )
  })
}
/***************************************************
* This area is where i create a bunch of react
* components. These are then placed into other react
* components and all render into the high level
* component your team card
*
****************************************************/
class playerPicture extends React.Component {
  render() {
    return (
      <div>
        
      </div>
    )
  }
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
    onClick(member) {
      //if the player is clicked it will display a popup with basic playerinformation
      document.getElementById('playerPopUp').player = member;
      document.getElementById('playerPopUp').style.display = "visible";
    }
    render() {
      return(
        <div>
          <header>
            Team Members
          </header>
          <div id='listOfTeamMembers'>
          {

            //takes list of team member uids
            //then takes the list and converts each one invidiually to a username and puts that in a div
            team.members.map(member =>
            <div className = {member == firebase.auth().currentUser.uid ? 'userInMemberList' : 'memberList'}>
                <p className="playerNameInList">{db.collections('users').doc(member).data().username}</p>
            </div>
          )}
          </div>
          
        </div>
      )
  }
}
class TeamChatTab extends React.component {
  //renders the team messages in the team chat tab
  render() {
    return(
      <div>
          <div>
            Team Chat:
          </div>
          <TeamMessage/>
          {
            //renders the team message component in the team chat tab
          }
      </div>
        
    )
  }
}
class TeamTournamentsList extends React.component {
  handleClick = (doc) =>{ 
      window.location = "tournament-info?tournamentId=" //have to revisit when I figure out object structure
  }
  render() {
    return(
      <div>
        {
          team.tournament.map((doc) => {
              (
                <div className="tournamentCard">
                  {/*how the tournament card is structured comes from tournaments.js*/}
                  <div className="tournamentCardBackground">
                    <div className="tournamentCardContent" onClick={() => this.handleClick(doc)}>
                        <picture className="tournamentWallpaper">
                          <source srcSet={this.props.wallpaper + "webp"} type="image/webp"></source>
                          <img className="tournamentWallpaper" src={this.props.wallpaper + "jpg"}/>
                        </picture>
                        <div className="tournamentCardText">
                          <h6 className="tournamentCardTitle">{doc.name}</h6>
                          <ul className="tournamentCardDetails">
                            <li className="tournamentDetailsList"><i className="fa fa-gamepad tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail">{doc.game}</div></li>
                            <li className="tournamentDetailsList"><i className="fa fa-calendar tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail">{doc.date}</div></li>
                            <li className="tournamentDetailsList"><i className="fa fa-user tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail">{doc.players.length}</div></li>
                          </ul>
                        </div>
                        <div className="tournamentCardHostBar">
                          <img className="tournamentCardHostPic" src={/*jake needs to help here*/}></img>
                          <h6 className="tournamentCardHostName">{doc.creatorName}</h6>
                        </div>
                    </div>
                  </div>
                </div>
              )
          })
        }
    
      </div>
    )
  }
}
class TeamTournamentTab extends React.component {
    render() {
      return(
        <div>
          <div>
            Your Team is Currently Enrolled in:
          </div>
          <TeamTournamentsList/>
        </div>

      )
    }
}
class YourTeamCard extends React.component {
  //high level component with a lot of smaller components rendered within it
    render() {
      return (
          <div>
            <ul class="quickNavbar">
                <li id="teamOverviewNavbar" class="quickNavbarItem quickNavbarItemSelected"><a class="quickNavbarItemLink" onclick={setTeamTab('overview')}><p class="quickNavbarItemText">Overview</p></a></li>
                <li id="teamMembersNavbar" class="quickNavbarItem"><a class="quickNavbarItemLink" onclick={setTeamTab('teamMembers')}><p class="quickNavbarItemText">Members</p></a></li>
                <li id="teamChatNavbar" class="quickNavbarItem"><a class="quickNavbarItemLink" onclick={setTeamTab('teamChat')}><p class="quickNavbarItemText">Chat</p></a></li>
                <li id="teamTournamentsNavbar" class="quickNavbarItem"><a class="quickNavbarItemLink" onclick={setTeamTab('teamTournaments')}><p class="quickNavbarItemText">Tournaments</p></a></li>
            </ul>
            <div id="teamOverviewTab"></div>
            <div id="teamMembersTab"></div>
            <div id='teamChatTab'></div>
            <div id='teamTournamentsTab'></div>
          </div>
      )
    }
}
