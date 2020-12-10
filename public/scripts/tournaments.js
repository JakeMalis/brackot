function personalizeElements() {
  $("#gameList").append(
    '<li class="filterListItem gameFilterListItem"><label class="filterOption"><input class="filterInput" type="radio"><p class="filterText">All</p></input></label></li>'
  );
  $("#dateList").append(
    '<li class="filterListItem dateFilterListItem"><label class="filterOption"><input class="filterInput" type="radio"><p class="filterText">All</p></input></label></li>'
  );

  games.forEach((entry) => {
    $("#gameList").append(
      '<li class="filterListItem gameFilterListItem"><label class="filterOption"><input class="filterInput" type="radio"><p class="filterText">' +
        entry +
        "</p></input></label></li>"
    );
  });
  dateOptions.forEach((entry) => {
    $("#dateList").append(
      '<li class="filterListItem dateFilterListItem"><label class="filterOption"><input class="filterInput" type="radio"><p class="filterText">' +
        entry +
        "</p></input></label></li>"
    );
  });

  filterData();
  renderTournamentCards();
}

var selectedGame = games;
var tournamentsCollection = firebase.firestore().collection("tournaments");
var dateOperator = ">=";
var dateOptions = ["Today", "This Week", "This Month"];
var currentDate = new Date();
var filteredDate = currentDate;
var query = tournamentsCollection.where("date", ">=", new Date());

