import axios from './customize-axios';

const fetchAllUser = () => {
    const access_token = localStorage.getItem("TOKEN")
    return axios.get('/api/v1/user', {headers: {"Authorization": "Bearer " + access_token}});
}

const postCreateUser = (full_name, birthday, gender, phone_number, address, email, introduction, image) => {
    // const access_token = localStorage.getItem("TOKEN")
    return axios.post('/api/v1/user', { full_name, birthday, gender, phone_number, address, email, introduction, image })
}

const putUpdateUser = (_id, full_name, birthday, gender, phone_number, address, email, introduction, image) => {
    // const access_token = localStorage.getItem("TOKEN")
    return axios.put(`/api/v1/user/${_id}`, { _id, full_name, birthday, gender, phone_number, address, email, introduction, image })
}

const deleteUser = (_id) => {
    // const access_token = localStorage.getItem("TOKEN")
    return axios.delete(`/api/v1/user/${_id}`)
}

const faceSearch = (face) =>{
    return axios.post('/api/v1/facesearch',{face})
}

const getFaceSearch = () => {
    return axios.get('/api/v1/searchuser');
}

const exportUsers = (date) => {
    const access_token = localStorage.getItem("TOKEN")
    console.log(date)
    return axios.get('/api/v1/export?date='+date, {headers: {"Authorization": "Bearer " + access_token}});
}

export { fetchAllUser, postCreateUser, putUpdateUser, deleteUser, faceSearch, getFaceSearch, exportUsers };
