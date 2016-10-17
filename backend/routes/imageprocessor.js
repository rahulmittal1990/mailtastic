/**
 * All routes where no jwt token is neccessary
 */
var express = require('express');
var router = express.Router();
bodyParser = require('body-parser'), //parses information from POST
methodOverride = require('method-override'); //used to manipulate POST
var fs = require( 'fs' );
var path = require( 'path' );
var process = require( "process" );
var helpers = require('../helpers/helperfunctions');

/**
 * Erzeugt für jedes Bild ein zugehöriges Outlook Bild
 * @param {type} param1
 * @param {type} param2
 */
router.get("/updateoutlookimages", function(req, res, next){
    var imageDir = "public/images/";
    console.log("---------------------IMAGES---------------");
    fs.readdir( imageDir, function( err, files ) {
        if( err ) {
//            console.log("---------------------IMAGES 2---------------");
            console.error( "Could not list the directory.", err );
            process.exit( 1 );
        } 
//        console.log(JSON.stringify(files));
//        console.log("---------------------IMAGES 3---------------");
        files.forEach( function( file, index ) {
//             console.log(file);
//            console.log(file[index]); //print the file
//            console.log(path.extname(file[index]));
            var name   = file.substr(0, file.lastIndexOf('.'));
            var ending = file.substr(file.lastIndexOf('.')+1);

//            console.log("Name: " + name);
//            console.log("Ending: " + ending);

            helpers.imageTransformation.createTransparentImageForOutlook(name, ending);

         } );
    });
});

module.exports = router;
