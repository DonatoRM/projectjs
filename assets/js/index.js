import {fetchData} from "./services.js";

document.addEventListener('DOMContentLoaded', () => {
  const authToken = window.localStorage.getItem('AUTH_CLIENT');
  if (authToken !== null) {
    void getAuthorizationByToken(authToken);
  } else {
    const form = document.getElementById('form');
    const errorLogin = document.getElementById('errorLogin');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const usernameComponent = document.getElementById('username');
      const passwordComponent = document.getElementById('password');
      void getAuthorization(usernameComponent, passwordComponent);
    }, false);
    document.getElementById('username').focus();
  }
}, false);
const getAuthorizationByToken = async (authToken) => {
  const errorLogin = document.getElementById('errorLogin');
  const {data, error} = await fetchData('http://192.168.0.2:81', 'Bearer ' + authToken, 'get');
  if (error) {
    const modal = document.getElementById('errorAuthorization');
    modal.classList.add('show');
    modal.style.display = 'block';
    errorLogin.innerHTML = error;
    const closeModal = document.getElementsByClassName('closeModal');
    for (let i = 0; i < closeModal.length; i++) {
      closeModal[i].addEventListener('click', () => {
        modal.classList.remove('show');
        modal.style.display = 'none';
        window.localStorage.removeItem('AUTH_CLIENT');
        window.localStorage.removeItem('role');
        window.localStorage.removeItem('selectedClient');
        window.localStorage.removeItem('selectedInstallation');
        window.localStorage.removeItem('selectedLocation');
        window.localStorage.removeItem('row');
        window.location='../../index.html';
      }, false);
    }
  } else {
    const role = parseInt(window.localStorage.getItem('role'));
    switch (role) {
      case 1:
      case 3:
        window.location.href = '../../views/operator.html';
        break;
      case 2:
        window.location.href = './views/client.html';
        break;
      default:
        throw new error('The selected option is invalid');
    }
  }
};
const getAuthorization = async (usernameComponent, passwordComponent) => {
  const errorLogin = document.getElementById('errorLogin');
  const {
    data,
    error
  } = await fetchData('http://192.168.0.2:81', 'Basic ' + btoa(usernameComponent.value + ':' + passwordComponent.value), 'get');
  // const {data, error} = await fetchAuthorization(usernameComponent.value, passwordComponent.value);
  if (error) {
    const modal = document.getElementById('errorAuthorization');
    modal.classList.add('show');
    modal.style.display = 'block';
    errorLogin.innerHTML = error;
    const closeModal = document.getElementsByClassName('closeModal');
    for (let i = 0; i < closeModal.length; i++) {
      closeModal[i].addEventListener('click', () => {
        passwordComponent.focus();
        passwordComponent.value = '';
        usernameComponent.focus();
        usernameComponent.value = '';
        modal.classList.remove('show');
        modal.style.display = 'none';
      }, false);
    }
  } else {
    const authToken = data.authToken;
    const role = data.role;
    if (authToken !== undefined) {
      window.localStorage.setItem('AUTH_CLIENT', authToken);
    }
    if (role !== undefined) {
      window.localStorage.setItem('role', role);
    }
    switch (role) {
      case 1:
      case 3:
        window.location.href = '../../views/operator.html';
        break;
      case 2:
        window.location.href = './views/client.html';
        break;
      default:
        throw new error('The selected option is invalid');
    }
  }
};