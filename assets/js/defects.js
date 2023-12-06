import {fetchData} from './services.js';

document.addEventListener('DOMContentLoaded', async () => {
  const role = parseInt(window.localStorage.getItem('role'));
  if (role === 2) {
    window.location.href = '../../index.html';
  }
  const objPosition = JSON.parse(window.localStorage.getItem('row'));
  const table = document.getElementById('table');
  const buttonNew = document.getElementById('new');
  const buttonBack = document.getElementById('back');
  const buttonBackNewDefect = document.getElementById('backNewDefect');
  const buttonsBackMessage = document.getElementsByClassName('backMessage');
  const typeButtonDefect = document.getElementById('typeButtonDefect');
  const inputsDefectsModal = document.getElementsByTagName('input');
  const modalInfoButton = document.getElementById('modalInfo');
  const deleteButtonModal = document.getElementById('borrar');
  const spinnerDefects = document.getElementById('spinnerDefects');
  const defects = document.getElementById('defects');

  sessionStorage.setItem('position', JSON.stringify(objPosition.id));
  document.getElementById('position').value = objPosition.position;
  document.getElementById('element').value = objPosition.element;
  document.getElementById('point').value = objPosition.point;
  document.getElementById('fase').value = objPosition.fase;

  buttonNew.addEventListener('click', handleNewDefect, false);
  buttonBack.addEventListener('click', handleBack, false);
  for (let i = 0; i < buttonsBackMessage.length; i++) {
    buttonsBackMessage[i].addEventListener('click', goBack, false);
  }
  for (let i = 0; i < inputsDefectsModal.length; i++) {
    inputsDefectsModal[i].addEventListener('blur', errorControls, false);
  }
  buttonBackNewDefect.addEventListener('click', handleBackNewDefect, false);
  typeButtonDefect.addEventListener('click', handleTypeButtonDefect, false);
  modalInfoButton.addEventListener('click', handleBackInfo, false);
  deleteButtonModal.addEventListener('click', handlerDeleteRow, false);

  const ok=await getDefects(objPosition.id, table);
  if(ok) {
    spinnerDefects.classList.add('d-none');
    defects.classList.remove('d-none');
  }

}, false);
const handlerDeleteRow = async (event) => {
  const modalDanger = document.getElementById('modalDanger');
  modalDanger.classList.remove('show');
  modalDanger.style.display = 'none';
  const idDefect = parseInt(JSON.parse(sessionStorage.getItem('deleteRow')));
  const objData={
    'id': idDefect
  }
  sessionStorage.removeItem('deleteRow');
  const method = 'DELETE';
  const authToken = window.localStorage.getItem('AUTH_CLIENT');
  const authorization = 'Bearer ' + authToken;
  let url = 'http://192.168.0.2:81/defects';
  const {data, error} = await fetchData(url, authorization, method, objData);
  if (error) throw new error('Error al buscar: ' + error);
  window.location.href = '../../views/defects.html';
};
const handleBackInfo = () => {
  const modalInfo = document.getElementById('modalInfo');
  modalInfo.classList.remove('show');
  modalInfo.style.display = 'none';
};
const handleTypeButtonDefect = async () => {
  const type = JSON.parse(sessionStorage.getItem('NEW_DEFECT'));
  const idDefect = sessionStorage.getItem('idDefect');
  const errMessages = document.getElementsByClassName('err');
  const validInputs = document.getElementsByClassName('valid');
  let valid = true;
  for (let i = 0; i < errMessages.length; i++) {
    if (errMessages[i].textContent !== '') {
      valid = false;
    }
  }
  for (let i = 0; i < validInputs.length; i++) {
    if (validInputs[i].value === '') {
      valid = false;
    }
  }
  const modalInfo = document.getElementById('modalInfo');
  if (!valid) {
    document.getElementById('idTitleModalInfo').textContent = "¡¡¡ ADVERTENCIA !!!";
    document.getElementById('idMessageModalInfo').textContent = 'Existen campos sin rellenar o erróneos'
    modalInfo.classList.add('show');
    modalInfo.style.display = 'block';
  } else {
    const authToken = window.localStorage.getItem('AUTH_CLIENT');
    const authorization = 'Bearer ' + authToken;
    const url = 'http://192.168.0.2:81/defects';
    const newDefectModal = document.getElementById('modalDefects');
    const inputsNewDefectModal = newDefectModal.getElementsByTagName('input');
    const textAreaNewDefect = newDefectModal.getElementsByTagName('textarea')[0];
    let objData;
    let method = '';
    if (type) {
      method = 'POST';
      objData = {
        'date': inputsNewDefectModal['date'].value,
        'wind': parseFloat(inputsNewDefectModal['wind'].value),
        'emissivity': parseFloat(inputsNewDefectModal['emissivity'].value),
        'point_temperature': parseFloat(inputsNewDefectModal['temp'].value),
        'reference_temperature': parseFloat(inputsNewDefectModal['temp_ref'].value),
        'room_temperature': parseFloat(inputsNewDefectModal['temp_amb'].value),
        'reflected_apparent_temperature': parseFloat(inputsNewDefectModal['temp_ap'].value),
        'maximum_current': parseFloat(inputsNewDefectModal['Imax'].value),
        'current': parseFloat(inputsNewDefectModal['I'].value),
        'feedback': textAreaNewDefect.value,
        'thermogram': inputsNewDefectModal['image'].value,
        'photo': inputsNewDefectModal['photo'].value,
        'position': parseInt(JSON.parse(sessionStorage.getItem('position')))
      };
    } else {
      method = 'PUT';
      objData = {
        'id': parseInt(JSON.parse(sessionStorage.getItem('idDefect'))),
        'date': inputsNewDefectModal['date'].value,
        'wind': parseFloat(inputsNewDefectModal['wind'].value),
        'emissivity': parseFloat(inputsNewDefectModal['emissivity'].value),
        'point_temperature': parseFloat(inputsNewDefectModal['temp'].value),
        'reference_temperature': parseFloat(inputsNewDefectModal['temp_ref'].value),
        'room_temperature': parseFloat(inputsNewDefectModal['temp_amb'].value),
        'reflected_apparent_temperature': parseFloat(inputsNewDefectModal['temp_ap'].value),
        'maximum_current': parseFloat(inputsNewDefectModal['Imax'].value),
        'current': parseFloat(inputsNewDefectModal['I'].value),
        'feedback': textAreaNewDefect.value,
        'thermogram': inputsNewDefectModal['image'].value,
        'photo': inputsNewDefectModal['photo'].value,
        'position': parseInt(JSON.parse(sessionStorage.getItem('position')))
      };
    }
    const {data, error} = await fetchData(url, authorization, method, objData);
    if (error) throw new error('Error al buscar: ' + error);
    modalInfo.classList.remove('show');
    modalInfo.style.display = 'none';
    sessionStorage.removeItem('NEW_DEFECT');
    sessionStorage.removeItem('idDefect');
    window.location.href = '../../views/defects.html';
  }
};
const handleBackNewDefect = () => {
  sessionStorage.removeItem('NEW_DEFECT');
  const modalNewDefects = document.getElementById('modalDefects');
  modalNewDefects.classList.remove('show');
  modalNewDefects.style.display = 'none';
  const inputsModalNewDefects = modalNewDefects.getElementsByTagName('input');
  const errModalNewDefects = modalNewDefects.getElementsByClassName('err');
  for (let i = 0; i < errModalNewDefects.length; i++) {
    errModalNewDefects[i].value = '';
  }
  for (let i = 0; i < inputsModalNewDefects.length; i++) {
    inputsModalNewDefects[i].value = '';
  }
  modalNewDefects.getElementsByTagName('textarea')[0].value = '';
  sessionStorage.removeItem('idDefect');
};
const errorControls = event => {
  const control = event.target;
  const value = control.value;
  switch (control.getAttribute('id')) {
    case 'date':
      const date = value.split('-');
      if (!isDateValid(parseInt(date[2]), parseInt(date[1]), parseInt(date[0]))) {
        document.getElementById('errorData').textContent = 'Formato de fecha incorrecto';
        control.classList.add('border-color-red');
      } else {
        document.getElementById('errorData').textContent = '';
        control.classList.remove('border-color-red');
      }
      break;
    case 'wind':
      if (value < 0) {
        document.getElementById('errorWind').textContent = 'Valor negativo';
        control.classList.add('border-color-red');
      } else if (value === '') {
        document.getElementById('errorWind').textContent = 'valor obligatorio';
        control.classList.add('border-color-red');
      } else {
        document.getElementById('errorWind').textContent = '';
        control.classList.remove('border-color-red');
      }
      break;
    case 'emissivity':
      if (value <= 0 || value >= 1) {
        document.getElementById('errorEmissivity').textContent = 'Estar entre 0.01 y 0.99';
        control.classList.add('border-color-red');
      } else {
        document.getElementById('errorEmissivity').textContent = '';
        control.classList.remove('border-color-red');
      }
      break;
    case 'temp':
      if (value === '') {
        document.getElementById('errorTemp').textContent = 'Valor no numérico';
        control.classList.add('border-color-red');
      } else {
        document.getElementById('errorTemp').textContent = '';
        control.classList.remove('border-color-red');
      }
      document.getElementById('temp_ref').classList.remove('border-color-red');
      document.getElementById('errorTempRef').textContent = '';
      break;
    case 'temp_ref':
      const tp = document.getElementById('temp').value;
      if (tp === '') {
        document.getElementById('errorTempRef').textContent = 'Falta la del punto';
        control.classList.add('border-color-red');
      } else if (value > parseFloat(tp)) {
        document.getElementById('errorTempRef').textContent = 'Inferior a la del punto';
        control.classList.add('border-color-red');
      } else {
        document.getElementById('errorTempRef').textContent = '';
        control.classList.remove('border-color-red');
      }
      document.getElementById('errorTempAmb').textContent = '';
      document.getElementById('temp_amb').classList.remove('border-color-red');
      break;
    case 'temp_amb':
      if (document.getElementById('temp_ref').value === '') {
        document.getElementById('errorTempAmb').textContent = 'Falta la de referencia';
        control.classList.add('border-color-red');
      } else if (value > document.getElementById('temp_ref').value) {
        document.getElementById('errorTempAmb').textContent = 'Superior temperatura';
        control.classList.add('border-color-red');
      } else {
        document.getElementById('errorTempAmb').textContent = '';
        control.classList.remove('border-color-red');
      }
      document.getElementById('errorTempAp').textContent = '';
      document.getElementById('temp_ap').classList.remove('border-color-red');
      break;
    case 'temp_ap':
      if (document.getElementById('temp_amb').value === '') {
        document.getElementById('errorTempAp').textContent = 'Falta la ambiente';
        control.classList.add('border-color-red');
      } else if (value < document.getElementById('temp_amb').value) {
        document.getElementById('errorTempAp').textContent = 'Inferior a la ambiente';
        control.classList.add('border-color-red');
      } else {
        document.getElementById('errorTempAp').textContent = '';
        control.classList.remove('border-color-red');
      }
      break;
    case 'Imax':
      if (value === '') {
        document.getElementById('errorIMax').textContent = 'Campo vacío';
        control.classList.add('border-color-red');
      } else if (value < 0) {
        document.getElementById('errorIMax').textContent = 'Valor negativo';
        control.classList.add('border-color-red');
      } else {
        document.getElementById('errorIMax').textContent = '';
        control.classList.remove('border-color-red');
      }
      break;
    case 'I':
      if (value === '') {
        document.getElementById('errorI').textContent = 'Campo vacío';
        control.classList.add('border-color-red');
      } else if (value < 0) {
        document.getElementById('errorI').textContent = 'Valor negativo';
        control.classList.add('border-color-red');
      } else {
        document.getElementById('errorI').textContent = '';
        control.classList.remove('border-color-red');
      }
      break;
  }
};

