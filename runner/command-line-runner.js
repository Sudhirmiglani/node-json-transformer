/**
 * Created by sudhir.m on 22/03/17.
 */
const transformHelper = require("../index");


let data = {
    uom: {
        k: 'M'
    },
    v: {
        val: "item"
    },
    d: "dd",
    f: "ff",
    g: "gg",
    j: [{
        k: {
            l: "jj"
        }
    }, {
        k: {
            l: "ll"
        }
    }],
    f : [{
        b :"bb"
    }]
};


let transformation = {

    config: {
        appendMap: {
            i: {
                path: 'uom.k',
                separator: '/'
            }
        }
    },
    mapping: {
        item: {
            a: "v.val{APPEND{i}}",
            b: [{
                collect: "",
                item: [
                    "d", "f", "g", "j.k.l"
                ]
            }],
            c: [{
                collect: "",
                item: [
                    [{
                        list: "j",
                        item: {
                            x: "k.l"
                        }
                    }],
                    [{
                        list: "f",
                        item: {
                            x: "b"
                        }
                    }]
                ]
            }]

        }
    }

};

let result = transformHelper.transform(data, transformation);
console.log(result);