import {auth} from "../firebase/firebaseAuth"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

const provider = new GoogleAuthProvider();

export async function cadastrarEmail(email, senha){
    return createUserWithEmailAndPassword(auth, email, senha);
}

export async function loginEmail(email, senha){
    return signInWithEmailAndPassword(auth, email, senha)
}

export async function loginGoogle(){
    return signInWithPopup(auth, provider);
}

