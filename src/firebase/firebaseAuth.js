import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: 'AIzaSyD_EU_GdrmVhs2w7Ewg0laNCxMoyFcVjJY',
  authDomain: 'tasks-bd-2273f.firebaseapp.com',
  projectId: 'tasks-bd-2273f',
  storageBucket: 'tasks-bd-2273f.firebasestorage.app',
  messagingSenderId: '689868159',
  appId: '1:689868159:web:e661185b4e434704ce1e4a',
  measurementId: 'G-825MD2NYCQ',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);