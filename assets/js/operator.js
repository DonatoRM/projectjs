import {fetchData} from './services.js';

document.addEventListener('DOMContentLoaded', () => {
  const role = parseInt(window.localStorage.getItem('role'));
  if (role === 2) {
    window.location.href = '../../index.html';
  }
  const selectClients = document.getElementById('clients');
  const selectInstallations = document.getElementById('installations');
  const selectLocations = document.getElementById('locations');
  // Falta selectPositions que es la tabla con los datos

  let selectClientValue = 1;
  let selectInstallationValue = 1;
  let selectLocationValue = 1;

  if (window.localStorage.getItem('selectClient')) {
    selectClientValue = parseInt(window.localStorage.getItem('selectClient'));
  }
  if (window.localStorage.getItem('selectInstallation')) {
    selectInstallationValue = parseInt(window.localStorage.getItem('selectInstallation'));
  }
  if (window.localStorage.getItem('selectLocation')) {
    selectLocationValue = parseInt(window.localStorage.getItem('selectLocation'));
  }


  const changeClients = async (event) => {
    const method = 'GET';
    const authToken = window.localStorage.getItem('AUTH_CLIENT');
    const authorization = 'Bearer ' + authToken;
    window.localStorage.setItem('selectClient', event.target.value);
    let url = 'http://192.168.0.2:81/installations?client=' + event.target.value;
    const selectInstallationsValue=await getInstallations(url, authorization, method, selectInstallations, selectLocations, selectInstallationValue);
    window.localStorage.setItem('selectInstallation', selectInstallationsValue);
    url = 'http://192.168.0.2:81/locations?installation='+selectInstallationsValue;
    const selectLocationsValue=await getLocations(url,authorization,method,selectLocations);
    window.localStorage.setItem('selectLocation', selectLocationsValue);
  }
  const changeInstallations = async (event) => {
    const method = 'GET';
    const authToken = window.localStorage.getItem('AUTH_CLIENT');
    const authorization = 'Bearer ' + authToken;
    window.localStorage.setItem('selectInstallation', event.target.value);
    const url = 'http://192.168.0.2:81/locations?installation=' + event.target.value;
    const selectLocationsValue=await getLocations(url, authorization, method, selectLocations);
    window.localStorage.setItem('selectLocation', selectLocationsValue);
  }

  selectClients.addEventListener('change', changeClients, false);
  selectInstallations.addEventListener('change', changeInstallations, false);

  void initialStateComponents(selectClients, selectInstallations, selectLocations, selectClientValue, selectInstallationValue, selectLocationValue);

}, false);
const getClients = async (url, authorization, method, selectClients, selectClientValue) => {
  const {data, error} = await fetchData(url, authorization, method);
  if (error) throw new error('Error al busca: ' + error);
  data.data.map(client => {
    let option = document.createElement("option");
    option.value = client.id;
    option.text = client.name;
    if (selectClientValue === client.id) {
      option.defaultSelected = true;
      window.localStorage.setItem('selectClient', client.id);
    }
    selectClients.appendChild(option);
  });
};
const getInstallations = async (url, authorization, method, selectInstallations, selectLocations, selectInstallationValue) => {
  const {data, error} = await fetchData(url, authorization, method);
  if (error) throw new error('Error al busca: ' + error);
  selectInstallations.innerHTML = '';
  data.data.map(installation => {
    let option = document.createElement("option");
    option.value = installation.id;
    option.text = installation.name;
    if (selectInstallationValue === installation.id) {
      option.defaultSelected = true;
      window.localStorage.setItem('selectInstallation', installation.id);
    }
    selectInstallations.appendChild(option);
  });

  return selectInstallations.options[0].value;
};
const getLocations = async (url, authorization, method, selectLocations,selectLocationValue) => {
  const {data, error} = await fetchData(url, authorization, method);
  if (error) throw new error('Error al busca: ' + error);
  selectLocations.innerHTML = '';
  data.data.map(location => {
    let option = document.createElement("option");
    option.value = location.id;
    option.text = location.name;
    if (selectLocationValue === location.id) {
      option.defaultSelected = true;
      window.localStorage.setItem('selectLocation', location.id);
    }
    selectLocations.appendChild(option);
  });
  return selectLocations.options[0].value;
};
// TODO: GET POSITIONS

// TODO: END GET POSITIONS
const initialStateComponents = async (selectClients, selectInstallations, selectLocations, selectClientValue, selectInstallationValue, selectLocationValue) => {
  const authToken = window.localStorage.getItem('AUTH_CLIENT');
  const authorization = 'Bearer ' + authToken;
  let url = 'http://192.168.0.2:81/clients';
  let method = 'GET';
  await getClients(url, authorization, method, selectClients,selectClientValue);
  url = `http://192.168.0.2:81/installations?client=${selectClientValue}`;
  await getInstallations(url, authorization, method, selectInstallations, selectLocations, selectInstallationValue);
  url='http://192.168.0.2:81/locations?installation='+selectLocationValue;
  await getLocations(url,authorization,method,selectLocations,selectLocationValue);
};