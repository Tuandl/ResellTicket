import { create } from 'apisauce';
import AppConfigs from '../config/appConfigs';
import { AsyncStorage } from 'react-native';
import keyConstant from '../constants/keyConstant';
import NavigationService from './NavigationService';

async function getToken() {
    return await AsyncStorage.getItem(keyConstant.STORAGE.TOKEN);
}

const api = create({
    baseURL: AppConfigs.baseUrl,
    headers: {
        Authorization: `Bearer ${getToken()}`,
    }
});

api.addMonitor(response => {
    if(response.status === 401) {
        NavigationService.navigate('Login');
    }
});

export default api;