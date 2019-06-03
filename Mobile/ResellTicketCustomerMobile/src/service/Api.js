import { create } from 'apisauce';
import AppConfigs from '../config/appConfigs';

const api = create({
    baseURL: AppConfigs.baseUrl,
});

export default api;