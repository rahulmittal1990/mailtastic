/**
 * Generted dummy data to show to potential customers
 * @type type
 */
var fs = require("fs");
var rand = require("generate-key");
var uuid = require('node-uuid');
var Converter =  require("csvtojson").Converter;    
var signatureFields = require("../../../helpers/signatureGeneration/fields.json"); 
var q = require('q');
sequelize =  require('sequelize');
var signatureHelper = require("../../../helpers/signatureGeneration/signaturehelperClass");
//new converter instance
var csvConverter=new Converter({
//    delimiter : [";"]
});

var createGroupQuery = "INSERT INTO `Groups`( `title`, `owner`, `isDefault`) VALUES ('$$$GROUPNAME$$$','$$$ADMIN$$$', 0);";
var createEmployeeQuery = "INSERT INTO `User`(`id`, `firstname`,`lastname`,`email`,`admin`, `currentGroup`, `activationCode`,`userInfo`, `isAdmin` ) VALUES ('$$$ID$$$','$$$FIRSTNAME$$$','$$$LASTNAME$$$','$$$EMAIL$$$','$$$ADMIN$$$', @lastGroupId, '$$$ACTIVATIONCODE$$$', '$$$USERINFO$$$', 0);";
var saveGroupIdToVariable = "SET @lastGroupId = LAST_INSERT_ID();";






