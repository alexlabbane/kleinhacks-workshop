
// Initialization code for using Google Firebase
// Found here: https://firebase.google.com/docs/firestore/quickstart
var firebaseConfig = {
apiKey: "AIzaSyDpGJxZztDa8lffEJkzXCzDJmSRSE0t0Ak",
authDomain: "kleinhackschatapp.firebaseapp.com",
projectId: "kleinhackschatapp",
storageBucket: "kleinhackschatapp.appspot.com",
messagingSenderId: "22780951362",
appId: "1:22780951362:web:2aa38aafc1f3c42afa26db"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Our database object
let db = firebase.firestore();

// The HTML element where the user can type a message
let inputBox = document.getElementById('message-input');

// Lets the user enter their name when the web-app loads
let name = prompt("Enter your name to start chatting!");

window.sendMessage = function(event) {
    if(event.key == 'Enter') {
        let timestamp = new Date();

        // Send the message to the database
        db.collection('messages').add({
            user: name,
            message: inputBox.value,
            timestamp: timestamp.valueOf()
        });

        inputBox.value = "";
    }
}

// Will allow us to ignore messages we have already received
let lastGet = new Date().valueOf();

// Finds the HTML element with class='messages'
let messages = document.querySelector('.messages');

// Retrieve all new messages from the database
function updateMessages() {
    // Retrieve all messages that are newer than the last message received
    db.collection('messages').where('timestamp', '>', lastGet).orderBy('timestamp', 'desc').limit(100).get().then((querySnapshot) => {
        let docs = [];

        // Add all of the new messages to a list
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            lastGet = Math.max(lastGet, doc.data().timestamp);
            docs.push(doc);
        });

        // Insert the new messages into the HTML of the webpage in the order they were sent
        docs.reverse();
        docs.forEach((doc) => {
            messages.insertAdjacentHTML('beforeend', `<p>${doc.data().user}: ${doc.data().message}</p>`)

            // Scrolls the message box all the way to the bottom
            messages.scrollTop = messages.scrollHeight;
        });
    });
}

// Load chat messages any time a new message is inserted into the database
// Documentation here: https://firebase.google.com/docs/firestore/query-data/listen
db.collection('messages').orderBy('timestamp', 'desc').limit(1).onSnapshot((querySnapshot) => {
    updateMessages();
});
