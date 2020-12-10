var teamId;
const db = firebase.firestore();
const teamsRef = db.collection("teams");

function personalizeElements() {
  var url = new URL(window.location.href);
  teamId = url.searchParams.get("teamId");
  ReactDOM.render(
    <TeamInfoPage />,
    document.getElementById("teamInfoMainPage")
  );

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
  await firebase
    .storage()
    .refFromURL("gs://brackot-app.appspot.com/" + player + "/profile")
    .getDownloadURL()
    .then(function (url) {
      return String(url);
    })
    .catch((error) => {
      return "../media/BrackotLogo2.jpg";
    });
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
    super(props);
    this.state = {
      messages: [],
    };
    this.getRealtimeTeamConversations();
  }
  getRealtimeTeamConversations = () => {
    //this function sets the event listener

    db.collection("teams")
      .doc(teamId)
      .collection("chat")
      .orderBy("createdAt", "asc")
      .onSnapshot((querySnapshot) => {
        this.setState({ messages: [] });
        querySnapshot.forEach((doc) => {
          this.setState({ messages: [...this.state.messages, doc.data()] });
        });
      });
  };
  render() {
    return (
      <div>
        {this.state.messages.map((con) => (
          <div
            className={
              con.sentUID == firebase.auth().currentUser.uid
                ? "bubble userBubble"
                : "bubble foreignBubble"
            }
          >
            <p className="messageBlurb">{con.message}</p>
          </div>
        ))}
      </div>
    );
  }
}

class TeamMessageTab extends React.Component {
  //the tab of the main team card that has all of the team chat components in them
  updateTeamMessage = (msgObj) => {
    db.collection("teams")
      .doc(teamId)
      .collection("chat")
      .add({
        ...msgObj,
        createdAt: new Date(),
      })
      //uses the msgObj along with the date for ordering messages
      .then(
        console.log(msgObj)
        //for testing purposes only
      );
  };

