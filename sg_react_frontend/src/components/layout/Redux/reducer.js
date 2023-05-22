import * as actions from "./actionTypes";


const initialState = {
    type: '',
    object: []
};


export default function reducer (state = initialState, action) {
    switch (action.type) {
        case actions.GET_FOLDER: {
            console.log(action.payload);
            return {
                ...state,
                type: 'folder',
                object: action.payload
            }
        }
        case actions.GET_TESTCASE: {
            console.log(action.payload)
            return {
                ...state,
                type: 'testcase',
                object: action.payload
            }
        }
        default:
            return state;
    }
}