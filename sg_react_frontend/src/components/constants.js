export const ROOT = "root";
export const FOLDER = "folder";
export const TESTCASE = "testcase";
export const KEY = (key, id) => { return key + id + ":"; }
export const KEY_FOLDER = (id) => { return KEY("F", id); }
export const KEY_TESTCASE = (id) => { return KEY("T", id); }
export const STEP_ACTION = "action";
export const STEP_RESULT = "result";

export const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};