  submitTeamMessage = (message) => {
    const msgObj = {
      sentUID: firebase.auth().currentUser.uid,
      message,
      //an object with all the data about a message
    };
    if (message !== "") {
      this.updateTeamMessage(msgObj).then(
        (document.getElementById("teamChatText").value = "")
      );
      //calls updateTeamMessage with the message object then resets the teamChat text box to empty
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      //sets default state of the message to blank
      message: "",
    };
  }
  render() {
    return (
      <div id="teamChatTab" className="teamChatTab" style={{ width: "100%" }}>
        <div className="chatArea" style={{ padding: "30px 30px 0" }}>
          <div className="chatHeader"></div>
          <TeamMessages />
          <br />
          <div className="chatControls ">
            <input
              id="teamChatText"
              placeholder="Write Message"
              className="chatInput"
            />
            <i
              id="sendChatIcon"
              className="fas fa-paper-plane sendChatIcon"
              onClick={() =>
                this.submitTeamMessage(
                  document.getElementById("teamChatText").value
                )
              }
            ></i>
          </div>
        </div>
      </div>
    );
  }
}
class ListOfPendingMembers extends React.Component {
  //a tab with a list of pending members that a tema admin can reject or accept
  accept = (member) => {
    teamsRef.doc(teamId).update({
      teamMembers: firebase.firestore.FieldValue.arrayUnion(member),
      pendingMembers: firebase.firestore.FieldValue.arrayRemove(member),
    });
    //removes the uid of the user accepted from the pending members field in the database
    //then adds the uid of the user accepted to the team members field in the database
  };
  reject = (member) => {
    teamsRef.doc(teamId).update({
      pendingMembers: firebase.firestore.FieldValue.arrayRemove(member),
    });
    //removes the uid of the user rejected from the pending members field in the database
  };
  render() {
    return (
      <div>
        {team.pendingMembers.map((member) => (
          <div>
            <div>
              <img id={`profilePic${member}`} src={getProfilePic(member)}></img>
              <div>{db.collection("users").doc(member).name}</div>
            </div>
            <div>
              <button
                onClick={() => this.accept(member)}
                className="pendingMemberAcceptButton"
              >
                Accept
              </button>
              <button
                onClick={() => this.reject(member)}
                className="PendingMemberRejectButtton"
              >
                Recject
              </button>
            </div>
          </div>
        ))}
      </div>
    );
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

class TeamTournamentCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creatorPic: "../media/BrackotLogo2.jpg",
    };
    this.getCreatorPic();
  }
  getCreatorPic() {
    const player = this.props.tournamentData.creator;
    firebase
      .storage()
      .refFromURL("gs://brackot-app.appspot.com/" + player + "/profile")
      .getDownloadURL()
      .then((url) => {
        this.setState({ creatorPic: String(url) });
      })
      .catch(() => {
        this.setState({ creatorPic: "../media/BrackotLogo2.jpg" });
      });
  }

  render() {
    const { tournamentData } = this.props;
    const { creatorPic } = this.state;
    return (
      <div className="tournamentCard">
        {/*how the tournament card is structured comes from tournaments.js*/}
        <div className="tournamentCardBackground">
          <div className="tournamentCardContent">
            <picture className="tournamentWallpaper">
              <source
                srcSet={`/media/game_wallpapers/${tournamentData.game
                  .toLowerCase()
                  .replace(/ /g, "")}-cardWallpaper.webp`}
                type="image/webp"
              ></source>
              <img
                className="tournamentWallpaper"
                src={`/media/game_wallpapers/${tournamentData.game
                  .toLowerCase()
                  .replace(/ /g, "")}-cardWallpaper.jpg`}
              />
            </picture>
            <div className="tournamentCardText">
              <h6 className="tournamentCardTitle">
                {String(tournamentData.name)}
              </h6>
              <ul className="tournamentCardDetails">
                <li className="tournamentDetailsList">
                  <i
                    className="fa fa-gamepad tournamentCardIcon"
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">
                    {String(tournamentData.game)}
                  </div>
                </li>
                <li className="tournamentDetailsList">
                  <i
                    className="fa fa-calendar tournamentCardIcon"
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">
                    {String(tournamentData.date)}
                  </div>
                </li>
                <li className="tournamentDetailsList">
                  <i
                    className="fa fa-user tournamentCardIcon"
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">
                    {String(tournamentData.players.length)}
                  </div>
                </li>
              </ul>
            </div>
            <div className="tournamentCardHostBar">
              <img
                className="tournamentCardHostPic"
                src={String(creatorPic)}
              ></img>
              <h6 className="tournamentCardHostName">
                {String(tournamentData.creatorName)}
              </h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class TeamTournamentsList extends React.Component {
  handleClick = (doc) => {
    window.location = "tournament-info?tournamentId=" + doc.id;
    //this sends you to the tournament that you click on
    //doesnt work yet
  };
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="tournamentRows">
        {this.props.tournaments.map((doc, id) => (
          <TeamTournamentCard tournamentData={doc} key={id} />
        ))}
      </div>
    );
  }
}

