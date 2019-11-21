/**
 * Created by sudhir.m on 26/04/17.
 */
'use strict';

const transformer = require('../index');

test('object to object transformation', () => {

    const data = {
        x: "xx",
        y: {
            z: "zz"
        }
    };

    const transformation = {
        mapping: {
            item: {
                a: "x",
                b: "y.z"
            }
        }
    };

    const output = transformer.transform(data, transformation);

    expect(output).toStrictEqual({
                                     a: "xx",
                                     b: "zz"
                                 });

});


test('array to array transformation', () => {
    const data = {
        x: "xx",
        y: [{
            z: "z1"
        },
            {
                z: "z2"
            }]
    };

    const transformation = {
        "mapping": {
            "item": {
                a: "x",
                b: [{
                    "list": "y",
                    "item": {
                        "c": "z"
                    }
                }]
            }
        }
    };


    const output = transformer.transform(data, transformation);
    expect(output).toStrictEqual({
                                     a: "xx",
                                     b:
                                         [{
                                             "c": "z1"
                                         }, {
                                             "c": "z2"
                                         }]
                                 });
});


test('object to object transformation', () => {

    const data = {
        x: "xx",
        y: "yy"
    };

    const transformation = {
        "mapping": {
            "item": {
                a: "x",
                b: "y",
                c: "$constantValue"
            }
        }
    };

    const output = transformer.transform(data, transformation);

    expect(output).toStrictEqual({
                                     a: "xx",
                                     b: "yy",
                                     c: "constantValue"
                                 });


});

test('Array to object transformation', () => {

    const data = {
        x: {
            x1: [{
                z: "23"
            }, {
                z: "45"
            }]
        },
        y: "yy"
    };

    const transformation = {
        "mapping": {
            "item": {
                a: {
                    "flat": "x.x1#eq(1)",
                    "item": {
                        "c": "z"
                    }
                },
                b: "y"
            }
        }
    };

    const output = transformer.transform(data, transformation);

    expect(output).toStrictEqual({
                                     a: {
                                         c: "45"
                                     },
                                     b: "yy"
                                 });


});

test('Object to Array transformation', () => {

    const data = {
        x: {
            x1: "123"
        },
        y: 456,
        z: "abc"
    };

    const transformation = {
        "mapping": {
            "item": {
                "arrayItems": {
                    "objectify": "x",
                    "item": {
                        "car": {
                            "c1": "x1",
                            "c2": "$abc"
                        }
                    }
                }
            }
        }
    };


    const output = transformer.transform(data, transformation);

    expect(output).toStrictEqual({
                                     arrayItems: [{
                                         car: {
                                             c1: "123",
                                             c2: "abc"
                                         }
                                     }]
                                 });


});

test('Type conversion', () => {

    const data = {
        x: "123",
        y: 456,
        z: "abc"
    };

    const transformation = {
        "mapping": {
            "item": {
                a: "x(NUMBER)",
                b: "y(STRING)",
                c: "z(UPPER)"
            }
        }
    };

    const output = transformer.transform(data, transformation);

    expect(output).toStrictEqual({
                                     a: 123,
                                     b: "456",
                                     c: "ABC"
                                 });


});

test('Test operations', () => {

    const data = {
        x: "RED",
        y: "Jude"
    };

    const transformation = {
        "config": {
            "dependentMap": {
                "RED": "stop",
                "GREEN": "go"
            }
        },
        "mapping": {
            "item": {
                a: "x{DEPENDS}"
            }
        }
    };
    const output = transformer.transform(data, transformation);

    expect(output).toStrictEqual({
                                     a: "stop"
                                 });


});


