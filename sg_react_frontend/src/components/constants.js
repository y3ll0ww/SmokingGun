export const ROOT = "root";
export const FOLDER = "folder";
export const TESTCASE = "testcase";
export const KEY = (key, id) => { return key + id + ":"; }
export const KEY_FOLDER = (id) => { return KEY("F", id); }
export const KEY_TESTCASE = (id) => { return KEY("T", id); }
