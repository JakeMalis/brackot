/*
    This file is only functions that render the tournament chat
    it also has the declaration of the user object which is used
    in all chat files
*/
//user constants unneccesary for now but with redux will improve run speed
const userConstants = {
  GET_REALTIME_USERS: "GET_REALTIME_USERS",
  GET_REALTIME_MESSAGES: "GET_REALTIME_MESSAGES",
};
const user = {
  tournamentConversations: [],
};
const userNames = {};
//object that contains all of the messages to be rendered across all chat files

//Code designed to make a message submit upon hitting the enter button
$("#textHolder").keyup(function (event) {
  if (event.keyCode === 13) {
    $("#sendChatIcon").click();
  }
});

$("#sendChatIcon").click(function () {
  submitTournamentMessage();
});

const db = firebase.firestore();
//just to save time
function initChat() {
  //calls the event listener function and passes the current UID
  getRealtimeConversations(firebase.auth().currentUser.uid);
}
function submitTournamentMessage() {
  var message = document.getElementById("textHolder").value;
  //gets the message from the text box
  document.getElementById("textHolder").value = "";
  //clears the text box
  const msgObj = {
    sentUID: firebase.auth().currentUser.uid,
    message,
  };
  //msg object is just passed between the submitMessage and updateMessage function
  //msgObj is not contained in user.conversations
  if (message !== "") {
    //checks if message is blank
    updateMessage(msgObj);
    //passes the msgObj to the updateMessage function
  }
}
//updateMessage is the function that actually sends the message to firebase
function updateMessage(msgObj) {
  db.collection("tournaments")
    .doc(tournamentId)
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
}
function renderChat() {
  ReactDOM.render(<Message />, document.getElementById("messageSections"));
  //displays the Message component
}
function getRealtimeConversations() {
  //this function sets the event listener

  db.collection("tournaments")
    .doc(tournamentId)
    .collection("chat")
    .orderBy("createdAt", "asc")
    .onSnapshot((querySnapshot) => {
      user.tournamentConversations = [];
      //resets the conversations object so that you dont get duplicate messages
      querySnapshot.forEach(async (doc) => {
        user.tournamentConversations.push(doc.data());
        //adds each firebase documment in chat collection to conversations object

        db.collection("users")
          .doc(doc.data().sentUID)
          .get()
          .then((userDoc) => {
            userNames[doc.sentUID] = userDoc.data().name;
          });

        renderChat();
        //rerendering the Message component when the data changes
      });
    });
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userNames: {} };
  }
  componentDidUpdate() {
    user.tournamentConversations.forEach((message) => {
      if (!this.state.userNames[message.sentUID])
        return db
          .collection("users")
          .doc(message.sentUID)
          .get()
          .then((userDoc) => {
            const { name, avatarUrl } = userDoc.data();
            this.setState((state) => {
              return {
                userNames: {
                  ...state.userNames,
                  [message.sentUID]: {
                    name,
                    avatarUrl,
                  },
                },
              };
            });
          });
    });
  }
  convertStampToDate(timestamp) {
    const messageDate = new Date(timestamp * 1000);
    const today = new Date();
    const date =
      today.getFullYear() === messageDate.getFullYear() &&
      today.getMonth() === messageDate.getMonth() &&
      today.getDate() === messageDate.getDate()
        ? "Today"
        : `${months[messageDate.getMonth()]} ${messageDate.getDate()}`;
    const hour =
      messageDate.getHours() === 12
        ? 12
        : messageDate.getHours() > 12
        ? messageDate.getHours() - 12
        : messageDate.getHours();
    const time = `${hour < 10 ? `0${hour}` : hour}:${
      messageDate.getMinutes() < 10
        ? `0${messageDate.getMinutes()}`
        : messageDate.getMinutes()
    } ${messageDate.getHours() >= 12 ? "PM" : "AM"}`;

    return `${date} ${time}`;
  }
  render() {
    const { userNames } = this.state;
    return (
      <div>
        {
          /*
                        maps through the conversations object putting each message in a div
                    */
          user.tournamentConversations.map((con, index) => (
            <div
              className={
                con.sentUID == firebase.auth().currentUser.uid
                  ? "bubble userBubble"
                  : "bubble foreignBubble"
              }
              key={index}
            >
              {
                //if the sentUID of the message is the same as the UID of the user who is currently logged in it
                //puts the message on the right if not it puts it on the left
              }
              <div className="messageBlurb">
                <span>{con.message}</span>
                {userNames[con.sentUID] && (
                  <div className="messageBlurb-detail">
                    <small>
                      {userNames[con.sentUID].name}
                      <br />
                      {this.convertStampToDate(con.createdAt.seconds)}
                    </small>
                    <img
                      className="messageAvatar"
                      src={
                        userNames[con.sentUID].avatarUrl
                          ? userNames[con.sentUID].avatarUrl
                          : "media/BrackotLogo2.jpg"
                      }
                      alt="avatar"
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}
