
 var serverApi = "https://www.mailtastic.de/api/api2.php";
var employeeSlider;

function initSlider(){


    this.sliderChanged = function() {
        var value = employeeSlider.slider('getValue');
        
        jQuery("#anzahlMitarbeiter").val(value);
        calcNumbers(value);
        
        // jQuery('#RGB').css('background', 'rgb('+r.getValue()+','+g.getValue()+','+b.getValue()+')')
    };



    try{
        
        employeeSlider = jQuery('#ex1');
    	employeeSlider = employeeSlider.slider({
        	formatter: function(value) {
        		return 'Mitarbeiter: ' + value;
        	},
        	tooltip_position : "bottom"
        });



        employeeSlider.on('slide', this.sliderChanged);
        employeeSlider.data('slider');

        jQuery('#anzahlMitarbeiter').on('input',function(e){
             var value = jQuery("#anzahlMitarbeiter").val();
             
             if(value > 49 && value < 501){
                employeeSlider.slider('setValue', parseInt(value));
                calcNumbers(value);
             }
        });
    

    }catch(e){
    	console.log(e);
    }

}



jQuery( document ).ready(function() {
    initSlider();
});

    
/**
 * berechnet die Ergebnisse
 */
var emailsPerUserPerYear = 13870;   
function calcNumbers(amountOfUsers){
	var emailsSent = amountOfUsers * 10220;
	var emailsViewed = emailsSent * 2.5;
	var emailsClicked = emailsViewed * 0.005;
	
	jQuery(".display_count").text(toLocaleFormat(emailsViewed));
	
	jQuery(".verpasste_chancen_count").text(toLocaleFormat(Math.floor(emailsClicked)));
	jQuery(".anzahlMitarbeiter").text(toLocaleFormat(amountOfUsers));
	jQuery("#emailCount").text(toLocaleFormat(emailsSent));
		
};



/**
 * Tausender trennzeichen
 */
 function toLocaleFormat(val){
    var n = val;
    ns = String(n).replace('.', ',');
    var w = [];
    while (ns.length > 0) {
        var a = ns.length;
        if (a >= 3) {
            s = ns.substr(a - 3);
            ns = ns.substr(0, a - 3);
        } else {
            s = ns;
            ns = "";
        }
        w.push(s);
    }
    for (i = w.length - 1; i >= 0; i--) {
        ns += w[i] + ".";
    }
    ns = ns.substr(0, ns.length - 1);
    return ns.replace(/\.,/, ',');
}



/**
 * Scroll a bit down used for when someone clicks on the arrow
 */
function scrollDown() {
    var currentPosition = jQuery(document).scrollTop();
    var completeHeight = jQuery(document).height();
    var windowHeight = jQuery(window).height();

    if ((completeHeight - currentPosition) > windowHeight) {
        jQuery('html, body').animate({
            scrollTop: currentPosition + 400
        }, 1000);
    }


}
//
//   $scope.livedemodata = {
//                     email: "",
//                     company: "",
//                     name : ""
//                 };
//                 
//                 
//                 $scope.kontaktdata = {
//                    nachricht: '',
//                    anrede: '',
//                    vorname: ' ',
//                    company : '',
//                    name: '',
//                    email: '',
//                    telefon: '',
//                    key : "stagger",
//                    command : "kontakt"
//                };

 function trackGoogleAdwordsConv(google_conversion_id, google_conversion_label) {
        var image = new Image(1, 1); 
        image.src = "//www.googleadservices.com/pagead/conversion/" + google_conversion_id + "/?label=" + google_conversion_label +"&amp;guid=ON&amp;script=0";
    }