class TeamTournamentTab extends React.Component {
  componentDidMount() {
    db.collection("tournaments")
      .where("players", "array-contains", teamId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (!this.state.tournaments.includes(doc.data())) {
            this.state.tournaments.push(doc.data());
          }
        });
        this.setState({ isDataFetched: true });
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      tournaments: [],
      isDataFetched: false,
    };
  }
  render() {
    //waits for the component did mount function to run before returning the actual component class
    if (!this.state.isDataFetched) return null;
    return (
      <div className="teamTournamentsTab">
        <div className="teamTournamentsList" style={{ width: "100%" }}>
          <div className="teamTournamentsHeader">Tournaments in Progress:</div>
          <TeamTournamentsList tournaments={this.state.tournaments} />
          <div className="teamTournamentsHeader">Upcoming Tournaments:</div>
          <TeamTournamentsList tournaments={this.state.tournaments} />
          <div className="teamTournamentsHeader">Completed tournaments:</div>
          <TeamTournamentsList tournaments={this.state.tournaments} />
        </div>
      </div>
    );
  }
}
class TeamOverviewTab extends React.Component {
  //the main overview of the team
  teamListener() {
    //creates an event listener for data on the team
    db.collection("teams")
      .doc(teamId)
      .onSnapshot((doc) => {
        const { description, name, games } = doc.data();
        this.setState({ teamDescription: description });
        this.setState({ teamName: name });
        this.setState({ games: games });

        if (doc.data().teamMembers.includes(firebase.auth().currentUser.uid)) {
          //if the user is in the team if provides a button which lets the user leave the team they are in
          this.setState({ buttonText: "Leave Team" });
          this.setState({
            buttonOnClick: () => {
              teamsRef.doc(teamId).update({
                teamMembers: firebase.firestore.FieldValue.arrayRemove(
                  firebase.auth().currentUser.uid
                ),
              });
            },
          });
        } else if (
          doc.data().pendingMembers.includes(firebase.auth().currentUser.uid)
        ) {
          this.setState({ buttonText: "requested" });
          this.setState({ buttonOnClick: () => {} });
          //if the user has already requested to be in the team the button will do nothing and the text will read requested.
          //different stylings for different button messages will come later
        } else {
          this.setState({ buttonText: "Join Team" });
          if (doc.data().privacy == "private") {
            this.setState({
              buttonOnClick: () => {
                teamsRef.doc(teamId).update({
                  teamPendingMembers: firebase.firestore.FieldValue.arrayUnion(
                    firebase.auth().currentUser.uid
                  ),
                  //adds the current user to the list of pending team members if the team is private and the user wishes to join the team
                });
              },
            });
          } else {
            this.setState({
              buttonOnClick: () => {
                teamsRef.doc(teamId).update({
                  teamMembers: firebase.firestore.FieldValue.arrayUnion(
                    firebase.auth().currentUser.uid
                  ),
                  //if the team is public it allows the user to automatically join the team
                });
              },
            });
          }
        }
      });
  }
  getGameFileName(gameName) {
    const gameFileName = gameName
      .toLowerCase()
      .replace(/ /g, "")
      .replace("-", "")
      .replace(".", "")
      .replace("'", "");
    return gameFileName;
  }
  constructor(props) {
    super(props);
    this.state = {
      teamName: "",
      teamDescription: "",
      buttonOnClick: () => {},
      buttonText: "Join Team",
    };
    this.teamListener();
  }
  render() {
    const {
      teamName,
      teamDescription,
      games,
      buttonOnClick,
      buttonText,
    } = this.state;
    return (
      <div className="wideCardBackground tournamentInfoCardBackground">
        <div id="teamInfoCardContent" className="wideCardContent">
          <h6 className="teamInfoSubheader">Team</h6>
          <h2 className="teamInfoName" id="teamInfoName">
            {teamName}
          </h2>
          <div className="tournamentInfoRow">
            <h6 className="teamInfoSubheader">Description</h6>
            <p id="teamInfoDescription" className="tournamentInfoDetail font15">
              {teamDescription}
            </p>
          </div>
          {games &&
            games.map((gameType, index) => (
              <div
                id="teamInfoGamesRow"
                className="tournamentInfoRow"
                key={index}
              >
                <h6 className="teamInfoSubheader">Games</h6>
                <p
                  id="teamInfoGames"
                  className="tournamentInfoDetail font15"
                ></p>
                <div id="teamInfoGameCarousel" className="teamInfoGameCarousel">
                  <label
                    id="teamInfominecraftLabel"
                    className="teamInfoGamesLabel"
                  >
                    <picture>
                      <source
                        srcSet={`../media/game_images/${this.getGameFileName(
                          gameType
                        )}.webp`}
                        type="image/webp"
                      />
                      <img
                        className="teamInfoGamesImage"
                        src={`../media/game_images/${this.getGameFileName(
                          gameType
                        )}.jpg`}
                      />
                    </picture>
                  </label>
                </div>
              </div>
            ))}
        </div>
        <button
          className="tournamentCardButton tournamentCardButtonGeneric"
          id="teamSignUpButton"
          onClick={this.state.buttonOnClick}
        >
          {buttonText}
        </button>
      </div>
    );
  }
}

class TeamInfoQuickCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { teamProfilePic: "" };
  }

  componentDidMount() {
    firebase
      .storage()
      .refFromURL("gs://brackot-teams-storage/" + teamId + "/profile")
      .getDownloadURL()
      .then((url) => {
        this.setState({ teamProfilePic: url });
      })
      .catch(() => {
        this.setState({ teamProfilePic: "../media/BrackotLogo2.jpg" });
      });
  }

  render() {
    //container with stylings for the team Info quick card
    // no actual content other than tbhe profile pic
    const { teamProfilePic } = this.state;
    return (
      <div id="teamInfoQuickCard" className="teamInfoQuickCard">
        <div className="wideCardBackground tournamentInfoCardBackground">
          <div className="singleColumn">
            {teamProfilePic && (
              <img
                id="teamInfoProfilePic"
                className="teamInfoProfilePic"
                src={teamProfilePic}
              />
            )}
            <div id="teamNameQuickCard" className="teamNameQuickCard"></div>
            <div className="teamInfoQuickContent" id="teamInfoQuickContent">
              <TeamInfoQuickContent />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
class TeamInfoQuickContent extends React.Component {
  constructor(props) {
    super(props);
    //sets the empty state and initializes isDataFetched to false so that the component doesnt load until all the other necesary data is brouought
    this.state = {
      members: [],
      privacy: [],
      isDataFetched: false,
      social: {},
    };
  }
  //gets the list of team members
  //makes sure that the component has all of the data before it renders in
  // this stops the component from rendering blank or an error resulting from an undeclared variable being called
  componentDidMount() {
    teamsRef.doc(teamId).onSnapshot((doc) => {
      const docData = doc.data();
      this.setState({
        members: docData.teamMembers,
        privacy: docData.privacy,
        isDataFetched: true,
        social: docData.social,
      });
    });
  }
  render() {
    const { social } = this.state;
    if (!this.state.isDataFetched) {
      return null;
    }
    return (
      <div>
        <div className="teamSocials" id="teamInfoSocials">
          {social.facebook && (
            <a
              className="teamSocial facebookIcon noDisplay"
              id="teamInfoFacebook"
            >
              <i className="fab fa-facebook-square" aria-hidden="true"></i>
            </a>
          )}
          {social.twitter && (
            <a
              className="teamSocial twitterIcon noDisplay"
              id="teamInfoTwitter"
            >
              <i className="fab fa-twitter" aria-hidden="true"></i>
            </a>
          )}
          {social.instagram && (
            <a
              className="teamSocial instagramIcon noDisplay"
              id="teamInfoInstagram"
            >
              <i className="fab fa-instagram" aria-hidden="true"></i>
            </a>
          )}
          {social.youtube && (
            <a
              className="teamSocial youtubeIcon noDisplay"
              id="teamInfoYoutube"
            >
              <i className="fab fa-youtube" aria-hidden="true"></i>
            </a>
          )}
          {social.reddit && (
            <a className="teamSocial redditIcon noDisplay" id="teamInfoReddit">
              <i className="fab fa-reddit-alien" aria-hidden="true"></i>
            </a>
          )}
          {social.twitch && (
            <a className="teamSocial twitchIcon noDisplay" id="teamInfoTwitch">
              <i className="fab fa-twitch" aria-hidden="true"></i>
            </a>
          )}
          {social.discord && (
            <a
              className="teamSocial discordIcon noDisplay"
              id="teamInfoDiscord"
            >
              <i className="fab fa-discord" aria-hidden="true"></i>
            </a>
          )}
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
            <i
              id="teamInfoPublicIcon"
              className="fas fa-users teamInfoIcon noDisplay"
            ></i>
            <i
              id="teamInfoPrivateIcon"
              className="fas fa-lock teamInfoIcon noDisplay"
            ></i>
            <h2 id="teamInfoPrivacy" className="teamInfoStat"></h2>
          </div>
          <p className="statDescription">
            Privacy:{" "}
            <i
              className={
                this.state.privacy === "public"
                  ? "fas fa-lock-open"
                  : "fas fa-lock"
              }
            ></i>
          </p>
        </div>
      </div>
    );
  }
}
class TeamInfoMainCard extends React.Component {
  constructor(props) {
    super(props);
    this.getTeamStatus();
    // this function runs quick enough that there doesnt need to be a failsafe like some of the other components with firebase data
    this.state = {
      //changes tab by setting the state equal to a jsx element
      tab: <TeamOverviewTab />,
      tabName: "overview",
    };
  }
  getTeamStatus() {
    db.collection("teams")
      .doc(teamId)
      .onSnapshot((doc) => {
        if (doc.data().teamAdmins.includes(firebase.auth().currentUser.uid)) {
          this.state = {
            //checks to see if the current user is a team admin
            //if the user is a team admin the pending members page loads
            teamAdmin: true,
          };
        } else {
          this.state = {
            teamAdmin: false,
          };
          console.log(this.state.teamAdmin);
        }
      });
  }
  render() {
    const { tabName } = this.state;
    return (
      <div className="teamInfoMainCard">
        <ul className="quickNavbar">
          <li
            id="teamOverviewNavbar"
            className={`quickNavbarItem ${
              tabName === "overview" ? "quickNavbarItemSelected" : ""
            }`}
          >
            <a
              className="quickNavbarItemLink"
              onClick={() =>
                this.setState({ tab: <TeamOverviewTab />, tabName: "overview" })
              }
            >
              <p className="quickNavbarItemText">Overview</p>
            </a>
          </li>
          <li
            id="teamChatNavbar"
            className={`quickNavbarItem ${
              tabName === "message" ? "quickNavbarItemSelected" : ""
            }`}
          >
            <a
              className="quickNavbarItemLink"
              onClick={() =>
                this.setState({ tab: <TeamMessageTab />, tabName: "message" })
              }
            >
              <p className="quickNavbarItemText">Chat</p>
            </a>
          </li>
          <li
            id="teamTournamentsNavbar"
            className={`quickNavbarItem ${
              tabName === "tournament" ? "quickNavbarItemSelected" : ""
            }`}
          >
            <a
              className="quickNavbarItemLink"
              onClick={() =>
                this.setState({
                  tab: <TeamTournamentTab />,
                  tabName: "tournament",
                })
              }
            >
              <p className="quickNavbarItemText">Tournaments</p>
            </a>
          </li>
          <li
            id="teamPendingNavbar"
            className={`quickNavbarItem ${
              tabName === "pending" ? "quickNavbarItemSelected" : ""
            }`}
            style={{ display: this.state.teamAdmin ? "block" : "none" }}
          >
            <a
              className="quickNavbarItemLink"
              onClick={() =>
                this.setState({
                  tab: <ListOfPendingMembers />,
                  tabName: "pending",
                })
              }
            >
              <p className="quickNavbarItemText">Pending Requests</p>
            </a>
          </li>
        </ul>
        <div className="teamInfoPageContainer teamInfoMainInfo">
          {this.state.tab}
        </div>
      </div>
    );
  }
}
class TeamInfoPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      //a flexbox containing the team Info card and Team info Quick Card
      <div className="teamInfoPageContainer">
        <TeamInfoQuickCard />
        <TeamInfoMainCard />
      </div>
    );
  }
}
