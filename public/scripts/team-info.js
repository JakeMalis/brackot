var teamId;
const db = firebase.firestore();
const team = {
    'members' : [],
    'tournaments': {
      'upcoming' : [],
      'current' : [],
      'complete' : []
    },
    'conversations' : []
};

function personalizeElements() {
  var url = new URL(window.location.href);
  teamId = url.searchParams.get("teamId");
  
  updateTeamTournaments();
  
  initTeamCard();
  initTeamChat();
  /*
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

*/
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

function initTeamCard() {
  ReactDOM.render(
      <TeamOverviewTab/>,
      document.getElementById('teamOverviewTab')
  )
  ReactDOM.render(
    <TeamChatTab/>,
    document.getElementById('teamChatTab')
  )
}
const setTeamTab = (tab) => {
  //takes and input and makes various components visible base on the input
  if(tab === "overview") {
    document.getElementById("teamOverviewTab").style.display = "block";
    //document.getElementById("teamMembersTab").style.display = "none";
    document.getElementById("teamChatTab").style.display = "none";
    document.getElementById("teamTournamentsTab").style.display = "none";
    //displays the team overview tab and makes all the other tabs invisible

    document.getElementById("teamOverviewNavbar").className = "quickNavbarItem quickNavbarItemSelected";
    //document.getElementById("teamMembersTab").className = "quickNavbarItem";
    document.getElementById("teamChatNavbar").className = "quickNavbarItem";
    document.getElementById("teamTournamentsNavbar").className = "quickNavbarItem";
    //displays the team overview NavbarItem as highlighted 
  }
  else if(tab === "teamMembers") {
    
    document.getElementById("teamOverviewTab").style.display = "none";
    //document.getElementById("teamMembersTab").style.display = "block";
    document.getElementById("teamChatTab").style.display = "none";
    document.getElementById("teamTournamentsTab").style.display = "none";
    //displays the team members tab and makes all the other tabs invisible

    document.getElementById("teamOverviewNavbar").className = "quickNavbarItem";
    //document.getElementById("teamMembersTab").className = "quickNavbarItem  quickNavbarItemSelected";
    document.getElementById("teamChatNavbar").className = "quickNavbarItem";
    document.getElementById("teamTournamentsNavbar").className = "quickNavbarItem";
    //displays the team members NavbarItem as highlighted
  }
  else if(tab === "teamChat") {
    
    document.getElementById("teamOverviewTab").style.display = "none";
    //document.getElementById("teamMembersTab").style.display = "none";
    document.getElementById("teamChatTab").style.display = "block";
    document.getElementById("teamTournamentsTab").style.display = "none";
    //displays the team chat tab and makes all the other tabs invisible

    document.getElementById("teamOverviewNavbar").className = "quickNavbarItem";
    //document.getElementById("teamMembersTab").className = "quickNavbarItem";
    document.getElementById("teamChatNavbar").className = "quickNavbarItem quickNavbarItemSelected";
    document.getElementById("teamTournamentsNavbar").className = "quickNavbarItem";
    //displays the team chat NavbarItem as highlighted
  }
  else if(tab === "teamTournaments") {
    
    document.getElementById("teamOverviewTab").style.display = "none";
    //document.getElementById("teamMembersTab").style.display = "none";
    document.getElementById("teamChatTab").style.display = "none";
    document.getElementById("teamTournamentsTab").style.display = "block";
    //displays the team tournaments tab and makes all the other tabs invisible

    document.getElementById("teamOverviewNavbar").className = "quickNavbarItem";
    //document.getElementById("teamMembersTab").className = "quickNavbarItem";
    document.getElementById("teamChatNavbar").className = "quickNavbarItem";
    document.getElementById("teamTournamentsNavbar").className = "quickNavbarItem quickNavbarItemSelected";
    //displays the team tournaments NavbarItem as highlighted
  }
}
/*
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
*/
function initTeamChat() {
  //calls the event listener function and passes the current UID
  getRealtimeTeamConversations(firebase.auth().currentUser.uid);
  
}
function submitTeamMessage() {
  var message = document.getElementById("textHolder").value;
  //gets the message from the text box
  document.getElementById("textHolder").value = '';
  //clears the text box
  const msgObj = {
      sentUID: firebase.auth().currentUser.uid,
      message
  }
  //msg object is just passed between the submitMessage and updateMessage function
  //msgObj is not contained in user.conversations
  if(message !== ""){
  //checks if message is blank
      updateTeamMessage(msgObj)
      //passes the msgObj to the updateMessage function
  };
  
}//updateMessage is the function that actually sends the message to firebase
function updateTeamMessage(msgObj) {
  db.collection('tournaments')
      .doc(tournamentId)
      .collection('chat')
      .add({
          ...msgObj,
          createdAt: new Date(),
      })
      //uses the msgObj along with the date for ordering messages 
      .then (
          console.log(msgObj)
          //for testing purposes only
      )
}
function getRealtimeTeamConversations() {
  //this function sets the event listener 

  db.collection('teams').doc(teamId).collection('chat')
  .orderBy('createdAt', 'asc')
  .onSnapshot((querySnapshot) => {
      team.conversations = []
      //resets the conversations object so that you dont get duplicate messages
      querySnapshot.forEach(doc => {
          team.conversations.push(doc.data())  
          //adds each firebase documment in chat collection to conversations object
      });
      renderTeamChat()
      //rerendering the Message component when the data changes
      
  })
}
const updateTeamTournaments = () => {
  //sets up an event listener for the tournaments a team is in 
  db.collection("tournaments")
  .where("players", "array-contains", teamId)
  .onSnapshot((querySnapshot) => {
      //when the team tournemnt list changes it 
      console.log(querySnapshot)
      console.log('hello')
      team.tournaments.complete = [];
      team.tournaments.current = [];
      team.tournaments.upcoming = [];
      querySnapshot.forEach((doc) => {
        console.log(doc)
        team.tournaments.upcoming.push(doc.data())
      })
      
      console.log(team)
      console.log(teamId)
      ReactDOM.render(
        <TeamTournamentTab/>,
        document.getElementById('teamTournamentsTab')
      //once the team.tournaments object is updated the function renders it
      )
  })
}

function renderTeamChat() {
  ReactDOM.render(
      <TeamMessage/>,
      document.getElementById("teamChatTab")
      
  );
  //displays the Message component
}
function getProfilePic(player) {
  firebase.storage().refFromURL("gs://brackot-app.appspot.com/" + player + "/profile").getDownloadURL().then(function (url) {
    return String(url);
  }).catch((error) => {
    return "../media/BrackotLogo2.jpg";
  })
}
/***************************************************
* This area is where i create a bunch of react
* components. These are then placed into other react
* components and all render into the high level
* component your team card
*
****************************************************/
/*
class PlayerPopUp extends React.Component {
  render() {
    return (
      <div>
        
      </div>
    )
  }
}
*/
class TeamMessage extends React.Component {
  render(){
    return (
      <div>
        {   
          team.conversations.map(con =>
            <div className = {con.sentUID == firebase.auth().currentUser.uid ? 'userBubble' : 'foreignBubble'}>
              <p className="messageBlurb">{con.message}</p>                          
            </div>
          )    
        }
      </div>
    );
  }
}

class TeamOverviewTab extends React.Component {
    render() {
      return(
        <div>
          hi
        </div>
      )
    }
}
/*
class TeamMembersTab extends React.component {
    playerClicked(member) {
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
                <button onClick={this.playerClicked(member)}><p className="playerNameInList">{db.collections('users').doc(member).data().username}</p></button>
            </div>
          )}
          </div>
          
        </div>
      )
  }
}
*/
class TeamChatTab extends React.Component {
  //renders the team messages in the team chat tab
  render() {
    return(
      <div>
          <div>
            Team Chat:
          </div>
          <TeamMessage/>
          {/*renders the team message component in the team chat tab*/}
      </div>
        
    )
  }
}

class TeamTournamentsList extends React.Component{
  
  handleClick = (doc) => { 
    window.location = "tournament-info?tournamentId=" + doc.id;   //have to revisit when I figure out object structure
  }
  render() {
    return(
      <div>
        {team.tournaments.upcoming.map((doc) => (
        <div className="tournamentCard">
        {/*how the tournament card is structured comes from tournaments.js*/}
        <div className="tournamentCardBackground">
          <div className="tournamentCardContent">
              <picture className="tournamentWallpaper">
                <source srcSet={'../media/game_wallpapers/' + doc.game + '-cardWallpaper.webp'} type="image/webp"></source>
                <img className="tournamentWallpaper" src={'../media/game_wallpapers/' + doc.game + '-cardWallpaper.jpg'}/>
              </picture>
              <div className="tournamentCardText">
                <h6 className="tournamentCardTitle">{doc.name}</h6>
                <ul className="tournamentCardDetails">
                  <li className="tournamentDetailsList">
                    <i className="fa fa-gamepad tournamentCardIcon" aria-hidden="true"></i>
                    <div className="tournamentCardDetail">{doc.game}</div>
                  </li>
                  <li className="tournamentDetailsList">
                    <i className="fa fa-calendar tournamentCardIcon" aria-hidden="true"></i>
                    <div className="tournamentCardDetail">{doc.date}</div>
                  </li>
                  <li className="tournamentDetailsList">
                    <i className="fa fa-user tournamentCardIcon" aria-hidden="true"></i>
                    <div className="tournamentCardDetail">{doc.players.length}</div>
                  </li>
                </ul>
              </div>
              <div className="tournamentCardHostBar">
                <img className="tournamentCardHostPic" src={getProfilePic(doc.creator)}></img>
                <h6 className="tournamentCardHostName">{doc.creator}</h6>
              </div>
            </div>
          </div>
          </div>
          ))}
        </div>    
      )    
  }
}

class TeamTournamentTab extends React.Component {
    render() {
      return(
        <div>
          <div>
            Tournaments in Progress:
          </div>
          <TeamTournamentsList tournaments = {team.tournaments.current}/>
          <div>
            Upcoming Tournaments:
          </div>
          <TeamTournamentsList tournaments = {team.tournaments.upcoming}/>
          <div>
            Completed tournaments:
          </div>
          <TeamTournamentsList tournaments = {team.tournaments.complete}/>
        </div>
      )
    }
}
