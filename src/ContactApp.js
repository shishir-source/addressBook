import React from "react";
import "./style.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  database,
  ContactListApi,
  contact1,
  contact2,
  contact3,
  contact4,
  addContactDb,
  updateContactDb
} from "./data/ContactList";

class ContactApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contactList: [],
      listLoaded: false,
      action: "" // edit or add contact
    };

    this.filterContacts = this.filterContacts.bind(this);
    this.addContact = this.addContact.bind(this);
    this.hide = this.hide.bind(this);
    this.editContact = this.editContact.bind(this);
    this.renderAddContact = this.renderAddContact.bind(this);
    this.updateContact = this.updateContact.bind(this);
  }

  componentDidMount() {
    /*  adding 4 contacts to DB
    
    addContactDb(contact1);
    addContactDb(contact2);
    addContactDb(contact3);
    addContactDb(contact4); */

    // update state in real time from DB
    database.ref(`contacts`).on("value", snapshot => {
      const contacts = [];
      snapshot.forEach(childSnapshot => {
        contacts.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      console.log(contacts);
      this.setState({ contactList: contacts, listLoaded: true });
    });
  }

  // filter by name(for now it filters only data rendered, I still need implement filter using query on DB)
  filterContacts(e) {
    e.preventDefault();
    let search = e.target.value.trim();
    this.setState({
      contactList: this.state.contactList.filter(contact =>
        contact.name.toLowerCase().includes(search.toLowerCase())
      )
    });
  }

  //remove contact from DB
  removeContact(e) {
    e.preventDefault();
    const ref = e.target;
    const id = ref.closest("tr").id;

    const name = ref.closest("tr").childNodes[1].innerText; // name of contact we are about to delete

    confirmAlert({
      title: "",
      message: `Are you sure you want to delete contact ${name}?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            database.ref(`contacts/${id}`).remove();
          }
        },
        {
          label: "No",
          onClick: () => {}
        }
      ]
    });
  }

  //post code lookup for County and Town-City (this api doesn't return addresses)
  fetchInfoByPostcode(e) {
    e.preventDefault();
    const postCode = e.target.value.trim().substring(0, 3);
    console.log(postCode);
    fetch(`https://api.postcodes.io/outcodes/${postCode}`)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        // if lookup found data
        if (myJson.status === 200) {
          console.log(myJson.result.admin_county);
          document.getElementById("town-city").value =
            myJson.result.admin_district[0];
          document.getElementById("county").value = myJson.result.admin_county;
        }
      });
  }

  renderAddContact(e) {
    e.preventDefault();
    this.setState({ action: "add" });
    this.renderForm(e);
  }

  // add contact from popup form
  addContact(e) {
    e.preventDefault();

    const newContact = this.getPopupValues();
    addContactDb(newContact); // add contact to db
    this.hide(); // close popup
  }

  updateContact(e) {
    e.preventDefault();
    const id = document.getElementById("id").value;
    const editContact = this.getPopupValues();
    updateContactDb(editContact, id); // add contact to db
    this.hide(); // close popup
  }

  editContact(e) {
    this.setState({ action: "edit" });

    this.renderForm(e);
    //get id of clicked row
    const id = e.target.closest("tr").id;
    // get tds of row clicked
    const contactInfo = e.target.closest("tr").childNodes;
    // populate input fields based on contact row clicked
    console.log(id);
    document.getElementById("id").value = id;
    document.getElementById("town-city").value = contactInfo[2].innerText;
    document.getElementById("address1").value = contactInfo[5].innerText;
    document.getElementById("address2").value = contactInfo[6].innerText;
    document.getElementById("post-code").value = contactInfo[4].innerText;
    document.getElementById("county").value = contactInfo[7].innerText;
    document.getElementById("name").value = contactInfo[1].innerText;
    document.getElementById("email").value = contactInfo[8].innerText;
    document.getElementById("telephone").value = contactInfo[3].innerText;
  }

  operateFormatter(value, row, index) {
    return (
      <div>
        <a
          rel="tooltip"
          title="Edit"
          className="table-action edit"
          title="Edit"
          onClick={this.editContact}
        >
          <i className="fa fa-edit" />
        </a>
        <a
          rel="tooltip"
          title="Remove"
          ref="delete"
          className="table-action remove"
          title="Remove"
          onClick={this.removeContact}
        >
          <i className="fa fa-remove" />
        </a>
      </div>
    );
  }

  render() {
    return (
      <div className="wrapper">
        <div className="blur" />
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="fresh-table table-responsive full-color-orange">
                <div className="action">
                  <input
                    type="search"
                    placeholder="Search name"
                    onChange={this.filterContacts}
                  />
                  <button
                    className="btn-floating waves-effect waves-light add-btn"
                    onClick={this.renderAddContact}
                  >
                    Add Contact{" "}
                  </button>
                </div>

                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th data-field="id">ID</th>
                      <th data-field="name" data-sortable="true">
                        Name
                      </th>
                      <th data-field="CityTown" data-sortable="true">
                        City/Town
                      </th>
                      <th data-field="Telephone" data-sortable="true">
                        Telephone
                      </th>
                      <th data-field="postCode" data-sortable="true">
                        Postcode
                      </th>
                      <th data-field="address1" data-sortable="true">
                        Address1
                      </th>
                      <th data-field="address2" data-sortable="true">
                        Address2
                      </th>

                      <th data-field="County">County</th>
                      <th data-field="email" data-sortable="true">
                        Email
                      </th>
                      <th data-field="actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.listLoaded > 0 &&
                      this.state.contactList.map((contact, index) => (
                        <tr key={index} id={contact.id} name={contact.name}>
                          <td>{index + 1}</td>
                          <td>{contact.name}</td>
                          <td>{contact.townCity}</td>
                          <td>{contact.telephone}</td>
                          <td>{contact.postCode}</td>
                          <td>{contact.addressLine1}</td>
                          <td>{contact.addressLine2}</td>
                          <td>{contact.county}</td>
                          <td>{contact.email}</td>
                          <td>{this.operateFormatter()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Form that will pop up when we click on add contact button  */}

          <div className="popup-form">
            <div className="fresh-table full-color-orange">
              <form className="col s12 popup-input">
                <h4 className="heading">
                  {this.state.action === "add"
                    ? "Add a contact"
                    : "Update contact"}
                  <a
                    rel="tooltip"
                    title="Remove"
                    className="table-action remove right"
                    onClick={this.hide}
                    title="Remove"
                  >
                    <i className="fa fa-remove " />
                  </a>
                </h4>
                <hr className="hr" />
                <div className="row">
                  <div className="input-field col s4">
                    <input
                      id="id"
                      type="hidden"
                      ref="id"
                      className="validate"
                    />
                    <input
                      id="name"
                      type="text"
                      ref="name"
                      className="validate"
                      placeholder=" Name"
                    />
                  </div>
                  <div className="input-field col s4">
                    <input
                      id="town-city"
                      type="text"
                      ref="town"
                      className="validate"
                      placeholder="City/Town"
                    />
                  </div>
                  <div className="input-field col s4">
                    <input
                      id="telephone"
                      type="text"
                      ref="telephone"
                      className="validate"
                      placeholder="Telephone"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s8">
                    <input
                      id="address1"
                      type="text"
                      ref="address1"
                      className="validate"
                      placeholder=" Address1"
                    />
                  </div>
                  <div className="input-field col s4">
                    <input
                      id="post-code"
                      type="text"
                      ref="postCode"
                      className="validate"
                      placeholder=" Postcode"
                      onChange={this.fetchInfoByPostcode} // fetch town and county by postcode and populate inputs
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s8">
                    <input
                      id="address2"
                      type="text"
                      ref="address2"
                      className="validate"
                      placeholder=" Address2"
                    />
                  </div>
                  <div className="input-field col s4">
                    <input
                      id="county"
                      type="text"
                      ref="country"
                      className="validate"
                      placeholder=" County"
                    />
                  </div>
                </div>
                {/* dynamic funtion call based on action add or edit contact */}
                <div className="row">
                  <button
                    className="btn-floating waves-effect waves-light add-btn"
                    onClick={
                      this.state.action === "add"
                        ? this.addContact
                        : this.updateContact
                    }
                  >
                    {/* dynamic label based on action add or edit contact */}
                    {this.state.action === "add"
                      ? "Add Contact"
                      : "Update Contact"}
                  </button>
                  <div className="input-field col s4">
                    <input
                      id="email"
                      type="text"
                      ref="email"
                      className="validate"
                      placeholder=" Email"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderForm(e) {
    e.preventDefault();
    var popupForm = document.getElementsByClassName("popup-form")[0];
    var blur = document.getElementsByClassName("blur")[0];
    blur.style = "opacity : 1; z-index: 10";
    blur.style.transition = "opacity .5s ease,z-index .5s ease";
    popupForm.style = "opacity : 1; z-index: 10";
    popupForm.style.transition = "opacity .5s ease,z-index .5s ease";
  }
  hide() {
    var popupForm = document.getElementsByClassName("popup-form")[0];
    var blur = document.getElementsByClassName("blur")[0];
    blur.style = "opacity : 0; z-index: -9";
    blur.style.transition = "opacity .5s ease,z-index .5s ease";
    popupForm.style = "opacity : 0; z-index: -10";
    popupForm.style.transition = "opacity .5s ease,z-index .5s ease";
    this.clearInputs(); // clear all inputs of form
  }

  clearInputs() {
    document.getElementById("town-city").value = "";
    document.getElementById("address1").value = "";
    document.getElementById("address2").value = "";
    document.getElementById("post-code").value = "";
    document.getElementById("county").value = "";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telephone").value = "";
  }

  getPopupValues() {
    return {
      townCity: document.getElementById("town-city").value,
      addressLine1: document.getElementById("address1").value,
      addressLine2: document.getElementById("address2").value,
      postCode: document.getElementById("post-code").value,
      county: document.getElementById("county").value,
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      telephone: document.getElementById("telephone").value
    };
  }
}

export default ContactApp;
