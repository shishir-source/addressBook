// data from firebase DB
import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyDT3EmgtaIht2B2fZcg0TjeEy7Zg9zSRiA",
  authDomain: "address-book-85e7d.firebaseapp.com",
  databaseURL: "https://address-book-85e7d.firebaseio.com",
  projectId: "address-book-85e7d",
  storageBucket: "address-book-85e7d.appspot.com",
  messagingSenderId: "230479373923"
};

firebase.initializeApp(config);

export const database = firebase.database();

// function to get list of contacts from DB

// function to add contact in DB
export const addContactDb = contact => {
  database
    .ref(`contacts`)
    .push()
    .set(contact);
};

// function to update contact in DB given id
export const updateContactDb = (contact, id) => {
  database.ref(`contacts/${id}`).set(contact);
};

// dummy data

export const contact1 = {
  //  Name, Address Line 1, Address Line 2, Town/City, County, Postcode, Telephone and Email.
  name: "Logan Stevenson",
  addressLine1: "39 Broad Street",
  addressLine2: "",
  townCity: "LOWICK",
  county: "Northumberland",
  postCode: "TD15 2RJ",
  telephone: "079 3758 4259",
  email: "LoganStevenson@dayrep.com"
};

export const contact2 = {
  name: "Faith Stevens",
  addressLine1: "39 Broad Street",
  addressLine2: "35 George Street",
  townCity: "BRYNGWYN",
  county: " Monmouthshire",
  postCode: "HR5 7QJ",
  telephone: "079 4376 3854",
  email: "FaithStevens@teleworm.us"
};

export const contact3 = {
  name: "Alexandra Wood",
  addressLine1: "44 New Dover Rd",
  addressLine2: "",
  townCity: "WALDRIDGE",
  county: "Durham",
  postCode: "TD15 2RJ",
  telephone: "078 1161 8272",
  email: "AlexandraWood@teleworm.us"
};

export const contact4 = {
  name: "Freddie Scott",
  addressLine1: "93 Henley Road",
  addressLine2: "",
  townCity: "BOURTON",
  county: "Buckinghamshire",
  postCode: "SN6 3JE",
  telephone: "079 0494 1170",
  email: "FreddieScott@teleworm.us"
};
