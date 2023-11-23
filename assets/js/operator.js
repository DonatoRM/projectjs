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
  const buttonExit = document.getElementById('exit');
  const buttonsBack = document.getElementsByClassName('close');
  const buttonSession = document.getElementById('exitSession');
  const popupExit = document.getElementById('popupExit');
  const modalNewClient = document.getElementById('modalClients');

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
  const exitSession = (event) => {

    popupExit.classList.add('show');
    popupExit.style.display = 'block';
  };
  const backPopup = () => {
    popupExit.classList.remove('show');
    popupExit.style.display = 'none';
  };
  const goToLogin = () => {
    sessionStorage.removeItem('positions');
    localStorage.removeItem('row');
    localStorage.removeItem('selectClient');
    localStorage.removeItem('selectInstallation');
    localStorage.removeItem('selectLocation');
    localStorage.removeItem('selectPosition');
    localStorage.removeItem('role');
    localStorage.removeItem('AUTH_CLIENT');
    window.location.href = '../../index.html';
  };

  selectClients.addEventListener('change', changeClients, false);
  selectInstallations.addEventListener('change', changeInstallations, false);
  selectLocations.addEventListener('change', changeLocations, false);
  searchContainer.addEventListener('input', changeSearch, false);
  buttonExit.addEventListener('click', exitSession, false);
  modalNewClient.addEventListener('shown.bs.modal', handleNewClientModal, false);
  for (let i = 0; i < buttonsBack.length; i++) {
    buttonsBack[i].addEventListener('click', backPopup, false);
  }
  buttonSession.addEventListener('click', goToLogin, false);
  const countryNewClient = document.getElementById('countryNewClient');
  countryNewClient.addEventListener('change', handleChangeNewCountry, false);

  const provinceNewClient = document.getElementById('provinceNewClient');
  provinceNewClient.addEventListener('change', handleChangeNewProvince, false);

  const buttonDeleteNewClients = document.getElementById('resetNewClient');
  buttonDeleteNewClients.addEventListener('click', handleButtonDeleteNewClients, false);

  modalNewClient.addEventListener('hidden.bs.modal', handleButtonBackNewClients, false);

  void initialStateComponents(selectClients, selectInstallations, selectLocations, selectClientValue, selectInstallationValue, selectLocationValue);
}, false);

const handleButtonBackNewClients = event => {
  const modal=event.target;
  const objNewClient={
    name: document.querySelector('#modalClients #nameNewClient').value,
    cp: document.querySelector('#modalClients #zipCodeNewClient').value,
    country: document.querySelector('#modalClients #countryNewClient').value,
    province: document.querySelector('#modalClients #provinceNewClient').value,
    municipality: document.querySelector('#modalClients #municipalityNewClient').value,
    address: document.querySelector('#modalClients #addressNewClient').value,
    phone: document.querySelector('#modalClients #phoneNewClient').value,
    email: document.querySelector('#modalClients #emailNewClient').value,
  }
  sessionStorage.setItem('objNewClient',JSON.stringify(objNewClient));
};

const handleButtonDeleteNewClients = async event => {
  const provinceNewClient = document.getElementById('provinceNewClient');
  for (let i = provinceNewClient.length - 1; i >= 0; i--) {
    provinceNewClient.options[i] = null;
  }
  const municipalityNewClient = document.getElementById('municipalityNewClient');
  for (let i = municipalityNewClient.length - 1; i >= 0; i--) {
    municipalityNewClient.options[i] = null;
  }
  const selectNewCountry = document.getElementById('countryNewClient');
  const valueNewCountry = parseInt(selectNewCountry.options[selectNewCountry.selectedIndex].value);
  let url = `http://localhost:81/provinces?country=${valueNewCountry}`;
  const method = 'GET';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  const objProvinces = await fetchData(url, authorization, method);
  if (objProvinces.error) throw new error('Error al solicitar las provincias');
  objProvinces.data.data.map(province => {
    const option = document.createElement('option');
    option.value = province.id;
    option.text = province.name;
    provinceNewClient.appendChild(option);
  });
  url = `http://localhost:81/municipalities?province=${objProvinces.data.data[0].id}`;
  const objMunicipalities = await fetchData(url, authorization, method);
  if (objMunicipalities.error) throw new error('Error al solicitar los municipios');
  objMunicipalities.data.data.map(municipality => {
    const option = document.createElement('option');
    option.value = municipality.id;
    option.text = municipality.name;
    municipalityNewClient.appendChild(option);
  });
};

