var teamId;
const db = firebase.firestore();
const team = {
    'members' : [],
    'pendingMembers' : [],
    'tournaments': {
      'upcoming' : [],
      'current' : [],
      'complete' : []
    },
    'conversations' : [],
    'socials' : []
};
const teamsRef = db.collection("teams");

function personalizeElements() {
  
  var url = new URL(window.location.href);
  teamId = url.searchParams.get("teamId");
  ReactDOM.render(
    <TeamInfoPage/>,
    document.getElementById('teamInfoCard')
  )
  ReactDOM.render(
    <TeamInfoQuickCard/>,
    document.getElementById('teamInfoQuickContent')
  )
  
  
  
  
  /*
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

    */
    /*
    var facebook = firebase.firestore().collection('teams').doc(teamId).data().social.facebook;
    var twitter = firebase.firestore().collection('teams').doc(teamId).data().social.twitter;
    var instagram = firebase.firestore().collection('teams').doc(teamId).data().social.instagram;
    var youtube = firebase.firestore().collection('teams').doc(teamId).data().social.youtube;
    var reddit = firebase.firestore().collection('teams').doc(teamId).data().social.reddit;
    var twitch = firebase.firestore().collection('teams').doc(teamId).data().social.twitch;
    var discord = firebase.firestore().collection('teams').doc(teamId).data().social.discord;
    if(facebook != ""){ $('#teamInfoFacebook').removeClass("noDisplay"); $("#teamInfoFacebook").attr("href", facebook); }
    if(twitter != ""){ $('#teamInfoTwitter').removeClass("noDisplay"); $("#teamInfoTwitter").attr("href", twitter); }
    if(instagram != ""){ $('#teamInfoInstagram').removeClass("noDisplay"); $("#teamInfoInstagram").attr("href", instagram); }
    if(youtube != ""){ $('#teamInfoYoutube').removeClass("noDisplay"); $("#teamInfoYoutube").attr("href", youtube); }
    if(reddit != ""){ $('#teamInfoReddit').removeClass("noDisplay"); $("#teamInfoReddit").attr("href", reddit); }
    if(twitch != ""){ $('#teamInfoTwitch').removeClass("noDisplay"); $("#teamInfoTwitch").attr("href", twitch); }
    if(discord != ""){ $('#teamInfoDiscord').removeClass("noDisplay"); $("#teamInfoDiscord").attr("href", discord); }
    /*
    if (doc.data().games != undefined){
      $('#teamInfoGamesRow').removeClass("noDisplay");
      doc.data().games.forEach((game) => {
        gameFileName = (game.toLowerCase()).replace(/ /g, "").replace("-","").replace(".","").replace("'","");
        $("#teamInfoGameCarousel").append('<label id="teamInfo' + gameFileName + 'Label" class="teamInfoGamesLabel"><picture><source srcset="../media/game_images/' + gameFileName + '.webp" type="image/webp"><img class="teamInfoGamesImage" src="../media/game_images/' + gameFileName + '.jpg"></picture></label>');
      });
    }


    */
    
    }
    //document.getElementById("tournamentInfoWallpaper").className = "headerImage tournamentInfoWallpaper " + (doc.data().game.toLowerCase()).replace(/ /g, "").replace("-","").replace(".","") + "InfoWallpaper";
const updateMembers = () => {
    //sets up an event listener
    
    db.collection('teams').doc(teamId).onSnapshot(() => {
        team.members = []
        //clears the team members list
        teamsRef.doc(teamId).get().then((doc) => {
          if(doc.exists) {
            team.members = doc.data().teamMembers;
            //document.getElementById('teamInfoName').innerHTML = doc.data().name;
          }
        }
        )
        console.log(team.members)
        //replaces the team members list with the team members list from the database
        //re-renders the TeamMembersTab every time there is an update to the team member list
    })
}

const initTeamChat = () => {
  //calls the event listener function and passes the current UID
  getRealtimeTeamConversations(firebase.auth().currentUser.uid);
  
}
//updateMessage is the function that actually sends the message to firebase
const getPendingTeamMembers = () => {
  team.pendingMembers = [] 
  db.collection('teams').doc(teamId)
  //sets up an event listener for the team doc 
  .onSnapshot((doc) => {
    team.pendingMembers = doc.data().pendingMembers
  })
}



