# json-transformer

A Node.js package that converts json from one format to another.

## Usage

First, install the package using npm:

    npm install json-transformer-node --save

Then, require the package and use it like this:

    var nodeJsonTransformer = require('json-transformer-node');

    var data = {
        x : "xx",
        y : "yy"
    }
    
    var transformation = {
        mapping : {
            item : {
                a : "x",
                b : "y"
            }
        }
    }
    
    var output = nodeJsonTransformer.transform(data, transformation);
    console.log(output);
    
    Output : 
    {
        a : "xx",
        b : "yy"
    }
    
    
## Type of Transformations Supported
    
1. Object to Object Transformation
        
        var data = {
            x : "xx",
            y : {
                z: "zz"
            }
        }
        
        var transformation = {
            mapping : {
                item: {
                    a : "x",
                    b : "y.z" // dot separated path
                }
            }
        }
        
        var output = nodeJsonTransformer.transform(data, transformation);
        console.log(output);
        
        Output : 
        {
            a : "xx",
            b : "zz"
        }
        
2. Array to Array Transformation
            
            var data = {
                x : "xx",
                y : [{
                    z: "z1"
                    },
                    {
                      z: "z2"
                    }]
            }
            
            var transformation = {
                "mapping" :{ 
                    "item":{
                        a : "x",
                        b : [{
                            "list" : "y",
                            "item" : {
                                "c" : "z"
                            }
                        }]
                    }
                }
            }
            
            var output = nodeJsonTransformer.transform(data, transformation);
            console.log(output);
            
            Output : 
            {
                a : "xx",
                b : [{
                        "c" : "z1"
                    },{
                        "c" : "z2"
                    }]
            }

3. Using Hardcoded values
            
            var data = {
                x : "xx",
                y : "yy"
            }
            
            var transformation = {
                "mapping" : {
                    "item":{
                        a : "x",
                        b : "y",
                        c : "$constantValue"
                    }
                }
            }
            
            var output = nodeJsonTransformer.transform(data, transformation);
            console.log(output);
            
            Output : 
            {
                a : "xx",
                b : "yy",
                c : "constantValue"
            }
            
4. Array to Object Transformation
            
            var data = {
                x : {
                    x1 : [{
                            z : "23"
                        },{
                            z : "45"
                        }]
                    },
                y : "yy"
            }
            
            var transformation = {
                            "mapping" : {
                                "item":{
                                    a : {
                                        "flat" : "x.x1#eq(1)",
                                        "item": {
                                            "c" : "z"
                                        }
                                    },
                                    b : "y"
                                }
                            }
                        }
            
            var output = nodeJsonTransformer.transform(data, transformation);
            console.log(output);
            
            Output : 
            {
                a : {
                    z : "45"
                },
                b : "yy"
            }
            
            Note :  "flat" : "x.x1#eq(1)" means flat it, x.x1 is the dot separated path to the array, 
            eq(index) specifies the index to pick
            
5. Object to Array Transformation

            var data = {
                x : {
                    x1 : "123"
                },
                y : 456,
                z : "abc"
            }
            
            var transformation = {
                "mapping" : {
                    "item":{
                       "arrayItems": { 
                            "objectify": "x",
                            "item": { 
                                "car": {
                                    "c1" : "x1",
                                    "c2" : "$abc"
                                }
                             }
                       }
                    }
                }
            }
            
            var output = nodeJsonTransformer.transform(data, transformation);
            console.log(output);
            
            Output : 
            {
                a : 123,
                b : "456",
                c : "ABC
            }
            
6. Type Conversion
            
            var data = {
                x : "123",
                y : 456,
                z : "abc"
            }
            
            var transformation = {
                "mapping" : {
                    "item":{
                        a : "x(NUMBER)",
                        b : "y(STRING)",
                        c : "z(UPPER)"
                    }
                }
            }
            
            var output = nodeJsonTransformer.transform(data, transformation);
            console.log(output);
            
            Output : 
            {
                a : 123,
                b : "456",
                c : "ABC
            }
            
7. Operations - depends etc.

            var data = {
                x : "RED",
                y : "Jude"
            }
            
            var transformation = {
                "config": {
                    "dependentMap": {
                        "RED": "stop",
                        "GREEN": "go"
                    }
                },
                "mapping" : {
                    "item":{
                        a : "x{DEPENDS}"
                    }
                }
            }
            
            var output = nodeJsonTransformer.transform(data, transformation);
            console.log(output);
            
            Output : 
            {
                a : "stop",
                b : "Hey Jude !!!"
            }
            
## License

Apache 2.0