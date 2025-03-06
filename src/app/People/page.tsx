import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import Link from "next/link";
 
import { BACKEND_URL } from '../../constants';

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
