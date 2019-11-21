/**
 * Created by sudhir.m on 26/04/17.
 */

const {getObjectOrArrayFromStringKey, isNonEmptyArray, isNumber} = require('../utils/utilities');

test('get object by path from nested object', () => {

    let obj = {
        a: {
            b : 123
        }
    };
    expect(getObjectOrArrayFromStringKey( "a.b", obj)).toBe(123);

});

test('get object by path when path is empty', () => {

    let obj = {
        a: {
            b : 123
        }
    };
    expect(getObjectOrArrayFromStringKey( "", obj)).toStrictEqual(obj);

});

test('get object when path is invalid', () => {

    let obj = {
        a: {
            b : 123
        }
    };
    expect(getObjectOrArrayFromStringKey( "a.b.c.d", obj)).toBe(undefined);

});

test('get array by path from nested object', () => {

    let obj = {
        a: {
            b : [{
                x : 123
            }]
        }
    };
    expect(getObjectOrArrayFromStringKey( "a.b.x", obj)).toStrictEqual([123]);

});

test('check is array empty - empty array', () => {

    expect(isNonEmptyArray([])).toBe(false);

});

test('check is array empty - non empty array', () => {

    expect(isNonEmptyArray([1])).toBe(true);

});

test('check is number - number passed', () => {

    expect(isNumber(1)).toBe(true);

});


test('check is number - string passed', () => {

    expect(isNumber("abc")).toBe(false);

});


