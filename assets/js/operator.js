import {fetchData} from './services.js';

document.addEventListener('DOMContentLoaded', () => {
  const role = parseInt(window.localStorage.getItem('role'));
  if (role === 2) {
    window.location.href = '../../index.html';
  }
  const selectClients = document.getElementById('clients');
  const selectInstallations = document.getElementById('installations');
  const selectLocations = document.getElementById('locations');
  const searchContainer = document.getElementById('search');
  const table = document.getElementById('table');

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
    const selectInstallationsValue = await getInstallations(url, authorization, method, selectInstallations, selectLocations, selectInstallationValue);
    window.localStorage.setItem('selectInstallation', selectInstallationsValue);
    url = 'http://192.168.0.2:81/locations?installation=' + selectInstallationsValue;
    const selectLocationsValue = await getLocations(url, authorization, method, selectLocations);
    window.localStorage.setItem('selectLocation', selectLocationsValue);
    url = 'http://192.168.0.2:81/positions?location=' + selectLocationsValue;
    await getPositions(url, authorization, method, table);
  }
  const changeInstallations = async (event) => {
    const method = 'GET';
    const authToken = window.localStorage.getItem('AUTH_CLIENT');
    const authorization = 'Bearer ' + authToken;
    window.localStorage.setItem('selectInstallation', event.target.value);
    let url = 'http://192.168.0.2:81/locations?installation=' + event.target.value;
    const selectLocationsValue = await getLocations(url, authorization, method, selectLocations);
    window.localStorage.setItem('selectLocation', selectLocationsValue);
    url = 'http://192.168.0.2:81/positions?location=' + selectLocationsValue;
    await getPositions(url, authorization, method, table);
  }
  const changeLocations = async (event) => {
    const method = 'GET';
    const authToken = window.localStorage.getItem('AUTH_CLIENT');
    const authorization = 'Bearer ' + authToken;
    window.localStorage.setItem('selectLocation', event.target.value);
    let url = 'http://192.168.0.2:81/positions?location=' + event.target.value;
    const selectPositionsValue = await getPositions(url, authorization, method, table);
    window.localStorage.setItem('selectPosition', selectPositionsValue);
  }
  const changeSearch = (event) => {
    const searchText = event.target.value;
    const positions = JSON.parse(sessionStorage.getItem('positions'));
    getNewPositions(table, positions, searchText);
  };

  selectClients.addEventListener('change', changeClients, false);
  selectInstallations.addEventListener('change', changeInstallations, false);
  selectLocations.addEventListener('change', changeLocations, false);
  searchContainer.addEventListener('input', changeSearch, false);

void  initialStateComponents(selectClients, selectInstallations, selectLocations, selectClientValue, selectInstallationValue, selectLocationValue);
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
const getLocations = async (url, authorization, method, selectLocations, selectLocationValue) => {
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
const getNewPositions = (table, positions, searchText) => {
  const tds = table.getElementsByTagName('td');
  while (tds.length > 0) {
    tds[0].parentNode.removeChild(tds[0]);
  }
  if (searchText !== '') {
    positions = positions.filter(position => position.name.includes(searchText) || position.element.includes(searchText) || position.point.includes(searchText));
  }
  positions.map(position => {
    const row = document.createElement('tr');
    const tdId = document.createElement('td');
    tdId.setAttribute('class', 'text-center align-middle');
    tdId.textContent = position.id;
    row.appendChild(tdId);
    const tdPosition = document.createElement('td');
    tdPosition.setAttribute('class', 'text-center align-middle');
    tdPosition.textContent = position.name;
    row.appendChild(tdPosition);
    const tdElement = document.createElement('td');
    tdElement.textContent = position.element;
    tdElement.setAttribute('class', 'text-center align-middle');
    row.appendChild(tdElement);
    const tdPoint = document.createElement('td');
    tdPoint.setAttribute('class', 'text-center align-middle');
    tdPoint.textContent = position.point;
    row.appendChild(tdPoint);
    const tdFase = document.createElement('td');
    tdFase.textContent = position.fase;
    tdFase.setAttribute('class', 'text-center align-middle');
    row.appendChild(tdFase);
    const tdTrash = document.createElement('td');
    tdTrash.innerHTML = "<button type='button' class='btn bg-color-marron text-white rounded-circle'><i class=\"fa-solid fa-trash\"></i></button>";
    tdTrash.setAttribute('class', 'text-center align-middle');
    row.appendChild(tdTrash);
    const tdType = document.createElement('td');
    table.appendChild(row);
    const rowsTable = table.getElementsByTagName('tr');
    for (let i = 0; i < rowsTable.length; i++) {
      rowsTable[i].addEventListener('click', clickRow, false);
    }
  });
  return positions;
};
const getPositions = async (url, authorization, method, table) => {
  const {data, error} = await fetchData(url, authorization, method);
  if (error) throw new error('Error al buscar: ' + error);
  const tds = table.getElementsByTagName('td');
  while (tds.length > 0) {
    tds[0].parentNode.removeChild(tds[0]);
  }
  data.data.map(position => {
    const row = document.createElement('tr');
    const tdId = document.createElement('td');
    tdId.setAttribute('class', 'text-center align-middle');
    tdId.textContent = position.id;
    row.appendChild(tdId);
    const tdPosition = document.createElement('td');
    tdPosition.setAttribute('class', 'text-center align-middle');
    tdPosition.textContent = position.name;
    row.appendChild(tdPosition);
    const tdElement = document.createElement('td');
    tdElement.textContent = position.element;
    tdElement.setAttribute('class', 'text-center align-middle');
    row.appendChild(tdElement);
    const tdPoint = document.createElement('td');
    tdPoint.setAttribute('class', 'text-center align-middle');
    tdPoint.textContent = position.point;
    row.appendChild(tdPoint);
    const tdFase = document.createElement('td');
    tdFase.textContent = position.fase;
    tdFase.setAttribute('class', 'text-center align-middle');
    row.appendChild(tdFase);
    const tdTrash = document.createElement('td');
    tdTrash.innerHTML = "<button type='button' class='btn bg-color-marron text-white rounded-circle'><i class=\"fa-solid fa-trash\"></i></button>";
    tdTrash.setAttribute('class', 'text-center align-middle');
    row.appendChild(tdTrash);
    const tdType = document.createElement('td');
    table.appendChild(row);
    const rowsTable = table.getElementsByTagName('tr');
    for (let i = 0; i < rowsTable.length; i++) {
      rowsTable[i].addEventListener('click', clickRow, false);
    }
  });
  if (sessionStorage.getItem('positions')) {
    sessionStorage.removeItem(('positions'));
  }
  sessionStorage.setItem('positions', JSON.stringify(data.data));
};
const clickRow = event => {
  // console.log(parseInt(event.target.parentNode.children[0].textContent));
  const tr = event.target.parentNode;
  const objPosition = {
    id: parseInt(tr.children[0].textContent),
    position: tr.children[1].textContent,
    element: tr.children[2].textContent,
    point: tr.children[3].textContent,
    fase: tr.children[4].textContent
  }
  window.localStorage.setItem('row', JSON.stringify(objPosition));
  window.location = '../../views/defects.html';
};
const initialStateComponents = async (selectClients, selectInstallations, selectLocations, selectClientValue, selectInstallationValue, selectLocationValue) => {
  const authToken = window.localStorage.getItem('AUTH_CLIENT');
  const authorization = 'Bearer ' + authToken;
  let url = 'http://192.168.0.2:81/clients';
  let method = 'GET';
  await getClients(url, authorization, method, selectClients, selectClientValue);
  url = `http://192.168.0.2:81/installations?client=${selectClientValue}`;
  await getInstallations(url, authorization, method, selectInstallations, selectLocations, selectInstallationValue);
  url = 'http://192.168.0.2:81/locations?installation=' + selectLocationValue;
  await getLocations(url, authorization, method, selectLocations, selectLocationValue);
  url = 'http://192.168.0.2:81/positions?location=' + selectLocationValue;
  await getPositions(url, authorization, method, table);
};