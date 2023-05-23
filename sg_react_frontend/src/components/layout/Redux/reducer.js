import { ROOT, FOLDER, TESTCASE } from "../../constants";
import * as actions from "./actionTypes";


const initialState = {
    type: ROOT,
    object: []
};


export default function reducer (state = initialState, action) {
    switch (action.type) {
        case actions.GET_ROOT: {
            console.log(action.payload);
            return {
                ...state,
                type: ROOT,
                object: action.payload
            }
        }
        case actions.GET_FOLDER: {
            console.log(action.payload);
            return {
                ...state,
                type: FOLDER,
                object: action.payload
            }
        }
        case actions.GET_TESTCASE: {
            console.log(action.payload)
            return {
                ...state,
                type: TESTCASE,
                object: action.payload
            }
        }
        default:
            return state;
    }
}