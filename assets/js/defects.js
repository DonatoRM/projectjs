import {fetchData} from './services.js';

document.addEventListener('DOMContentLoaded', () => {
  const role = parseInt(window.localStorage.getItem('role'));
  if (role === 2) {
    window.location.href = '../../index.html';
  }
  const objPosition = JSON.parse(window.localStorage.getItem('row'));
  // window.localStorage.removeItem('row');
  const table=document.getElementById('table');
  document.getElementById('id').textContent = objPosition.id;
  document.getElementById('position').textContent = objPosition.position;
  document.getElementById('element').textContent = objPosition.element;
  document.getElementById('point').textContent = objPosition.point;
  document.getElementById('fase').textContent = objPosition.fase;
  void getDefects(objPosition.id,table);
}, false);
const getDefects = async(id,table) => {
  const method = 'GET';
  const authToken = window.localStorage.getItem('AUTH_CLIENT');
  const authorization = 'Bearer ' + authToken;
  const url = 'http://192.168.0.2:81/defects?position='+id;
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
    tdWind.textContent = point.wind;
    tdWind.setAttribute('class', 'text-center');
    row.appendChild(tdWind);
    const tdEmissivity = document.createElement('td');
    tdEmissivity.textContent = point.emissivity;
    tdEmissivity.setAttribute('class', 'text-center');
    row.appendChild(tdEmissivity);
    const tdPointTemperature = document.createElement('td');
    tdPointTemperature.textContent = point.point_temperature;
    tdPointTemperature.setAttribute('class', 'text-center');
    row.appendChild(tdPointTemperature);
    // TODO
    const tdReferenceTemperature = document.createElement('td');
    tdReferenceTemperature.textContent = point.reference_temperature;
    tdReferenceTemperature.setAttribute('class', 'text-center');
    row.appendChild(tdReferenceTemperature);
    // TODO
    const tdRoomTemperature = document.createElement('td');
    tdRoomTemperature.textContent = point.room_temperature;
    tdRoomTemperature.setAttribute('class', 'text-center');
    row.appendChild(tdRoomTemperature);
    const tdReflectedApparentTemperatute = document.createElement('td');
    tdReflectedApparentTemperatute.textContent = point.reflected_apparent_temperature;
    tdReflectedApparentTemperatute.setAttribute('class', 'text-center');
    row.appendChild(tdReflectedApparentTemperatute);
    const tdMaximumCurrent = document.createElement('td');
    tdMaximumCurrent.textContent = point.maximum_current;
    tdMaximumCurrent.setAttribute('class', 'text-center');
    row.appendChild(tdMaximumCurrent);
    const tdCurrent = document.createElement('td');
    tdCurrent.textContent = point.current;
    tdCurrent.setAttribute('class', 'text-center');
    row.appendChild(tdCurrent);
    const tdFeedback = document.createElement('td');
    tdFeedback.textContent = point.feedback;
    tdFeedback.setAttribute('class', 'text-center');
    row.appendChild(tdFeedback);
    const tdThermogram = document.createElement('td');
    tdThermogram.textContent = point.thermogram;
    tdThermogram.setAttribute('class', 'text-center');
    row.appendChild(tdThermogram);
    const tdPhoto = document.createElement('td');
    tdPhoto.textContent = point.photo;
    tdPhoto.setAttribute('class', 'text-center');
    row.appendChild(tdPhoto);
    table.appendChild(row);
    // const rowsTable = table.getElementsByTagName('tr');
    // for (let i = 0; i < rowsTable.length; i++) {
    //   rowsTable[i].addEventListener('click', clickRow, false);
    // }
  });
};