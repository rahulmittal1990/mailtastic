'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

   describe('App grundsätzlich', function() {


  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    browser.get('');
    expect(browser.getLocationAbsUrl()).toMatch("/login");
  });


  describe('Login', function() {

    beforeEach(function() {
      browser.get('#/login');
    });


    it('Login Seite wird korrekt angezeigt', function() {
            expect(element.all(by.css('.subline')).first().getText()).
            toMatch("Herzlich willkommen zur Betaphase. Bitte loggen Sie sich mit Ihren Zugangsdaten ein");
        });

    it('Mit falschen Login Daten wird die Fehlermeldung ausgegeben', function() {
        
        // Find the element with ng-model="user" and type "jacksparrow" into it
        element(by.model('auth.email')).sendKeys('schredder@netstag.com');
        element(by.model('auth.password')).sendKeys('12345678');
        // Find the first (and only) button on the page and click it
        element(by.css('button')).click();

        expect(element.all(by.css('.bootbox-body')).first().getText()).
            toMatch("Login konnte nicht durchgeführt werden. Bitte überprüfen Sie Ihre Login-Daten oder wenden Sie sich an den Support unter unter 06182 955 70 00 oder support@mailtastic.de - Herzlichen Dank.");
    });
    
    it('Mit richtigen Login Daten geschieht login', function() {
        
        // Find the element with ng-model="user" and type "jacksparrow" into it
        element(by.model('auth.email')).sendKeys('schredder@netstag.com');
        element(by.model('auth.password')).sendKeys('123456789');
        // Find the first (and only) button on the page and click it
        element(by.css('button')).click();
        expect(browser.getLocationAbsUrl()).toMatch("/dashboard");
        expect(element.all(by.css('.modal-body')).first().getText()).
            toMatch("Login konnte nicht durchgeführt werden. Bitte überprüfen Sie Ihre Login-Daten oder wenden Sie sich an den Support unter unter 06182 955 70 00 oder support@mailtastic.de - Herzlichen Dank.");

    });
    
   



  });
  
  describe('Employees', function() {
        beforeEach(function() {
            browser.get('#/employees/employees/list');
        });

     
        it('Mitarbeiter hinzufügen', function() {
            //get nr of list elements
            //Anzahl an Mitarbeiter merken
            var todoList = element.all(by.repeater('item in data.employees'));
            var amountOfMembers = todoList.count();
            
            // expect(todoList.count()).toEqual(9);
            element(by.id('employee_list_addbutton')).click();
            element(by.id('employee_list_addbutton_new')).click();
            expect(element.all(by.css('.modal-body')).count()).toEqual(1);      //modal öffnet sich
            element(by.model('employeedata.email')).sendKeys('autotest@netstag.com');
            element(by.model('employeedata.firstname')).sendKeys('Autotest');
            element(by.model('employeedata.lastname')).sendKeys('Bot'); 
            element(by.id('employee_modal_button_createsave')).click();
            var todoListNew = element.all(by.repeater('item in data.employees'));
            var amountOfMembersNew = todoListNew.count();
            expect(amountOfMembersNew).toEqual(amountOfMembers +1);
        });
 
        it('Mitarbeiter bearbeiten', function() {
            
            
        });
        
        it('Mitarbeiter löschen', function() {
            
            
        });

   
  });

});
