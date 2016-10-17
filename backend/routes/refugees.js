/**
 * All routes where no jwt token is neccessary
 */
var express = require('express');
var router = express.Router();
var helpers = require('../helpers/helperfunctions');
bodyParser = require('body-parser'), //parses information from POST
methodOverride = require('method-override'); //used to manipulate POST
var emailHandler = require('../helpers/mailhandler');
var passwordTool = require('password-hash-and-salt');
var rand = require("generate-key");
var q = require('q');


    var pp5Url = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3D4TKVBYGEW5E";
    var pp10Url = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=M9PHF4TD5WF8U";
    var pp20Url = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SMU59VLMEM686";
    var pp30Url = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QWPXPL6KWEGFW";
    var pp40Url = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=GCM54DXUZY2FQ";
    var pp50Url = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VXU6SNHL6R3LE";
    var ppCustomAmountUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KN78LVP8J7B2L";
    var bbdoCampaignId = 89;
    var bbdoGroupId = 124;
    var bbdoDonAccountUrl = "http://neu.hauptstadthelfer.de/home/geld-spenden";
    var bbdoWebsite = "http://neu.hauptstadthelfer.de";
    var mailtasticLanding = "https://www.mailtastic.de/#/wirhelfen";
    var bbdoAccountId = "a180b61f-b2d9-455a-b7ce-468882755ce1";
    
        
    var clickModel = {
           groupId : bbdoGroupId,
            campaignId : bbdoCampaignId,
            userId : bbdoAccountId
    };
    
    
    /**
     * 
     * @type type BBDO Kampagne wird im mailtastic dashboard auch getrackt
     */
    var mailtasticBbbdoClickModel = {
            groupId : 126,
            campaignId : 90,
            userId : '366b9eff-3019-4b7a-90ad-48e1c5c90a6f'
    };
    

router.get('/dispatch/:com/:query', function (req, res, next) {


    if (!req.params.query || !req.params.com) {
        console.error("Refugeees wrong request"+req.params.com + " and "+ req.params.query);
        res.redirect(bbdoWebsite);
    } else{
        var query = req.params.query;
        var company = req.params.com;
        var refugeeModel = {
                        amount : "",
                        type : "",
                        company : company
                    };
       //click für bddo zählen
        addClick(clickModel); 
        
        //clicks der bbdo kampagne im mailtastic bereich mit tracken
        addClick(mailtasticBbbdoClickModel);
            
        switch(query){
            case 'pp5' : 
                refugeeModel.type = "paypal";
                refugeeModel.amount = 5;
                addRefugees(refugeeModel);
                res.redirect(pp5Url);
                break;
            case 'pp10' : 
                refugeeModel.type = "paypal";
                refugeeModel.amount = 10;
                addRefugees(refugeeModel);
                res.redirect(pp10Url);
                break;
            case 'pp20' : 
                refugeeModel.type = "paypal";
                refugeeModel.amount = 20;
                addRefugees(refugeeModel);
                res.redirect(pp20Url);
                break;
            case 'pp30' : 
                refugeeModel.type = "paypal";
                refugeeModel.amount = 30;
                addRefugees(refugeeModel);
                res.redirect(pp30Url);
                break;
            case 'pp40' : 
                refugeeModel.type = "paypal";
                refugeeModel.amount = 40;
                addRefugees(refugeeModel);
                res.redirect(pp40Url);
                break;
            case 'pp50' : 
                refugeeModel.type = "paypal";
                refugeeModel.amount = 50;
                addRefugees(refugeeModel);
                res.redirect(pp50Url);
                break;
            case 'ppcus' : 
                refugeeModel.type = "paypal";
                refugeeModel.amount = 0;
                addRefugees(refugeeModel);
                res.redirect(ppCustomAmountUrl);
                break;
            case 'donaccount' : 
                refugeeModel.type = "donateaccount";
                refugeeModel.amount = 0;
                addRefugees(refugeeModel);
                res.redirect(bbdoDonAccountUrl);
                break;
            case 'website' : 
                refugeeModel.type = "website";
                refugeeModel.amount = 0;
                addRefugees(refugeeModel);
                res.redirect(bbdoWebsite);
                break;
            default : 
                console.error("Refugeees wrong request"+req.params.com + " and "+ req.params.query);
                res.redirect(bbdoWebsite);
        }
 }
});

function addRefugees(model){
    var deferred = q.defer();
    
    Refugees.create(model).then(function(created){
        if(!created){
            console.error("Refugeees save error"+ JSON.stringify(model));
            deferred.resolve(false);
          
        }else{
            deferred.resolve(true);
        }
    });
    return deferred.promise;
}

function addClick(model){
    var deferred = q.defer();
    
    Click.create(model).then(function(created){
        if(!created){
            deferred.resolve(false);
        }else{
            deferred.resolve(true);
        }
    });
    return deferred.promise;
}

function addView(model){
    var deferred = q.defer();
    
    View.create(model).then(function(created){
        if(!created){
            deferred.resolve(false);
        }else{
            deferred.resolve(true);
        }
    });
    return deferred.promise;
}



module.exports = router;
