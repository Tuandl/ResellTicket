import * as ActionType from "../../constants/ActionTypes";

var initialState = [];

const transportationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.GET_TRANSPORTATION:
            state = action.transportations;
            return [...state];
        case ActionType.CREATE_TRANSPORTATION:
            state.push(action.newTransportation);
            return [...state]
        default:
            return state;
    }
}

export default transportationsReducer;