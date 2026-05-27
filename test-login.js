const axios = require('axios');

async function test() {
  console.log('Probando login...');
  try {
    const res = await axios.post('http://localhost:3000/api/auth/teacher/login', {
      email: 'juan.perez@colegio.com',
      password: 'password123'
    });
    console.log('✅ Login Profesor exitoso:', res.data.token ? 'TOKEN RECIBIDO' : 'SIN TOKEN');
  } catch (err) {
    console.error('❌ Error Login Profesor:', err.response?.data || err.message);
  }

  try {
    const res = await axios.post('http://localhost:3000/api/auth/student/login', {
      documentNumber: '1234567890',
      password: 'password123'
    });
    console.log('✅ Login Estudiante exitoso:', res.data.token ? 'TOKEN RECIBIDO' : 'SIN TOKEN');
  } catch (err) {
    console.error('❌ Error Login Estudiante:', err.response?.data || err.message);
  }
}

test();
