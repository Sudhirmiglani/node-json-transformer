# node-json-transformer

A Node.js package that converts json from one format to another.

## Usage

First, install the package using npm:

    npm install node-json-transformer --save

Then, require the package and use it like so:

    var nodeJsonTransformer = require('node-json-transformer');

    var data = {
        x : "xx",
        y : "yy"
    }
    
    var transformation = {
        mapping : {
            a : "x",
            b : "y"
        }
    }
    
    var output = nodeJsonTransformer.transform(data, transformation);
    console.log(output);
    
    Output : 
    {
        a : "xx",
        b : "yy"
    }
    

## License

Apache 2.0