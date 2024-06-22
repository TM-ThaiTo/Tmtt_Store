import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove, get, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAolwIYbWt52MoCNUl4xopktmWHiA6twNE",
    authDomain: "chatapp-tmttstore.firebaseapp.com",
    databaseURL: "https://chatapp-tmttstore-default-rtdb.firebaseio.com",
    projectId: "chatapp-tmttstore",
    storageBucket: "chatapp-tmttstore.appspot.com",
    messagingSenderId: "225531939306",
    appId: "1:225531939306:web:5ea8db5a911d4039baca93",
    measurementId: "G-THFT439BBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export { db, ref, push, onValue, remove, get, set }


