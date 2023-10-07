export const DARK = "darkTheme";
export const LIGHT = "lightTheme";
export const PRIMARY_COLOR = "#C02328";
export const SELECTION_COLOR = "rgb(192, 35, 40, 0.25)"
export const SECONDARY_COLOR = "#D9D454";
export const DIRECTORY = "directory";
export const TESTRUNS = "testruns";
export const SIDEMENU = "sidemenu";
export const DETAILVIEW = "detailview";
export const PROJECT = "project";
export const FOLDER = "folder";
export const TESTCASE = "testcase";
export const KEY_ = (key, id) => { return `${key}-${id}`; }
export const KEY_FOLDER = (project_key, item_number) => { return KEY_(project_key, item_number); }
export const KEY_TESTCASE = (project_key, item_number) => { return KEY_(project_key, item_number); }
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

export const REGEX_NO_SPECIAL_CHARS = (value) => {
    return value.replace(/[^A-Za-z0-9\sÀàÁáÂâÃãĀāĂăȦȧÄäÅåǍǎȂȃC̀c̀ĆćÇçÈèÉéÊêẼẽĒēĔĕĖėËëE̊e̊ĚěȆȇÌìÍíÎîĨĩĪīĬĭÏïI̊i̊ǏǐȊȋÑñÒòÓóÔôÕõŎŏȮȯÖöO̊o̊ǑǒØøƟɵŞşÙùÚúÛûŨũŪūŬŭÜüŮůǓǔȖȗ]/gu, '');
}

export const REGEX_SPECIAL_CHARS = (value) => {
    return value.replace(/[^A-Za-z0-9\s!@#$%^&*()-_=+[\]{}|;:'",.<>/?\\]ÀàÁáÂâÃãĀāĂăȦȧÄäÅåǍǎȂȃC̀c̀ĆćÇçÈèÉéÊêẼẽĒēĔĕĖėËëE̊e̊ĚěȆȇÌìÍíÎîĨĩĪīĬĭÏïI̊i̊ǏǐȊȋÑñÒòÓóÔôÕõŎŏȮȯÖöO̊o̊ǑǒØøƟɵŞşÙùÚúÛûŨũŪūŬŭÜüŮůǓǔȖȗ/g, '');
}
