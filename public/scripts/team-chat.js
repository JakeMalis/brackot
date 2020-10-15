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
//object that contains all of the messages to be rendered across all chat files
user = {
    'teamConversations' : []
};



const db = firebase.firestore();
//just to save time



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
    
}


//updateMessage is the function that actually sends the message to firebase
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


function renderTeamChat() {
    ReactDOM.render(
        <Message/>,
        document.getElementById("messageSections")
        
    );
    //displays the Message component
}


function getRealtimeTeamConversations() {
    //this function sets the event listener 

    db.collection('teams').doc(teamId).collection('chat')
    .orderBy('createdAt', 'asc')
    .onSnapshot((querySnapshot) => {
        user.teamConversations = []
        //resets the conversations object so that you dont get duplicate messages
        

        querySnapshot.forEach(doc => {
            user.teamConversations.push(doc.data())  
            //adds each firebase documment in chat collection to conversations object
            console.log(doc)
        });
        renderTeamChat()
        //rerendering the Message component when the data changes
        
    })
}



