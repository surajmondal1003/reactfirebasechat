import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyD73DnjTe-oV2NJaOZRQPa1h-WNRlOqj20",
    authDomain: "reactchat-ca64a.firebaseapp.com",
    databaseURL: "https://reactchat-ca64a.firebaseio.com",
    projectId: "reactchat-ca64a",
    storageBucket: "reactchat-ca64a.appspot.com",
    messagingSenderId: "835654153849",
    appId: "1:835654153849:web:5e5294bd26ebdff55ec6a8",
    measurementId: "G-YVGHQTQEGJ"
}
firebase.initializeApp(config)

export const myFirebase = firebase
export const myFirestore = firebase.firestore()
export const myStorage = firebase.storage()
