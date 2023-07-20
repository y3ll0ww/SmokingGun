import { PROJECT, FOLDER, TESTCASE } from "../../constants";
import * as actions from "./actionTypes";
import { KEY_FOLDER } from "../../constants";


const initialState = {
    type: PROJECT,
    projects: {
        availableProjects: [],
        currentProject: {}
    },
    object: {},
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
        case actions.GET_PROJECTS: {
            return {
                ...state,
                projects: {
                    ...state.projects,
                    availableProjects: action.payload
                }
            }
        }
        case actions.SET_PROJECT: {
            return {
                ...state,
                type: PROJECT,
                projects: {
                    ...state.projects,
                    currentProject: {
                        ...state.projects.currentProject,
                        id: action.payload
                    }
                }
            }
        }
        case actions.GET_PROJECT: {
            let data = action.payload;
            data.child_folders = action.payload.project_folders;
            data.test_cases = action.payload.project_testcases;
            delete data.project_folders;
            delete data.project_testcases;

            return {
                ...state,
                type: PROJECT,
                object: data,
                projects: {
                    ...state.projects,
                    currentProject: action.payload
                }
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
        case action.TREE_UPDATE: {
            const name = action.payload.name;
            return {
                ...state,
                tree: {
                    ...state.tree,
                    treeUpdate: `[${Date.now()}]: "${name}"]`
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