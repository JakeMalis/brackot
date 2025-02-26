function personalizeElements() {
  renderTeamCards();
}

class TeamSkeletonCard extends React.Component {
  render() {
    return (
      <div className="tournamentCard teamCard">
        <div className="tournamentCardBackground">
          <div className="tournamentCardContent">
            <div className="tournamentCardSkeletonWallpaper loading"></div>
            <div className="tournamentCardText">
              <h6 className="tournamentCardTitle loader">Loading...</h6>
              <ul className="tournamentCardDetails">
                <li className="tournamentDetailsList">
                  <i
                    className="fa fa-user tournamentCardIcon"
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">Loading...</div>
                </li>
                <li className="tournamentDetailsList">
                  <i
                    className={
                      "fa " + this.props.privacyIcon + " tournamentCardIcon"
                    }
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">Loading...</div>
                </li>
              </ul>
            </div>
            <div className="tournamentCardHostBar teamCardHostBar loader">
              <button className="teamCardButton" disabled>Loading...</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class TeamCard extends React.Component {
  handleClick() {
    window.location = "team-info?teamId=" + this.props.teamID;
  }
  render() {
    return (
      <div className="tournamentCard teamCard">
        <div className="tournamentCardBackground">
          <div
            className="tournamentCardContent"
            onClick={() => this.handleClick()}
          >
            <picture className="tournamentWallpaper">
              <img
                className="tournamentWallpaper"
                src={this.props.teamProfilePic}
              />
            </picture>
            <div className="tournamentCardText">
              <h6 className="tournamentCardTitle">{this.props.name}</h6>
              <ul className="tournamentCardDetails">
                <li className="tournamentDetailsList">
                  <i
                    className="fa fa-user tournamentCardIcon"
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">
                    {this.props.teamMembers}
                  </div>
                </li>
                <li className="tournamentDetailsList">
                  <i
                    className={
                      "fa " + this.props.privacyIcon + " tournamentCardIcon"
                    }
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">
                    {this.props.privacy}
                  </div>
                </li>
              </ul>
            </div>
            <div className="tournamentCardHostBar teamCardHostBar">
              <button className="teamCardButton">View Details</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

var teamCollection = firebase.firestore().collection("teams");
var query = teamCollection;

async function renderTeamCards() {
  var TeamCardArray = [];
  var teamNumber = 1;

  console.log("startRender");
  ReactDOM.render(
    new Array(4).fill("").map((_, index) => <TeamSkeletonCard key={index} />),
    document.getElementById("teamsRow")
  );

  query.get().then(async function (querySnapshot) {
    const collectionLength = querySnapshot.size;

    if (collectionLength == 0) {
      // if there are no team cards to be shown
      ReactDOM.render(TeamCardArray, document.getElementById("teamsRow"));
      document.getElementById("noTeams").style.display = "block"; // display the block #noTournaments which is a message
    }

    querySnapshot.forEach(async (doc) => {
      var name = doc.data().name;
      var teamMembers = doc.data().teamMembers.length + " Members";
      var privacy = doc.data().privacy;
      if (privacy == "public") {
        privacy = "Public";
        var privacyIcon = "fa-users";
      } else {
        privacy = "Private";
        var privacyIcon = "fa-lock";
      }

      if (doc.data().teamAvatar == null) {
        var teamProfilePic = "../media/BrackotLogo.png"
      }
      else {
        var teamProfilePic = doc.data().teamAvatar;
      }

      //"/media/game_wallpapers/amongus-cardWallpaper."
      TeamCardArray.push(
        <TeamCard
          name={name}
          teamMembers={teamMembers}
          teamProfilePic={teamProfilePic}
          teamID={doc.id}
          privacy={privacy}
          privacyIcon={privacyIcon}
          key={doc.id}
        />
      );
      if (teamNumber == collectionLength) {
        ReactDOM.render(TeamCardArray, document.getElementById("teamsRow"));
      }
      teamNumber++;
    });
  });
}
