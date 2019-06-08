import * as ActionType from '../constants/ActionTypes';
import { callApiWithToken } from '../helper/ApiCaller';


export const getTicketTypeRequest = (param) =>{
    return dispatch => {
        var url = null;
        if(param) {
            url = 'api/tickettype?param=' + param;
        } else {
            url = 'api/tickettype';
        }
        return callApiWithToken(url, 'GET', null).then(res => { 
            dispatch(getTicketType(res.data));
        });
    }
}



export const getTicketType = (ticketTypes) => {
    
    return {
        type: ActionType.GET_TICKETTYPE,
        ticketTypes
    }
}

export const findTicketTypeByIdRequest = (id) => {
    return dispatch => {
        return callApiWithToken(`api/tickettype/${id}`, 'GET', null).then(res => {
            dispatch(findTicketTypeById(res.data));           
            
        });
    }
}

export const findTicketTypeById = (ticketType) => {
    return {
        type: ActionType.EDIT_TICKETTYPE,
        ticketType
    }
}

export const createTransportationRequest = (user) => {
    return dispatch => {
        return callApiWithToken('api/tickettype', 'POST', user, null).then(res => {
            dispatch(createTransportation(res.data));
        })
    }
}

export const createTransportation = (newTransportation) => {
    return {
        type: ActionType.CREATE_TRANSPORTATION,
        newTransportation
    }
}