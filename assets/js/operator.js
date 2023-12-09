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
  const buttonExit = document.getElementsByClassName('exit');
  const buttonsBack = document.getElementsByClassName('close');
  const buttonSession = document.getElementById('exitSession');
  const popupExit = document.getElementById('popupExit');
  const modalNewClient = document.getElementById('modalClients');
  const idNewClient = document.getElementById('idNewClient');
  const buttonNewClient = document.getElementById('client');
  const buttonNewInstallation = document.getElementById('installation');
  const buttonNewLocation = document.getElementById('location');
  const buttonNewPosition = document.getElementById('position');
  const buttonDeleteClient = document.querySelector('#modalClients #idDeleteNewClient');
  const userButton = document.getElementById('user');
  if (role === 3) {
    userButton.classList.remove('d-none');
  }

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
  // TODO: Me da la impresión de que faltaría la parte de position

  const changeClients = async (event) => {
    const clients = document.getElementById('clients');
    const installations = document.getElementById('installations');
    const locations = document.getElementById('locations');
    const spinnerClientSelect = document.getElementById('spinnerClientSelect');
    const spinnerInstallationSelect = document.getElementById('spinnerInstallationSelect');
    const spinnerLocationSelect = document.getElementById('spinnerLocationSelect');
    spinnerClientSelect.classList.remove('d-none');
    spinnerClientSelect.classList.add('d-inline-block');
    spinnerInstallationSelect.classList.remove('d-none');
    spinnerInstallationSelect.classList.add('d-inline-block');
    spinnerLocationSelect.classList.remove('d-none');
    spinnerLocationSelect.classList.add('d-inline-block');
    clients.disabled = true;
    installations.disabled = true;
    locations.disabled = true;
    const method = 'GET';
    const authToken = window.localStorage.getItem('AUTH_CLIENT');
    const authorization = 'Bearer ' + authToken;
    window.localStorage.setItem('selectClient', event.target.value);
    let url = 'http://192.168.0.2:81/installations?client=' + parseInt(event.target.options[event.target.selectedIndex].value);
    const selectInstallationsValue = await getInstallations(url, authorization, method, selectInstallations, selectLocations, selectInstallationValue);
    window.localStorage.setItem('selectInstallation', selectInstallationsValue);
    url = 'http://192.168.0.2:81/locations?installation=' + selectInstallationsValue;
    const selectLocationsValue = await getLocations(url, authorization, method, selectLocations);
    window.localStorage.setItem('selectLocation', selectLocationsValue);
    url = 'http://192.168.0.2:81/positions?location=' + selectLocationsValue;
    await getPositions(url, authorization, method, table);
    spinnerClientSelect.classList.remove('d-inline-block');
    spinnerClientSelect.classList.add('d-none');
    spinnerInstallationSelect.classList.remove('d-inline-block');
    spinnerInstallationSelect.classList.add('d-none');
    spinnerLocationSelect.classList.remove('d-inline-block');
    spinnerLocationSelect.classList.add('d-none');
    clients.disabled = false;
    installations.disabled = false;
    locations.disabled = false;
  }
  const changeInstallations = async (event) => {
    const clients = document.getElementById('clients');
    const locations = document.getElementById('locations');
    const spinnerClientSelect = document.getElementById('spinnerClientSelect');
    const spinnerInstallationSelect = document.getElementById('spinnerInstallationSelect');
    const spinnerLocationSelect = document.getElementById('spinnerLocationSelect');
    spinnerClientSelect.classList.remove('d-none');
    spinnerClientSelect.classList.add('d-inline-block');
    spinnerInstallationSelect.classList.remove('d-none');
    spinnerInstallationSelect.classList.add('d-inline-block');
    spinnerLocationSelect.classList.remove('d-none');
    spinnerLocationSelect.classList.add('d-inline-block');
    clients.disabled = true;
    event.target.disabled = true;
    locations.disabled = true;
    const method = 'GET';
    const authToken = window.localStorage.getItem('AUTH_CLIENT');
    const authorization = 'Bearer ' + authToken;
    window.localStorage.setItem('selectInstallation', event.target.value);
    let url = 'http://192.168.0.2:81/locations?installation=' + event.target.value;
    const selectLocationsValue = await getLocations(url, authorization, method, selectLocations);
    window.localStorage.setItem('selectLocation', selectLocationsValue);
    url = 'http://192.168.0.2:81/positions?location=' + selectLocationsValue;
    await getPositions(url, authorization, method, table);
    spinnerClientSelect.classList.remove('d-inline-block');
    spinnerClientSelect.classList.add('d-none');
    spinnerInstallationSelect.classList.remove('d-inline-block');
    spinnerInstallationSelect.classList.add('d-none');
    spinnerLocationSelect.classList.remove('d-inline-block');
    spinnerLocationSelect.classList.add('d-none');
    clients.disabled = false;
    event.target.disabled = false;
    locations.disabled = false;
  }
  const changeLocations = async (event) => {
    const clients = document.getElementById('clients');
    const installations = document.getElementById('installations');
    const spinnerClientSelect = document.getElementById('spinnerClientSelect');
    const spinnerInstallationSelect = document.getElementById('spinnerInstallationSelect');
    const spinnerLocationSelect = document.getElementById('spinnerLocationSelect');
    spinnerClientSelect.classList.remove('d-none');
    spinnerClientSelect.classList.add('d-inline-block');
    spinnerInstallationSelect.classList.remove('d-none');
    spinnerInstallationSelect.classList.add('d-inline-block');
    spinnerLocationSelect.classList.remove('d-none');
    spinnerLocationSelect.classList.add('d-inline-block');
    clients.disabled = true;
    installations.disabled = true;
    event.target.disabled = true;
    const method = 'GET';
    const authToken = window.localStorage.getItem('AUTH_CLIENT');
    const authorization = 'Bearer ' + authToken;
    window.localStorage.setItem('selectLocation', event.target.value);
    let url = 'http://192.168.0.2:81/positions?location=' + event.target.value;
    const selectPositionsValue = await getPositions(url, authorization, method, table);
    window.localStorage.setItem('selectPosition', selectPositionsValue);
    spinnerClientSelect.classList.remove('d-inline-block');
    spinnerClientSelect.classList.add('d-none');
    spinnerInstallationSelect.classList.remove('d-inline-block');
    spinnerInstallationSelect.classList.add('d-none');
    spinnerLocationSelect.classList.remove('d-inline-block');
    spinnerLocationSelect.classList.add('d-none');
    clients.disabled = false;
    installations.disabled = false;
    event.target.disabled = false;
  }
  const changeSearch = (event) => {
    const searchText = event.target.value;
    const positions = JSON.parse(sessionStorage.getItem('positions'));
    getNewPositions(table, positions, searchText);
  };
  const exitSession = () => {

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
  for (let i = 0; i < buttonExit.length; i++) {
    buttonExit[i].addEventListener('click', exitSession, false);
  }
  buttonNewClient.addEventListener('click', handleNewClientModal, false);
  buttonNewInstallation.addEventListener('click', handleNewInstallationModal, false);
  buttonNewLocation.addEventListener('click', handleNewLocationModal, false);
  buttonNewPosition.addEventListener('click', handleNewPositionModal, false);
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

  const totalClientsNewClientes = document.querySelector('#modalClients #totalClients');
  totalClientsNewClientes.addEventListener('change', handleTotalClientsNewClientes, false);

  idNewClient.addEventListener('click', handleActionIdNewClient, false);
  const backInfo = document.getElementById('backInfo');
  backInfo.addEventListener('click', handleBackInfo, false);

  buttonDeleteClient.addEventListener('click', handleDeleteClient, false);

  userButton.addEventListener('click', handleModalUser, false);

  void initialStateComponents(selectClients, selectInstallations, selectLocations, selectClientValue, selectInstallationValue, selectLocationValue);
}, false);
const handleModalUser = async event => {
  const modalUsers = document.querySelector('#modalUsers');
  const totalUsers = document.querySelector('#modalUsers #totalUsers');
  const spinnerTotalUsers = document.querySelector('#modalUsers #spinnerTotalUsers');
  const idUser = document.querySelector('#modalUsers #idUser');
  const nameNewUser = document.querySelector('#modalUsers #nameNewUser');
  const passwordNewUser = document.querySelector('#modalUsers #passwordNewUser');
  const roleUserSelected = document.querySelector('#modalUsers #roleUsersSelected');
  const spinnerRoleUserSelected = document.querySelector('#modalUsers #spinnerRoleUsersSelected');
  const clientsUserSelected = document.querySelector('#modalUsers #clientsUserSelected');
  const spinnerClientsUserSelected = document.querySelector('#modalUsers #spinnerClientsUserSelected');
  const installationsUserSelected = document.querySelector('#modalUsers #installationsUserSelected');
  const spinnerInstallationsUserSelected = document.querySelector('#modalUsers #spinnerInstallationsUserSelected');
  const idDeleteNewUser = document.querySelector('#modalUsers #idDeleteNewUser');
  const idNewUser = document.querySelector('#modalUsers #idNewUser');
  const resetNewUser = document.querySelector('#modalUsers #resetNewUser');
  const spinnerButton = document.querySelector('#spinnerUsersButton');
  sessionStorage.removeItem('updateUser');
  idNewUser.textContent = 'Aceptar';
  idUser.value = 0;
  idDeleteNewUser.disabled = true;
  spinnerButton.classList.remove('d-none');
  spinnerButton.classList.add('d-inline-block');
  modalUsers.classList.add('d-none');
  if (totalUsers.firstChild) {
    while (totalUsers.firstChild) {
      totalUsers.removeChild(totalUsers.firstChild);
    }
  }
  if (roleUserSelected.firstChild) {
    while (roleUserSelected.firstChild) {
      roleUserSelected.removeChild(roleUserSelected.firstChild);
    }
  }
  if (clientsUserSelected.firstChild) {
    while (clientsUserSelected.firstChild) {
      clientsUserSelected.removeChild(clientsUserSelected.firstChild);
    }
  }
  if (installationsUserSelected.firstChild) {
    while (installationsUserSelected.firstChild) {
      installationsUserSelected.removeChild(installationsUserSelected.firstChild);
    }
  }
  nameNewUser.value = '';
  passwordNewUser.value = '';
  // Carga de datos
  let url = 'http://192.168.0.2:81/users';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  let method = 'GET';
  const objTotalUsers = await fetchData(url, authorization, method);
  if (objTotalUsers.error) throw 'Error al buscar los usuarios';
  objTotalUsers.data.data.map(user => {
    const option = document.createElement('option');
    option.value = user.username;
    option.text = user.username;
    totalUsers.appendChild(option);
  });
  url = 'http://192.168.0.2:81/roles';
  const objRoleUserSelected = await fetchData(url, authorization, method);
  if (objRoleUserSelected.error) throw 'Error al buscar los roles';
  objRoleUserSelected.data.data.map(role => {
    const option = document.createElement('option');
    option.value = role.id;
    option.text = role.rol;
    roleUserSelected.appendChild(option);
  });
  url = 'http://192.168.0.2:81/clients';
  const objClientsUserSelected = await fetchData(url, authorization, method);
  if (objClientsUserSelected.error) throw 'Error al buscar los clientes';
  objClientsUserSelected.data.data.map(client => {
    const option = document.createElement('option');
    option.value = client.id;
    option.text = client.name;
    clientsUserSelected.appendChild(option);
  });
  url = `http://192.168.0.2:81/installations?client=${parseInt(clientsUserSelected.options[clientsUserSelected.selectedIndex].value)}`;
  const objInstallationsUserSelected = await fetchData(url, authorization, method);
  if (objInstallationsUserSelected.error) throw 'Error al buscar las instalaciones';
  objInstallationsUserSelected.data.data.map(installation => {
    const option = document.createElement('option');
    option.value = installation.id;
    option.text = installation.name;
    installationsUserSelected.appendChild(option);
  });
  spinnerButton.classList.remove('d-inline-block');
  spinnerButton.classList.add('d-none');
  modalUsers.classList.remove('d-none');
  modalUsers.classList.add('show');
  modalUsers.style.display = 'block';
  event.target.disabled = false;
  // Fin de la carga de datos
  // Evento del botón borrar
  resetNewUser.addEventListener('click', async () => {
    totalUsers.disabled = true;
    roleUserSelected.disabled = true;
    clientsUserSelected.disabled = true;
    installationsUserSelected.disabled = true;
    spinnerTotalUsers.classList.remove('d-none');
    spinnerTotalUsers.classList.add('d-inline-block');
    spinnerRoleUserSelected.classList.remove('d-none');
    spinnerRoleUserSelected.classList.add('d-inline-block');
    spinnerClientsUserSelected.classList.remove('d-none');
    spinnerClientsUserSelected.classList.add('d-inline-block');
    spinnerInstallationsUserSelected.classList.remove('d-none');
    spinnerInstallationsUserSelected.classList.add('d-inline-block');
    idUser.value = 0;
    idDeleteNewUser.disabled = true;
    idNewUser.textContent = 'Aceptar';
    if (totalUsers.firstChild) {
      while (totalUsers.firstChild) {
        totalUsers.removeChild(totalUsers.firstChild);
      }
    }
    if (roleUserSelected.firstChild) {
      while (roleUserSelected.firstChild) {
        roleUserSelected.removeChild(roleUserSelected.firstChild);
      }
    }
    if (clientsUserSelected.firstChild) {
      while (clientsUserSelected.firstChild) {
        clientsUserSelected.removeChild(clientsUserSelected.firstChild);
      }
    }
    if (installationsUserSelected.firstChild) {
      while (installationsUserSelected.firstChild) {
        installationsUserSelected.removeChild(installationsUserSelected.firstChild);
      }
    }
    nameNewUser.value = '';
    passwordNewUser.value = '';
    let url = 'http://192.168.0.2:81/users';
    const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
    let method = 'GET';
    const objTotalUsers = await fetchData(url, authorization, method);
    if (objTotalUsers.error) throw 'Error al buscar los usuarios';
    objTotalUsers.data.data.map(user => {
      const option = document.createElement('option');
      option.value = user.username;
      option.text = user.username;
      totalUsers.appendChild(option);
    });
    url = 'http://192.168.0.2:81/roles';
    const objRoleUserSelected = await fetchData(url, authorization, method);
    if (objRoleUserSelected.error) throw 'Error al buscar los roles';
    objRoleUserSelected.data.data.map(role => {
      const option = document.createElement('option');
      option.value = role.id;
      option.text = role.rol;
      roleUserSelected.appendChild(option);
    });
    url = 'http://192.168.0.2:81/clients';
    const objClientsUserSelected = await fetchData(url, authorization, method);
    if (objClientsUserSelected.error) throw 'Error al buscar los clientes';
    objClientsUserSelected.data.data.map(client => {
      const option = document.createElement('option');
      option.value = client.id;
      option.text = client.name;
      clientsUserSelected.appendChild(option);
    });
    url = `http://192.168.0.2:81/installations?client=${parseInt(clientsUserSelected.options[clientsUserSelected.selectedIndex].value)}`;
    const objInstallationsUserSelected = await fetchData(url, authorization, method);
    if (objInstallationsUserSelected.error) throw 'Error al buscar las instalaciones';
    objInstallationsUserSelected.data.data.map(installation => {
      const option = document.createElement('option');
      option.value = installation.id;
      option.text = installation.name;
      installationsUserSelected.appendChild(option);
    });
    totalUsers.disabled = false;
    roleUserSelected.disabled = false;
    clientsUserSelected.disabled = false;
    installationsUserSelected.disabled = false;
    spinnerTotalUsers.classList.remove('d-inline-block');
    spinnerTotalUsers.classList.add('d-none');
    spinnerRoleUserSelected.classList.remove('d-inline-block');
    spinnerRoleUserSelected.classList.add('d-none');
    spinnerClientsUserSelected.classList.remove('d-inline-block');
    spinnerClientsUserSelected.classList.add('d-none');
    spinnerInstallationsUserSelected.classList.remove('d-inline-block');
    spinnerInstallationsUserSelected.classList.add('d-none');
    sessionStorage.removeItem('updateUser');
  }, false);
  // Fin de evento del botón borrar
  totalUsers.addEventListener('change', async event => {
    // Poner spinners
    totalUsers.disabled = true;
    nameNewUser.disabled = true;
    passwordNewUser.disabled = true;
    roleUserSelected.disabled = true;
    clientsUserSelected.disabled = true;
    installationsUserSelected.disabled = true;
    spinnerTotalUsers.classList.remove('d-none');
    spinnerTotalUsers.classList.add('d-inline-block');
    spinnerRoleUserSelected.classList.remove('d-none');
    spinnerRoleUserSelected.classList.add('d-inline-block');
    spinnerClientsUserSelected.classList.remove('d-none');
    spinnerClientsUserSelected.classList.add('d-inline-block');
    spinnerInstallationsUserSelected.classList.remove('d-none');
    spinnerInstallationsUserSelected.classList.add('d-inline-block');
    const username = event.target.options[event.target.selectedIndex].value;
    idUser.value = username;
    url = `http://192.168.0.2:81/users?username=${username}`;
    const objTotalUsers = await fetchData(url, authorization, method);
    if (objTotalUsers.error) throw 'Error al buscar el usuario';
    const role = parseInt(objTotalUsers.data.data[0].rol);
    let installation = 1;
    let client = 1;
    if (role === 2) {
      url = `http://192.168.0.2:81/users_installations?username=${username}`;
      const objUsersInstallations = await fetchData(url, authorization, method);
      if (objUsersInstallations.error) throw 'Error al buscar la instalación que controla el usuario';
      installation = parseInt(objUsersInstallations.data.data[0].idInstallation);
      url = `http://192.168.0.2:81/installations?id=${installation}`;
      const objInstallation = await fetchData(url, authorization, method);
      if (objInstallation.error) throw 'Error al buscar la instalación';
      client = parseInt(objInstallation.data.data[0].client);
      nameNewUser.value = username;
      idUser.value = username;
      passwordNewUser.value = '';
      if (roleUserSelected.firstChild) {
        for (let i = 0; i < roleUserSelected.options.length; i++) {
          if (parseInt(roleUserSelected.options[i].value) === role) roleUserSelected.options[i].setAttribute('selected', true);
          else roleUserSelected.options[i].removeAttribute('selected');
        }
      }
      if (clientsUserSelected.firstChild) {
        for (let i = 0; i < clientsUserSelected.options.length; i++) {
          for (let i = 0; i < clientsUserSelected.options.length; i++) {
            if (parseInt(clientsUserSelected.options[i].value) === client) clientsUserSelected.options[i].setAttribute('selected', true);
            else clientsUserSelected.options[i].removeAttribute('selected');
          }
        }
      }
      if (installationsUserSelected.firstChild) {
        while (installationsUserSelected.firstChild) {
          installationsUserSelected.removeChild(installationsUserSelected.firstChild);
        }
      }
      url = `http://192.168.0.2:81/installations?client=${client}`;
      method = 'GET';
      const objNewInstallationsUserSelected = await fetchData(url, authorization, method);
      if (objNewInstallationsUserSelected.error) throw 'Error al buscar las instalaciones';
      objNewInstallationsUserSelected.data.data.map(installation => {
        const option = document.createElement('option');
        option.value = installation.id;
        option.text = installation.name;
        installationsUserSelected.appendChild(option);
      });
      if (installationsUserSelected.firstChild) {
        for (let i = 0; i < installationsUserSelected.options.length; i++) {
          if (parseInt(installationsUserSelected.options[i].value) === installation) installationsUserSelected.options[i].setAttribute('selected', true);
          else installationsUserSelected.options[i].removeAttribute('selected');
        }
      }
    } else {
      nameNewUser.value = username;
      passwordNewUser.value = '';
      if (roleUserSelected.firstChild) {
        for (let i = 0; i < roleUserSelected.options.length; i++) {
          if (parseInt(roleUserSelected.options[i].value) === role) roleUserSelected.options[i].setAttribute('selected', true);
          else roleUserSelected.options[i].removeAttribute('selected');
        }
      }
    }
    sessionStorage.setItem('updateUser', JSON.stringify(true));
    spinnerTotalUsers.classList.remove('d-inline-block');
    spinnerTotalUsers.classList.add('d-none');
    spinnerRoleUserSelected.classList.remove('d-inline-block');
    spinnerRoleUserSelected.classList.add('d-none');
    spinnerClientsUserSelected.classList.remove('d-inline-block');
    spinnerClientsUserSelected.classList.add('d-none');
    spinnerInstallationsUserSelected.classList.remove('d-inline-block');
    spinnerInstallationsUserSelected.classList.add('d-none');
    totalUsers.disabled = false;
    nameNewUser.disabled = false;
    passwordNewUser.disabled = false;
    roleUserSelected.disabled = false;
    clientsUserSelected.disabled = false;
    installationsUserSelected.disabled = false;
    idDeleteNewUser.disabled = false;
    idNewUser.textContent = 'Actualizar';
  }, false);
  clientsUserSelected.addEventListener('change', async event => {
    clientsUserSelected.disabled = true;
    installationsUserSelected.disabled = true;
    spinnerClientsUserSelected.classList.add('d-inline-block');
    spinnerClientsUserSelected.classList.remove('d-none');
    spinnerInstallationsUserSelected.classList.add('d-inline-block');
    spinnerInstallationsUserSelected.classList.remove('d-none');
    if (installationsUserSelected.firstChild) {
      while (installationsUserSelected.firstChild) {
        installationsUserSelected.removeChild(installationsUserSelected.firstChild);
      }
    }
    url = `http://192.168.0.2:81/installations?client=${parseInt(event.target.options[event.target.selectedIndex].value)}`;
    const objInstallationsUserSelected = await fetchData(url, authorization, method);
    if (objInstallationsUserSelected.error) throw 'Error al buscar las instalaciones';
    objInstallationsUserSelected.data.data.map(installation => {
      const option = document.createElement('option');
      option.value = installation.id;
      option.text = installation.name;
      installationsUserSelected.appendChild(option);
    });
    spinnerClientsUserSelected.classList.remove('d-inline-block');
    spinnerClientsUserSelected.classList.add('d-none');
    spinnerInstallationsUserSelected.classList.remove('d-inline-block');
    spinnerInstallationsUserSelected.classList.add('d-none');
    clientsUserSelected.disabled = false;
    installationsUserSelected.disabled = false;
  }, false);
  idNewUser.addEventListener('click', async () => {
    let updateUser = false;
    if (nameNewUser.value !== '' && passwordNewUser.value !== '') {
      if (sessionStorage.getItem('updateUser')) {
        updateUser = true;
      }
      if (updateUser) {
        const name = nameNewUser.value;
        const password = passwordNewUser.value;
        const role = parseInt(roleUserSelected.options[roleUserSelected.selectedIndex].value);
        const installation = parseInt(installationsUserSelected.options[installationsUserSelected.selectedIndex].value);
        url = 'http://192.168.0.2:81/users';
        method = 'PUT';
        const objData = {
          username: name,
          password,
          rol: role
        };
        const objUserUpdateSelected = await fetchData(url, authorization, method, objData);
        if (objUserUpdateSelected.error) throw 'Error al actualizar el usuario';
        if (role === 2) {
          // Caso de actualización de datos para un customer
          // Controlar si el usuario lo cambiamos a cliente, no existe en la tabla usersInstallations

          url = `http://192.168.0.2:81/users_installations?username=${name}`;
          method = 'GET';
          const objUsersInstallationsSearchSelected = await fetchData(url, authorization, method);
          if (objUsersInstallationsSearchSelected.error) throw 'Error al buscar la instalación';
          if (objUsersInstallationsSearchSelected.data.data.length !== 0) {
            const oldIdInstallation = parseInt(objUsersInstallationsSearchSelected.data.data[0].idInstallation);
            url = `http://192.168.0.2:81/users_installations`;
            method = 'DELETE';
            let objData = {
              idInstallation: oldIdInstallation,
              username: name
            };
            const objUsersInstallationsDeleteSelected = await fetchData(url, authorization, method, objData);
            if (objUsersInstallationsDeleteSelected.error) throw 'Error al eliminar el usuario';
          }
          url = `http://192.168.0.2:81/users_installations`;
          method = 'POST';
          const objDataNew = {
            idInstallation: installation,
            username: name
          };
          const objUsersInstallationsInsertSelected = await fetchData(url, authorization, method, objDataNew);
          if (objUsersInstallationsInsertSelected.error) throw 'Error al insertar el usuario';
          window.location.href = '../../views/operator.html';
        } else {
          // Chequear si el usuario existe en la tabla users_installation, y si existe borrarlo. Luego actualizar la tabla users
          url = `http://192.168.0.2:81/users_installations?username=${name}`;
          method = 'GET';
          const objSearchUser = await fetchData(url, authorization, method);
          if (objSearchUser.error) throw 'Error al buscar el usuario';
          if (objSearchUser.data.data.length !== 0) {
            const oldIdInstallation = parseInt(objSearchUser.data.data[0].idInstallation);
            url = `http://192.168.0.2:81/users_installations`;
            method = 'DELETE';
            let objData = {
              idInstallation: oldIdInstallation,
              username: name
            };
            const objUsersInstallationsDeleteSelected = await fetchData(url, authorization, method, objData);
            if (objUsersInstallationsDeleteSelected.error) throw 'Error al eliminar el usuario';
            url = 'http://192.168.0.2:81/users';
            method = 'PUT';
            const objDataNew = {
              username: name,
              password,
              rol: role
            };
            const objUserUpdateSelected = await fetchData(url, authorization, method, objDataNew);
            if (objUserUpdateSelected.error) throw 'Error al insertar el usuario';
            window.location.href = '../../views/operator.html';
          }
        }
        idUser.value = 0;
        sessionStorage.removeItem('updateUser');
        window.location.href = '../../views/operator.html';
      } else {
        // Caso de inserción de datos
        const name = nameNewUser.value;
        const password = passwordNewUser.value;
        const role = parseInt(roleUserSelected.options[roleUserSelected.selectedIndex].value);
        url = 'http://192.168.0.2:81/users';
        method = 'POST';
        const objData = {
          username: name,
          password,
          rol: role
        };
        const objUserUpdateSelected = await fetchData(url, authorization, method, objData);
        if (objUserUpdateSelected.error) throw 'Error al insertar el usuario';
        if (role === 2) {
          url = 'http://192.168.0.2:81/users_installations';
          method = 'POST';
          const objData = {
            idInstallation: parseInt(installationsUserSelected.options[installationsUserSelected.selectedIndex].value),
            username: name
          };
          const objInsertNewClientUser = await fetchData(url, authorization, method, objData);
          if (objInsertNewClientUser.error) throw 'Error al insertar el nuevo cliente';
        }
        window.location.href = '../../views/operator.html';
      }
    } else {
      // Se abre el modal de info diciendo que faltan campos por cubrir
      const modalInfo = document.getElementById('modalInfo');
      modalInfo.classList.add('show');
      modalInfo.style.display = 'block';
      document.querySelector('#modalInfo #idTitleModalInfo').textContent = 'Operación incompleta';
      document.querySelector('#modalInfo #idMessageModalInfo').textContent = 'Faltan campos por cubrir';
    }
  }, false);
  idDeleteNewUser.addEventListener('click', async () => {
    const modalUsers = document.querySelector('#modalUsers');
    const modalDanger = document.querySelector('#modalDanger');
    const buttonBackModalDanger = document.querySelector('#modalDanger #back');
    const buttonDeleteModalDanger = document.querySelector('#modalDanger #borrar');
    modalUsers.classList.remove('show');
    modalUsers.classList.add('d-none');
    modalDanger.classList.remove('d-none');
    modalDanger.classList.add('show');
    modalDanger.style.display = 'block';
    if (parseInt(roleUserSelected.value) === 2) sessionStorage.setItem('customer', JSON.stringify(true));
    buttonBackModalDanger.addEventListener('click', () => {
      idUser.value = 0;
      sessionStorage.removeItem('updateUser');
      window.location.href = '../../views/operator.html';
    }, false);
    buttonDeleteModalDanger.addEventListener('click', async () => {
      const id = idUser.value;
      const idInstallation = parseInt(installationsUserSelected.options[installationsUserSelected.selectedIndex].value);
      const role = parseInt(roleUserSelected.options[roleUserSelected.selectedIndex].value);
      if (role === 2) {
        url = 'http://192.168.0.2:81/users_installations';
        method = 'DELETE';
        const objData = {
          idInstallation,
          username: id
        }
        const objDeleteLinkUser = await fetchData(url, authorization, method, objData);
        if (objDeleteLinkUser.error) throw 'Error al borrar el usuario';
      }
      url = 'http://192.168.0.2:81/users';
      method = 'DELETE';
      const objData = {
        username: id
      }
      const objIdDeleteNewUser = await fetchData(url, authorization, method, objData);
      if (objIdDeleteNewUser.error) throw 'Error al borrar la posición';
      sessionStorage.removeItem('updateUser');
      window.location.href = '../../views/operator.html';
    }, false);
  }, false);
};
const handleDeleteClient = () => {
  const inputsModal = document.querySelectorAll('#modalClients input:not([type="hidden"])');
  const selectsModal = document.querySelectorAll('#modalClients select');
  for (let i = 0; i < selectsModal.length; i++) {
    for (let j = selectsModal[i].length - 1; j >= 0; j--) {
      selectsModal[i].options[j] = null;
    }
  }
  for (let i = 0; i < inputsModal.length; i++) {
    for (let j = inputsModal[i].length - 1; j >= 0; i--) {
      inputsModal[i][j].value = '';
    }
  }
  const dangerModal = document.getElementById('modalDanger');
  const buttonBack = document.querySelector('#modalDanger #back');
  const buttonDelete = document.querySelector('#modalDanger #borrar');
  buttonBack.addEventListener('click', handleBackDeleteClient, false);
  buttonDelete.addEventListener('click', handleDeleteOldClient, false);
  sessionStorage.removeItem('updateClient');
  dangerModal.classList.add('show');
  dangerModal.style.display = 'block';
  sessionStorage.removeItem('objNewClient');
};
const handleBackDeleteClient = () => {
  const dangerModal = document.getElementById('modalDanger');
  dangerModal.classList.remove('show');
  dangerModal.style.display = 'none';
  window.location.href = '../../views/operator.html';
};
const handleDeleteOldClient = async () => {
  const inputsModal = document.querySelector('#modalClients input[type="hidden"]');
  const url = `http://192.168.0.2:81/clients`;
  const method = 'DELETE';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  const objData = {
    id: inputsModal.value
  }
  const objDeleteClient = await fetchData(url, authorization, method, objData);
  if (objDeleteClient.error) throw 'Error al borrar el cliente';
  localStorage.removeItem('selectClient');
  localStorage.removeItem('selectInstallation');
  localStorage.removeItem('selectLocation');
  window.location.href = '../../views/operator.html';
};
const handleBackInfo = () => {
  const modalInfo = document.getElementById('modalInfo');
  modalInfo.classList.remove('show');
  modalInfo.style.display = 'none';
};
const handleActionIdNewClient = async event => {
  event.preventDefault();
  const allInputsModalClients = document.querySelectorAll('#modalClients input');
  let operationOk = true;
  for (let i = 0; i < allInputsModalClients.length; i++) {
    if (allInputsModalClients[i].value === '' && allInputsModalClients[i].type !== 'hidden') operationOk = false;
  }
  if (!operationOk) {
    const modalInfo = document.getElementById('modalInfo');
    modalInfo.classList.add('show');
    modalInfo.style.display = 'block';
    document.querySelector('#modalInfo #idTitleModalInfo').textContent = 'Operación incompleta';
    document.querySelector('#modalInfo #idMessageModalInfo').textContent = 'Faltan campos por cubrir';
  } else {
    let update;
    if (sessionStorage.getItem('updateClient')) {
      update = sessionStorage.getItem('updateClient');
    }
    const url = `http://192.168.0.2:81/clients`;
    const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
    const inputsClients = document.querySelectorAll('#modalClients input');
    const selectsClients = document.querySelectorAll('#modalClients select');
    if (update === undefined) {
      // Es una inserción
      const method = 'POST';
      const objData = {
        name: inputsClients.item(1).value,
        address: inputsClients.item(3).value,
        cp: inputsClients.item(2).value,
        country: selectsClients.item(0).value === '' ? 1 : parseInt(selectsClients.item(1).value),
        province: parseInt(selectsClients.item(2).value),
        municipality: parseInt(selectsClients.item(3).value),
        location: inputsClients.item(3).value,
        phone: inputsClients.item(4).value,
        email: inputsClients.item(5).value
      }
      const objResultInsertNewClient = await fetchData(url, authorization, method, objData);
      if (objResultInsertNewClient.error) throw 'Error al insertar el nuevo cliente';
    } else {
      sessionStorage.removeItem('updateClient');
      // Es una actualización
      const method = 'PUT';
      const objData = {
        id: parseInt(inputsClients.item(0).value),
        name: inputsClients.item(1).value,
        address: inputsClients.item(3).value,
        cp: inputsClients.item(2).value,
        country: selectsClients.item(0).value === '' ? 1 : parseInt(selectsClients.item(1).value),
        province: parseInt(selectsClients.item(2).value),
        municipality: parseInt(selectsClients.item(3).value),
        location: inputsClients.item(3).value,
        phone: inputsClients.item(4).value,
        email: inputsClients.item(5).value
      }
      const objResultUpdateClient = await fetchData(url, authorization, method, objData);
      if (objResultUpdateClient.error) throw 'Error al insertar el nuevo cliente';
    }
    const modalClientes = document.getElementById('modalClients');
    modalClientes.classList.remove('show');
    modalClientes.style.display = 'none';
    window.location.href = '../../views/operator.html';
  }
};
const handleTotalClientsNewClientes = async event => {
  const spinnerTotalClientsSelect = document.querySelector('#modalClients #spinnerTotalClientsSelect');
  const spinnerNameNewClient = document.querySelector('#modalClients #spinnerNameNewClient');
  const spinnerZipCodeNewClient = document.querySelector('#modalClients #spinnerZipCodeNewClient');
  const spinnerCountrySelect = document.querySelector('#modalClients #spinnerCountrySelect');
  const spinnerProvinceSelect = document.querySelector('#modalClients #spinnerProvinceSelect');
  const spinnerMunicipalitySelect = document.querySelector('#modalClients #spinnerMunicipalitySelect');
  const spinnerAddressNewClient = document.querySelector('#modalClients #spinnerAddressNewClient');
  const spinnerPhoneNewClient = document.querySelector('#modalClients #spinnerPhoneNewClient');
  const spinnerEmailNewClient = document.querySelector('#modalClients #spinnerEmailNewClient');
  const totalClients = document.querySelector('#modalClients #totalClients');
  const nameNewClient = document.querySelector('#modalClients #nameNewClient');
  const zipCodeNewClient = document.querySelector('#modalClients #zipCodeNewClient');
  const countryNewClient = document.querySelector('#modalClients #countryNewClient');
  const provinceNewClient = document.querySelector('#modalClients #provinceNewClient');
  const municipalityNewClient = document.querySelector('#modalClients #municipalityNewClient');
  const addressNewClient = document.querySelector('#modalClients #addressNewClient');
  const phoneNewClient = document.querySelector('#modalClients #phoneNewClient');
  const emailNewClient = document.querySelector('#modalClients #emailNewClient');
  totalClients.disabled = true;
  nameNewClient.disabled = true;
  zipCodeNewClient.disabled = true;
  countryNewClient.disabled = true;
  provinceNewClient.disabled = true;
  municipalityNewClient.disabled = true;
  addressNewClient.disabled = true;
  phoneNewClient.disabled = true;
  emailNewClient.disabled = true;
  spinnerTotalClientsSelect.classList.remove('d-none');
  spinnerTotalClientsSelect.classList.add('d-inline-block');
  spinnerNameNewClient.classList.remove('d-none');
  spinnerNameNewClient.classList.add('d-inline-block');
  spinnerZipCodeNewClient.classList.remove('d-none');
  spinnerZipCodeNewClient.classList.add('d-inline-block');
  spinnerCountrySelect.classList.remove('d-none');
  spinnerCountrySelect.classList.add('d-inline-block');
  spinnerProvinceSelect.classList.remove('d-none');
  spinnerProvinceSelect.classList.add('d-inline-block');
  spinnerMunicipalitySelect.classList.remove('d-none');
  spinnerMunicipalitySelect.classList.add('d-inline-block');
  spinnerAddressNewClient.classList.remove('d-none');
  spinnerAddressNewClient.classList.add('d-inline-block');
  spinnerPhoneNewClient.classList.remove('d-none');
  spinnerPhoneNewClient.classList.add('d-inline-block');
  spinnerEmailNewClient.classList.remove('d-none');
  spinnerEmailNewClient.classList.add('d-inline-block');

  sessionStorage.setItem('updateClient', JSON.stringify(true));
  document.getElementById('idNewClient').textContent = 'Actualizar';
  const clientSelectedForUpdate = event.target.options[event.target.selectedIndex].value;
  let url = `http://192.168.0.2:81/clients?id=${clientSelectedForUpdate}`;
  const method = 'GET';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  const objClients = await fetchData(url, authorization, method);
  if (objClients.error) throw 'Error al buscar el cliente';
  document.getElementById('idClient').value = objClients.data.data[0].id;
  document.getElementById('nameNewClient').value = objClients.data.data[0].name;
  document.getElementById('zipCodeNewClient').value = objClients.data.data[0].cp;
  //
  url = 'http://192.168.0.2:81/countries';
  const objCountries = await fetchData(url, authorization, method);
  if (objCountries.error) throw 'Error al solicitar los clientes';
  const selectCountriesClients = document.querySelector('#modalClients #countryNewClient');
  for (let i = selectCountriesClients.length - 1; i >= 0; i--) {
    selectCountriesClients.options[i] = null;
  }
  objCountries.data.data.map(country => {
    const option = document.createElement('option');
    option.value = country.id;
    option.text = country.name;
    if (parseInt(option.value) === objClients.data.data[0].country) option.setAttribute('selected', 'true');
    selectCountriesClients.appendChild(option);
  });
  //
  url = `http://192.168.0.2:81/provinces?country=${selectCountriesClients.options[selectCountriesClients.selectedIndex].value}`;
  const objProvinces = await fetchData(url, authorization, method);
  if (objProvinces.error) throw 'Error al solicitar las provincias';
  const selectProvincesClients = document.querySelector('#modalClients #provinceNewClient');
  for (let i = selectProvincesClients.length - 1; i >= 0; i--) {
    selectProvincesClients.options[i] = null;
  }
  objProvinces.data.data.map(province => {
    const option = document.createElement('option');
    option.value = province.id;
    option.text = province.name;
    if (parseInt(option.value) === objClients.data.data[0].province) option.setAttribute('selected', 'true');
    selectProvincesClients.appendChild(option);
  });
  //
  url = `http://192.168.0.2:81/municipalities?province=${selectProvincesClients.options[selectProvincesClients.selectedIndex].value}`;
  const objMunicipalities = await fetchData(url, authorization, method);
  if (objMunicipalities.error) throw 'Error al solicitar los Municipios';
  const selectMunicipalitiesClients = document.querySelector('#modalClients #municipalityNewClient');
  for (let i = selectMunicipalitiesClients.length - 1; i >= 0; i--) {
    selectMunicipalitiesClients.options[i] = null;
  }
  objMunicipalities.data.data.map(municipality => {
    const option = document.createElement('option');
    option.value = municipality.id;
    option.text = municipality.name;
    if (parseInt(option.value) === objClients.data.data[0].municipality) option.setAttribute('selected', 'true');
    selectMunicipalitiesClients.appendChild(option);
  });
  document.getElementById('addressNewClient').value = objClients.data.data[0].address;
  document.getElementById('phoneNewClient').value = objClients.data.data[0].phone;
  document.getElementById('emailNewClient').value = objClients.data.data[0].email;

  const buttonDeleteClient = document.querySelector('#modalClients #idDeleteNewClient');
  buttonDeleteClient.disabled = false;

  spinnerTotalClientsSelect.classList.add('d-none');
  spinnerTotalClientsSelect.classList.remove('d-inline-block');
  spinnerNameNewClient.classList.add('d-none');
  spinnerNameNewClient.classList.remove('d-inline-block');
  spinnerZipCodeNewClient.classList.add('d-none');
  spinnerZipCodeNewClient.classList.remove('d-inline-block');
  spinnerCountrySelect.classList.add('d-none');
  spinnerCountrySelect.classList.remove('d-inline-block');
  spinnerProvinceSelect.classList.add('d-none');
  spinnerProvinceSelect.classList.remove('d-inline-block');
  spinnerMunicipalitySelect.classList.add('d-none');
  spinnerMunicipalitySelect.classList.remove('d-inline-block');
  spinnerAddressNewClient.classList.add('d-none');
  spinnerAddressNewClient.classList.remove('d-inline-block');
  spinnerPhoneNewClient.classList.add('d-none');
  spinnerPhoneNewClient.classList.remove('d-inline-block');
  spinnerEmailNewClient.classList.add('d-none');
  spinnerEmailNewClient.classList.remove('d-inline-block');
  totalClients.disabled = false;
  nameNewClient.disabled = false;
  zipCodeNewClient.disabled = false;
  countryNewClient.disabled = false;
  provinceNewClient.disabled = false;
  municipalityNewClient.disabled = false;
  addressNewClient.disabled = false;
  phoneNewClient.disabled = false;
  emailNewClient.disabled = false;

};
const handleButtonBackNewClients = () => {
  const objNewClient = {
    name: document.querySelector('#modalClients #nameNewClient').value,
    cp: document.querySelector('#modalClients #zipCodeNewClient').value,
    country: document.querySelector('#modalClients #countryNewClient').value,
    province: document.querySelector('#modalClients #provinceNewClient').value,
    municipality: document.querySelector('#modalClients #municipalityNewClient').value,
    address: document.querySelector('#modalClients #addressNewClient').value,
    phone: document.querySelector('#modalClients #phoneNewClient').value,
    email: document.querySelector('#modalClients #emailNewClient').value,
  }
  sessionStorage.setItem('objNewClient', JSON.stringify(objNewClient));
};
const handleButtonDeleteNewClients = async () => {
  const spinnerTotalClientsSelect = document.querySelector('#modalClients #spinnerTotalClientsSelect');
  const spinnerNameNewClient = document.querySelector('#modalClients #spinnerNameNewClient');
  const spinnerZipCodeNewClient = document.querySelector('#modalClients #spinnerZipCodeNewClient');
  const spinnerCountrySelect = document.querySelector('#modalClients #spinnerCountrySelect');
  const spinnerProvinceSelect = document.querySelector('#modalClients #spinnerProvinceSelect');
  const spinnerMunicipalitySelect = document.querySelector('#modalClients #spinnerMunicipalitySelect');
  const spinnerAddressNewClient = document.querySelector('#modalClients #spinnerAddressNewClient');
  const spinnerPhoneNewClient = document.querySelector('#modalClients #spinnerPhoneNewClient');
  const spinnerEmailNewClient = document.querySelector('#modalClients #spinnerEmailNewClient');
  const totalClients = document.querySelector('#modalClients #totalClients');
  const nameNewClient = document.querySelector('#modalClients #nameNewClient');
  const zipCodeNewClient = document.querySelector('#modalClients #zipCodeNewClient');
  const countryNewClient = document.querySelector('#modalClients #countryNewClient');
  const provinceNewClient = document.querySelector('#modalClients #provinceNewClient');
  const municipalityNewClient = document.querySelector('#modalClients #municipalityNewClient');
  const addressNewClient = document.querySelector('#modalClients #addressNewClient');
  const phoneNewClient = document.querySelector('#modalClients #phoneNewClient');
  const emailNewClient = document.querySelector('#modalClients #emailNewClient');
  totalClients.disabled = true;
  nameNewClient.disabled = true;
  zipCodeNewClient.disabled = true;
  countryNewClient.disabled = true;
  provinceNewClient.disabled = true;
  municipalityNewClient.disabled = true;
  addressNewClient.disabled = true;
  phoneNewClient.disabled = true;
  emailNewClient.disabled = true;
  spinnerTotalClientsSelect.classList.remove('d-none');
  spinnerTotalClientsSelect.classList.add('d-inline-block');
  spinnerNameNewClient.classList.remove('d-none');
  spinnerNameNewClient.classList.add('d-inline-block');
  spinnerZipCodeNewClient.classList.remove('d-none');
  spinnerZipCodeNewClient.classList.add('d-inline-block');
  spinnerCountrySelect.classList.remove('d-none');
  spinnerCountrySelect.classList.add('d-inline-block');
  spinnerProvinceSelect.classList.remove('d-none');
  spinnerProvinceSelect.classList.add('d-inline-block');
  spinnerMunicipalitySelect.classList.remove('d-none');
  spinnerMunicipalitySelect.classList.add('d-inline-block');
  spinnerAddressNewClient.classList.remove('d-none');
  spinnerAddressNewClient.classList.add('d-inline-block');
  spinnerPhoneNewClient.classList.remove('d-none');
  spinnerPhoneNewClient.classList.add('d-inline-block');
  spinnerEmailNewClient.classList.remove('d-none');
  spinnerEmailNewClient.classList.add('d-inline-block');

  sessionStorage.removeItem('updateClient');
  document.querySelector('#modalClients #idNewClient').textContent = 'Aceptar';
  for (let i = provinceNewClient.length - 1; i >= 0; i--) {
    provinceNewClient.options[i] = null;
  }
  for (let i = municipalityNewClient.length - 1; i >= 0; i--) {
    municipalityNewClient.options[i] = null;
  }
  const selectNewCountry = document.getElementById('countryNewClient');
  const valueNewCountry = parseInt(selectNewCountry.options[selectNewCountry.selectedIndex].value);
  let url = `http://192.168.0.2:81/provinces?country=${valueNewCountry}`;
  const method = 'GET';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  const objProvinces = await fetchData(url, authorization, method);
  if (objProvinces.error) throw 'Error al solicitar las provincias';
  objProvinces.data.data.map(province => {
    const option = document.createElement('option');
    option.value = province.id;
    option.text = province.name;
    provinceNewClient.appendChild(option);
  });
  url = `http://192.168.0.2:81/municipalities?province=${objProvinces.data.data[0].id}`;
  const objMunicipalities = await fetchData(url, authorization, method);
  if (objMunicipalities.error) throw 'Error al solicitar los municipios';
  objMunicipalities.data.data.map(municipality => {
    const option = document.createElement('option');
    option.value = municipality.id;
    option.text = municipality.name;
    municipalityNewClient.appendChild(option);
  });
  document.querySelector('#modalClients #idDeleteNewClient').disabled = true;
  spinnerTotalClientsSelect.classList.add('d-none');
  spinnerTotalClientsSelect.classList.remove('d-inline-block');
  spinnerNameNewClient.classList.add('d-none');
  spinnerNameNewClient.classList.remove('d-inline-block');
  spinnerZipCodeNewClient.classList.add('d-none');
  spinnerZipCodeNewClient.classList.remove('d-inline-block');
  spinnerCountrySelect.classList.add('d-none');
  spinnerCountrySelect.classList.remove('d-inline-block');
  spinnerProvinceSelect.classList.add('d-none');
  spinnerProvinceSelect.classList.remove('d-inline-block');
  spinnerMunicipalitySelect.classList.add('d-none');
  spinnerMunicipalitySelect.classList.remove('d-inline-block');
  spinnerAddressNewClient.classList.add('d-none');
  spinnerAddressNewClient.classList.remove('d-inline-block');
  spinnerPhoneNewClient.classList.add('d-none');
  spinnerPhoneNewClient.classList.remove('d-inline-block');
  spinnerEmailNewClient.classList.add('d-none');
  spinnerEmailNewClient.classList.remove('d-inline-block');
  totalClients.disabled = false;
  nameNewClient.disabled = false;
  zipCodeNewClient.disabled = false;
  countryNewClient.disabled = false;
  provinceNewClient.disabled = false;
  municipalityNewClient.disabled = false;
  addressNewClient.disabled = false;
  phoneNewClient.disabled = false;
  emailNewClient.disabled = false;
};
const handleChangeNewProvince = async event => {
  const countryNewClient = document.getElementById('countryNewClient');
  const municipalityNewClient = document.getElementById('municipalityNewClient');
  const spinnerCountrySelect = document.getElementById('spinnerCountrySelect');
  const spinnerProvinceSelect = document.getElementById('spinnerProvinceSelect');
  const spinnerMunicipalitySelect = document.getElementById('spinnerMunicipalitySelect');
  spinnerCountrySelect.classList.remove('d-none');
  spinnerCountrySelect.classList.add('d-inline-block');
  spinnerProvinceSelect.classList.remove('d-none');
  spinnerProvinceSelect.classList.add('d-inline-block');
  spinnerMunicipalitySelect.classList.remove('d-none');
  spinnerMunicipalitySelect.classList.add('d-inline-block');
  countryNewClient.disabled = true;
  event.target.disabled = true;
  municipalityNewClient.disabled = true;
  for (let i = municipalityNewClient.length - 1; i >= 0; i--) {
    municipalityNewClient.options[i] = null;
  }
  const selectNewProvince = event.target;
  const valueNewProvince = parseInt(selectNewProvince.options[selectNewProvince.selectedIndex].value);
  let url = `http://192.168.0.2:81/municipalities?province=${valueNewProvince}`;
  const method = 'GET';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  const objMunicipalities = await fetchData(url, authorization, method);
  if (objMunicipalities.error) throw 'Error al solicitar las provincias';
  objMunicipalities.data.data.map(municipality => {
    const option = document.createElement('option');
    option.value = municipality.id;
    option.text = municipality.name;
    municipalityNewClient.appendChild(option);
  });
  spinnerCountrySelect.classList.remove('d-inline-block');
  spinnerCountrySelect.classList.add('d-none');
  spinnerProvinceSelect.classList.remove('d-inline-block');
  spinnerProvinceSelect.classList.add('d-none');
  spinnerMunicipalitySelect.classList.remove('d-inline-block');
  spinnerMunicipalitySelect.classList.add('d-none');
  countryNewClient.disabled = false;
  event.target.disabled = false;
  municipalityNewClient.disabled = false;
};
const handleChangeNewCountry = async event => {
  const provinceNewClient = document.getElementById('provinceNewClient');
  const municipalityNewClient = document.getElementById('municipalityNewClient');
  const spinnerCountrySelect = document.getElementById('spinnerCountrySelect');
  const spinnerProvinceSelect = document.getElementById('spinnerProvinceSelect');
  const spinnerMunicipalitySelect = document.getElementById('spinnerMunicipalitySelect');
  spinnerCountrySelect.classList.remove('d-none');
  spinnerCountrySelect.classList.add('d-inline-block');
  spinnerProvinceSelect.classList.remove('d-none');
  spinnerProvinceSelect.classList.add('d-inline-block');
  spinnerMunicipalitySelect.classList.remove('d-none');
  spinnerMunicipalitySelect.classList.add('d-inline-block');
  event.target.disabled = true;
  provinceNewClient.disabled = true;
  municipalityNewClient.disabled = true;
  for (let i = provinceNewClient.length - 1; i >= 0; i--) {
    provinceNewClient.options[i] = null;
  }
  for (let i = municipalityNewClient.length - 1; i >= 0; i--) {
    municipalityNewClient.options[i] = null;
  }
  const selectNewCountry = event.target;
  const valueNewCountry = parseInt(selectNewCountry.options[selectNewCountry.selectedIndex].value);
  let url = `http://192.168.0.2:81/provinces?country=${valueNewCountry}`;
  const method = 'GET';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  const objProvinces = await fetchData(url, authorization, method);
  if (objProvinces.error) throw 'Error al solicitar las provincias';
  objProvinces.data.data.map(province => {
    const option = document.createElement('option');
    option.value = province.id;
    option.text = province.name;
    provinceNewClient.appendChild(option);
  });
  url = `http://192.168.0.2:81/municipalities?province=${objProvinces.data.data[0].id}`;
  const objMunicipalities = await fetchData(url, authorization, method);
  if (objMunicipalities.error) throw 'Error al solicitar los municipios';
  objMunicipalities.data.data.map(municipality => {
    const option = document.createElement('option');
    option.value = municipality.id;
    option.text = municipality.name;
    municipalityNewClient.appendChild(option);
  });
  spinnerCountrySelect.classList.remove('d-inline-block');
  spinnerCountrySelect.classList.add('d-none');
  spinnerProvinceSelect.classList.remove('d-inline-block');
  spinnerProvinceSelect.classList.add('d-none');
  spinnerMunicipalitySelect.classList.remove('d-inline-block');
  spinnerMunicipalitySelect.classList.add('d-none');
  event.target.disabled = false;
  provinceNewClient.disabled = false;
  municipalityNewClient.disabled = false;
};
const handleNewInstallationModal = async (event) => {
  const modalNewInstallation = document.querySelector('#modalInstallations');
  const totalInstallations = document.querySelector('#modalInstallations #totalInstallations');
  const nameNewInstallation = document.querySelector('#modalInstallations #nameNewInstallation');
  const clientSelect = document.querySelector('#modalInstallations #clientSelected');
  const spinnerTotalInstallations = document.querySelector('#modalInstallations #spinnerTotalInstallations');
  const spinnerClientSelected = document.querySelector('#modalInstallations #spinnerClientSelected');
  event.target.disabled = false;
  let objNewInstallation = null;
  if (sessionStorage.getItem('objNewInstallation')) {
    objNewInstallation = JSON.parse(sessionStorage.getItem('objNewInstallation'));
  }
  const spinnerButton = document.getElementById('spinnerInstallationsButton');
  clientSelect.addEventListener('change', async event => {
    spinnerClientSelected.classList.remove('d-none');
    spinnerClientSelected.classList.add('d-inline-block');
    spinnerTotalInstallations.classList.remove('d-none');
    spinnerTotalInstallations.classList.add('d-inline-block');
    totalInstallations.disabled = true;
    nameNewInstallation.disabled = true;
    clientSelect.disabled = true;
    const clientValueSelected = parseInt(event.target.options[event.target.selectedIndex].value);
    const url = `http://192.168.0.2:81/installations?client=${clientValueSelected}`;
    const method = 'GET';
    const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
    await getInstallations(url, authorization, method, totalInstallations);
    totalInstallations.disabled = false;
    nameNewInstallation.disabled = false;
    clientSelect.disabled = false;
    spinnerClientSelected.classList.add('d-none');
    spinnerClientSelected.classList.remove('d-inline-block');
    spinnerTotalInstallations.classList.add('d-none');
    spinnerTotalInstallations.classList.remove('d-inline-block');
  }, false);
  totalInstallations.addEventListener('change', event => {
    spinnerClientSelected.classList.remove('d-none');
    spinnerClientSelected.classList.add('d-inline-block');
    spinnerTotalInstallations.classList.remove('d-none');
    spinnerTotalInstallations.classList.add('d-inline-block');
    totalInstallations.disabled = true;
    nameNewInstallation.disabled = true;
    clientSelect.disabled = true;
    sessionStorage.setItem('updateInstallation', JSON.stringify(true));
    document.querySelector('#modalInstallations #idNewInstallation').textContent = 'Actualizar';
    document.querySelector('#modalInstallations #nameNewInstallation').value = event.target.options[event.target.selectedIndex].textContent;
    document.querySelector('#modalInstallations #idDeleteNewInstallation').disabled = false;
    document.querySelector('#modalInstallations #idInstallation').value = event.target.options[event.target.selectedIndex].value;
    totalInstallations.disabled = false;
    nameNewInstallation.disabled = false;
    clientSelect.disabled = false;
    spinnerClientSelected.classList.add('d-none');
    spinnerClientSelected.classList.remove('d-inline-block');
    spinnerTotalInstallations.classList.add('d-none');
    spinnerTotalInstallations.classList.remove('d-inline-block');
  }, false);
  const resetNewInstallationButton = document.querySelector('#modalInstallations #resetNewInstallation');
  resetNewInstallationButton.addEventListener('click', async () => {
    spinnerClientSelected.classList.remove('d-none');
    spinnerClientSelected.classList.add('d-inline-block');
    spinnerTotalInstallations.classList.remove('d-none');
    spinnerTotalInstallations.classList.add('d-inline-block');
    totalInstallations.disabled = true;
    nameNewInstallation.disabled = true;
    clientSelect.disabled = true;
    nameNewInstallation.value = '';
    while (totalInstallations.firstChild) {
      totalInstallations.removeChild(totalInstallations.firstChild);
    }
    let url = 'http://192.168.0.2:81/installations?client=1';
    let method = 'GET';
    const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
    await getInstallations(url, authorization, method, totalInstallations);
    document.querySelector('#modalInstallations #idNewInstallation').textContent = 'aceptar';
    document.querySelector('#modalInstallations #idDeleteNewInstallation').disabled = true;
    sessionStorage.removeItem('updateInstallation');
    document.querySelector('#modalInstallations #idInstallation').value = 0;
    totalInstallations.disabled = false;
    nameNewInstallation.disabled = false;
    clientSelect.disabled = false;
    spinnerClientSelected.classList.add('d-none');
    spinnerClientSelected.classList.remove('d-inline-block');
    spinnerTotalInstallations.classList.add('d-none');
    spinnerTotalInstallations.classList.remove('d-inline-block');
  }, false);
  const idNewInstallation = document.querySelector('#modalInstallations #idNewInstallation');
  idNewInstallation.addEventListener('click', async () => {
    const inputModalInstallations = document.querySelector('#modalInstallations #nameNewInstallation');
    let operationOk = inputModalInstallations.value !== '';
    if (!operationOk) {
      const modalInfo = document.getElementById('modalInfo');
      modalInfo.classList.add('show');
      modalInfo.style.display = 'block';
      document.querySelector('#modalInfo #idTitleModalInfo').textContent = 'Operación incompleta';
      document.querySelector('#modalInfo #idMessageModalInfo').textContent = 'Faltan campos por cubrir';
    } else {
      const clientSelected = document.querySelector('#modalInstallations #clientSelected');
      url = 'http://192.168.0.2:81/installations';
      const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
      if (sessionStorage.getItem('updateInstallation')) {
        sessionStorage.removeItem('updateInstallation');
        const idInstallation = parseInt(document.querySelector('#modalInstallations #idInstallation').value);
        document.querySelector('#modalInstallations #idInstallation').value = 0;
        const objData = {
          id: idInstallation,
          name: document.querySelector('#modalInstallations #nameNewInstallation').value,
          client: parseInt(clientSelected.options[clientSelected.selectedIndex].value)
        }
        method = 'PUT';
        const objUpdateInstallation = await fetchData(url, authorization, method, objData);
        if (objUpdateInstallation.error) throw 'Error al actualizar la instalación';
      } else {
        const objData = {
          name: document.querySelector('#modalInstallations #nameNewInstallation').value,
          client: parseInt(clientSelected.options[clientSelected.selectedIndex].value)
        }
        //
        method = 'POST';
        const objInsertInstallation = await fetchData(url, authorization, method, objData);
        if (objInsertInstallation.error) throw 'Error al insertar la instalación';

      }
      modalNewInstallation.classList.remove('show');
      modalNewInstallation.style.display = 'none';
      window.location.href = '../../views/operator.html';
    }
  }, false);
  const idDeleteNewInstallation = document.querySelector('#modalInstallations #idDeleteNewInstallation');
  idDeleteNewInstallation.addEventListener('click', async () => {
    // Lanzamos el modal de peligro
    // Luego definimos los eventos del modal y en los eventos del modal indicamos lo de abajo
    const modalDanger = document.getElementById('modalDanger');
    const buttonBack = document.querySelector('#modalDanger #back');
    buttonBack.addEventListener('click', () => {
      const modalDanger = document.getElementById('modalDanger');
      modalDanger.classList.remove('show');
      modalDanger.style.display = 'none';
    }, false);
    const buttonDelete = document.querySelector('#modalDanger #borrar');
    buttonDelete.addEventListener('click', async () => {
      // donde se borra
      url = 'http://192.168.0.2:81/installations';
      if (sessionStorage.getItem('updateInstallation')) {
        sessionStorage.removeItem('updateInstallation');
        const idInstallation = parseInt(document.querySelector('#modalInstallations #idInstallation').value);
        document.querySelector('#modalInstallations #idInstallation').value = 0;
        const objData = {
          id: idInstallation
        }
        method = 'DELETE';
        const objUpdateInstallation = await fetchData(url, authorization, method, objData);
        if (objUpdateInstallation.error) throw 'Error al actualizar la instalación';
        const modalInstallations = document.querySelector('#modalInstallations');
        modalInstallations.classList.remove('show');
        modalInstallations.style.display = 'none';
        window.location.href = '../../views/operator.html';
      }
    }, false);
    modalDanger.classList.add('show');
    modalDanger.style.display = 'block';
    // Hasta aquí
  }, false);
  for (let i = clientSelect.options.length - 1; i >= 0; i--) {
    clientSelect[i].options.value = null;
  }
  for (let i = totalInstallations.options.length - 1; i >= 0; i--) {
    totalInstallations[i].options.value = null;
  }
  spinnerButton.classList.remove('d-none');
  spinnerButton.classList.add('d-block');
  const idInitialClient = (objNewInstallation && parseInt(objNewInstallation.id) !== 0) ? parseInt(objNewInstallation.id) : 1;
  let url = 'http://192.168.0.2:81/clients';
  let method = 'GET';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  await getClients(url, authorization, method, clientSelect, idInitialClient);
  const idClientSelected = parseInt(clientSelect.options[clientSelect.selectedIndex].value);
  url = `http://192.168.0.2:81/installations?client=${idClientSelected}`;
  await getInstallations(url, authorization, method, totalInstallations);
  spinnerButton.classList.remove('d-block');
  spinnerButton.classList.add('d-none');
  modalNewInstallation.classList.remove('d-none');
  modalNewInstallation.classList.add('show');
  modalNewInstallation.style.display = 'block';
  sessionStorage.removeItem('objNewInstallation');
  event.target.disabled = false;
}
const handleNewLocationModal = async () => {
  let objNewLocation = null;
  if (sessionStorage.getItem('objNewLocation')) {
    objNewLocation = JSON.parse(sessionStorage.getItem('objNewLocation'));
  }
  const modalNewLocation = document.getElementById('modalLocations');
  const spinnerButton = document.getElementById('spinnerLocationsButton');
  const clientSelect = document.querySelector('#modalLocations #clientsSelected');
  const installationSelect = document.querySelector('#modalLocations #installationSelected');
  const totalLocationsSelect = document.querySelector('#modalLocations #totalLocations');
  const nameNewLocation = document.querySelector('#modalLocations #nameNewLocation');
  const modalLocations = document.querySelector('#modalLocations');
  modalLocations.classList.remove('show');
  modalLocations.classList.add('hide');
  modalLocations.classList.add('d-none');
  spinnerButton.classList.remove('d-none');
  spinnerButton.classList.add('d-inline-block');
  for (let i = clientSelect.options.length - 1; i >= 0; i--) {
    clientSelect.options[i].remove();
  }
  for (let i = installationSelect.options.length - 1; i >= 0; i--) {
    installationSelect.options[i].remove();
  }
  for (let i = totalLocationsSelect.options.length - 1; i >= 0; i--) {
    totalLocationsSelect.options[i].remove();
  }
  nameNewLocation.value = '';
  let url = `http://192.168.0.2:81/clients`;
  const method = 'GET';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  await getClients(url, authorization, method, clientSelect);
  url = `http://192.168.0.2:81/installations?client=${parseInt(clientSelect.options[clientSelect.selectedIndex].value)}`;
  await getInstallations(url, authorization, method, installationSelect);
  url = `http://192.168.0.2:81/locations?installation=${parseInt(installationSelect.options[installationSelect.selectedIndex].value)}`;
  await getLocations(url, authorization, method, totalLocations);
  spinnerButton.classList.remove('d-inline-block');
  spinnerButton.classList.add('d-none');
  modalNewLocation.classList.remove('d-none');
  modalNewLocation.classList.remove('hide');
  modalNewLocation.classList.add('show');
  sessionStorage.removeItem('objNewLocation');
  const resetNewLocationButton = document.querySelector('#modalLocations #resetNewLocation');
  resetNewLocationButton.addEventListener('click', async () => {
    const clientSelect = document.querySelector('#modalLocations #clientsSelected');
    const installationSelect = document.querySelector('#modalLocations #installationSelected');
    const totalLocations = document.querySelector('#modalLocations #totalLocations');
    const spinnerClientsLocations = document.querySelector('#modalLocations #spinnerClientsSelected');
    const spinnerInstallationsLocations = document.querySelector('#modalLocations #spinnerInstallationsSelected');
    const spinnerTotalLocations = document.querySelector('#modalLocations #spinnerTotalLocations');
    spinnerClientsLocations.classList.remove('d-none');
    spinnerInstallationsLocations.classList.remove('d-none');
    spinnerTotalLocations.classList.remove('d-none');
    spinnerClientsLocations.classList.add('d-inline-block');
    spinnerInstallationsLocations.classList.add('d-inline-block');
    spinnerTotalLocations.classList.add('d-inline-block');
    clientSelect.disabled = false;
    installationSelect.disabled = false;
    totalLocations.disabled = false;
    nameNewLocation.disabled = false;
    document.querySelector('#modalLocations #idDeleteNewLocation').disabled = true;
    for (let i = totalLocations.options.length - 1; i >= 0; i--) {
      totalLocations.options[i].remove();
    }
    nameNewLocation.value = '';
    clientSelect.options[clientSelect.selectedIndex].setAttribute('defaultSelected', 'false');
    clientSelect.options[0].setAttribute('defaultSelected', 'true');
    let method = 'GET';
    url = 'http://192.168.0.2:81/installations?client=1';
    await getInstallations(url, authorization, method, installationSelect, null, 1);
    url = 'http://192.168.0.2:81/locations?installation=1';
    await getLocations(url, authorization, method, totalLocations);
    document.querySelector('#modalLocations #idNewLocation').textContent = 'aceptar';
    sessionStorage.removeItem('updateLocation');
    document.querySelector('#modalLocations #idLocation').value = 0;

    spinnerClientsLocations.classList.remove('d-inline-block');
    spinnerInstallationsLocations.classList.remove('d-inline-block');
    spinnerTotalLocations.classList.remove('d-inline-block');
    spinnerClientsLocations.classList.add('d-none');
    spinnerInstallationsLocations.classList.add('d-none');
    spinnerTotalLocations.classList.add('d-none');
    clientSelect.disabled = false;
    installationSelect.disabled = false;
    totalLocations.disabled = false;
    nameNewLocation.disabled = false;
  }, false);
  const idNewLocation = document.querySelector('#modalLocations #idNewLocation');
  idNewLocation.addEventListener('click', async () => {
    const inputModalLocations = document.querySelector('#modalLocations #nameNewLocation');
    let operationOk = inputModalLocations.value !== '';
    if (!operationOk) {
      const modalInfo = document.getElementById('modalInfo');
      modalInfo.classList.add('show');
      modalInfo.style.display = 'block';
      document.querySelector('#modalInfo #idTitleModalInfo').textContent = 'Operación incompleta';
      document.querySelector('#modalInfo #idMessageModalInfo').textContent = 'Faltan campos por cubrir';
    } else {
      const installationSelected = document.querySelector('#modalLocations #installationSelected');
      url = 'http://192.168.0.2:81/locations';
      const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
      if (sessionStorage.getItem('updateLocation')) {
        sessionStorage.removeItem('updateLocation');
        const idLocation = parseInt(document.querySelector('#modalLocations #idLocation').value);
        document.querySelector('#modalLocations #idLocation').value = 0;
        const objData = {
          id: idLocation,
          name: document.querySelector('#modalLocations #nameNewLocation').value,
          columns: '',
          installation: parseInt(installationSelected.options[installationSelected.selectedIndex].value)
        }
        const method = 'PUT';
        const objUpdateLocation = await fetchData(url, authorization, method, objData);
        if (objUpdateLocation.error) throw 'Error al actualizar la localización';
      } else {
        const objData = {
          name: document.querySelector('#modalLocations #nameNewLocation').value,
          columns: '',
          installation: parseInt(installationSelected.options[installationSelected.selectedIndex].value)
        }
        //
        const method = 'POST';
        const objInsertLocation = await fetchData(url, authorization, method, objData);
        if (objInsertLocation.error) throw 'Error al insertar la localización';

      }
      modalNewLocation.classList.remove('show');
      modalNewLocation.style.display = 'none';
      window.location.href = '../../views/operator.html';
    }
  }, false);
  const idDeleteNewLocation = document.querySelector('#modalLocations #idDeleteNewLocation');
  idDeleteNewLocation.addEventListener('click', async () => {
    const modalDanger = document.getElementById('modalDanger');
    const buttonBack = document.querySelector('#modalDanger #back');
    buttonBack.addEventListener('click', () => {
      const modalDanger = document.getElementById('modalDanger');
      modalDanger.classList.remove('show');
      modalDanger.style.display = 'none';
    }, false);
    const buttonDelete = document.querySelector('#modalDanger #borrar');
    buttonDelete.addEventListener('click', async () => {
      // donde se borra
      url = 'http://192.168.0.2:81/locations';
      if (sessionStorage.getItem('updateLocation')) {
        sessionStorage.removeItem('updateLocation');
        const idLocation = parseInt(document.querySelector('#modalLocations #idLocation').value);
        document.querySelector('#modalLocations #idLocation').value = 0;
        const objData = {
          id: idLocation
        }
        const method = 'DELETE';
        const objUpdateLocation = await fetchData(url, authorization, method, objData);
        if (objUpdateLocation.error) throw 'Error al borrar la localización';
        const modalLocations = document.querySelector('#modalLocations');
        modalLocations.classList.remove('show');
        modalLocations.style.display = 'none';
        window.location.href = '../../views/operator.html';
      }
    }, false);
    modalDanger.classList.add('show');
    modalDanger.style.display = 'block';
  }, false);
  clientSelect.addEventListener('change', async event => {
    const clientSelect = document.querySelector('#modalLocations #clientsSelected');
    const installationSelect = document.querySelector('#modalLocations #installationSelected');
    const totalLocationsSelected = document.querySelector('#modalLocations #totalLocations');
    const spinnerClientsSelected = document.querySelector('#modalLocations #spinnerClientsSelected');
    const spinnerInstallationsSelected = document.querySelector('#modalLocations #spinnerInstallationsSelected');
    const spinnerTotalLocationsSelected = document.querySelector('#modalLocations #spinnerTotalLocations');
    event.target.disabled = true;
    installationSelect.disabled = true;
    totalLocationsSelected.disabled = true;
    for (let i = installationSelect.options.length - 1; i >= 0; i--) {
      installationSelect.options[i].remove();
    }
    for (let i = totalLocationsSelect.options.length - 1; i >= 0; i--) {
      totalLocationsSelect.options[i].remove();
    }
    spinnerClientsSelected.classList.remove('d-none');
    spinnerInstallationsSelected.classList.remove('d-none');
    spinnerTotalLocationsSelected.classList.remove('d-none');
    spinnerClientsSelected.classList.add('d-inline-block');
    spinnerInstallationsSelected.classList.add('d-inline-block');
    spinnerTotalLocationsSelected.classList.add('d-inline-block');
    url = `http://192.168.0.2:81/installations?client=${parseInt(clientSelect.options[clientSelect.selectedIndex].value)}`;
    const objInstallationsSelect = await fetchData(url, authorization, method);
    if (objInstallationsSelect.error) throw 'Error al buscar las instalaciones';
    objInstallationsSelect.data.data.map(installation => {
      const option = document.createElement('option');
      option.value = installation.id;
      option.text = installation.name;
      installationSelect.appendChild(option);
    });

    url = `http://192.168.0.2:81/locations?installation=${parseInt(installationSelect.options[installationSelect.selectedIndex].value)}`;
    const objLocationsSelect = await fetchData(url, authorization, method);
    if (objLocationsSelect.error) throw 'Error al buscar las localizaciones';
    objLocationsSelect.data.data.map(location => {
      const option = document.createElement('option');
      option.value = location.id;
      option.text = location.name;
      totalLocationsSelect.appendChild(option);
    });
    spinnerClientsSelected.classList.remove('d-d-inline-block');
    spinnerInstallationsSelected.classList.remove('d-inline-block');
    spinnerTotalLocationsSelected.classList.remove('d-inline-block');
    spinnerClientsSelected.classList.add('d-none');
    spinnerInstallationsSelected.classList.add('d-none');
    spinnerTotalLocationsSelected.classList.add('d-none');
    event.target.disabled = false;
    installationSelect.disabled = false;
    totalLocationsSelect.disabled = false;
  }, false);

  installationSelect.addEventListener('change', async event => {
    const spinnerClientsSelected = document.querySelector('#modalLocations #spinnerClientsSelected');
    const spinnerInstallationsSelected = document.querySelector('#modalLocations #spinnerInstallationsSelected');
    const spinnerTotalLocationsSelected = document.querySelector('#modalLocations #spinnerTotalLocations');
    clientSelect.disabled = true;
    event.target.disabled = true;
    totalLocationsSelect.disabled = true;
    for (let i = totalLocationsSelect.options.length - 1; i >= 0; i--) {
      totalLocationsSelect.options[i].remove();
    }
    spinnerClientsSelected.classList.remove('d-none');
    spinnerInstallationsSelected.classList.remove('d-none');
    spinnerTotalLocationsSelected.classList.remove('d-none');
    spinnerClientsSelected.classList.add('d-inline-block');
    spinnerInstallationsSelected.classList.add('d-inline-block');
    spinnerTotalLocationsSelected.classList.add('d-inline-block');
    url = `http://192.168.0.2:81/locations?installation=${parseInt(installationSelect.options[installationSelect.selectedIndex].value)}`;
    const objLocationsSelect = await fetchData(url, authorization, method);
    if (objLocationsSelect.error) throw 'Error al buscar las localizaciones';
    objLocationsSelect.data.data.map(location => {
      const option = document.createElement('option');
      option.value = location.id;
      option.text = location.name;
      totalLocationsSelect.appendChild(option);
    });
    spinnerClientsSelected.classList.remove('d-d-inline-block');
    spinnerInstallationsSelected.classList.remove('d-inline-block');
    spinnerTotalLocationsSelected.classList.remove('d-inline-block');
    spinnerClientsSelected.classList.add('d-none');
    spinnerInstallationsSelected.classList.add('d-none');
    spinnerTotalLocationsSelected.classList.add('d-none');
    clientSelect.disabled = false;
    event.target.disabled = false;
    totalLocationsSelect.disabled = false;
  }, false);
  totalLocationsSelect.addEventListener('change', async event => {
    const idLocation = document.querySelector('#modalLocations #idLocation');
    const idDeleteNewLocation = document.querySelector('#modalLocations #idDeleteNewLocation');
    const idNewLocation = document.querySelector('#modalLocations #idNewLocation');
    const nameNewLocation = document.querySelector('#modalLocations #nameNewLocation');
    idLocation.value = parseInt(event.target.options[event.target.selectedIndex].value);
    idDeleteNewLocation.disabled = false;
    idNewLocation.textContent = 'Actualizar';
    nameNewLocation.value = event.target.options[event.target.selectedIndex].textContent;
    sessionStorage.setItem('updateLocation', JSON.stringify(true));
  }, false);
}
const handleNewPositionModal = async (event) => {
  event.target.disabled = true;
  let objNewPosition = null;
  if (sessionStorage.getItem('objNewPosition')) {
    objNewPosition = JSON.parse(sessionStorage.getItem('objNewPosition'));
  }
  const modalNewPosition = document.getElementById('modalPositions');
  const spinnerButton = document.getElementById('spinnerPositionsButton');
  const totalPositions = document.querySelector('#modalPositions #totalPositions');
  const spinnerTotalPositions = document.querySelector('#modalPositions #spinnerTotalPositions');
  const nameNewPosition = document.querySelector('#modalPositions #nameNewPosition');
  const clientPositionsSelected = document.querySelector('#modalPositions #clientPositionsSelected');
  const spinnerClientPositionsSelected = document.querySelector('#modalPositions #spinnerClientPositionsSelected');
  const installationPositionsSelected = document.querySelector('#modalPositions #installationPositionsSelected');
  const spinnerInstallationPositionsSelected = document.querySelector('#modalPositions #spinnerInstallationPositionsSelected');
  const elementSelect = document.querySelector('#modalPositions #elementSelected');
  const locationSelect = document.querySelector('#modalPositions #locationSelected');
  const spinnerLocationSelected = document.querySelector('#modalPositions #spinnerLocationSelected');
  const iePosition = document.querySelector('#modalPositions #IEPosition');
  const tensionPosition = document.querySelector('#modalPositions #tensionPosition');
  const pointPosition = document.querySelector('#modalPositions #pointPosition');
  const fasePosition = document.querySelector('#modalPositions #fasePosition');
  const idDeleteNewPosition = document.querySelector('#modalPositions #idDeleteNewPosition');
  const idNewPosition = document.querySelector('#modalPositions #idNewPosition');
  const resetNewPosition = document.querySelector('#modalPositions #resetNewPosition');
  const idPosition = document.querySelector('#modalPositions #idPosition');
  spinnerButton.classList.remove('d-none');
  spinnerButton.classList.add('d-block');
  modalNewPosition.classList.add('d-none');
  if (totalPositions.firstChild) {
    while (totalPositions.firstChild) {
      totalPositions.removeChild(totalPositions.firstChild);
    }
  }
  if (clientPositionsSelected.firstChild) {
    while (clientPositionsSelected.firstChild) {
      clientPositionsSelected.removeChild(clientPositionsSelected.firstChild);
    }
  }
  if (installationPositionsSelected.firstChild) {
    while (installationPositionsSelected.firstChild) {
      installationPositionsSelected.removeChild(installationPositionsSelected.firstChild);
    }
  }
  if (locationSelect.firstChild) {
    while (locationSelect.firstChild) {
      locationSelect.removeChild(locationSelect.firstChild);
    }
  }
  if (elementSelect.firstChild) {
    while (elementSelect.firstChild) {
      elementSelect.removeChild(elementSelect.firstChild);
    }
  }
  let method = 'GET';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  let url = 'http://192.168.0.2:81/clients';
  const objClientsPositions = await fetchData(url, authorization, method);
  if (objClientsPositions.error) throw 'Error al buscar los clientes';
  objClientsPositions.data.data.map(client => {
    const option = document.createElement('option');
    option.value = client.id;
    option.text = client.name;
    clientPositionsSelected.appendChild(option);
  });
  url = `http://192.168.0.2:81/installations?client=${parseInt(clientPositionsSelected.options[clientPositionsSelected.selectedIndex].value)}`;
  const objInstallationsPositions = await fetchData(url, authorization, method);
  if (objInstallationsPositions.error) throw 'Error al buscar las instalaciones';
  objInstallationsPositions.data.data.map(installation => {
    const option = document.createElement('option');
    option.value = installation.id;
    option.text = installation.name;
    installationPositionsSelected.appendChild(option);
  });
  url = `http://192.168.0.2:81/locations?installation=${parseInt(installationPositionsSelected.options[installationPositionsSelected.selectedIndex].value)}`;
  const objLocationsPositions = await fetchData(url, authorization, method);
  if (objLocationsPositions.error) throw 'Error al buscar las localizaciones';
  objLocationsPositions.data.data.map(location => {
    const option = document.createElement('option');
    option.value = location.id;
    option.text = location.name;
    locationSelect.appendChild(option);
  });
  url = 'http://192.168.0.2:81/elements';
  const objElementSelected = await fetchData(url, authorization, method);
  if (objElementSelected.error) throw 'Error el buscar los elementos';
  objElementSelected.data.data.map(element => {
    const option = document.createElement('option');
    option.value = element.id;
    option.text = element.name;
    elementSelect.appendChild(option);
  });
  url = `http://192.168.0.2:81/positions?location=${parseInt(locationSelect.options[locationSelect.selectedIndex].value)}`;
  const objPositionsSelected = await fetchData(url, authorization, method);
  if (objPositionsSelected.error) throw 'Error al buscar las posiciones';
  objPositionsSelected.data.data.map(position => {
    const option = document.createElement('option');
    option.value = position.id;
    option.text = position.name;
    totalPositions.appendChild(option);
  });
  nameNewPosition.value = '';
  iePosition.value = '';
  tensionPosition.value = '';
  pointPosition.value = '';
  fasePosition.value = '';
  clientPositionsSelected.addEventListener('change', async () => {
    spinnerTotalPositions.classList.remove('d-none');
    spinnerTotalPositions.classList.add('d-inline-block');
    totalPositions.disabled = true;
    spinnerClientPositionsSelected.classList.remove('d-none');
    spinnerClientPositionsSelected.classList.add('d-inline-block');
    clientPositionsSelected.disabled = true;
    spinnerInstallationPositionsSelected.classList.remove('d-none');
    spinnerInstallationPositionsSelected.classList.add('d-inline-block');
    installationPositionsSelected.disabled = true;
    spinnerLocationSelected.classList.remove('d-none');
    spinnerLocationSelected.classList.add('d-inline-block');
    locationSelect.disabled = true;

    if (totalPositions.firstChild) {
      while (totalPositions.firstChild) {
        totalPositions.removeChild(totalPositions.firstChild);
      }
    }
    if (installationPositionsSelected.firstChild) {
      while (installationPositionsSelected.firstChild) {
        installationPositionsSelected.removeChild(installationPositionsSelected.firstChild);
      }
    }
    if (locationSelect.firstChild) {
      while (locationSelect.firstChild) {
        locationSelect.removeChild(locationSelect.firstChild);
      }
    }
    url = `http://192.168.0.2:81/installations?client=${parseInt(clientPositionsSelected.options[clientPositionsSelected.selectedIndex].value)}`;
    const objInstallationsPositionsSelected = await fetchData(url, authorization, method);
    if (objInstallationsPositionsSelected.error) throw 'Error al buscar las instalaciones';
    objInstallationsPositionsSelected.data.data.map(installation => {
      const option = document.createElement('option');
      option.value = installation.id;
      option.text = installation.name;
      installationPositionsSelected.appendChild(option);
    });
    url = `http://192.168.0.2:81/locations?installation=${parseInt(installationPositionsSelected.options[installationPositionsSelected.selectedIndex].value)}`;
    const objLocationsPositionsSelected = await fetchData(url, authorization, method);
    if (objLocationsPositionsSelected.error) throw 'Error al buscar las localizaciones';
    objLocationsPositionsSelected.data.data.map(location => {
      const option = document.createElement('option');
      option.value = location.id;
      option.text = location.name;
      locationSelect.appendChild(option);
    });
    url = `http://192.168.0.2:81/positions?location=${parseInt(locationSelect.options[locationSelect.selectedIndex].value)}`;
    const objPositionsPositionsSelected = await fetchData(url, authorization, method);
    if (objPositionsPositionsSelected.error) throw 'Error al buscar las posiciones';
    objPositionsPositionsSelected.data.data.map(position => {
      const option = document.createElement('option');
      option.value = position.id;
      option.text = position.name;
      totalPositions.appendChild(option);
    });
    clientPositionsSelected.disabled = false;
    installationPositionsSelected.disabled = false;
    locationSelect.disabled = false;
    totalPositions.disabled = false;
    spinnerTotalPositions.classList.remove('d-inline-block');
    spinnerTotalPositions.classList.add('d-none');
    spinnerClientPositionsSelected.classList.remove('d-inline-block');
    spinnerClientPositionsSelected.classList.add('d-none');
    spinnerInstallationPositionsSelected.classList.remove('d-inline-block');
    spinnerInstallationPositionsSelected.classList.add('d-none');
    spinnerLocationSelected.classList.remove('d-inline-block');
    spinnerLocationSelected.classList.add('d-none');
  }, false);
  installationPositionsSelected.addEventListener('change', async () => {
    spinnerTotalPositions.classList.remove('d-none');
    spinnerTotalPositions.classList.add('d-inline-block');
    spinnerClientPositionsSelected.classList.remove('d-none');
    spinnerClientPositionsSelected.classList.add('d-inline-block');
    spinnerInstallationPositionsSelected.classList.remove('d-none');
    spinnerInstallationPositionsSelected.classList.add('d-inline-block');
    spinnerLocationSelected.classList.remove('d-none');
    spinnerLocationSelected.classList.add('d-inline-block');
    totalPositions.disabled = true;
    clientPositionsSelected.disabled = true;
    installationPositionsSelected.disabled = true;
    locationSelect.disabled = true;
    if (totalPositions.firstChild) {
      while (totalPositions.firstChild) {
        totalPositions.removeChild(totalPositions.firstChild);
      }
    }
    if (locationSelect.firstChild) {
      while (locationSelect.firstChild) {
        locationSelect.removeChild(locationSelect.firstChild);
      }
    }
    url = `http://192.168.0.2:81/locations?installation=${parseInt(installationPositionsSelected.options[installationPositionsSelected.selectedIndex].value)}`;
    const objLocationsPositionsSelected = await fetchData(url, authorization, method);
    if (objLocationsPositionsSelected.error) throw 'Error al buscar las localizaciones';
    objLocationsPositionsSelected.data.data.map(location => {
      const option = document.createElement('option');
      option.value = location.id;
      option.text = location.name;
      locationSelect.appendChild(option);
    });
    url = `http://192.168.0.2:81/positions?location=${parseInt(locationSelect.options[locationSelect.selectedIndex].value)}`;
    const objPositionsPositionsSelected = await fetchData(url, authorization, method);
    if (objPositionsPositionsSelected.error) throw 'Error al buscar las posiciones';
    objPositionsPositionsSelected.data.data.map(position => {
      const option = document.createElement('option');
      option.value = position.id;
      option.text = position.name;
      totalPositions.appendChild(option);
    });
    clientPositionsSelected.disabled = false;
    installationPositionsSelected.disabled = false;
    locationSelect.disabled = false;
    totalPositions.disabled = false;
    spinnerTotalPositions.classList.remove('d-inline-block');
    spinnerTotalPositions.classList.add('d-none');
    spinnerClientPositionsSelected.classList.remove('d-inline-block');
    spinnerClientPositionsSelected.classList.add('d-none');
    spinnerInstallationPositionsSelected.classList.remove('d-inline-block');
    spinnerInstallationPositionsSelected.classList.add('d-none');
    spinnerLocationSelected.classList.remove('d-inline-block');
    spinnerLocationSelected.classList.add('d-none');
  }, false);
  locationSelect.addEventListener('change', async () => {
    spinnerTotalPositions.classList.remove('d-none');
    spinnerTotalPositions.classList.add('d-inline-block');
    spinnerClientPositionsSelected.classList.remove('d-none');
    spinnerClientPositionsSelected.classList.add('d-inline-block');
    spinnerInstallationPositionsSelected.classList.remove('d-none');
    spinnerInstallationPositionsSelected.classList.add('d-inline-block');
    spinnerLocationSelected.classList.remove('d-none');
    spinnerLocationSelected.classList.add('d-inline-block');
    totalPositions.disabled = true;
    clientPositionsSelected.disabled = true;
    installationPositionsSelected.disabled = true;
    locationSelect.disabled = true;
    if (totalPositions.firstChild) {
      while (totalPositions.firstChild) {
        totalPositions.removeChild(totalPositions.firstChild);
      }
    }
    url = `http://192.168.0.2:81/positions?location=${parseInt(locationSelect.options[locationSelect.selectedIndex].value)}`;
    const objPositionsPositionsSelected = await fetchData(url, authorization, method);
    if (objPositionsPositionsSelected.error) throw 'Error al buscar las posiciones';
    objPositionsPositionsSelected.data.data.map(position => {
      const option = document.createElement('option');
      option.value = position.id;
      option.text = position.name;
      totalPositions.appendChild(option);
    });
    clientPositionsSelected.disabled = false;
    installationPositionsSelected.disabled = false;
    locationSelect.disabled = false;
    totalPositions.disabled = false;
    spinnerTotalPositions.classList.remove('d-inline-block');
    spinnerTotalPositions.classList.add('d-none');
    spinnerClientPositionsSelected.classList.remove('d-inline-block');
    spinnerClientPositionsSelected.classList.add('d-none');
    spinnerInstallationPositionsSelected.classList.remove('d-inline-block');
    spinnerInstallationPositionsSelected.classList.add('d-none');
    spinnerLocationSelected.classList.remove('d-inline-block');
    spinnerLocationSelected.classList.add('d-none');
  }, false);
  totalPositions.addEventListener('change', async event => {
    spinnerTotalPositions.classList.remove('d-none');
    spinnerTotalPositions.classList.add('d-inline-block');
    spinnerClientPositionsSelected.classList.remove('d-none');
    spinnerClientPositionsSelected.classList.add('d-inline-block');
    spinnerInstallationPositionsSelected.classList.remove('d-none');
    spinnerInstallationPositionsSelected.classList.add('d-inline-block');
    spinnerLocationSelected.classList.remove('d-none');
    spinnerLocationSelected.classList.add('d-inline-block');
    totalPositions.disabled = true;
    clientPositionsSelected.disabled = true;
    installationPositionsSelected.disabled = true;
    locationSelect.disabled = true;
    idDeleteNewPosition.disabled = false;
    idNewPosition.textContent = 'Actualizar';
    const idTotalPositionsSelected = parseInt(event.target.options[event.target.selectedIndex].value);
    url = `http://192.168.0.2:81/positions?id=${idTotalPositionsSelected}`;
    const objTotalPositions = await fetchData(url, authorization, method);
    if (objTotalPositions.error) throw 'Error al buscar la posición';
    idPosition.value = parseInt(objTotalPositions.data.data[0].id);
    nameNewPosition.value = objTotalPositions.data.data[0].name;
    for (let i = 0; i < elementSelect.options.length; i++) {
      if (elementSelect.options[i].value.toLowerCase() === objTotalPositions.data.data[0].element.toLowerCase()) {
        elementSelect.options[i].setAttribute('selected', 'true');
        break;
      }
    }
    for (let i = 0; i < locationSelect.options.length; i++) {
      if (parseInt(locationSelect.options[i].value) === parseInt(objTotalPositions.data.data[0].location)) {
        locationSelect.options[i].setAttribute('selected', 'true');
        break;
      }
    }
    iePosition.value = objTotalPositions.data.data[0].type;
    tensionPosition.value = parseFloat(objTotalPositions.data.data[0].voltage);
    pointPosition.value = objTotalPositions.data.data[0].point;
    fasePosition.value = objTotalPositions.data.data[0].fase;
    sessionStorage.setItem('updatePosition', JSON.stringify(true));
    clientPositionsSelected.disabled = false;
    installationPositionsSelected.disabled = false;
    locationSelect.disabled = false;
    totalPositions.disabled = false;
    spinnerTotalPositions.classList.remove('d-inline-block');
    spinnerTotalPositions.classList.add('d-none');
    spinnerClientPositionsSelected.classList.remove('d-inline-block');
    spinnerClientPositionsSelected.classList.add('d-none');
    spinnerInstallationPositionsSelected.classList.remove('d-inline-block');
    spinnerInstallationPositionsSelected.classList.add('d-none');
    spinnerLocationSelected.classList.remove('d-inline-block');
    spinnerLocationSelected.classList.add('d-none');
  }, false);
  resetNewPosition.addEventListener('click', async () => {
    spinnerClientPositionsSelected.classList.add('d-inline-block');
    spinnerClientPositionsSelected.classList.remove('d-none');
    clientPositionsSelected.disabled=true;
    spinnerInstallationPositionsSelected.classList.add('d-inline-block');
    spinnerInstallationPositionsSelected.classList.remove('d-none');
    installationPositionsSelected.disabled=true;
    spinnerLocationSelected.classList.add('d-inline-block');
    spinnerLocationSelected.classList.remove('d-none');
    locationSelect.disabled=true;
    spinnerTotalPositions.classList.add('d-inline-block');
    spinnerTotalPositions.classList.remove('d-none');
    totalPositions.disabled=true;
    idNewPosition.textContent = 'Aceptar';
    idDeleteNewPosition.disabled = true;
    sessionStorage.removeItem('updatePosition');
    idPosition.value = 0;
    nameNewPosition.value = '';
    iePosition.value = '';
    tensionPosition.value = '';
    pointPosition.value = '';
    fasePosition.value = '';
    if (clientPositionsSelected.firstChild) {
      while (clientPositionsSelected.firstChild) {
        clientPositionsSelected.removeChild(clientPositionsSelected.firstChild);
      }
    }
    if (installationPositionsSelected.firstChild) {
      while (installationPositionsSelected.firstChild) {
        installationPositionsSelected.removeChild(installationPositionsSelected.firstChild);
      }
    }
    if (locationSelect.firstChild) {
      while (locationSelect.firstChild) {
        locationSelect.removeChild(locationSelect.firstChild);
      }
    }
    if (totalPositions.firstChild) {
      while (totalPositions.firstChild) {
        totalPositions.removeChild(totalPositions.firstChild);
      }
    }
    url = 'http://192.168.0.2:81/clients';
    method = 'GET';
    const objClientPositionsSelected = await fetchData(url, authorization, method);
    if (objClientPositionsSelected.error) throw 'Error al consultar los clientes';
    objClientPositionsSelected.data.data.map(client => {
      const option = document.createElement('option');
      option.value = client.id;
      option.text = client.name;
      clientPositionsSelected.appendChild(option);
    });
    url = 'http://192.168.0.2:81/installations?client=1';
    const objInstallationPositionsSelected = await fetchData(url, authorization, method);
    if (objInstallationPositionsSelected.error) throw 'Error al consultar las instalaciones';
    objInstallationPositionsSelected.data.data.map(installation => {
      const option = document.createElement('option');
      option.value = installation.id;
      option.text = installation.name;
      installationPositionsSelected.appendChild(option);
    });
    url = 'http://192.168.0.2:81/locations?installation=1';
    const objLocationPositionsSelected = await fetchData(url, authorization, method);
    if (objLocationPositionsSelected.error) throw 'Error al consultar las localizaciones';
    objLocationPositionsSelected.data.data.map(location => {
      const option = document.createElement('option');
      option.value = location.id;
      option.text = location.name;
      locationSelect.appendChild(option);
    });
    url = 'http://192.168.0.2:81/positions?location=1';
    const objTotalPositions = await fetchData(url, authorization, method);
    if (objTotalPositions.error) throw 'Error al consultar las posiciones';
    objTotalPositions.data.data.map(position => {
      const option = document.createElement('option');
      option.value = position.id;
      option.text = position.name;
      totalPositions.appendChild(option);
    });
    spinnerClientPositionsSelected.classList.remove('d-inline-block');
    spinnerClientPositionsSelected.classList.add('d-none');
    clientPositionsSelected.disabled=false;
    spinnerInstallationPositionsSelected.classList.remove('d-inline-block');
    spinnerInstallationPositionsSelected.classList.add('d-none');
    installationPositionsSelected.disabled=false;
    spinnerLocationSelected.classList.remove('d-inline-block');
    spinnerLocationSelected.classList.add('d-none');
    locationSelect.disabled=false;
    spinnerTotalPositions.classList.remove('d-inline-block');
    spinnerTotalPositions.classList.add('d-none');
    totalPositions.disabled=false;
  }, false);
  idNewPosition.addEventListener('click', async () => {
    let update = false;
    if (sessionStorage.getItem('updatePosition')) {
      update = Boolean(JSON.parse(sessionStorage.getItem('updatePosition')));
      sessionStorage.removeItem('updatePosition');
    }
    if (nameNewPosition.value === '' || iePosition.value === '' || tensionPosition.value === '' || pointPosition.value === '' || fasePosition.value === '') {
      const modalInfo = document.getElementById('modalInfo');
      modalInfo.classList.add('show');
      modalInfo.style.display = 'block';
      document.querySelector('#modalInfo #idTitleModalInfo').textContent = 'Operación incompleta';
      document.querySelector('#modalInfo #idMessageModalInfo').textContent = 'Faltan campos por cubrir';
    } else {
      url = `http://192.168.0.2:81/positions`;
      if (update === true) {
        const id = idPosition.value;
        idPosition.value = 0;
        const objData = {
          id: parseInt(id),
          name: nameNewPosition.value,
          element: elementSelect.options[elementSelect.selectedIndex].value,
          point: pointPosition.value,
          type: iePosition.value,
          fase: fasePosition.value,
          voltage: parseFloat(tensionPosition.value),
          location: parseInt(locationSelect.options[locationSelect.selectedIndex].value)
        }
        // Actualización
        method = 'PUT';
        const objUpdatePosition = await fetchData(url, authorization, method, objData);
        if (objUpdatePosition.error) throw 'Error al actualizar la posición';
        sessionStorage.removeItem('updatePosition');
      } else {
        const objData = {
          name: nameNewPosition.value,
          element: elementSelect.options[elementSelect.selectedIndex].value,
          point: pointPosition.value,
          type: iePosition.value,
          fase: fasePosition.value,
          voltage: parseFloat(tensionPosition.value),
          location: parseInt(locationSelect.options[locationSelect.selectedIndex].value)
        }
        // Inserción
        method = 'POST';
        const objInsertPosition = await fetchData(url, authorization, method, objData);
        if (objInsertPosition.error) throw 'Error al insertar la posición';
      }
      modalNewPosition.classList.remove('show');
      modalNewPosition.style.display = 'none';
      window.location.href = '../../views/operator.html';
    }
  }, false);
  idDeleteNewPosition.addEventListener('click', async () => {
    url = 'http://192.168.0.2:81/positions';
    method = 'DELETE';
    const objData = {
      id: parseInt(idPosition.value)
    }
    const objIdDeleteNewPosition = await fetchData(url, authorization, method, objData);
    if (objIdDeleteNewPosition.error) throw 'Error al borrar la posición';
    modalNewPosition.classList.remove('show');
    modalNewPosition.style.display = 'none';
    sessionStorage.removeItem('updatePosition');
    window.location.href = '../../views/operator.html';
  }, false);
  spinnerButton.classList.remove('d-block');
  spinnerButton.classList.add('d-none');
  modalNewPosition.classList.remove('d-none');
  modalNewPosition.classList.add('show');
  modalNewPosition.style.display = 'block';
  sessionStorage.removeItem('objNewPosition');
  event.target.disabled = false;
}


