import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDoTrxgYePqJc9rKfT1cGG4bylfNg6d8QY",
  authDomain: "products-qr-web.firebaseapp.com",
  projectId: "products-qr-web",
  storageBucket: "products-qr-web.appspot.com",
  messagingSenderId: "599529447297",
  appId: "1:599529447297:web:6936cfed7223a9e8c59280",
};
initializeApp(firebaseConfig);
export const db = getFirestore();
