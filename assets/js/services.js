export const fetchData = async (url, authorization, method, objData) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(objData)
    });
    if (response.ok) {
      const data = await response.json();
      return {
        data,
        error: false
      }
    } else {
      return {
        data: [],
        error: '<p>Error de Autentificación</p'
      }
    }
  } catch (err) {
    return {
      data: [],
      error: '<p>Autenticación no válida</p'
    }
  }
};