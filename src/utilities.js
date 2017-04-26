/**
 * Created by sudhir.m on 23/03/17.
 */

const {VALUES} = require('./constants');


const getObjectOrArrayFromStringKey = (path, obj) => {

    if (path === "") {
        return obj;
    }

    path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    path = path.replace(/^\./, '');           // strip a leading dot
    let pathArray = path.split('.');
    for (let i = 0, n = pathArray.length; i < n; ++i) {
        let currentPath = pathArray[i];
        if (typeof obj === "object" && obj.hasOwnProperty(currentPath) && (currentPath in obj)) {
            obj = obj[currentPath];
        } else if (Array.isArray(obj)) {
            // create nested path for array traversal
            currentPath = pathArray.slice(i, pathArray.length).join(".");
            return obj.map((val) => {
                return getObjectOrArrayFromStringKey(currentPath, val);
            })
        } else {
            return VALUES.DEFAULT;
        }

    }
    return obj;

};

const isNonEmptyArray = (arr) => {
    return arr && Array.isArray(arr) && arr.length > 0;
};

const isNumber = (x) => {
    return !isNaN(x);
};

const objectWithoutProperties = (obj, keys) => {
    let target = {};
    for (let i in obj) {
        if (keys.indexOf(i) >= 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
    }
    return target;
};



const utilities = {
    getObjectOrArrayFromStringKey,
    isNonEmptyArray,
    objectWithoutProperties,
    isNumber
};

module.exports = utilities;