import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove, get, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDDV-n6zp6Nb0dFohVeymD7_cF7RowY_t0",
    authDomain: "test1-e4610.firebaseapp.com",
    databaseURL: "https://test1-e4610-default-rtdb.firebaseio.com",
    projectId: "test1-e4610",
    storageBucket: "test1-e4610.appspot.com",
    messagingSenderId: "992238875188",
    appId: "1:992238875188:web:114dea425ad65a88cf1061",
    measurementId: "G-6YZFF0T9EQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export { db, ref, push, onValue, remove, get, set }


