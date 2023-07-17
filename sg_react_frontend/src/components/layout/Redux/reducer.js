import { ROOT, FOLDER, TESTCASE } from "../../constants";
import * as actions from "./actionTypes";
import { KEY_FOLDER } from "../../constants";


const initialState = {
    type: ROOT,
    object: [],
    tree: {
        openNodes: [],
        treeUpdate: ''
    },
    steps: {
        newStepIds: [],
        stepUpdate: '',
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
            const name = action.payload.name;
            return {
                ...state,
                tree: {
                    ...state.tree,
                    treeUpdate: `[${Date.now()}]: Added folder "${name}"`
                }
            }
        }
        case actions.UPDATE_FOLDER: {
            const name = action.payload.name;
            return {
                ...state,
                tree: {
                    ...state.tree,
                    treeUpdate: `[${Date.now()}]: Updated folder "${name}"`
                }
            }
        }
        case actions.DELETE_FOLDER: {
            const id = action.payload.id;
            const name = action.payload.name;
            return {
                ...state,
                tree: {
                    ...state.tree,
                    treeUpdate: `[${Date.now()}]: Deleted folder "${KEY_FOLDER(id)} ${name}"`
                }
            }
        }
        case actions.CREATE_TESTCASE: {
            const name = action.payload.name;
            return {
                ...state,
                tree: {
                    ...state.tree,
                    treeUpdate: `[${Date.now()}]: Added testcase "${name}"`
                }
            }
        }
        case actions.UPDATE_TESTCASE: {
            const name = action.payload.name;
            return {
                ...state,
                tree: {
                    ...state.tree,
                    treeUpdate: `[${Date.now()}]: Updated testcase "${name}"`
                }
            }
        }
        case actions.DELETE_TESTCASE: {
            const id = action.payload.id;
            const name = action.payload.name;
            return {
                ...state,
                tree: {
                    ...state.tree,
                    treeUpdate: `[${Date.now()}]: Deleted testcase "${KEY_FOLDER(id)} ${name}"`
                }
            }
        }
        case actions.TESTSTEPS_CREATE_NEW_LINE: {
            const id = Date.now();
            const data = {
                id: id,
                order: action.payload.order,
                action: action.payload.action,
                result: action.payload.result
            }
            const newSteps = state.object.test_steps;
            newSteps.push(data);
            return {
                ...state,
                ...state.tree,
                object: {
                    ...state.object,
                    test_steps: newSteps
                },
                steps: {
                    ...state.steps,
                    newStepIds: [
                        ...state.steps.newStepIds,
                        id
                    ]
                }
            }
        }
        case actions.TESTSTEPS_ADD_NEW_LINE: {
            const update = Date.now();
            const newSteps = state.object.test_steps.filter(step => step.id !== action.payload);
            const newStepIds = state.steps.newStepIds.filter(stepId => stepId.id !== action.payload);

            return {
                ...state,
                object: {
                    ...state.object,
                    test_steps: newSteps
                },
                steps: {
                    newStepIds: newStepIds,
                    stepUpdate: update
                }
            }

        }
        case actions.TESTSTEPS_REORDER_STEPS: {
            return {
                ...state,
                object: {
                    ...state.object,
                    test_steps: action.payload
                }
            }
        }
        case actions.TESTSTEPS_DELETE_STEP: {
            const newStepIds = state.steps.newStepIds.filter(stepId => stepId !== action.payload.id);
            return {
                ...state,
                object: {
                    ...state.object,
                    test_steps: action.payload.steps
                },
                steps: {
                    ...state.steps,
                    newStepIds: newStepIds
                }
            }
        }




        default:
            return state;
    }
}