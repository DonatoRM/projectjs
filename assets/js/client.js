document.addEventListener('DOMContentLoaded', () => {
  const role = parseInt(window.localStorage.getItem('role'));
  if (role !== 2) {
    window.location.href = '../../index.html';
  }
}, false);