var employeeImporter = {
    
    settings : {
        adminId : "",
        csvFileName : "./SpindlerExportNeu.csv",
        resultFilename : "",
        emptyEmployeeFieldStructure : ""
    },
    
    init : function(importFilenName, resultFileName, adminId){
        
        this.settings.csvFileName = importFilenName;
        this.settings.resultFilename = resultFileName;
        this.settings.adminId = adminId;
   
        //clone field object always work with clone of object
        var fields =  JSON.parse(JSON.stringify(signatureFields));
        
       
        
        var mode = "employee";
        var ret;
        var sigHelperInstance = new signatureHelper(null);

        if(mode === "employee"){
           ret = sigHelperInstance.prepareDataForBackend("employee", fields);
        }else if(mode === "company"){
           ret = sigHelperInstance.prepareDataForBackend("company", fields);
        }
        this.settings.emptyEmployeeFieldStructure = ret;
        
    },
    
    getCopyOfEmptyFieldStructure : function(){
        
        return JSON.parse(JSON.stringify(this.settings.emptyEmployeeFieldStructure));
    },
    
    getGroupQuery : function(title){
        var ret = "";
        ret = createGroupQuery.replace("$$$GROUPNAME$$$", title);
        ret = ret.replace("$$$ADMIN$$$", this.settings.adminId);
        return ret;

    },

   getEmployeeQuery : function(firstname, lastname, email, infoObject ){
        var ret = "";
        ret = createEmployeeQuery.replace("$$$ID$$$", uuid.v4());


        var infoObjectAsString = JSON.stringify(infoObject);
        infoObjectAsString = infoObjectAsString.replace("@spindler-gruppe.de", "@netstag.de");
        infoObjectAsString = infoObjectAsString.replace("@porsche-wuerzburg.de", "@netstag.de");
        

        ret = ret.replace("$$$FIRSTNAME$$$", firstname);
        ret = ret.replace("$$$LASTNAME$$$", lastname);
        ret = ret.replace("$$$EMAIL$$$", email);
        ret = ret.replace("$$$ADMIN$$$", this.settings.adminId);
        ret = ret.replace("$$$ACTIVATIONCODE$$$", rand.generateKey(10));
        ret = ret.replace("$$$USERINFO$$$", infoObjectAsString);

        ret = ret.replace("@spindler-gruppe.de", "@netstag.de");
        ret = ret.replace("@porsche-wuerzburg.de", "@netstag.de");
        
        

        return ret;
    
    },
    
    getEmployeeInfoDataStructure : function(firstname, lastname, email,companyName, department, phone, zip, street, city){
        var emptyStructure = this.getCopyOfEmptyFieldStructure();
        
        
        
        emptyStructure['ma_vorname'] = firstname;
        emptyStructure['ma_nachname'] = lastname;
        emptyStructure['ma_email'] = email;
        
        emptyStructure['ma_firma'] = companyName;
        emptyStructure['ma_abteilung'] = department;
        emptyStructure['ma_tel'] = phone;
        emptyStructure['ma_plz'] = zip;
        emptyStructure['ma_strasse'] = street;
        emptyStructure['ma_ort'] = city;
        
        return emptyStructure;
        
    },
    
    createImportSqlFile : function(){
        var deferred = q.defer();
        
        
        //generate writeStream
        var wstream = fs.createWriteStream(this.settings.resultFilename);
        var ownObject = this;

        csvConverter.fromFile(this.settings.csvFileName,function(err,result){
          //console.log(result); //here is your result json object

          //sort for groups
            var sortedAfterCompany = [];
            for(var i = 0; i < result.length ; i++){
                var company = result[i].FIRMA;
                if(!sortedAfterCompany[company]){
                    sortedAfterCompany[company] = [];
                }
                sortedAfterCompany[company].push(result[i]);
            }

            var sortedAfterCompanyAndDepartment = [];
            var company;
            for (company in sortedAfterCompany) {

                if(!sortedAfterCompanyAndDepartment[company]){
                    sortedAfterCompanyAndDepartment[company] = [];
                }
                for(var u = 0; u < sortedAfterCompany[company].length ; u++){   //iterate over every employee in company
                    var department = sortedAfterCompany[company][u]['BÜRO'];
                    if(!sortedAfterCompanyAndDepartment[company][department]){
                        sortedAfterCompanyAndDepartment[company][department] = [];
                    }
                    sortedAfterCompanyAndDepartment[company][department].push(sortedAfterCompany[company][u]);
                }
            }


            var company;
            var department;
           //generate SQL from sorted groups
            for (company in sortedAfterCompanyAndDepartment) {
                for (department in sortedAfterCompanyAndDepartment[company]) {
                    //create group with name Company + Department
                    var newGroupName = company + " - " + department;

                    //create group    
                    wstream.write(ownObject.getGroupQuery(newGroupName) + "\n");
                    //save id from group
                    wstream.write(saveGroupIdToVariable + "\n");

                    //create all employee queries
                    for(var z = 0; z < sortedAfterCompanyAndDepartment[company][department].length ; z++){

                        var firstname = sortedAfterCompanyAndDepartment[company][department][z]['VORNAME'];
                        var lastname = sortedAfterCompanyAndDepartment[company][department][z]['NACHNAME'];
                        var email = sortedAfterCompanyAndDepartment[company][department][z]['E-MAIL-ADRESSE'];
                        
                        var companyName = sortedAfterCompanyAndDepartment[company][department][z]['FIRMA'];
                        var department = sortedAfterCompanyAndDepartment[company][department][z]['BÜRO'];
                        var phone = sortedAfterCompanyAndDepartment[company][department][z]['TELEFON'];
                        var zip = sortedAfterCompanyAndDepartment[company][department][z]['POSTLEITZAHL'];
                        var street = sortedAfterCompanyAndDepartment[company][department][z]['STRASSE'];
                        var city = sortedAfterCompanyAndDepartment[company][department][z]['STADT'];

                        
                        var infoObject = ownObject.getEmployeeInfoDataStructure(firstname, lastname, email, companyName, department, phone, zip, street, city);


                        wstream.write(ownObject.getEmployeeQuery(firstname, lastname, email, infoObject) + "\n");
                    }


                }
            }

           wstream.end();  //close stream
         console.log("DONE");
           // console.log(sortedAfterCompanyAndDepartment);


        });

        return deferred.promise;
    }
    
};


(function(){
    
    //have to set admin because the requests were copied code and need the admin id
    var adminId = '3adaff74-807a-401d-8743-47536e6cdf52';
    
    employeeImporter.init("./SpindlerExportNeu.csv", "spindlerImport.sql", adminId);
    employeeImporter.createImportSqlFile().then(function(data){
        if(data === true){
            console.log("DONE");
        }
    }).
    catch(function(e){
        console.log(e);
        
    })
    ;
    
    
    
})();