function sendKontaktRequest(){
    
    var name = jQuery("#personalcontact_name").val();
    
    var objectToSend = {
        anrede : jQuery("#personalcontact_anrede").val(),
        telefon : jQuery("#personalcontact_telefon").val(),
        name : jQuery("#personalcontact_name").val(),
        nachricht : jQuery("#personalcontact_nachricht").val(),
        email : jQuery("#personalcontact_email").val(),
        company : jQuery("#personalcontact_firma").val(),
        key : "stagger",
        command : "kontakt"
    };
    
    
    if(!objectToSend.name || !objectToSend.email || !objectToSend.nachricht){
        alert("Bitte geben Sie ihren Namen, ihre E-Mail-Adresse und eine Nachricht ein.");
        
    }else{
        
                var request =  jQuery.ajax({
                            type : "POST",
                            url : serverApi,
                            data : objectToSend,
			});
		request.done(function( msg ) {
			// hideLoadSpinner();
			if(msg == true){
                            alert("Vielen Dank für Ihre Anfrage. Wir werden uns umgehend mit Ihnen in Verbindung setzen.");
                             jQuery('#personalcontactmodal').modal('hide');
                             
                              ga('send', {
                                        hitType: 'event',
                                        eventCategory: 'KontaktAufnehmen',
                                        eventAction: 'Clicked',
                                        eventLabel : "",
                                        eventValue: 1
                                    });
                                    
                                    
                                    
                                if(typeof fbq === 'undefined') {
                                    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                                    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                                    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                                    document,'script','//connect.facebook.net/en_US/fbevents.js');

                                   fbq('init', '259799124372238');
                                    fbq('track', 'PageView');

                                    fbq('track', 'Lead', {
                                         content_category : "KontaktFormular"
                                     });
                                }
                                else {
                                    fbq('track', 'Lead', {
                                     content_category : "KontaktFormular"
                                    });
                                }
                              
                                
                                //track google micro conversion
                                trackGoogleAdwordsConv(873966782, 'LXErCIvmgGoQvtneoAM');
                                
                                
                                
                              
                        }else {
		            alert("Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder kontaktieren Sie uns unter support@mailtastic.de bzw. unter 06182 955 70 00.");
                        }
                          
		});
		
		request.fail(function( jqXHR, textStatus ) {
			  alert("Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder kontaktieren Sie uns unter support@mailtastic.de bzw. unter 06182 955 70 00.");
                          // hideLoadSpinner();
		});
        
    }
    
    
    
}
 

function sendLiveDemoRequest(){
    
   var url = "https://www.app.mailtastic.de/api/account/livedemo";
    
    var objectToSend = {
        name : jQuery("#livedemo_name").val(),
        email : jQuery("#livedemo_email").val(),
        company : jQuery("#livedemo_firma").val(),
       
    };
    
    objectToSend.company += (" Zeit: " + jQuery("#livedemo_time").val());
    objectToSend.company += (" Datum: " + jQuery("#livedemo_date").val());
    
    if(!objectToSend.name || !objectToSend.email){
        alert("Bitte geben Sie ihren Namen, ihre E-Mail-Adresse und Ihre E-Mail-Adresse ein.");
    }else{
        
                var request =  jQuery.ajax({
                            type : "POST",
                            url : url,
                            data : objectToSend,
			});
		request.done(function( msg ) {
			// hideLoadSpinner();
			if(msg.success == true){
                            
                            alert("Vielen Dank für Ihre Anfrage. Wir werden uns umgehend mit Ihnen in Verbindung setzen.");
                            
                             //send google event
                                 ga('send', {
                                    hitType: 'event',
                                    eventCategory: 'LiveDemo',
                                    eventAction: 'Clicked',
                                    eventLabel : "",
                                    eventValue: 1
                                });
                            
                            
                            if(typeof fbq === 'undefined') {
                                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                                n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                                document,'script','//connect.facebook.net/en_US/fbevents.js');

                               fbq('init', '259799124372238');
                                fbq('track', 'PageView');

                                fbq('track', 'Lead', {
                                     content_category : "LiveDemo"
                                 });
                              }
                              else {
                               fbq('track', 'Lead', {
                                     content_category : "LiveDemo"
                                 });
                              }
                            
                            
                            
                            
                            
                                //track google micro conversion
                                trackGoogleAdwordsConv(873966782, 'ievPCJGyj2oQvtneoAM');
                                jQuery('#livedemomodal').modal('hide');
                        }else {
		            alert("Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder kontaktieren Sie uns unter support@mailtastic.de bzw. unter 06182 955 70 00.");
                        }
                         
		});
		
		request.fail(function( jqXHR, textStatus ) {
			  alert("Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder kontaktieren Sie uns unter support@mailtastic.de bzw. unter 06182 955 70 00.");
                          // hideLoadSpinner();
		});
        
    }
    
    
    
}


function alert(text) {

    bootbox.alert(text);
}

jQuery( document ).ready( function(){
    
    jQuery(".opencontatctform").click(function(){

         jQuery('#personalcontactmodal').modal('show');

    });
    
    jQuery("#mc-embedded-subscribe").click(function(){

        //send google event
        ga('send', {
           hitType: 'event',
           eventCategory: 'newsletterwebseite',
           eventAction: 'Clicked',
           eventLabel : "",
           eventValue: 1
       });
       
       
        //track livedemo event
                                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                                n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                                document,'script','//connect.facebook.net/en_US/fbevents.js');

                                fbq('init', '259799124372238');
                                fbq('track', 'PageView');

                                
                                 fbq('track', 'AddToWishlist');

    });
    
    
    
}); 

