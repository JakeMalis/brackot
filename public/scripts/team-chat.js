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






