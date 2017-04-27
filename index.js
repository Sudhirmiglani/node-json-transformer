/**
 * Created by sudhir.m on 30/11/16.
 */
'use strict';
const {convertByKey} = require('./utils/helper');
const {getObjectOrArrayFromStringKey, isNonEmptyArray} = require('./utils/utilities');
const {IDENTIFIERS} = require('./utils/constants');

let rootData = {};
let configuration = {};

const transform = (data, transformation) => {

    let {mapping, config} = transformation;

    // make copy
    rootData = data;
    if (config) {
        configuration = config;
    }
    return transformData(data, mapping);

};

const transformData = (data, mapping) => {

    if (typeof mapping.list !== "undefined" || typeof mapping.objectify !== "undefined" || typeof mapping.collect !== "undefined") {
        return transformArray(mapping, data);
    } else if (typeof mapping.flat !== "undefined") {
        let extractedData = extractArrayIndexObject(mapping.flat, data);
        return transformObject(mapping.item, extractedData);
    } else {
        return transformObject(mapping.item, data);
    }

};


const collectArrayElements = (items, data) => {

    let arr = [];
    items.forEach((mappingKey) => {
        if (typeof mappingKey === "string") {
            let returnedVal = convertByKey(mappingKey, data, rootData, configuration);
            // if returned value is Array, concat array elements
            if (isNonEmptyArray(returnedVal)) {
                arr = arr.concat(returnedVal);
            } else {
                arr.push(returnedVal);
            }
        } else if (Array.isArray(mappingKey)) {
            // collect array elements from different arrays
            arr = arr.concat(convertByArray(mappingKey[0], data))
        } else if (typeof mappingKey === "object") {
            arr.push(transformObject(mappingKey, data))
        }
    });

    return arr;

};

const extractArrayIndexObject = (key, data) => {

    if (key.indexOf(IDENTIFIERS.ARRAY_INDEX) > -1) {

        const index = key.substring(key.lastIndexOf(IDENTIFIERS.ARRAY_START) + 1, key.lastIndexOf(IDENTIFIERS.ARRAY_END));
        const keyVal = key.substring(0, key.lastIndexOf(IDENTIFIERS.ARRAY_INDEX));
        let extractedData = data;

        if (keyVal) {
            extractedData = getObjectOrArrayFromStringKey(keyVal, data);
        }
        return extractedData[index];

    }
    return {};
};

const convertByArray = (mapping, data) => {

    const key = mapping.list;

    if (typeof key === "undefined") {
        return transformArray(mapping, data);
    }

    if (key.startsWith(IDENTIFIERS.ARRAY_INDEX) && key.indexOf(IDENTIFIERS.ARRAY_START) > -1 && key.indexOf(IDENTIFIERS.ARRAY_END) > -1) {
        const index = key.substring(key.lastIndexOf(IDENTIFIERS.ARRAY_START) + 1, key.lastIndexOf(IDENTIFIERS.ARRAY_END));
        return [transformObject(mapping.item, data)];
    } else {
        return transformArray(mapping, data);
    }
};

const specialObjectTransformation = (mappingKey, data) => {

    if (typeof mappingKey.flat !== "undefined") {

        let extractedData = extractArrayIndexObject(mappingKey.flat, data);
        return transformObject(mappingKey.item, extractedData);

    } else if (typeof mappingKey.objectify !== "undefined") {

        return transformArray(mappingKey, data);
    }

    return transformObject(mappingKey, data);

};

const transformObject = (obj, data) => {

    let transformedObj = {};
    let keys = Object.keys(obj);

    keys.forEach((key) => {

        const mappingKey = obj[key];

        if (typeof mappingKey === "string") {

            // check for hard coded values, etc..
            transformedObj[key] = convertByKey(mappingKey, data, rootData, configuration);

        } else if (Array.isArray(mappingKey) && mappingKey.length > 0) {

            transformedObj[key] = convertByArray(mappingKey[0], data);

        } else if (typeof mappingKey === "object") {

            transformedObj[key] = specialObjectTransformation(mappingKey, data);

        }
    });

    return transformedObj;

};

const transformArray = (mapping, data) => {

    let sourceArray;

    if (typeof mapping.list !== "undefined") {

        sourceArray = getObjectOrArrayFromStringKey(mapping.list, data);

    } else if (typeof mapping.objectify !== "undefined") {

        sourceArray = [getObjectOrArrayFromStringKey(mapping.objectify, data)];

    } else if (typeof mapping.collect !== "undefined") {

        return collectArrayElements(mapping.item, data);

    }
    if (!isNonEmptyArray(sourceArray)) {
        return [];
    }

    let itemTransformation = mapping.item;
    return sourceArray.map((val, key) => {
        return transformObject(itemTransformation, val);
    });

};


let transformHelper = {
    transform
};

module.exports = transformHelper;