var teamId;
const db = firebase.firestore();
const teamsRef = db.collection("teams");

function personalizeElements() {
  
  var url = new URL(window.location.href);
  teamId = url.searchParams.get("teamId");
  ReactDOM.render(
    <TeamInfoPage/>,
    document.getElementById('teamInfoMainPage')
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
        $("#teamInfoGameCarousel").append('<label id="teamInfo' + gameFileName + 'Label" className="teamInfoGamesLabel"><picture><source srcset="../media/game_images/' + gameFileName + '.webp" type="image/webp"><img className="teamInfoGamesImage" src="../media/game_images/' + gameFileName + '.jpg"></picture></label>');
      });
    }


    */
    
}


//updateMessage is the function that actually sends the message to firebase
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
* component your team info page
*
****************************************************/
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
      this.setState({'messages': []})
        querySnapshot.forEach(doc => {
        
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
  //the tab of the main team card that has all of the team chat components in them
  updateTeamMessage = (msgObj) => {
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

  submitTeamMessage = (message) => {
    const msgObj = {
        sentUID: firebase.auth().currentUser.uid,
        message
        //an object with all the data about a message
    }
    if(message !== ""){
        this.updateTeamMessage(msgObj).then(document.getElementById('teamChatText').value = '')
        //calls updateTeamMessage with the message object then resets the teamChat text box to empty
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      //sets default state of the message to blank
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
            <textarea id = 'teamChatText' placeholder="Write Message"/>
            <i id="sendChatIcon" className="fas fa-paper-plane sendChatIcon" onClick={() => this.submitTeamMessage(document.getElementById("teamChatText").value)}></i>
          </div>
        </div>
      </div>
    )
  }
}
class ListOfPendingMembers extends React.Component {
  //a tab with a list of pending members that a tema admin can reject or accept 
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
  constructor(props) {
    super(props)
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
                      //gets the name of the tournaments creator
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
    componentDidMount() {
      db.collection("tournaments")
      .where("players", "array-contains", teamId)
      .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if(!this.state.tournaments.includes(doc.data())) {
              this.state.tournaments.push(doc.data())
            }
          })
          this.setState({'isDataFetched': true})
      })
    }
    
    constructor(props) {
      super(props)
      this.state = {
        'tournaments': [],
        'isDataFetched' :false
      }
    }
    render() {
      //waits for the component did mount function to run before returning the actual component class
      if(!this.state.isDataFetched) return null;
      return(
          <div className = "teamTournamentsList">
            <div className = "teamTournamentsHeader">
              Tournaments in Progress:
            </div>
            <TeamTournamentsList tournaments = {this.state.tournaments}/>
            <div className = "teamTournamentsHeader">
              Upcoming Tournaments:
            </div>
            <TeamTournamentsList tournaments = {this.state.tournaments}/>
            <div className = "teamTournamentsHeader">
              Completed tournaments:
            </div>
            <TeamTournamentsList tournaments = {this.state.tournaments}/>
          </div>
      )
      }
}
class TeamOverviewTab extends React.Component {
  //the main overview of the team
  teamListener = () => {
    //creates an event listener for data on the team
    db.collection('teams').doc(teamId).onSnapshot((doc) => {
      if(doc.data().teamMembers.includes(firebase.auth().currentUser.uid)) {
        //if the user is in the team if provides a button which lets the user leave the team they are in 
        this.setState({'buttonText' : 'Leave Team'})
        this.setState({'buttonOnClick' : () => {
          teamsRef.doc(teamId).update({
            teamMembers: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
          })
        }})
      } else if (doc.data().pendingMembers.includes(firebase.auth().currentUser.uid)) {
        this.setState({'buttonText' : 'requested'})
        this.setState({'buttonOnClick' : () => {}})
        //if the user has already requested to be in the team the button will do nothing and the text will read requested. 
        //different stylings for different button messages will come later
      } else {
        this.setState({'buttonText' : 'Join Team'})
        if(doc.data().privacy == "private"){
          this.setState({'buttonOnClick' : () => {
            teamsRef.doc(teamId).update({
              teamPendingMembers: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
              //adds the current user to the list of pending team members if the team is private and the user wishes to join the team
            });
          }})
        } else {
          this.setState({'buttonOnClick' : () => {
            teamsRef.doc(teamId).update({
              teamMembers: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
              //if the team is public it allows the user to automatically join the team 
            });
          }})
        }
      }
      this.setState({'teamDescription' : doc.data().description});
      //gets the team description data and adds it to the state of the compoent so it automatically updates when firebase does
      this.setState({'teamName' : doc.data().name});
      //gets the team name data and adds it to the state of the compoent so it automatically updates when firebase does
    })
  }
  constructor(props) {
    super(props)
    this.state = {}
    //fast enough function it doesnt need to be safe guarded with a component did mount
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
  render() {
    //container with stylings for the team Info quick card
    // no actual content other than tbhe profile pic
    return( 
      <div id="teamInfoQuickCard" className="teamInfoQuickCard">
        <div className="wideCardBackground tournamentInfoCardBackground">
          <div className="singleColumn">
            <img id="teamInfoProfilePic" className="teamInfoProfilePic" />
              <div id = "teamNameQuickCard" className = "teamNameQuickCard"></div>
              <div className="teamInfoQuickContent" id='teamInfoQuickContent'>
                <TeamInfoQuickContent/>
              </div>
            </div>
        </div>
      </div>
    )
  }
}
class TeamInfoQuickContent extends React.Component {
  constructor(props) {
    super(props) 
    //sets the empty state and initializes isDataFetched to false so that the component doesnt load until all the other necesary data is brouought
    this.state = {
      'members': [],
      'privacy' : [],
      'isDataFetched': false
    }
    
  }
  //gets the list of team members
  //makes sure that the component has all of the data before it renders in
  // this stops the component from rendering blank or an error resulting from an undeclared variable being called
  componentDidMount() {
    teamsRef.doc(teamId).onSnapshot((doc) => {
      this.setState({
        'members' : doc.data().teamMembers,
        'privacy' : doc.data().privacy,
        'isDataFetched': true
      })
    })
  }
  render() {
    if(!this.state.isDataFetched){return null;}
    return (
      <div>
        <div className="teamSocials" id="teamInfoSocials">
          <a className="teamSocial facebookIcon noDisplay" id="teamInfoFacebook"><i className="fab fa-facebook-square" aria-hidden="true"></i></a>
          <a className="teamSocial twitterIcon noDisplay" id="teamInfoTwitter"><i className="fab fa-twitter" aria-hidden="true"></i></a>
          <a className="teamSocial instagramIcon noDisplay" id="teamInfoInstagram"><i className="fab fa-instagram" aria-hidden="true"></i></a>
          <a className="teamSocial youtubeIcon noDisplay" id="teamInfoYoutube"><i className="fab fa-youtube" aria-hidden="true"></i></a>
          <a className="teamSocial redditIcon noDisplay" id="teamInfoReddit"><i className="fab fa-reddit-alien" aria-hidden="true"></i></a>
          <a className="teamSocial twitchIcon noDisplay" id="teamInfoTwitch"><i className="fab fa-twitch" aria-hidden="true"></i></a>
          <a className="teamSocial discordIcon noDisplay" id="teamInfoDiscord"><i className="fab fa-discord" aria-hidden="true"></i></a>
        </div>
        <div className="teamInfoDetails">
          <div className="iconAndNum teamInfoIconAndNum">
            <i className="fas fa-user teamInfoIcon"></i>
            <h2 id="teamInfoMembers" className="teamInfoStat"></h2>
          </div>
          <p className="statDescription">{`Members: ${this.state.members.length}`}</p>
        </div>
        <div className="teamInfoDetails">
          <div className="iconAndNum teamInfoIconAndNum">
            <i id="teamInfoPublicIcon" className="fas fa-users teamInfoIcon noDisplay"></i>
            <i id="teamInfoPrivateIcon" className="fas fa-lock teamInfoIcon noDisplay"></i>
            <h2 id="teamInfoPrivacy" className="teamInfoStat"></h2>
          </div>
          <p className="statDescription">Privacy:  <i className={this.state.privacy === 'public' ? 'fas fa-lock-open' : 'fas fa-lock'}></i></p>
                  
        </div>
      </div>
    )
  }
}
class TeamInfoMainCard extends React.Component {
  constructor(props) {
    super(props)
    this.getTeamStatus()
    // this function runs quick enough that there doesnt need to be a failsafe like some of the other components with firebase data
    this.state = {
      //changes tab by setting the state equal to a jsx element
      'tab' : <TeamOverviewTab/>
    }
  }
  getTeamStatus() {
    db.collection('teams').doc(teamId).onSnapshot((doc) => {
      if(doc.data().teamAdmins.includes(firebase.auth().currentUser.uid)) {
        this.state = {
          //checks to see if the current user is a team admin
          //if the user is a team admin the pending members page loads
          'teamAdmin' : true
        }
      } else {
        this.state = {
          'teamAdmin' : false
        }
        console.log(this.state.teamAdmin)
      }
    })
  }
  render() {
    return(
      <div className = 'teamInfoMainCard'>
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
          <li id="teamPendingNavbar" className="quickNavbarItem" style =  {{display: this.state.teamAdmin ? "block" : "none"}}>
            <a className="quickNavbarItemLink" onClick= {() => this.setState({'tab': <ListOfPendingMembers/>})}>
              <p className="quickNavbarItemText">Pending Requests</p>
            </a>
          </li>
        </ul>
        <div className = 'teamInfoPageContainer teamInfoMainInfo'>{this.state.tab}</div>
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
      //a flexbox containing the team Info card and Team info Quick Card
      <div className = 'teamInfoPageContainer'>
        <TeamInfoQuickCard/>
        <TeamInfoMainCard/>
      </div>
    )
  }
} 















