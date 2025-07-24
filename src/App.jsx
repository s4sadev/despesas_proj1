import { useEffect, useState } from 'react';
import './App.css';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'; //aqui podemos exportar as funções necessaria do CRUD
import './index.css'; // ou './main.css'
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  Transition,
  Disclosure, 
  DisclosureButton, 
  DisclosurePanel ,
} from '@headlessui/react';


import { db } from '../firebasedb';
import Swal from 'sweetalert2';
import Home from './Home';

function App() {

  return (
    <>
      <Home></Home>
    </>
  );


}

export default App;