const renderTeamChat = () => {
  //keep these seperate for dynamic rendering
  ReactDOM.render(
      <TeamMessage/>,
      document.getElementById("teamMessageSections")
      
  );
  //displays the Message component
}
async function getProfilePic(player) {
  //takes in the player uid and uses that to get the profile pic from a URL
  await firebase.storage().refFromURL("gs://brackot-app.appspot.com/" + player + "/profile").getDownloadURL().then(function (url) {
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
class TeamMessages extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'messages' : []
    };
    this.getRealtimeTeamConversations();
  }
  getRealtimeTeamConversations = () => {
    //this function sets the event listener 
  
    db.collection('teams').doc(teamId).collection('chat')
    .orderBy('createdAt', 'asc')
    .onSnapshot((querySnapshot) => {
        querySnapshot.forEach(doc => {
          if(!this.state.messages.includes(doc.data()))
            this.setState({messages : [...this.state.messages, doc.data()] })
        });     
    })
  }
  render() {
    return (
        <div>
          {   
            this.state.messages.map(con =>
              <div className = {con.sentUID == firebase.auth().currentUser.uid ? 'userBubble' : 'foreignBubble'}>
                <p className="messageBlurb">{con.message}</p>                          
              </div>
            )    
          }
        </div>
    );
  }
}

