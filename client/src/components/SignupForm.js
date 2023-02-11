import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

const SignupForm = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [validated] = useState(false); // set state for form validation
  const [showAlert, setShowAlert] = useState(false); // set state for alert
  const [createUser] = useMutation(ADD_USER);
  // update state based on form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if(form.checkValidity() === false) {
      console.log("Form doesn't have everything")
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      const { data } = await createUser({
        variables: { ...formState }
      })
      Auth.login(data.addUser.token)
    } catch (e) {
      console.error(e);
    }
  };
  // setFormState({
  //   username: '',
  //   email: '',
  //   password: '',
  // });
  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={formState.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={formState.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={formState.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(formState.username && formState.email && formState.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};
export default SignupForm;
