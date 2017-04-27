/**
 * Created by sudhir.m on 14/01/17.
 */

const {IDENTIFIERS, VALUES}  = require('./constants');
const {getObjectOrArrayFromStringKey, isNumber}  = require('./utilities');

const operators = ["+", "-", "*", "/", "%"];

// conversions to type
const convertToString = (val) => {
    if (val) {
        return String(val);
    }
    return "";
};

const convertToNumber = (val) => {
    if (val) {
        return Number(val);
    }
    return 0;
};

const convertToUpperCase = (val) => {
    if (val) {
        return val.toUpperCase();
    }
    return "";
};

const convertToDate = (val) => {
    if (val) {
        try {
            return new Date(val).getTime();
        } catch (e) {
        }
    }
    return val;
};

// actions
const deleteKey = (val) => {
    return undefined;
};

const deleteIfNotPresent = (val) => {
    return typeof val === "undefined" ? undefined : val;
};

const appendKeyData = (val, key, obj, config) => {

    const {appendMap} = config;
    if (!appendMap || typeof appendMap[key] === "undefined") {
        return val;
    }

    let {path, separator} = appendMap[key];

    return val + (separator ? separator : "") + convertByKey(path, obj);

};

const dependsOnSomeOtherKey = (val, key, obj, config) => {

    if (typeof key === "undefined") {
        return config.dependentMap[val];
    }

    const {keyType, keyVal, fn} = extractKeyAndValue(key);

    if (actionToFnMapping[keyVal]) {
        const fn = actionToFnMapping[keyVal];
        return fn.call(this, val, keyType, obj, config.dependentMap);
    }

    return key;
};

const evaluateExpression = (val, key, obj, config) => {

    key = getObjectOrArrayFromStringKey(key, obj);
    if (!config[key]) {
        return key;
    }
    const {operator, value} = config[key];

    if (operators.indexOf(operator) === -1 || !isNumber(value)) {
        return key;
    }

    const expr = val + "" + operator + "" + value;
    return eval(expr);

};

const extractKeyAndValue = (key) => {
    const start = isSpecialType(key, identifierMap);
    const {end, fn} = identifierMap[start];

    const keyType = key.substring(key.indexOf(start) + 1, key.lastIndexOf(end));
    const keyVal = key.substring(0, key.indexOf(start));
    return {
        keyType,
        keyVal,
        fn
    }
};

// mappings
const typeToFnMapping = {
    'STRING': convertToString,
    'NUMBER': convertToNumber,
    'DATE': convertToDate,
    'UPPER': convertToUpperCase
};

const actionToFnMapping = {

    'APPEND': appendKeyData,
    'DELETE': deleteKey,
    'DELETE_IF_NOT_PRESENT': deleteIfNotPresent,
    'DEPENDS': dependsOnSomeOtherKey,
    'EVAL': evaluateExpression
};


const convertToType = (type, val) => {

    if (typeToFnMapping[type]) {
        const fn = typeToFnMapping[type];
        return fn.call(this, val);
    }
    return val;

};

const performNestedAction = (key, val, obj, config) => {

    const {keyType, keyVal, fn} = extractKeyAndValue(key);

    if (actionToFnMapping[keyVal]) {
        const fn = actionToFnMapping[keyVal];
        return fn.call(this, val, keyType, obj, config);
    }

};

const performAction = (type, val, obj, config) => {
    const specialType = isSpecialType(type, identifierMap);
    if (specialType) {
        // nested action
        return performNestedAction(type, val, obj, config);
    }

    if (actionToFnMapping[type]) {
        const fn = actionToFnMapping[type];
        return fn.call(this, val, undefined, obj, config);
    }
    return val;
};

const identifierMap = {};
identifierMap[IDENTIFIERS.TYPE_START] = {
    end: IDENTIFIERS.TYPE_END,
    fn: convertToType
};
identifierMap[IDENTIFIERS.ACTION_START] = {
    end: IDENTIFIERS.ACTION_END,
    fn: performAction
};

const isSpecialType = (key) => {

    let keys = Object.keys(identifierMap);

    for (let i = 0; i < keys.length; i++) {
        const start = keys[i];
        const end = identifierMap[start].end;
        if (key.indexOf(start) > -1 && key.indexOf(end) > -1) {
            return start;
        }
    }

    return VALUES.DEFAULT;

};

const convertSpecialType = (key, start, obj, config) => {

    const {keyType, keyVal, fn} = extractKeyAndValue(key);
    const valueByPath = getObjectOrArrayFromStringKey(keyVal, obj);

    if (typeof valueByPath !== "undefined") {
        return fn.call(this, keyType, valueByPath, obj, config);
    }
    return VALUES.DEFAULT;

};


const convertByKey = (key, obj, rootData, configuration) => {

    const specialType = isSpecialType(key);

    if (key.startsWith(IDENTIFIERS.HARD_CODED)) {
        return key.substring(1);
    } else if (key.startsWith(IDENTIFIERS.PARENT)) {
        const extractedKey = key.substring(1);
        return getObjectOrArrayFromStringKey(extractedKey, rootData);
    } else if (specialType) {
        return convertSpecialType(key, specialType, obj, configuration);
    } else {
        return getObjectOrArrayFromStringKey(key, obj);
    }

};


const helper = {
    identifierMap,
    isSpecialType,
    convertSpecialType,
    convertByKey
};

module.exports = helper;
