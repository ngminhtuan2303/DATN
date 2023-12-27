import axios from './customize-axios';

const fetchAllUser = () => {
    const access_token = localStorage.getItem("TOKEN")
    return axios.get('/api/v1/admin', {headers: {"Authorization": "Bearer " + access_token}});
}

const postCreateUser = (full_name, password, email, introduction) => {
    // const access_token = localStorage.getItem("TOKEN")
    return axios.post('/api/v1/admin', { full_name, password, email, introduction })
}

const putUpdateUser = (_id, full_name, password, email, introduction, image) => {
    // const access_token = localStorage.getItem("ACCESS_TOKEN")
    return axios.put(`/api/v1/admin/${_id}`, { _id, full_name, password, email, introduction, image })
}

const deleteUser = (_id) => {
    // const access_token = localStorage.getItem("ACCESS_TOKEN")
    return axios.delete(`/api/v1/admin/${_id}`, { _id })
}

const logIn = (email, password) => {
    return axios.post(`/api/v1/login`, {email, password})
}

export { fetchAllUser, postCreateUser, putUpdateUser, deleteUser, logIn };