const handleChangeNewProvince = async event => {
  const municipalityNewClient = document.getElementById('municipalityNewClient');
  for (let i = municipalityNewClient.length - 1; i >= 0; i--) {
    municipalityNewClient.options[i] = null;
  }
  const selectNewProvince = event.target;
  const valueNewProvince = parseInt(selectNewProvince.options[selectNewProvince.selectedIndex].value);
  let url = `http://localhost:81/municipalities?province=${valueNewProvince}`;
  const method = 'GET';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  const objMunicipalities = await fetchData(url, authorization, method);
  if (objMunicipalities.error) throw new error('Error al solicitar las provincias');
  objMunicipalities.data.data.map(municipality => {
    const option = document.createElement('option');
    option.value = municipality.id;
    option.text = municipality.name;
    municipalityNewClient.appendChild(option);
  });

};

const handleChangeNewCountry = async event => {
  const provinceNewClient = document.getElementById('provinceNewClient');
  for (let i = provinceNewClient.length - 1; i >= 0; i--) {
    provinceNewClient.options[i] = null;
  }
  const municipalityNewClient = document.getElementById('municipalityNewClient');
  for (let i = municipalityNewClient.length - 1; i >= 0; i--) {
    municipalityNewClient.options[i] = null;
  }
  const selectNewCountry = event.target;
  const valueNewCountry = parseInt(selectNewCountry.options[selectNewCountry.selectedIndex].value);
  let url = `http://localhost:81/provinces?country=${valueNewCountry}`;
  const method = 'GET';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  const objProvinces = await fetchData(url, authorization, method);
  if (objProvinces.error) throw new error('Error al solicitar las provincias');
  objProvinces.data.data.map(province => {
    const option = document.createElement('option');
    option.value = province.id;
    option.text = province.name;
    provinceNewClient.appendChild(option);
  });
  url = `http://localhost:81/municipalities?province=${objProvinces.data.data[0].id}`;
  const objMunicipalities = await fetchData(url, authorization, method);
  if (objMunicipalities.error) throw new error('Error al solicitar los municipios');
  objMunicipalities.data.data.map(municipality => {
    const option = document.createElement('option');
    option.value = municipality.id;
    option.text = municipality.name;
    municipalityNewClient.appendChild(option);
  });

};
const handleNewClientModal = async (event) => {
  const countryNewClient = document.querySelector('#modalClients #countryNewClient');
  const provinceNewClient = document.querySelector('#modalClients #provinceNewClient');
  const municipalityNewClient = document.querySelector('#modalClients #municipalityNewClient');
  let objNewClient=null;
  if(sessionStorage.getItem('objNewClient')) {
    objNewClient=JSON.parse(sessionStorage.getItem('objNewClient'));
    sessionStorage.removeItem('objNewClient');
  }
  for (let i = countryNewClient.length - 1; i >= 0; i--) {
    countryNewClient.options[i] = null;
  }
  for (let i = provinceNewClient.length - 1; i >= 0; i--) {
    provinceNewClient.options[i] = null;
  }
  for (let i = municipalityNewClient.length - 1; i >= 0; i--) {
    municipalityNewClient.options[i] = null;
  }
  let url = 'http://localhost:81/countries';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  const method = 'GET';
  const objCountries = await fetchData(url, authorization, method);
  if (objCountries.error) new error('Error al solicitar los clientes');
  objCountries.data.data.map(country => {
    const option = document.createElement('option');
    option.value = country.id;
    option.text = country.name;
    if(objNewClient && option.value===objNewClient.country) {
      option.setAttribute('selected',true);
    }
    countryNewClient.appendChild(option);
  });
  url = 'http://localhost:81/provinces?country=' + countryNewClient.options[countryNewClient.selectedIndex].value;
  const objProvinces = await fetchData(url, authorization, method);
  if (objProvinces.error) throw new error('Error al solicitar las provincias');
  objProvinces.data.data.map(province => {
    const option = document.createElement('option');
    option.value = province.id;
    option.text = province.name;
    if(objNewClient && option.value===objNewClient.province) {
      option.setAttribute('selected',true);
    }
    provinceNewClient.appendChild(option);
  });
  url = 'http://localhost:81/municipalities?province='+ provinceNewClient.options[provinceNewClient.selectedIndex].value;
  const objMunicipality = await fetchData(url, authorization, method);
  if (objMunicipality.error) throw new error('Error al solicitar los municipios');
  objMunicipality.data.data.map(province => {
    const option = document.createElement('option');
    option.value = province.id;
    option.text = province.name;
    if(objNewClient && option.value===objNewClient.municipality) {
      option.setAttribute('selected',true);
    }
    municipalityNewClient.appendChild(option);
  });
  if(objNewClient) {
    document.getElementById('nameNewClient').value=objNewClient.name;
    document.getElementById('zipCodeNewClient').value=objNewClient.cp;
    document.getElementById('addressNewClient').value=objNewClient.address;
    document.getElementById('phoneNewClient').value=objNewClient.phone;
    document.getElementById('emailNewClient').value=objNewClient.email;
  }
};
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
  return data.data;
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
    positions = positions.filter(position => position.name.toLowerCase().includes(searchText.toLowerCase()) || position.element.toLowerCase().includes(searchText.toLowerCase()) || position.point.toLowerCase().includes(searchText.toLowerCase()));
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
    tdTrash.innerHTML = "<button type='button' class='btn bg-color-marron text-white rounded-circle' data='position.id'><i class=\"fa-solid fa-trash\"></i></button>";
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
    tdTrash.innerHTML = "<button type='button' class='btn bg-color-marron text-white rounded-circle' value='" + position.id + "'><i class=\"fa-solid fa-trash\"></i></button>";
    tdTrash.setAttribute('class', 'text-center align-middle');
    row.appendChild(tdTrash);
    table.appendChild(row);
  });
  const buttonsDelete = table.querySelectorAll('tr td button');
  for (let i = 0; i < buttonsDelete.length; i++) {
    buttonsDelete[i].addEventListener('click', handleButtonDelete, false);
  }
  const rowsTable = table.getElementsByTagName('tr');
  for (let i = 0; i < rowsTable.length; i++) {
    rowsTable[i].addEventListener('click', clickRow, false);
  }
  if (sessionStorage.getItem('positions')) {
    sessionStorage.removeItem(('positions'));
  }
  sessionStorage.setItem('positions', JSON.stringify(data.data));
};
const handleButtonDelete = async event => {
  event.stopPropagation();
  let tr = event.target.parentNode;
  while (tr.nodeName.toLowerCase() !== 'tr') {
    tr = tr.parentNode;
  }
  const idRowSelected = parseInt(tr.cells[0].innerHTML);
  sessionStorage.setItem('idRowDeleted', idRowSelected);
  let button = event.target;
  if (button.nodeName.toLowerCase() !== 'button') {
    button = button.parentNode;
  }
  const modalDanger = document.getElementById('modalDanger');
  modalDanger.classList.add('show');
  modalDanger.style.display = 'block';
  const buttonBack = modalDanger.getElementsByClassName('backMessage')[0];
  buttonBack.addEventListener('click', handleBackModalDanger, false);
  const buttonDelete = modalDanger.querySelector('#borrar');
  buttonDelete.addEventListener('click', deleteRowPosition, false);
};
const handleBackModalDanger = event => {
  const modalDanger = document.getElementById('modalDanger');
  modalDanger.classList.remove('show');
  modalDanger.style.display = 'none';
};
const deleteRowPosition = async event => {
  const modalDanger = document.getElementById('modalDanger');
  const idRowSelected = parseInt(JSON.parse(sessionStorage.getItem('idRowDeleted')));
  const objDelete = {
    id: idRowSelected
  }
  sessionStorage.removeItem(('idRowDeleted'));
  const method = 'DELETE';
  const authToken = window.localStorage.getItem('AUTH_CLIENT');
  const authorization = 'Bearer ' + authToken;
  let url = 'http://192.168.0.2:81/positions';
  const {data, error} = await fetchData(url, authorization, method, objDelete);
  if (error) throw new Error('Error al buscar: ' + error);
  window.location.href = '../../views/operator.html';
};
const clickRow = event => {
  if (event.target.nodeName.toLowerCase() !== 'tr') {
    let tr = event.target.parentNode;
    while (tr.nodeName.toLowerCase() !== 'tr') {
      tr = tr.parentNode;
    }
    const hijo = tr.children;
    const objPosition = {
      id: parseInt(tr.children[0].textContent),
      position: tr.children[1].textContent,
      element: tr.children[2].textContent,
      point: tr.children[3].textContent,
      fase: tr.children[4].textContent
    }
    window.localStorage.setItem('row', JSON.stringify(objPosition));
    window.location = '../../views/defects.html';
  }
};
const initialStateComponents = async (selectClients, selectInstallations, selectLocations, selectClientValue, selectInstallationValue, selectLocationValue) => {
  const authToken = window.localStorage.getItem('AUTH_CLIENT');
  const authorization = 'Bearer ' + authToken;
  let url = 'http://192.168.0.2:81/clients';
  let method = 'GET';
  const arrayClientes = await getClients(url, authorization, method, selectClients, selectClientValue);
  url = `http://192.168.0.2:81/installations?client=${selectClientValue}`;
  await getInstallations(url, authorization, method, selectInstallations, selectLocations, selectInstallationValue);
  url = 'http://192.168.0.2:81/locations?installation=' + selectLocationValue;
  await getLocations(url, authorization, method, selectLocations, selectLocationValue);
  url = 'http://192.168.0.2:81/positions?location=' + selectLocationValue;
  await getPositions(url, authorization, method, table);
  const selectTotalClients = document.querySelector('#modalClients #totalClients');
  arrayClientes.forEach((objectClient, index) => {
    const option = document.createElement('option');
    option.value = objectClient.id;
    option.text = objectClient.name;
    selectTotalClients.appendChild((option));
  });
  selectTotalClients.selectedIndex = -1;
};