import axios from 'axios'

const api = axios.create({
    baseURL: 'https://api-cadastro-de-usuarios.onrender.com',
})


export default api