class TeamMessageTab extends React.Component {
  updateTeamMessage = () => {
    db.collection('teams')
        .doc(teamId)
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

  submitTeamMessage = () => {
    const msgObj = {
        sentUID: firebase.auth().currentUser.uid,
        message
    }
    if(message !== ""){
        updateTeamMessage(msgObj).then(this.setState({'message' : ''}))
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      'message' : ''
    }
  }
  render(){
    return(
      <div id='teamChatTab' className = "teamChatTab">
        <div className ="chatArea">
          <div className ="chatHeader"></div>
          <TeamMessages/>
          <br/>
          <div className="chatControls ">
            <textarea value={this.state.message} onChange={(e) => setState({'message' : e.target.value})} placeholder="Write Message"/>
            <i id="sendChatIcon" className="fas fa-paper-plane sendChatIcon" onClick={() => this.submitTeamMessage()}></i>
          </div>
        </div>
      </div>
    )
  }
}
class ListOfPendingMembers extends React.Component {
  accept = (member) => {
    teamsRef.doc(teamId).update({
      teamMembers: firebase.firestore.FieldValue.arrayUnion(member),
      pendingMembers: firebase.firestore.FieldValue.arrayRemove(member)
    })
    //removes the uid of the user accepted from the pending members field in the database
    //then adds the uid of the user accepted to the team members field in the database
  }
  reject = (member) => {
    teamsRef.doc(teamId).update({
      pendingMembers: firebase.firestore.FieldValue.arrayRemove(member)
    })
    //removes the uid of the user rejected from the pending members field in the database 
  }
  render() {
    return (
    <div>
      {team.pendingMembers.map(member => 
      <div>
        <div>
          <img id = {`profilePic${member}`} src = {getProfilePic(member)}></img>
          <div>
            {db.collection("users").doc(member).name}
          </div>
        </div>
        <div>
          <button onClick = {() => this.accept(member)} className = "pendingMemberAcceptButton">Accept</button>
          <button onClick = {() => this.reject(member)} className = "PendingMemberRejectButtton">Recject</button>
        </div>
      </div>
      )}
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

class TeamTournamentsList extends React.Component{
  
  handleClick = (doc) => { 
    window.location = "tournament-info?tournamentId=" + doc.id;   
    //this sends you to the tournament that you click on 
    //doesnt work yet
  }
  render() {
    return(
      <div className = "tournamentRows">
        {this.props.tournaments.map((doc) => (
      <div className="tournamentCard">
        {/*how the tournament card is structured comes from tournaments.js*/}
        <div className="tournamentCardBackground">
          <div className="tournamentCardContent">
              <picture className="tournamentWallpaper">
                <source srcSet={'../media/game_wallpapers/' + `${doc.game}` + '-cardWallpaper.webp'} type="image/webp"></source>
                <img className="tournamentWallpaper" src={'../media/game_wallpapers/' + `${doc.game}` + '-cardWallpaper.jpg'}/>
              </picture>
              <div className="tournamentCardText">
                <h6 className="tournamentCardTitle">{String(doc.name)}</h6>
                <ul className="tournamentCardDetails">
                  <li className="tournamentDetailsList">
                    <i className="fa fa-gamepad tournamentCardIcon" aria-hidden="true"></i>
                    <div className="tournamentCardDetail">{String(doc.game)}</div>
                  </li>
                  <li className="tournamentDetailsList">
                    <i className="fa fa-calendar tournamentCardIcon" aria-hidden="true"></i>
                    <div className="tournamentCardDetail">{String(doc.date)}</div>
                  </li>
                  <li className="tournamentDetailsList">
                    <i className="fa fa-user tournamentCardIcon" aria-hidden="true"></i>
                    <div className="tournamentCardDetail">{String(doc.players.length)}</div>
                  </li>
                </ul>
              </div>
              <div className="tournamentCardHostBar">
                <img className="tournamentCardHostPic" src={String(getProfilePic(doc.creator))}></img>
                <h6 className="tournamentCardHostName">
                  {String(db.collection("users").doc(doc.creator).get().then((doc) => {
                    if(doc.exists) {
                      return String(doc.data().name)
                    }
                  }))}
                </h6>
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
    updateTeamTournaments = () => {
      //sets up an event listener for the tournaments a team is in 
      db.collection("tournaments")
      .where("players", "array-contains", teamId)
      .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if(!tournaments.includes(doc.data())) {
              this.setState({
                'tournaments':{...doc.data()}
              })
            }
          })
      })
    }
    
    constructor(props) {
      super(props)
      this.updateTeamTournaments()
    }
    render() {
      return(
          <div className = "teamTournamentsList">
            <div className = "teamTournamentsHeader">
              Tournaments in Progress:
            </div>
            <TeamTournamentsList tournaments = {currentTournaments}/>
            <div className = "teamTournamentsHeader">
              Upcoming Tournaments:
            </div>
            <TeamTournamentsList tournaments = {upcomingTournaments}/>
            <div className = "teamTournamentsHeader">
              Completed tournaments:
            </div>
            <TeamTournamentsList tournaments = {completeTournaments}/>
          </div>
      )
      }
}
class TeamOverviewTab extends React.Component {
  teamListener = () => {
    db.collection('teams').doc(teamId).onSnapshot((doc) => {
      if(doc.data().teamMembers.includes(firebase.auth().currentUser.uid)) {
        this.setState({'buttonText' : 'Leave Team'})
        this.setState({'buttonOnClick' : () => {
          teamsRef.doc(teamId).update({
            teamMembers: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
          })
        }})
      } else if (doc.data().pendingMembers.includes(firebase.auth().currentUser.uid)) {
        this.setState({'buttonText' : 'requested'})
        this.setState({'buttonOnClick' : () => {}})
      } else {
        this.setState({'buttonText' : 'Join Team'})
        if(doc.data().privacy == "private"){
          this.setState({'buttonOnClick' : () => {
            teamsRef.doc(teamId).update({
              teamPendingMembers: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
            });
          }})
        } else {
          this.setState({'buttonOnClick' : () => {
            teamsRef.doc(teamId).update({
              teamMembers: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
            });
          }})
        }
      }
      this.setState({'teamDescription' : doc.data().description});
      this.setState({'teamName' : doc.data().teamName});
    })
  }
  constructor(props) {
    super(props)
    this.state = {}
    this.teamListener();
  }
  render() {
    return (
      <div>
        <h2>{this.state.teamName}</h2>
        <h6>{this.state.teamDescription}</h6>
        <button onClick = {this.state.buttonOnClick}>{this.state.buttonText}</button>
      </div>
    )
  }
}

class TeamInfoQuickCard extends React.Component {
  constructor(props) {
    super(props) 
    teamsRef.doc(teamId).get().then((doc) => {
      try {
        this.state = {
          'members' : doc.data().teamMembers.length,
          'privacy' : doc.data().privacy
        } 
      } catch(err) {
        this.state = {
          'members' : 'none',
          'privacy' : 'public'
        }
        console.log(err)
      }
      
    })
  }
  render() {
    return( 
      <div>
        <div class="teamSocials" id="teamInfoSocials">
          <a class="teamSocial facebookIcon noDisplay" id="teamInfoFacebook"><i class="fab fa-facebook-square" aria-hidden="true"></i></a>
          <a class="teamSocial twitterIcon noDisplay" id="teamInfoTwitter"><i class="fab fa-twitter" aria-hidden="true"></i></a>
          <a class="teamSocial instagramIcon noDisplay" id="teamInfoInstagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
          <a class="teamSocial youtubeIcon noDisplay" id="teamInfoYoutube"><i class="fab fa-youtube" aria-hidden="true"></i></a>
          <a class="teamSocial redditIcon noDisplay" id="teamInfoReddit"><i class="fab fa-reddit-alien" aria-hidden="true"></i></a>
          <a class="teamSocial twitchIcon noDisplay" id="teamInfoTwitch"><i class="fab fa-twitch" aria-hidden="true"></i></a>
          <a class="teamSocial discordIcon noDisplay" id="teamInfoDiscord"><i class="fab fa-discord" aria-hidden="true"></i></a>
        </div>
        <div class="teamInfoDetails">
          <div class="iconAndNum teamInfoIconAndNum">
            <i class="fas fa-user teamInfoIcon"></i>
            <h2 id="teamInfoMembers" class="teamInfoStat"></h2>
          </div>
          <p class="statDescription">{`Members ${this.state.members}`}</p>
        </div>
        <div class="teamInfoDetails">
          <div class="iconAndNum teamInfoIconAndNum">
            <i id="teamInfoPublicIcon" class="fas fa-users teamInfoIcon noDisplay"></i>
            <i id="teamInfoPrivateIcon" class="fas fa-lock teamInfoIcon noDisplay"></i>
            <h2 id="teamInfoPrivacy" class="teamInfoStat"></h2>
          </div>
          <p class="statDescription">Privacy</p>
                  
        </div>
      </div>
    )
  }
}

class TeamInfoMainCard extends React.Component {
  constructor(props) {
    super(props)
    db.collection('teams').doc(teamId).get().then((doc) => {
      if(doc.data().teamAdmins.includes(firebase.auth().currentUser.uid)) {
        this.state = {
          'pendingTabStyle' : 'block'
        }
      } else {
        this.state = {
          'pendingTabStle' : 'none'
        }
      }
    })
    this.state = {
      'tab' : <TeamOverviewTab/>
    }
  }
  render() {
    return(
      <div>
        <ul className="quickNavbar">
          <li id="teamOverviewNavbar" className="quickNavbarItem quickNavbarItemSelected">
            <a className="quickNavbarItemLink" onClick= {() => this.setState({'tab': <TeamOverviewTab/>})}>
              <p className="quickNavbarItemText">Overview</p>
            </a>
          </li>
          <li id="teamChatNavbar" className="quickNavbarItem">
            <a className="quickNavbarItemLink" onClick= {() => this.setState({'tab': <TeamMessageTab/>})}>
              <p className="quickNavbarItemText">Chat</p>
            </a>
          </li>
          <li id="teamTournamentsNavbar" className="quickNavbarItem">
            <a className="quickNavbarItemLink" onClick= {() => this.setState({'tab': <TeamTournamentTab/>})}>
              <p className="quickNavbarItemText">Tournaments</p>
            </a>
          </li>
          <li id="teamPendingNavbar" className="quickNavbarItem" style =  {{display: this.state.pendingTabStyle}}>
            <a className="quickNavbarItemLink" onClick= {() => this.setState({'tab': <ListOfPendingMembers/>})}>
              <p className="quickNavbarItemText">Pending Requests</p>
            </a>
          </li>
        </ul>
        <div>{this.state.tab}</div>
      </div>
    )
  }
}
class TeamInfoPage extends React.Component { 
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div>
        <TeamInfoQuickCard/>
        <TeamInfoMainCard/>
      </div>
      
    )
  }
} 