const handleNewClientModal = async (event) => {
  event.target.disabled = true;
  const modalNewClient = document.getElementById('modalClients');
  const spinnerButton = document.getElementById('spinnerClientsButton');
  spinnerButton.classList.remove('d-none');
  spinnerButton.classList.add('d-block');
  modalNewClient.style.display = 'none';
  const countryNewClient = document.querySelector('#modalClients #countryNewClient');
  const provinceNewClient = document.querySelector('#modalClients #provinceNewClient');
  const municipalityNewClient = document.querySelector('#modalClients #municipalityNewClient');
  let objNewClient = null;
  if (sessionStorage.getItem('objNewClient')) {
    objNewClient = JSON.parse(sessionStorage.getItem('objNewClient'));
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
  let url = 'http://192.168.0.2:81/countries';
  const authorization = 'Bearer ' + localStorage.getItem('AUTH_CLIENT');
  const method = 'GET';
  const objCountries = await fetchData(url, authorization, method);
  if (objCountries.error) throw 'Error al solicitar los clientes';
  objCountries.data.data.map(country => {
    const option = document.createElement('option');
    option.value = country.id;
    option.text = country.name;
    if (objNewClient && option.value === objNewClient.country) {
      option.setAttribute('selected', true);
    }
    countryNewClient.appendChild(option);
  });
  url = 'http://192.168.0.2:81/provinces?country=' + countryNewClient.options[countryNewClient.selectedIndex].value;
  const objProvinces = await fetchData(url, authorization, method);
  if (objProvinces.error) throw 'Error al solicitar las provincias';
  objProvinces.data.data.map(province => {
    const option = document.createElement('option');
    option.value = province.id;
    option.text = province.name;
    if (objNewClient && option.value === objNewClient.province) {
      option.setAttribute('selected', true);
    }
    provinceNewClient.appendChild(option);
  });
  url = 'http://192.168.0.2:81/municipalities?province=' + provinceNewClient.options[provinceNewClient.selectedIndex].value;
  const objMunicipality = await fetchData(url, authorization, method);
  if (objMunicipality.error) throw 'Error al solicitar los municipios';
  objMunicipality.data.data.map(province => {
    const option = document.createElement('option');
    option.value = province.id;
    option.text = province.name;
    if (objNewClient && option.value === objNewClient.municipality) {
      option.setAttribute('selected', true);
    }
    municipalityNewClient.appendChild(option);
  });
  if (objNewClient) {
    document.getElementById('nameNewClient').value = objNewClient.name;
    document.getElementById('zipCodeNewClient').value = objNewClient.cp;
    document.getElementById('addressNewClient').value = objNewClient.address;
    document.getElementById('phoneNewClient').value = objNewClient.phone;
    document.getElementById('emailNewClient').value = objNewClient.email;
  }

  spinnerButton.classList.remove('d-block');
  spinnerButton.classList.add('d-none');
  modalNewClient.style.display = 'block';
  event.target.disabled = false;
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
  if (selectInstallations.options.length === 0) return null;
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
  if (selectLocations.options.length === 0) return null;
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
    tdTrash.innerHTML = "<button type='button' class='btn bg-color-marron text-white' data='position.id'><i class=\"fa-solid fa-trash\"></i></button>";
    tdTrash.setAttribute('class', 'text-center align-middle');
    row.appendChild(tdTrash);
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
const handleBackModalDanger = () => {
  const modalDanger = document.getElementById('modalDanger');
  modalDanger.classList.remove('show');
  modalDanger.style.display = 'none';
};
const deleteRowPosition = async () => {
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
  const table=document.getElementById('table');
  const authToken = window.localStorage.getItem('AUTH_CLIENT');
  const authorization = 'Bearer ' + authToken;
  let url = 'http://192.168.0.2:81/clients';
  let method = 'GET';
  const arrayClientes = await getClients(url, authorization, method, selectClients, selectClientValue);
  url = `http://192.168.0.2:81/installations?client=${selectClientValue}`;
  await getInstallations(url, authorization, method, selectInstallations, selectLocations, selectInstallationValue);
  url = 'http://192.168.0.2:81/locations?installation=' + selectInstallationValue;
  await getLocations(url, authorization, method, selectLocations, selectLocationValue);
  url = 'http://192.168.0.2:81/positions?location=' + selectLocationValue;
  await getPositions(url, authorization, method, table);
  const selectTotalClients = document.querySelector('#modalClients #totalClients');
  arrayClientes.forEach((objectClient) => {
    const option = document.createElement('option');
    option.value = objectClient.id;
    option.text = objectClient.name;
    selectTotalClients.appendChild((option));
  });
  selectTotalClients.selectedIndex = -1;
  document.getElementById('spinnerOperator').classList.remove('d-flex');
  document.getElementById('spinnerOperator').classList.add('d-none');
  document.getElementById('operator').classList.remove('d-none');
  document.getElementById('operator').classList.add('d-flex');
};