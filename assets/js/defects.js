import {fetchData} from './services.js';

document.addEventListener('DOMContentLoaded', () => {
  const role = parseInt(window.localStorage.getItem('role'));
  if (role === 2) {
    window.location.href = '../../index.html';
  }
  const objPosition = JSON.parse(window.localStorage.getItem('row'));
  const table = document.getElementById('table');
  const buttonNew = document.getElementById('new');
  const buttonBack = document.getElementById('back');
  const buttonsBackMessage = document.getElementsByClassName('backMessage');

  document.getElementById('position').value = objPosition.position;
  document.getElementById('element').value = objPosition.element;
  document.getElementById('point').value = objPosition.point;
  document.getElementById('fase').value = objPosition.fase;

  buttonNew.addEventListener('click', handleNewDefect, false);
  buttonBack.addEventListener('click', handleBack, false);
  for (let i = 0; i < buttonsBackMessage.length; i++) {
    buttonsBackMessage[i].addEventListener('click',goBack,false);
  }

  void getDefects(objPosition.id, table);

}, false);
const goBack = event => {
  const modalDanger=document.getElementById('modalDanger');
  const modalWarning=document.getElementById('modalWarning');
  modalDanger.classList.remove('show');
  modalDanger.style.display='none';
  modalWarning.classList.remove('show');
  modalWarning.style.display='none';
};
const handleBack = (event) => {
  console.log('Volver atrás');
};
const handleNewDefect = (event) => {
  console.log('Nuevo defecto');
};
const handleUpdate = (event) => {
  console.log('actualizar registro de defecto');
};
const handleDelete = (event) => {
  const modalDanger = document.getElementById('modalDanger');
  modalDanger.classList.add('show');
  modalDanger.style.display = 'block';
};
const getDefects = async (id, table) => {
  const method = 'GET';
  const authToken = window.localStorage.getItem('AUTH_CLIENT');
  const authorization = 'Bearer ' + authToken;
  const url = 'http://192.168.0.2:81/defects?position=' + id;
  const {data, error} = await fetchData(url, authorization, method);
  if (error) throw new error('Error al buscar: ' + error);
  const tds = table.getElementsByTagName('td');
  while (tds.length > 0) {
    tds[0].parentNode.removeChild(tds[0]);
  }
  data.data.map(point => {
    const row = document.createElement('tr');
    const tdId = document.createElement('td');
    tdId.textContent = point.id;
    tdId.setAttribute('class', 'text-center');
    row.appendChild(tdId);
    const tdDate = document.createElement('td');
    tdDate.textContent = point.date;
    tdDate.setAttribute('class', 'text-center');
    row.appendChild(tdDate);
    const tdWind = document.createElement('td');
    tdWind.textContent = parseFloat(point.wind);
    tdWind.setAttribute('class', 'text-center');
    row.appendChild(tdWind);
    const tdEmissivity = document.createElement('td');
    tdEmissivity.textContent = parseFloat(point.emissivity);
    tdEmissivity.setAttribute('class', 'text-center');
    row.appendChild(tdEmissivity);
    const tdPointTemperature = document.createElement('td');
    tdPointTemperature.textContent = parseFloat(point.point_temperature);
    tdPointTemperature.setAttribute('class', 'text-center');
    row.appendChild(tdPointTemperature);
    const tdReferenceTemperature = document.createElement('td');
    tdReferenceTemperature.textContent = parseFloat(point.reference_temperature);
    tdReferenceTemperature.setAttribute('class', 'text-center');
    row.appendChild(tdReferenceTemperature);
    const tdRoomTemperature = document.createElement('td');
    tdRoomTemperature.textContent = parseFloat(point.room_temperature);
    tdRoomTemperature.setAttribute('class', 'text-center');
    row.appendChild(tdRoomTemperature);
    const tdReflectedApparentTemperatute = document.createElement('td');
    tdReflectedApparentTemperatute.textContent = parseFloat(point.reflected_apparent_temperature);
    tdReflectedApparentTemperatute.setAttribute('class', 'text-center');
    row.appendChild(tdReflectedApparentTemperatute);
    const tdMaximumCurrent = document.createElement('td');
    tdMaximumCurrent.textContent = parseFloat(point.maximum_current);
    tdMaximumCurrent.setAttribute('class', 'text-center');
    row.appendChild(tdMaximumCurrent);
    const tdCurrent = document.createElement('td');
    tdCurrent.textContent = parseFloat(point.current);
    tdCurrent.setAttribute('class', 'text-center');
    row.appendChild(tdCurrent);
    const tdIcons = document.createElement('td');
    const buttonUpdate = document.createElement('button');
    buttonUpdate.setAttribute('class', 'btn bg-color-green text-white rounded-circle me-2 update');
    buttonUpdate.innerHTML = '<i class=\"fa-solid fa-pencil\"></i>';
    buttonUpdate.addEventListener('click', handleUpdate, false);
    tdIcons.appendChild(buttonUpdate);
    const buttonDelete = document.createElement('button');
    buttonDelete.setAttribute('class', 'btn bg-color-marron text-white rounded-circle delete');
    buttonDelete.innerHTML = '<i class=\"fa-solid fa-trash\"></i>';
    buttonDelete.addEventListener('click', handleDelete, false);
    tdIcons.appendChild(buttonDelete);
    tdIcons.setAttribute('class', 'text-center');
    row.appendChild(tdIcons);
    table.appendChild(row);
  });
};