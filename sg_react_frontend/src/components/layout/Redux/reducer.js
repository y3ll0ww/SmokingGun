import { PROJECT, FOLDER, TESTCASE, DARK, LIGHT } from "../../constants";
import * as actions from "./actionTypes";


const initialState = {
    theme: DARK,
    type: PROJECT,
    projects: {
        availableProjects: [],
        currentProject: {}
    },
    object: {},
    tree: {
        folders: [],
        openNodes: [],
        treeUpdate: ''
    },
    selection: [],
    steps: {
        newStepIds: [],
        editing: {},
        stepUpdate: '',
    }
};

const createFolderTree = (data, parentId = null) => {
    const folderTree = [];
  
    for (const item of data) {
      if (item.type === FOLDER && item.parent_folder === parentId) {
        // Recursively create child folders
        const childFolders = createFolderTree(data, item.id);
  
        // Remove "testcases" key
        const { testcases, ...folderWithoutTestcases } = item;
  
        // If there are child folders after filtering, add the folder to the tree
        if (childFolders.length > 0) {
          folderWithoutTestcases.child_folders = childFolders;
        }
  
        folderTree.push(folderWithoutTestcases);
      }
    }
  
    return folderTree;
};

const getAllExpandableNodes = (data) => {
    const expandableFolders = [];

    function processFolders(folders, isRoot) {
        for (const folder of folders) {
            if (folder.child_folders && folder.child_folders.length > 0) {
                folder.root = isRoot;
                expandableFolders.push(folder);
                processFolders(folder.child_folders, false);
            }
        }
    }

    processFolders(data, true);
    return expandableFolders;
}

export default function reducer (state = initialState, action) {
    console.log(action.payload);
    switch (action.type) {
        case actions.SET_THEME: {
            if (state.theme === DARK) {
                return {
                    ...state,
                    theme: LIGHT
                }
            } else if (state.theme === LIGHT) {
                return {
                    ...state,
                    theme: DARK
                }
            }
        }
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
        case actions.DESELECT_PROJECT: {
            return {
                ...state,
                type: PROJECT,
                projects: {
                    ...state.projects,
                    currentProject: {}
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
        case actions.SELECTION: {
            return {
                ...state,
                selection: action.payload,
                steps: {
                    ...state.steps,
                    editing: {}
                }
            }
        }
        case actions.TREE_SET_FOLDERS: {
            const treeFolders = createFolderTree(action.payload);

            return{
                ...state,
                tree: {
                    ...state.tree,
                    folders: treeFolders
                }
            }
        }
        case actions.TREE_EXPAND_ALL: {
            const allFolderIds = getAllExpandableNodes(state.tree.folders);
            
            return {
                ...state,
                tree: {
                    ...state.tree,
                    openNodes: allFolderIds
                }
            }
        }
        case actions.TREE_COLLAPSE_ALL: {
            return {
                ...state,
                tree: {
                    ...state.tree,
                    openNodes: []
                }
            }
        }
        case actions.TREE_EXPAND_NODE: {
            const updatedOpenNodes = [...state.tree.openNodes, action.payload];

            return {
                ...state,
                tree: {
                    ...state.tree,
                    openNodes: updatedOpenNodes
                }
            }
        }
        case actions.TREE_COLLAPSE_NODE: {
            const updatedOpenNodes = state.tree.openNodes.filter(
                (node) => node !== action.payload
            );
            
            return {
                ...state,
                tree: {
                    ...state.tree,
                    openNodes: updatedOpenNodes
                }
            }
        }
        case actions.TREE_UPDATE: {
            const name = action.payload.name;
            return {
                ...state,
                tree: {
                    ...state.tree,
                    treeUpdate: `[${Date.now()} | "${name}"]`
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
        case actions.TESTSTEPS_CHANGE_EDITING: {
            return {
                ...state,
                steps: {
                    ...state.steps,
                    editing: {
                        id: action.payload.id,
                        step: action.payload.step
                    }
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