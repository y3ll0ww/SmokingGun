export const PROJECT = "project";
export const FOLDER = "folder";
export const TESTCASE = "testcase";
export const KEY = (key, id) => { return key + id + ":"; }
export const KEY_FOLDER = (id) => { return KEY("F", id); }
export const KEY_TESTCASE = (id) => { return KEY("T", id); }
export const STEP_ACTION = "action";
export const STEP_RESULT = "result";

export const DATE = (date, showTime) => {
    const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    if (showTime) {
        dateOptions['hour'] = 'numeric';
        dateOptions['minute'] = 'numeric';
    }
    return new Date(date).toLocaleString(undefined, dateOptions);
}

export const TRUNCATE = (text, max) => {
    return text.length > max ? `${text.slice(0, max-3)}...` : text;
}

export const MODALSTYLE = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};