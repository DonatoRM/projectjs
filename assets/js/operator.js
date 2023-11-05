import {fetchData} from './services.js';

document.addEventListener('DOMContentLoaded', () => {
  const role = parseInt(window.localStorage.getItem('role'));
  if (role === 2) {
    window.location.href = '../../index.html';
  }
  const selectClients = document.getElementById('clients');
  const selectInstallations=document.getElementById('installations');
  const selectLocations=document.getElementById('locations');

  const changeClients=(event)=>{
    url = 'http://192.168.0.2:81/installations?client='+event.target.value;
    method = 'GET';
    void getInstallations(url, authorization, method, selectInstallations,selectLocations);
  }
  const changeInstallations=(event)=>{
    url = 'http://192.168.0.2:81/locations?installation='+event.target.value;
    method = 'GET';
    void getLocations(url, authorization, method, selectLocations);
  }

  selectClients.addEventListener('change',changeClients,false);
  selectInstallations.addEventListener('change',changeInstallations,false);
  // selectLocations.addEventListener('change',changeLocations,false);
  const authToken = window.localStorage.getItem('AUTH_CLIENT');
  const authorization = 'Bearer ' + authToken;
  let url = 'http://192.168.0.2:81/clients';
  let method = 'GET';
  void getClients(url, authorization, method, selectClients);
}, false);
const getClients = async (url, authorization, method, selectClients,selectInstallations) => {
  const {data,error}=await fetchData(url,authorization,method);
  if(error) throw new error('Error al busca: '+error);
  data.data.map(client=>{
    let option=document.createElement("option");
    option.value=client.id;
    option.text=client.name;
    selectClients.appendChild(option);
  });
};
const getInstallations = async (url, authorization, method, selectInstallations,selectLocations) => {
  const {data,error}=await fetchData(url,authorization,method);
  if(error) throw new error('Error al busca: '+error);
  selectInstallations.innerHTML='';
  selectLocations.innerHTML='';
  data.data.map(installation=>{
    let option=document.createElement("option");
    option.value=installation.id;
    option.text=installation.name;
    selectInstallations.appendChild(option);
  });
};
const getLocations = async (url, authorization, method, selectLocations) => {
  const {data,error}=await fetchData(url,authorization,method);
  if(error) throw new error('Error al busca: '+error);
  selectLocations.innerHTML='';
  data.data.map(location=>{
    let option=document.createElement("option");
    option.value=location.id;
    option.text=location.name;
    selectLocations.appendChild(option);
  });
};
