/*
    This file is only functions that render the tournament chat
    it also has the declaration of the user object which is used
    in all chat files
*/
//user constants unneccesary for now but with redux will improve run speed
const userConstants = {
    GET_REALTIME_USERS: 'GET_REALTIME_USERS',
    GET_REALTIME_MESSAGES: 'GET_REALTIME_MESSAGES'
}
const user = {
    'tournamentConversations': [],
    'teamConversations': []
}
//object that contains all of the messages to be rendered across all chat files




const db = firebase.firestore();
//just to save time
function initChat() {
    //calls the event listener function and passes the current UID
    getRealtimeConversations(firebase.auth().currentUser.uid);

}
function submitMessage() {
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
        updateMessage(msgObj)
        //passes the msgObj to the updateMessage function
    };

}
//updateMessage is the function that actually sends the message to firebase
function updateMessage(msgObj) {
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
function renderChat() {
    ReactDOM.render(
        <Message/>,
        document.getElementById("messageSections")

    );
    //displays the Message component
}
function getRealtimeConversations() {
    //this function sets the event listener

    db.collection('tournaments').doc(tournamentId).collection('chat')
    .orderBy('createdAt', 'asc')
    .onSnapshot((querySnapshot) => {
        user.tournamentConversations = []
        //resets the conversations object so that you dont get duplicate messages


        querySnapshot.forEach(doc => {
            user.tournamentConversations.push(doc.data())
            //adds each firebase documment in chat collection to conversations object
        });
        renderChat()
        //rerendering the Message component when the data changes

    })
}
class Message extends React.Component {
    render(){
        return (
            <div>
                {
                    /*
                        maps through the conversations object putting each message in a div
                    */
                        user.tournamentConversations.map(con =>
                            <div className = {con.sentUID == firebase.auth().currentUser.uid
                            ? 'bubble userBubble' : 'bubble foreignBubble'}>
                    {//if the sentUID of the message is the same as the UID of the user who is currently logged in it
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
