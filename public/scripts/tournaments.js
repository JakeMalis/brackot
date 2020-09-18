function personalizeElements() {
  $("#gameList").append('<li class="filterListItem gameFilterListItem"><label class="filterOption"><input class="filterInput" type="radio"><p class="filterText">All</p></input></label></li>');
  $("#dateList").append('<li class="filterListItem dateFilterListItem"><label class="filterOption"><input class="filterInput" type="radio"><p class="filterText">All</p></input></label></li>');
  games.forEach(function (entry) {
    $("#gameList").append('<li class="filterListItem gameFilterListItem"><label class="filterOption"><input class="filterInput" type="radio"><p class="filterText">' + entry + '</p></input></label></li>');
  });
  dateOptions.forEach(function (entry) {
    $("#dateList").append('<li class="filterListItem dateFilterListItem"><label class="filterOption"><input class="filterInput" type="radio"><p class="filterText">' + entry + '</p></input></label></li>');
  });
  filterData();
  renderTournamentCards();
}

var games = ["Counter-Strike Global Offensive", "Fall Guys", "Fortnite", "League of Legends", "Minecraft", "Overwatch", "Rocket League", "Super Smash Bros. Ultimate", "Valorant"];
var selectedGame = games;
var tournamentsCollection = firebase.firestore().collection("tournaments");
var dateOperator = ">=";
var dateOptions = ["Today", "This Week", "This Month"];
var filteredDate = new Date();
var query = tournamentsCollection.where("date", ">=", new Date()).where("date", dateOperator, filteredDate).where("game", "in", games);

class TournamentCard extends React.Component {
  handleClick() {
    window.location = "tournament-info?tournamentId=" + this.props.tournamentID;
  }
  render() {
    return (
      <div className="tournamentCard">
        <div className="tournamentCardBackground">
          <div className="tournamentCardContent" onClick={() => this.handleClick()}>
            <img className="tournamentWallpaper" src={this.props.wallpaper}></img>
            <div className="tournamentCardText">
              <h6 className="tournamentCardTitle">{this.props.title}</h6>
              <ul className="tournamentCardDetails">
                <li className="tournamentDetailsList"><i className="fa fa-gamepad tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail">{this.props.game}</div></li>
                <li className="tournamentDetailsList"><i className="fa fa-calendar tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail">{this.props.date}</div></li>
                <li className="tournamentDetailsList"><i className="fa fa-user tournamentCardIcon" aria-hidden="true"></i><div className="tournamentCardDetail">{this.props.participants}</div></li>
              </ul>
            </div>
            <div className="tournamentCardHostBar">
              <img className="tournamentCardHostPic" src={this.props.tournamentHostPic}></img>
              <h6 className="tournamentCardHostName">{this.props.creatorName}</h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


async function filterData() {
  $(function () {
    $('.gameFilterListItem').on('click', function () {
      $("#gameLabelField").html($(this).text());
      $("#gamePopup").removeClass("show");
      $("#gameFilterButton").removeClass("filterButtonLabelActive");
      if ($(this).text() === "All") { selectedGame = games; }
      else { selectedGame = [$(this).text()]; }
      query = tournamentsCollection.where("date", ">=", new Date()).where("date", dateOperator, filteredDate).where("game", "in", selectedGame);
      renderTournamentCards();
      addTournamentCardData();
    });
    $('.dateFilterListItem').on('click', function () {
      $("#dateLabelField").html($(this).text());
      $("#datePopup").removeClass("show");
      $("#dateFilterButton").removeClass("filterButtonLabelActive");
      if ($(this).text() === "All") { dateOperator = ">="; filteredDate = new Date(); }
      else if ($(this).text() === "Today") { dateOperator = "<="; filteredDate = new Date(new Date().setDate(new Date().getDate() + 1)); }
      else if ($(this).text() === "This Week") { dateOperator = "<="; filteredDate = new Date(new Date().setDate(new Date().getDate() + 7)); }
      else if ($(this).text() === "This Month") { dateOperator = "<="; filteredDate = new Date(new Date().setMonth(new Date().getMonth() + 1)); }
      query = tournamentsCollection.where("date", ">=", new Date()).where("date", dateOperator, filteredDate).where("game", "in", selectedGame);
      renderTournamentCards();
    });
  });
}

async function writeToDynamoDBOpen(params) {
  return new Promise(function (resolve, reject) {
    sendEmailTracking.create(params, function (err, acc) {
      if (err) {
        reject(err);
        // throw err;
      }
      resolve(acc);
      console.log("created account in DynamoDB");
    });
  });
}

function getAllData(doc) {
  return new Promise(function (resolve, reject) {
    return firebase.firestore().runTransaction(transaction => {
      return transaction.get(firebase.firestore().collection("users").doc(doc.data().creator)).then(async creatorDoc => {
        let results = [];
        results.wallpaper = "/media/game_wallpapers/" + (doc.data().game.toLowerCase()).replace(/ /g, "").replace("-", "").replace(".", "") + "-" + "cardWallpaper.jpg";
        results.title = doc.data().name;
        results.participants = (doc.data().players.length) + " Participants";
        if (doc.data().game == "Counter-Strike Global Offensive") {
          results.game = "Counter-Strike: Global Offensive";
        }
        else {
          results.game = doc.data().game;
        }

        await firebase.storage().refFromURL("gs://brackot-app.appspot.com/" + doc.data().creator + "/profile").getDownloadURL().then(function (url) {
          results.tournamentHostPic = url;
        }).catch(() => {
          results.tournamentHostPic = "media/BrackotLogo2.jpg";
        });
        var date = new Date(doc.data().date.toDate());
        var hour, meridiem;

        if ((date.getHours() - 12) < 0) {
          hour = date.getHours();
          results.meridiem = "A.M."
        }
        else if ((date.getHours() - 12) == 0) {
          hour = date.getHours();
          results.meridiem = "P.M."
        }
        else {
          hour = date.getHours() - 12;
          results.meridiem = "P.M."
        }
        results.tournamentDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' @ ' + hour + ':' + String(date.getMinutes()).padStart(2, "0") + ' ' + meridiem;
        results.creatorName = creatorDoc.data().name;
        results.tournamentID = doc.id;
        return resolve(results);
      })
    });
  })
}

async function renderTournamentCards() {
  var TournamentCardArray = [];
  var tournamentNumber = 1;
  var promises = [];

  let data_to_itrate = await query.get();
  data_to_itrate.forEach(async (doc) => {
    promises.push(getAllData(doc).then());
  });

  Promise.all(promises)
    .then((results) => {
      results.forEach(async (data_to_show) => {
        TournamentCardArray.push(<TournamentCard wallpaper={data_to_show.wallpaper} title={data_to_show.title} game={data_to_show.game} date={data_to_show.tournamentDate} participants={data_to_show.participants} tournamentHostPic={data_to_show.tournamentHostPic} tournamentID={data_to_show.tournamentID} creatorName={data_to_show.creatorName} />);
      })
      ReactDOM.render(
        TournamentCardArray,
        document.getElementById("row")
      );
    })
    .catch((e) => {
      // Handle errors here
    });
}



function searchGameFilter(searchbar) {
  var value = $(searchbar).val().toLowerCase();
  $("#gameList > li").each(function () {
    if ($(this).text().toLowerCase().search(value) > -1) { $(this).show(); }
    else { $(this).hide(); }
  });
}
