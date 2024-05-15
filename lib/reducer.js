export const initialState = {
    mode: false,
};

export const actionTypes = {
    SET_MODE : "SET_MODE",
};

const reducer = (state, action) => {
    switch(action.type){
        case actionTypes.SET_MODE:
            return {
                ...state,
                mode: action.mode,
            };

        default:
            return state;
    }
};

export default reducer;