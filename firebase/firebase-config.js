import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDbzcNYtiXTp2Xm2-sweU5V2cTUrTHP67s",
    authDomain: "reliefmap-bc66c.firebaseapp.com",
    projectId: "reliefmap-bc66c",
    storageBucket: "reliefmap-bc66c.appspot.com",
    messagingSenderId: "866612642202",
    appId: "1:866612642202:web:3d505f5f6dbca0f0457a23",
    measurementId: "G-LDK3PGNZ7K"
};

const app = initializeApp(firebaseConfig);

export default app