function isDateValid(day, month, year) {
  const date = new Date(year, month - 1, day);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date <= now && date && (date.getMonth() + 1) === month && date.getDate() === Number(day);
}

const goBack = event => {
  const modalDanger = document.getElementById('modalDanger');
  const modalWarning = document.getElementById('modalWarning');
  modalDanger.classList.remove('show');
  modalDanger.style.display = 'none';
  modalWarning.classList.remove('show');
  modalWarning.style.display = 'none';
};
const handleBack = (event) => {
  localStorage.removeItem('row');
  sessionStorage.removeItem('positions');
  sessionStorage.removeItem('NEW_DEFECT');
  sessionStorage.removeItem('position');
  sessionStorage.removeItem('position');
  window.location.href = '../../views/operator.html';
};
const handleNewDefect = (event) => {
  const modalDefects = document.getElementById('modalDefects');
  modalDefects.classList.add('show');
  modalDefects.style.display = 'block';
  const titleModal = document.getElementById('titleModal');
  titleModal.textContent = 'Nuevo Defecto';
  const typeButtonDefect = document.getElementById('typeButtonDefect');
  typeButtonDefect.textContent = 'insertar';
  sessionStorage.setItem('NEW_DEFECT', JSON.stringify(true));
};
const handleUpdate = async (event) => {
  const modalDefects = document.getElementById('modalDefects');
  modalDefects.classList.add('show');
  modalDefects.style.display = 'block';
  const titleModal = document.getElementById('titleModal');
  titleModal.textContent = 'Actualizar Defecto';
  const typeButtonDefect = document.getElementById('typeButtonDefect');
  typeButtonDefect.textContent = 'actualizar';
  sessionStorage.setItem('NEW_DEFECT', JSON.stringify(false));
  const trSelected = event.target.closest('tr');
  const idSelected = parseInt(trSelected.cells[0].textContent);
  const method = 'GET';
  const authToken = window.localStorage.getItem('AUTH_CLIENT');
  const authorization = 'Bearer ' + authToken;
  let url = 'http://192.168.0.2:81/defects?id=' + idSelected;
  const {data, error} = await fetchData(url, authorization, method);
  if (error) throw new error('Error al buscar: ' + error);
  document.querySelector('#modalDefects #date').value = data.data[0]['date'];
  document.querySelector('#modalDefects #wind').value = parseFloat(data.data[0]['wind']);
  document.querySelector('#modalDefects #emissivity').value = parseFloat(data.data[0]['emissivity']);
  document.querySelector('#modalDefects #temp').value = parseFloat(data.data[0]['point_temperature']);
  document.querySelector('#modalDefects #temp_ref').value = parseFloat(data.data[0]['reference_temperature']);
  document.querySelector('#modalDefects #temp_amb').value = parseFloat(data.data[0]['room_temperature']);
  document.querySelector('#modalDefects #temp_ap').value = parseFloat(data.data[0]['reflected_apparent_temperature']);
  document.querySelector('#modalDefects #Imax').value = parseFloat(data.data[0]['maximum_current']);
  document.querySelector('#modalDefects #I').value = parseFloat(data.data[0]['current']);
  document.querySelector('#modalDefects #image').value = data.data[0]['thermogram'];
  document.querySelector('#modalDefects #photo').value = data.data[0]['photo'];
  document.querySelector('#modalDefects #status').value = data.data[0]['feedback'];
  sessionStorage.setItem('idDefect', JSON.stringify(data.data[0]['id']));
};
const handleDelete = (event) => {
  const elementSelected = event.target;
  let parent = elementSelected.parentNode;
  while (parent && parent.nodeName.toLowerCase() !== 'tr') {
    parent = parent.parentNode;
  }
  const idRow = parseInt(parent.cells[0].innerHTML);
  sessionStorage.setItem('deleteRow', JSON.stringify(idRow));
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
  data.data.reverse().map(point => {
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
    const tdThermogram = document.createElement('td');
    tdThermogram.textContent = point.thermogram;
    tdThermogram.setAttribute('class', 'text-center d-none d-xl-table-cell');
    tdThermogramA.setAttribute('style','max-width: 150px');
    row.appendChild(tdThermogram);
    const tdPhoto = document.createElement('td');
    tdPhoto.textContent = point.photo;
    tdPhoto.setAttribute('class', 'text-center d-none d-xl-table-cell');
    tdPhoto.setAttribute('style','max-width: 150px');
    row.appendChild(tdPhoto);
    const tdFeedback = document.createElement('td');
    tdFeedback.textContent = point.feedback;
    tdFeedback.setAttribute('class', 'text-center d-none d-xl-table-cell');
    tdFeedback.setAttribute('style','max-width: 150px');
    row.appendChild(tdFeedback);
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
  return true;
};