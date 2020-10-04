const user = {
    conversations : []
};

const db = firebase.firestore()
async function updateTeamMessage(msgObj) {
    db.collection('tournaments').doc(tournamentId).collection('chat')
        .add({
            ...msgObj,
            createdAt: new Date(),
        })
        .catch(error => {
            console.log('error')
        });
    console.log('complete') 
}
function initTeamChat() {
    console.log("into init chat")
    renderChat()
}
function submitTeamMessage() {
    console.log('hello')
    var message = document.getElementById("textHolder").value;
    console.log(message)
    const msgObj = {
        sentUID: firebase.auth().currentUser.uid,
        message
    }
    if(message !== ""){
        console.log("into if statement")
        updateMessage(msgObj)
        
    };
    console.log("out of if")
}
function renderTeamChat() {
    ReactDOM.render(
        <Messages/>,
        document.getElementById("messageSections")

    );
}
function getRealTimeTeamMessages() {
    user.teamConversations = [] 
    db.collection('teams').doc(teamId).collection('chat')
                    .orderBy('createdAt', 'asc')
                    .onSnapshot((querySnapshot) => {
                        querySnapshot.forEach(doc => {
                            
                            user.teamConversations.push(doc.data())
                            
                        });
                        console.log(user.teamConversations);
                    })
}
class TeamMessages extends React.Component {
    render(){
        return (
            <div>
                {
                    getRealTimeMessages()
                }
                {
                    user.teamConversations.map(con =>
                        <div style={{ textAlign: con.userSent == firebase.auth().currentUser.uid
                            ? 'right' : 'left' }}>
                        <p className="messageStyle" >{con.message}</p>
                        <p className='messageSentBy'>{con.sentUID}</p>
                        </div>)    
                }
            </div>
            
        );
    }
}