class TournamentCardSkeleton extends React.Component {
  render() {
    return (
      <div className="tournamentCard">
        <div className="tournamentCardBackground">
          <div className="tournamentCardContent">
            <div className="tournamentCardSkeletonWallpaper loading"></div>
            <div className="tournamentCardText">
              <h6 className="tournamentCardTitle">Loading...</h6>
              <ul className="tournamentCardDetails">
                <li className="tournamentDetailsList">
                  <i
                    className="fa fa-gamepad tournamentCardIcon"
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">Loading...</div>
                </li>
                <li className="tournamentDetailsList">
                  <i
                    className="fa fa-calendar tournamentCardIcon"
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">Loading...</div>
                </li>
                <li className="tournamentDetailsList">
                  <i
                    className="fa fa-user tournamentCardIcon"
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">Loading...</div>
                </li>
              </ul>
            </div>
            <div className="tournamentCardHostBar">
              <div className="tournamentCardSkeletonHostPic"></div>
              <h6 className="tournamentCardHostName">Loading...</h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class TournamentCard extends React.Component {
  handleClick() {
    window.location = "tournament-info?tournamentId=" + this.props.tournamentID;
  }
  render() {
    return (
      <div className="tournamentCard">
        <div className="tournamentCardBackground">
          <div
            className="tournamentCardContent"
            onClick={() => this.handleClick()}
          >
            <picture className="tournamentWallpaper">
              <source
                srcSet={this.props.wallpaper + "webp"}
                type="image/webp"
              ></source>
              <img
                className="tournamentWallpaper"
                src={this.props.wallpaper + "jpg"}
              />
            </picture>
            <div className="tournamentCardText">
              <h6 className="tournamentCardTitle">{this.props.title}</h6>
              <ul className="tournamentCardDetails">
                <li className="tournamentDetailsList">
                  <i
                    className="fa fa-gamepad tournamentCardIcon"
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">{this.props.game}</div>
                </li>
                <li className="tournamentDetailsList">
                  <i
                    className="fa fa-calendar tournamentCardIcon"
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">{this.props.date}</div>
                </li>
                <li className="tournamentDetailsList">
                  <i
                    className="fa fa-user tournamentCardIcon"
                    aria-hidden="true"
                  ></i>
                  <div className="tournamentCardDetail">
                    {this.props.participants}
                  </div>
                </li>
              </ul>
            </div>
            <div className="tournamentCardHostBar">
              <img
                className="tournamentCardHostPic"
                src={this.props.tournamentHostPic}
              ></img>
              <h6 className="tournamentCardHostName">
                {this.props.creatorName}
              </h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

async function filterData() {
  $(function () {
    $(".gameFilterListItem").on("click", function () {
      $("#gameLabelField").html($(this).text());
      $("#gamePopup").removeClass("show");
      $("#gameFilterButton").removeClass("filterButtonLabelActive");
      if ($(this).text() === "All") {
        selectedGame = games;
      } else {
        selectedGame = [$(this).text()];
      }

      if (filteredDate === currentDate) {
        if ($(this).text() === "All") {
          query = tournamentsCollection.where("date", ">=", new Date());
        } else {
          query = tournamentsCollection
            .where("date", ">=", new Date())
            .where("game", "in", selectedGame);
        }
      } else {
        if ($(this).text() === "All") {
          query = tournamentsCollection
            .where("date", ">=", new Date())
            .where("date", dateOperator, filteredDate);
        } else {
          query = tournamentsCollection
            .where("date", ">=", new Date())
            .where("date", dateOperator, filteredDate)
            .where("game", "in", games);
        }
      }

      renderTournamentCards();
    });
    $(".dateFilterListItem").on("click", function () {
      $("#dateLabelField").html($(this).text());
      $("#datePopup").removeClass("show");
      $("#dateFilterButton").removeClass("filterButtonLabelActive");
      if ($(this).text() === "All") {
        dateOperator = ">=";
        filteredDate = new Date();
      } else if ($(this).text() === "Today") {
        dateOperator = "<=";
        filteredDate = new Date(new Date().setDate(new Date().getDate() + 1));
      } else if ($(this).text() === "This Week") {
        dateOperator = "<=";
        filteredDate = new Date(new Date().setDate(new Date().getDate() + 7));
      } else if ($(this).text() === "This Month") {
        dateOperator = "<=";
        filteredDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
      }

      if (selectedGame === games) {
        query = tournamentsCollection
          .where("date", ">=", new Date())
          .where("date", dateOperator, filteredDate);
      } else {
        query = tournamentsCollection
          .where("date", ">=", new Date())
          .where("date", dateOperator, filteredDate)
          .where("game", "in", selectedGame);
      }

      if (selectedGame === games) {
        if ($(this).text() === "All") {
          query = tournamentsCollection.where("date", ">=", new Date());
        } else {
          query = tournamentsCollection
            .where("date", ">=", new Date())
            .where("date", dateOperator, filteredDate);
        }
      } else {
        if ($(this).text() === "All") {
          query = tournamentsCollection
            .where("date", ">=", new Date())
            .where("game", "in", games);
        } else {
          query = tournamentsCollection
            .where("date", ">=", new Date())
            .where("date", dateOperator, filteredDate)
            .where("game", "in", games);
        }
      }
      renderTournamentCards();
    });
  });
}

async function renderTournamentCards() {
  var TournamentCardArray = [];

  ReactDOM.render(
    new Array(4)
      .fill("")
      .map((_, index) => <TournamentCardSkeleton key={index} />),
    document.getElementById("row")
  );

  query.get().then(async function (querySnapshot) {
    if (querySnapshot.size == 0) {
      // If there are no tournaments available to be rendered...
      document.getElementById("noTournaments").style.display = "block"; // display the block #noTournaments which is a message
    }
    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const docData = doc.data();
        const { game, name, players, date } = docData;
        const wallpaper =
          "/media/game_wallpapers/" +
          game
            .toLowerCase()
            .replace(/ /g, "")
            .replace("-", "")
            .replace(".", "") +
          "-" +
          "cardWallpaper.";
        const title = name;

        const creatorName = await firebase
          .firestore()
          .collection("users")
          .doc(docData.creator)
          .get()
          .then((creatorDoc) => {
            return creatorDoc.name;
          });

        const participants = players.length + " Participants";

        let transformedGame = game;
        if (game == "Counter-Strike Global Offensive") {
          transformedGame = "Counter-Strike: Global Offensive";
        }

        const tournamentHostPic = await firebase
          .storage()
          .refFromURL(
            "gs://brackot-app.appspot.com/" + docData.creator + "/profile"
          )
          .getDownloadURL()
          .then((url) => {
            return String(url);
          })
          .catch((error) => {
            return "media/BrackotLogo2.jpg";
          });

        const transformedDate = new Date(date.toDate());
        var hour, meridiem;

        if (transformedDate.getHours() == 0) {
          hour = 12;
          meridiem = "A.M.";
        } else if (transformedDate.getHours() - 12 < 0) {
          hour = transformedDate.getHours();
          meridiem = "A.M.";
        } else if (transformedDate.getHours() - 12 == 0) {
          hour = transformedDate.getHours();
          meridiem = "P.M.";
        } else {
          hour = transformedDate.getHours() - 12;
          meridiem = "P.M.";
        }
        const tournamentDate =
          transformedDate.getMonth() +
          1 +
          "/" +
          transformedDate.getDate() +
          "/" +
          transformedDate.getFullYear() +
          " @ " +
          hour +
          ":" +
          String(transformedDate.getMinutes()).padStart(2, "0") +
          " " +
          meridiem;

        TournamentCardArray.push(
          <TournamentCard
            wallpaper={wallpaper}
            title={title}
            game={game}
            date={tournamentDate}
            participants={participants}
            tournamentHostPic={tournamentHostPic}
            tournamentID={doc.id}
            creatorName={creatorName}
            key={doc.id}
          />
        );
      })
    ).then(() => {
      ReactDOM.render(TournamentCardArray, document.getElementById("row"));
    });
  });
}

function searchGameFilter(searchbar) {
  var value = $(searchbar).val().toLowerCase();
  $("#gameList > li").each(function () {
    if ($(this).text().toLowerCase().search(value) > -1) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}
