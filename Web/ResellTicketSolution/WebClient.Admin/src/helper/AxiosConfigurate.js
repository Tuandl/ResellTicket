import Axios from "axios";
import { API_URL } from "../constants/Config";

const AxiosConfigurate = () => {
    var token = localStorage.getItem('userToken');
    if (token != null) {
        token.replace(/"/g, '');
        Axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    }
    Axios.interceptors.response.use(null, (err) => {
        if(err.response.status === 401) {
            localStorage.removeItem('userToken');
            localStorage.clear();
            window.location.replace('/login');
        }
        return err;
    });
    Axios.defaults.baseURL = API_URL;
}

export default AxiosConfigurate