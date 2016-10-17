Colors = {};
Colors.names = {
    aqua: 			"#00ffff",
    azure: 			"#f0ffff",
    beige: 			"#f5f5dc",
    black: 			"#000000",
    blue: 			"#0000ff",
    brown: 			"#a52a2a",
    cyan: 			"#00ffff",
    darkblue: 		"#00008b",
    darkcyan: 		"#008b8b",
    darkgrey: 		"#a9a9a9",
    darkgreen: 		"#006400",
    darkkhaki: 		"#bdb76b",
    darkmagenta:	"#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: 	"#ff8c00",
    darkorchid: 	"#9932cc",
    darkred: 		"#8b0000",
    darksalmon: 	"#e9967a",
    darkviolet: 	"#9400d3",
    fuchsia: 		"#ff00ff",
    gold: 			"#ffd700",
    green: 			"#008000",
    indigo: 		"#4b0082",
    khaki: 			"#f0e68c",
    lightblue: 		"#add8e6",
    lightcyan: 		"#e0ffff",
    lightgreen: 	"#90ee90",
    lightgrey: 		"#d3d3d3",
    lightpink: 		"#ffb6c1",
    lightyellow:	"#ffffe0",
    lime: 			"#00ff00",
    magenta: 		"#ff00ff",
    maroon: 		"#800000",
    navy: 			"#000080",
    olive: 			"#808000",
    orange: 		"#ffa500",
    pink: 			"#ffc0cb",
    purple: 		"#800080",
    violet: 		"#800080",
    red: 			"#ff0000",
    silver: 		"#c0c0c0",
    yellow: 		"#ffff00",
    actiongreen:    "#9bdb42"
};

Colors.pieColors = [
    "#009fe3",
    "#e6391e",
    "#a0d117",
    "#143d60",
    "#ffc000",
    "#d11796",
    "#008000",
    "#4b0082",
    "#3dc0a0",
    "#dd7d2f"
    
];

 
 Colors.random = function() {
        var result;
        var count = 0;
        for (var prop in this.names)
            if (Math.random() < 1/++count)
               result = prop;
        return { name: "same", rgb: this.names[result]};
 };
 var colorcounter = 0;
  Colors.getNext = function() {
       var result = { name: "same", rgb: this.pieColors[colorcounter]};
       colorcounter++;
       if(colorcounter >=10){
           colorcounter = 0;
       }
       return result;
 };
 



Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};


String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.replaceAllRegex = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};



//Beim Mitarbeiter hinzufügen wird button auf basis von checkbox enabled. Da kein Angular wrapper für bootbox verwendet wird
function enablebuybutton(){
   var hasClass = $(".employeebuybutton").hasClass("disabled");
   if(hasClass === true){
         $(".employeebuybutton").removeClass("disabled");
   }else{
       $(".employeebuybutton").addClass("disabled");
   }
}

/**
 * search object in an array
 * @param {type} ObjectToSearch
 * @param {type} attributeName attribute to compare
 * @param {type} myArray
 * @returns {Boolean}
 */
function searchObjectInArray(ObjectToSearch,attributeName, myArray){
    var ret = {
        found : false,
        object : ""
    };
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i][attributeName] === ObjectToSearch[attributeName]) {
            ret.found = true;
            ret.object = myArray[i];
            return ret;
        }
    }
    
    return ret;
}