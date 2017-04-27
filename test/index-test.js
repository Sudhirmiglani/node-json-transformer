/**
 * Created by sudhir.m on 26/04/17.
 */
'use strict';

const expect = require('chai').expect;
const transformer = require('../index');

describe('#transformer', function () {
    it('should transform simple object', function () {

        let data = {
            a: "aa",
            b: "bb"
        };
        let transformation = {
            mapping: {
                item: {
                    x: "a",
                    y: "b"
                }
            }
        };
        let result = transformer.transform(data, transformation);
        console.log(result);
        expect(result).to.deep.equal({
            x: "aa",
            y: "bb"
        });
    });


});