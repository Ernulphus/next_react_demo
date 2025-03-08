import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from "next/link";
 
import { BACKEND_URL } from '@/app/constants.js';

const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;
const PEOPLE_CREATE_ENDPOINT = `${BACKEND_URL}/people/create`;
const ROLES_ENDPOINT = `${BACKEND_URL}/roles`;

function AddPersonForm({
  visible,
  cancel,
  fetchPeople,
  setError,
  roleOptions,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const changeName = (event) => { setName(event.target.value); };
  const changeEmail = (event) => { setEmail(event.target.value); };
  const changeRole = (event) => { setRole(event.target.value); };

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: name,
      email: email,
      roles: role,
      affiliation: '',
    }
    axios.put(PEOPLE_CREATE_ENDPOINT, newPerson)
      .then(fetchPeople)
      .catch((error) => { setError(`There was a problem adding the person. ${error}`); });
  };

  if (!visible) return null;
  return (
    <form>
      <label htmlFor="name">
        Name
      </label>
      <input required type="text" id="name" value={name} onChange={changeName} />
      <label htmlFor="email">
        Email
      </label>
      <input required type="text" id="email" onChange={changeEmail} />
      <select required name='role' onChange={changeRole}>
        {
          Object.keys(roleOptions).map((code) => (
            <option key={code} value={code}>
              {roleOptions[code]}
            </option>
          ))
        }
      </select>

      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={addPerson}>Submit</button>
    </form>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      {message}
    </div>
  );
}

function Person({
  person,
  fetchPeople,
  roleMap,
 }) {
  const { name, email, roles } = person;

  const deletePerson = () => {
    axios.delete(`${PEOPLE_READ_ENDPOINT}/${email}`)
      .then(fetchPeople)
  }

  return (
    <div>
      <Link to={email}>
        <div className="person-container">
          <h2>{name}</h2>
          <p>
            Email: {email}
          </p>
          <ul>
            Roles: {roles.map((role) => (<li key={role}>{ roleMap[role] }</li>))}
          </ul>
        </div>
      </Link>
      <button onClick={deletePerson}>Delete person</button>
    </div>
  );
}

function peopleObjectToArray(Data) {
  const keys = Object.keys(Data);
  const people = keys.map((key) => Data[key]);
  return people;
}


function People() {
  const [error, setError] = useState('');
  const [people, setPeople] = useState([]);
  const [addingPerson, setAddingPerson] = useState(false);
  const [roleMap, setRoleMap] = useState({});


  const fetchPeople = () => {
    axios.get(PEOPLE_READ_ENDPOINT)
      .then(
        ({ data }) => { setPeople(peopleObjectToArray(data)) }
    )
      .catch((error) => setError(`There was a problem retrieving the list of people. ${error}`));
  };

  const getRoles = () => {
    axios.get(ROLES_ENDPOINT)
      .then(({ data }) => setRoleMap(data))
      .catch((error) => { setError(`There was a problem getting roles. ${error}`); });
  }

  const showAddPersonForm = () => { setAddingPerson(true); };
  const hideAddPersonForm = () => { setAddingPerson(false); };

  useEffect(fetchPeople, []);
  useEffect(getRoles, []);


  return (
    <div className="wrapper">
      <header>
        <h1>
          View All People
        </h1>
        <button type="button" onClick={showAddPersonForm}>
          Add a Person
        </button>
      </header>
      <AddPersonForm
        visible={addingPerson}
        cancel={hideAddPersonForm}
        fetchPeople={fetchPeople}
        setError={setError}
        roleOptions={roleMap}
      />
      {error && <ErrorMessage message={error} />}
      {
      people.map((person) => 
        <Person
          key={person.email}
          person={person}
          fetchPeople={fetchPeople}
          roleMap={roleMap}
        />
      )
      }
    </div>
  );
}

export default People;
