import {fetchData} from './services.js';

document.addEventListener('DOMContentLoaded', () => {
  const role = parseInt(window.localStorage.getItem('role'));
  if (role === 2) {
    window.location.href = '../../index.html';
  }
  const authToken = window.localStorage.getItem('AUTH_CLIENT');
  const authorization = 'Bearer ' + authToken;
  let url = 'http://192.168.0.2:81/clients';
  let method = 'GET';
  const selectClients = document.getElementById('clients');
  void getClients(url, authorization, method, selectClients);
  const selectInstallations=document.getElementById('installations');
  console.log(selectClients);
  url = 'http://192.168.0.2:81/installations?client='+selectClients.selectedIndex;
  method = 'GET';
  void getInstallations(url, authorization, method, selectInstallations);
}, false);
const getClients = async (url1, authorization, method, selectClients,selectInstallations) => {
  const {data,error}=await fetchData(url,authorization,method);
  if(error) throw new error('Error al busca: '+error);
  data.data.map(client=>{
    let option=document.createElement("option");
    option.value=client.id;
    option.text=client.name;
    selectClients.appendChild(option);
  });
};
const getInstallations = async (url, authorization, method, selectInstallations) => {
  const {data,error}=await fetchData(url,authorization,method);
  if(error) throw new error('Error al busca: '+error);
  data.data.map(installation=>{
    let option=document.createElement("option");
    option.value=installation.id;
    option.text=installation.name;
    selectInstallations.appendChild(option);
  });
};
