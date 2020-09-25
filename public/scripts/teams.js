function personalizeElements() {
  renderTeamCards();
}

class TeamCard extends React.Component {
  handleClick() {
    window.location = "team-info?teamId=" + this.props.teamID;
  }
  render() {
    return (
      <div className="tournamentCard teamCard">
        <div className="tournamentCardBackground">
          <div className="tournamentCardContent" onClick={() => this.handleClick()}>
            <picture className="tournamentWallpaper">
              <source srcSet={this.props.teamProfilePic + "webp"} type="image/webp"></source>
              <img className="tournamentWallpaper" src={this.props.teamProfilePic + "jpg"}/>
            </picture>
            <div className="tournamentCardText">
                <h6 className="tournamentCardTitle">{this.props.name}</h6>
                <ul className="tournamentCardDetails">
                  <li className="tournamentDetailsList"><i className="fa fa-user tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail">{this.props.teamMembers}</div></li>
                  <li className="tournamentDetailsList"><i className={"fa " + this.props.privacyIcon + " tournamentCardIcon"} aria-hidden="true"></i><div className="tournamentCardDetail">{this.props.privacy}</div></li>
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
  query.get().then(async function(querySnapshot) {
    const collectionLength = querySnapshot.size;

    if (collectionLength == 0) {
      ReactDOM.render(
        TeamCardArray,
        document.getElementById("teamsRow")
      );
      console.log("No teams match criteria given.");
    }

    querySnapshot.forEach(async (doc) => {
        var name = doc.data().name;
        var teamMembers = (doc.data().teamMembers.length) + " Members";
        var privacy = doc.data().privacy;
        if (privacy == "public"){
          privacy = "Public";
          var privacyIcon = "fa-users";
        }
        else{
          privacy = "Private";
          var privacyIcon = "fa-lock";
        }

        var teamProfilePic = await firebase.storage().refFromURL("gs://brackot-app.appspot.com/" + doc.data().creator + "/profile").getDownloadURL().then(function (url) {
          return String(url);
        }).catch((error) => {
          return "media/BrackotLogo2.jpg";
        });

        TeamCardArray.push(<TeamCard name={name} teamMembers={teamMembers} teamProfilePic={"/media/game_wallpapers/amongus-cardWallpaper."} teamID={doc.id} privacy={privacy} privacyIcon={privacyIcon} key={doc.id} />);
        if(teamNumber == collectionLength) {
          ReactDOM.render(
            TeamCardArray,
            document.getElementById("teamsRow")
          );
        }
        teamNumber++;
    });
  });
}
