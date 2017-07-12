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
                "mapping" : 
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
                "mapping" : 
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
5. Object to Array Transformation
6. Type Conversion
7. Operations - eval, append, depends etc.
8. 
            
## License

Apache 2.0