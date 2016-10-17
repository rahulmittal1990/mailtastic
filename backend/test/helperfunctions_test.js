/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//var helpers = require("../helpers/helperfunctions.js");

//var app = require("../app.js");

config = require('../config/config.js');

var helpers = require("../helpers/helperfunctions.js");
expect = require('chai').expect;
assert = require('chai').assert;


describe("Helper functions", function() {
    describe("Signature Helper", function() {
       describe("Signature Status", function() { 
        it("no signature was ever activated", function() {

                var employee = {
                    companyInfoUpdatedAt: null,
                    signatureActivated: null,
                    signatureActivatedAt: null,
                    signatureUpdatedAt: null,
                    userInfoUpdatedAt: null
                 };
                 
                 var sigId = "074e5b0d-6652-4da4-9a57-420fe5d67ec7";
                 
                  var sigStatus = helpers.signatureHelper.getSignatureStatus(employee, sigId);
                  assert.equal(sigStatus ,"outdated");
                  
        });
        
        
        it("other signature was activated", function() {

                var employee = {
                     signatureActivated: "074e5b0d-6652-4da4-9a57-420fe5d67ec8",
                    companyInfoUpdatedAt: null,
                   
                    signatureActivatedAt: null,
                    signatureUpdatedAt: "Wed May 11 2016 09:22:10 GMT+0200 (CEST)",
                   
                    userInfoUpdatedAt: null
                 };
                 
                 var sigId = "074e5b0d-6652-4da4-9a57-420fe5d67ec7";
                 
                  var sigStatus = helpers.signatureHelper.getSignatureStatus(employee, sigId);
                  assert.equal(sigStatus ,"outdated");
                  
        });
        
         it("same signature but newer company data", function() {

                var employee = {
                    signatureActivated:     "074e5b0d-6652-4da4-9a57-420fe5d67ec7",
                    companyInfoUpdatedAt:   "Wed May 11 2016 09:00:10 GMT+0200 (CEST)",
                    signatureActivatedAt:   "Wed May 11 2016 09:00:01 GMT+0200 (CEST)",
                    signatureUpdatedAt:     "Wed May 11 2016 09:00:00 GMT+0200 (CEST)",
                    userInfoUpdatedAt:      "Wed May 11 2016 09:00:00 GMT+0200 (CEST)"
                 };
                 
                  var sigId = "074e5b0d-6652-4da4-9a57-420fe5d67ec7";
                 
                  var sigStatus = helpers.signatureHelper.getSignatureStatus(employee, sigId);
                  assert.equal(sigStatus ,"outdated");
                  
        });
        
        
        it("same signature but newer user data", function() {

                var employee = {
                    signatureActivated: "074e5b0d-6652-4da4-9a57-420fe5d67ec7",   
                    companyInfoUpdatedAt:  "Wed May 11 2016 09:00:00 GMT+0200 (CEST)",
                    signatureActivatedAt:  "Wed May 11 2016 09:00:01 GMT+0200 (CEST)",
                    signatureUpdatedAt:    "Wed May 11 2016 09:00:00 GMT+0200 (CEST)",
                    userInfoUpdatedAt:     "Wed May 11 2016 09:00:10 GMT+0200 (CEST)"
                 };
                 
                  var sigId = "074e5b0d-6652-4da4-9a57-420fe5d67ec7";
                 
                  var sigStatus = helpers.signatureHelper.getSignatureStatus(employee, sigId);
                  assert.equal(sigStatus ,"outdated");
                  
        });
        
        
        it("same signature but newer signature data", function() {

                var employee = {
                    signatureActivated:     "074e5b0d-6652-4da4-9a57-420fe5d67ec7",  
                    companyInfoUpdatedAt:   "Wed May 11 2016 09:00:00 GMT+0200 (CEST)",
                    signatureActivatedAt:   "Wed May 11 2016 09:00:01 GMT+0200 (CEST)",
                    signatureUpdatedAt:     "Wed May 11 2016 09:00:10 GMT+0200 (CEST)",
                    userInfoUpdatedAt:      "Wed May 11 2016 09:00:00 GMT+0200 (CEST)"
                 };
                 
                  var sigId = "074e5b0d-6652-4da4-9a57-420fe5d67ec7";
                 
                  var sigStatus = helpers.signatureHelper.getSignatureStatus(employee, sigId);
                  assert.equal(sigStatus ,"outdated");
                  
        });
        
        
        
        it("same signature and signature was updated latest", function() {

                var employee = {
                     signatureActivated:    "074e5b0d-6652-4da4-9a57-420fe5d67ec7",  
                    companyInfoUpdatedAt:   "Wed May 11 2016 09:00:00 GMT+0200 (CEST)",
                    signatureActivatedAt:   "Wed May 11 2016 09:00:10 GMT+0200 (CEST)",
                    signatureUpdatedAt:     "Wed May 11 2016 09:00:00 GMT+0200 (CEST)",
                    userInfoUpdatedAt:      "Wed May 11 2016 09:00:00 GMT+0200 (CEST)"
                 };
                 
                  var sigId = "074e5b0d-6652-4da4-9a57-420fe5d67ec7";
                 
                  var sigStatus = helpers.signatureHelper.getSignatureStatus(employee, sigId);
                  assert.equal(sigStatus ,"latest");
                  
        });
      });   
    });
});