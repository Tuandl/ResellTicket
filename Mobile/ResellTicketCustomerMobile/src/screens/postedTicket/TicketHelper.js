import Api from './../../service/Api';

async function getVehicles() {
    const resVehicle = await Api.get('api/vehicle');
    if (resVehicle.status === 200) {
        return resVehicle.data
    }
    return null;
}

export default {
    getVehicles: getVehicles
}