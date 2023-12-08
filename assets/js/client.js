import {fetchData} from "./services.js";

document.addEventListener('DOMContentLoaded', async () => {
  const role = parseInt(window.localStorage.getItem('role'));
  if (role !== 2) {
    window.location.href = '../../index.html';
  }
  const spinnerClient = document.querySelector('#spinnerClient');
  const client = document.getElementById('client');
  const installation = document.getElementById('installation');
  const location = document.getElementById('location');
  const desde = document.getElementById('desde');
  const hasta = document.getElementById('hasta');
  const table = document.getElementById('table');
  const exitButtons = document.getElementsByClassName('exit');
  const modalWarning = document.querySelector('#modalWarning');
  const url = 'http://192.168.0.2:81/view';
  const method = 'GET';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  const objView = await fetchData(url, authorization, method);
  if (objView.error) throw 'Error al solicitar los datos del cliente';
  sessionStorage.setItem('view', JSON.stringify(objView.data.data));
  const view = objView.data.data;
  client.value = view[0].client;
  installation.value = view[0].installation;
  const valuesLocations = [...new Set(view.map((elemento) => elemento.location))];
  valuesLocations.map(locationOption => {
    const option = document.createElement('option');
    option.value = locationOption;
    option.text = locationOption;
    location.appendChild(option);
  });
  showTable(view, location);
  spinnerClient.classList.remove('d-flex');
  spinnerClient.classList.add('d-none');
  // Final de Carga Inicial de datos
  // Eventos
  location.addEventListener('change', () => {
    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }
    showTable(view, location);
  }, false);
  desde.addEventListener('change', () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const now = `${year}-${month}-${day}`;
    if (hasta.value === '') hasta.value = now;
    if (desde.value <= hasta.value) {
      const newView = view.filter(obj => obj.date >= desde.value && obj.date <= hasta.value);
      while (table.firstChild) {
        table.removeChild(table.firstChild);
      }
      showTable(newView, location);
    } else {
      document.querySelector('#modalWarning #idTitleModalWarning').textContent = 'Error en la Fecha';
      document.querySelector('#modalWarning #idMessageModalWarning').textContent = 'La fecha tiene que ser inferior o igual a ' + hasta.value;
      modalWarning.classList.add('show');
      modalWarning.style.display = 'block';
      document.addEventListener('click', () => {
        modalWarning.classList.remove('block');
        modalWarning.style.display = 'none';
        desde.value = '';
      }, false);
    }
  }, false);

  hasta.addEventListener('change', () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const now = `${year}-${month}-${day}`;
    if (desde.value === '') desde.value = '2023-01-01';
    if (desde.value < hasta.value) {
      const newView = view.filter(obj => obj.date >= desde.value && obj.date <= hasta.value);
      while (table.firstChild) {
        table.removeChild(table.firstChild);
      }
      showTable(newView, location);
    } else {
      document.querySelector('#modalWarning #idTitleModalWarning').textContent = 'Error en la Fecha';
      document.querySelector('#modalWarning #idMessageModalWarning').textContent = 'La fecha tiene que ser superior o igual a ' + desde.value;
      modalWarning.classList.add('show');
      modalWarning.style.display = 'block';
      document.addEventListener('click', () => {
        modalWarning.classList.remove('block');
        modalWarning.style.display = 'none';
        hasta.value = '';
      }, false);
    }
  }, false);
  for (let button of exitButtons) {
    button.addEventListener('click', () => {
      const modalExit = document.getElementById('modalExit');
      const closeModalButtons = document.querySelector('#modalExit .close');
      modalExit.classList.add('show');
      modalExit.style.display = 'block';
      document.querySelector('#modalExit #exitSession').addEventListener('click', () => {
        sessionStorage.removeItem('view');
        localStorage.removeItem('AUTH_CLIENT');
        localStorage.removeItem('role');
        window.location.href = '../../index.html';
      }, false);
      for (let closeButton of closeModalButtons) {
        closeButton.addEventListener('click', () => {
          modalExit.classList.remove('show');
          modalExit.style.display = 'none';
        }, false);
      }
    });
  }

}, false);
const showTable = (view, location) => {
  view.filter(row => row.location === location.options[location.selectedIndex].value).sort((data1, data2) => {
    if (data1.position.toLowerCase() < data2.position.toLowerCase()) return -1;
    else if (data1.position.toLowerCase() > data2.position.toLowerCase()) return 1;
    else if (data1.date < data2.date) return 1;
    else if (data1.date > data2.date) return -1;
    else return 0
  }).map(element => {
    const row = document.createElement('tr');
    const tdDate = document.createElement('td');
    tdDate.textContent = element.date;
    tdDate.setAttribute('class', 'text-center');
    row.appendChild(tdDate);
    const tdPosition = document.createElement('td');
    tdPosition.textContent = element.position;
    tdPosition.setAttribute('class', 'text-center');
    row.appendChild(tdPosition);
    const tdPoint = document.createElement('td');
    tdPoint.textContent = element.point;
    tdPoint.setAttribute('class', 'text-center');
    row.appendChild(tdPoint);
    const tdFase = document.createElement('td');
    tdFase.textContent = element.fase;
    tdFase.setAttribute('class', 'text-center');
    row.appendChild(tdFase);
    const tdTemp = document.createElement('td');
    tdTemp.textContent = parseFloat(element.temp);
    tdTemp.setAttribute('class', 'text-center');
    row.appendChild(tdTemp);
    const tdTref = document.createElement('td');
    tdTref.textContent = parseFloat(element.tref);
    tdTref.setAttribute('class', 'text-center');
    row.appendChild(tdTref);
    const tdImax = document.createElement('td');
    tdImax.textContent = parseFloat(element.imax);
    tdImax.setAttribute('class', 'text-center');
    row.appendChild(tdImax);
    const tdIr = document.createElement('td');
    tdIr.textContent = parseFloat(element.ir);
    tdIr.setAttribute('class', 'text-center');
    row.appendChild(tdIr);
    table.appendChild(row);
  });
};