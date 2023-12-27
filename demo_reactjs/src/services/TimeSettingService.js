import axios from './customize-axios';

const getTimeSetting = () => {
    const access_token = localStorage.getItem("TOKEN")
    return axios.get('/api/v1/setting', {headers: {"Authorization": "Bearer " + access_token}});
}

const updateTimeSetting = (hour, minute) => {
    const access_token = localStorage.getItem("TOKEN")
    return axios.post('/api/v1/setting', { hour, minute }, {headers: {"Authorization": "Bearer " + access_token}})
}

export {getTimeSetting, updateTimeSetting}