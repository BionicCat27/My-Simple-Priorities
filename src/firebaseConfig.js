import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD8UFVmCrGkosxreqnQbr4wfe9uDPi4L9w",
    authDomain: "my-simple-priorities.firebaseapp.com",
    databaseURL: "https://my-simple-priorities-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "my-simple-priorities",
    storageBucket: "my-simple-priorities.appspot.com",
    messagingSenderId: "783456794609",
    appId: "1:783456794609:web:1ccfbec5791775a46ab650",
    measurementId: "G-MXL65K2JZC"
};

const app = initializeApp(firebaseConfig);

const enableDevelopmentMode = () => {
    let hostname = "127.0.0.1";
    connectAuthEmulator(getAuth(), `http://${hostname}:9099`);
    connectDatabaseEmulator(getDatabase(), hostname, 9000);
    console.debug("Development mode enabled, connected to emulators");
}

if (process.env.MODE === "development") {
    enableDevelopmentMode();
}

export { app, enableDevelopmentMode };