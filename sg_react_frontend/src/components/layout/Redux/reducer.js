import { ROOT, FOLDER, TESTCASE } from "../../constants";
import * as actions from "./actionTypes";


const initialState = {
    type: ROOT,
    object: [],
    tree: {
        openNodes: [],
        treeUpdate: ''
    }
};


export default function reducer (state = initialState, action) {
    console.log(action.payload);
    switch (action.type) {
        case actions.GET_ROOT: {
            return {
                ...state,
                type: ROOT,
                object: action.payload
            }
        }
        case actions.GET_FOLDER: {
            return {
                ...state,
                type: FOLDER,
                object: action.payload
            }
        }
        case actions.GET_TESTCASE: {
            return {
                ...state,
                type: TESTCASE,
                object: action.payload
            }
        }
        case actions.TREE_EXPAND_NODE: {
            const { nodeId } = action.payload;
            const updatedOpenNodes = [...state.tree.openNodes, nodeId];
            return {
                ...state,
                tree: {
                    ...state.tree,
                    openNodes: updatedOpenNodes
                }
            }
        }
        case actions.TREE_COLLAPSE_NODE: {
            const { nodeId } = action.payload;
            const updatedOpenNodes = state.tree.openNodes.filter(
                (node) => node !== nodeId
            );
            return {
                ...state,
                tree: {
                    ...state.tree,
                    openNodes: updatedOpenNodes
                }
            }
        }
        case actions.CREATE_FOLDER: {
            const id = action.payload.id;
            const name = action.payload.name;
            return {
                ...state,
                tree: {
                    ...state.tree,
                    treeUpdate: `Added folder "F${id}: ${name}"`
                }
            }
        }
        default:
            return state;
    }
}