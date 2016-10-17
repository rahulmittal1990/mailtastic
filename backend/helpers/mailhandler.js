var Handlebars = require('handlebars');
var fs = require('fs');
var templateCache = [];	//for caching the hbs templates
var EMPLOYEE_INVITATION_CACHE_KEY = "EMPLOYEE_INVITATION";
var EMPLOYEE_INVITATION_TEMPLATE_PATH = "./templates/user-invitation/html.html";
var EMPLOYEE_SOMETHING_CHANGED_TEMPLATE_PATH = "./templates/user-something-changed/html.html";
var EMPLOYEE_SYNC_DATA_MISSING_TEMPLATE_PATH = "./templates/user-sync-data-missing/html.html";

var USER_REGISTRATION_CACHE_KEY = "USER_REGISTRATION";
var USER_REGISTRATION_TEMPLATE_PATH = "./templates/registration/html.html";
var PASS_RESET_TEMPLATE_PATH = "./templates/passreset/html.html";
var NEWSLETTER_OPT_IN_TEMPLATE_PATH = "./templates/newsletter/html.html";
var WELCOME_TEMPLATE_PATH = "./templates/triggermails/nachaktivierung/html.html";
var EMPLOYEE_DELETION_INFO_TEMPLATE_PATH = "./templates/empremoved/html.html";

var q = require('q');

var WELCOME_MAIL = "EMPLOYEE_INVITATION";


var handler = {
	
	sendEmployeeInvitation : function(recipient, inputdata){
		 var deferred = q.defer();
			getTemplate(EMPLOYEE_INVITATION_TEMPLATE_PATH,inputdata , function(data){
				if(data === false){
					//error handling
					deferred.resolve(false);
				}else{
					var topic = inputdata.invitor + " hat Sie zu Mailtastic eingeladen";
					sendMail(recipient,inputdata.invitor + " - Mailtastic"  ,topic, data, function(ret){
						if(ret ===true){
							deferred.resolve(true);
						}else{
							deferred.resolve(false);
						}
					});
				}
			});
			return deferred.promise;
		}
	,
                /**
         * send when user has to change his signature
         * @param {type} recipient
         * @param {type} inputdata
         * @returns {q@call;defer.promise}
         */

        sendEmployeeSomethingChangedMail : function(recipient, inputdata){
		 var deferred = q.defer();
			getTemplate(EMPLOYEE_SOMETHING_CHANGED_TEMPLATE_PATH,inputdata , function(data){
				if(data === false){
					//error handling
					deferred.resolve(false);
				}else{
					var topic = inputdata.invitor + " bittet Sie Ihre Signatur zu aktualisieren.";
					sendMail(recipient,inputdata.invitor + " - Mailtastic"  ,topic, data, function(ret){
						if(ret ===true){
							deferred.resolve(true);
						}else{
							deferred.resolve(false);
						}
					});
				}
			});
			return deferred.promise;
		}
	,
                /**
         * Send when user is synced automatically but data is missing
         * @param {type} recipient
         * @param {type} inputdata
         * @returns {q@call;defer.promise}
         */
         sendSyncUserDataMissingMail : function(recipient, inputdata){
		 var deferred = q.defer();
			getTemplate(EMPLOYEE_SYNC_DATA_MISSING_TEMPLATE_PATH,inputdata , function(data){
				if(data === false){
					//error handling
					deferred.resolve(false);
				}else{
					var topic = inputdata.invitor + " bittet Sie Ihre Signatur-Daten zu aktualisieren.";
					sendMail(recipient,inputdata.invitor + " - Mailtastic"  ,topic, data, function(ret){
						if(ret ===true){
							deferred.resolve(true);
						}else{
							deferred.resolve(false);
						}
					});
				}
			});
			return deferred.promise;
		}
	,

        sendNewsletterOptIn : function(recipient, inputdata){
		 var deferred = q.defer();
			getTemplate(NEWSLETTER_OPT_IN_TEMPLATE_PATH,inputdata , function(data){
				if(data === false){
					//error handling
					deferred.resolve(false);
				}else{
					var topic = "Anmeldung zum Newsletter - Mailtastic";
					sendMail(recipient, "noreply@mailtastic.de"  ,topic, data, function(ret){
						if(ret ===true){
							deferred.resolve(true);
						}else{
							deferred.resolve(false);
						}
					});
				}
			});
			return deferred.promise;
		}
	,
        sendEmployeeReinvitation : function(recipient, inputdata){
		 var deferred = q.defer();
			getTemplate(EMPLOYEE_INVITATION_TEMPLATE_PATH,inputdata , function(data){
				if(data === false){
					//error handling
					deferred.resolve(false);
				}else{
					var topic = "Erinnerung: " + inputdata.invitor + " hat Sie zu Mailtastic eingeladen";
					sendMail(recipient,inputdata.invitor + " - Mailtastic", topic, data, function(ret){
						if(ret ===true){
							deferred.resolve(true);
						}else{
							deferred.resolve(false);
						}
					});
				}
			});
			return deferred.promise;
		}
	,
        
//        sendEmployeeDeletionInfo : function(recipient, inputdata){
//             var deferred = q.defer();
//			getTemplate(EMPLOYEE_DELETION_INFO_TEMPLATE_PATH,inputdata , function(data){
//				if(data === false){
//					//error handling
//					deferred.resolve(false);
//				}else{
//					var topic = "Auf Wiedersehen bei Mailtastic";
//					sendMail(recipient,inputdata.invitor + " - Mailtastic", topic, data, function(ret){
//						if(ret ===true){
//							deferred.resolve(true);
//						}else{
//							deferred.resolve(false);
//						}
//					});
//				}
//			});
//			return deferred.promise;
//        }
//        ,
        
        sendPassResetMail : function(recipient, inputdata){
		 var deferred = q.defer();
			getTemplate(PASS_RESET_TEMPLATE_PATH,inputdata , function(data){
				if(data === false){
					//error handling
					deferred.resolve(false);
				}else{
					var topic = "Passwort vergessen – Mailtastic";
					sendMail(recipient,"noreply@mailtastic.de", topic, data, function(ret){
						if(ret ===true){
							deferred.resolve(true);
						}else{
							deferred.resolve(false);
						}
					});
				}
			});
			return deferred.promise;
		}
	,
        sendWelcomeMail : function(recipient, inputdata){
		 var deferred = q.defer();
			getTemplate(WELCOME_TEMPLATE_PATH,inputdata , function(data){
				if(data === false){
					//error handling
					deferred.resolve(false);
				}else{
					var topic = "Kann ich Ihnen helfen?";
					sendMailFromTao(recipient,"t.bauer@mailtastic.de", topic, data, function(ret){
						if(ret ===true){
							deferred.resolve(true);
						}else{
							deferred.resolve(false);
						}
					});
				}
			});
			return deferred.promise;
		}
	,
         sendRegistrationActivation : function(recipient, inputdata){
		 var deferred = q.defer();
			getTemplate(USER_REGISTRATION_TEMPLATE_PATH,inputdata , function(data){
				if(data === false){
					//error handling
					deferred.resolve(false);
				}else{
					var topic = "Ihre Registrierung bei Mailtastic";
					sendMail(recipient,"registration@mailtastic.de", topic, data, function(ret){
                                            
                                                //infomail an uns--------------
                                                var Message = "Neue Registrierung:";
                                                Message += "<br />";
                                                Message += "Email: ";
                                                Message += recipient;
                                                Message += "<br />";


                                                var topic = "Es hat sich jemand registriert!";
                                                sendMail("management@mailtastic.de", "newregistration@mailtastic.de" ,topic, Message, function(data){

                                                });
                                                //-----------------------
                                            
                                                if(ret ===true){
							deferred.resolve(true);
						}else{
							deferred.resolve(false);
						}
					});
				}
			});
			return deferred.promise;
		}
	,
        
        sendFeedbackFromWebApp : function(data){
            var deferred = q.defer();
             var Message = "Jemand hat Feedback im Mailtastic Dashboard hinterlassen:";
             
              Message += "<br />";
              Message += "Name: ";
              Message += data.firstname;
              Message += " ";
              Message += data.lastname;
              Message += "<br />";
              Message += "Email: ";
              Message += data.email;
              Message += "<br />";
              Message += "Text:";
              Message += "<br />";
              Message += data.text;
             
            var topic = "Feedback aus dem Mailtastic Dashboard";
            sendMail("support@mailtastic.de", "feedback@mailtastic.de" ,topic, Message, function(ret){
                    if(ret === true){
                            deferred.resolve(true);
                    }else{
                            deferred.resolve(false);
                    }
            });
            
            return deferred.promise;
		
            
        },
         sendLiveDemoRequest : function(data){
            var deferred = q.defer();
             var Message = "Jemand möchte eine Live-Demo:";
              Message += "<br />";
              Message += "Name: ";
              Message += data.name;
              Message += "<br />";
              Message += "Email: ";
              Message += data.email;
              Message += "<br />";
              Message += "Unternehmen: ";
              Message += data.company;
              Message += "<br />";
            var topic = "Jemand möchte eine Live Demo";
            sendMail("livedemo@mailtastic.de", "livedemo@mailtastic.de" ,topic, Message, function(ret){
                 sendMail("t.bauer@mailtastic.de", "livedemo@mailtastic.de" ,topic, Message, function(ret){
                     if(ret === true){
                            deferred.resolve(true);
                    }else{
                            deferred.resolve(false);
                    }
                     
                     
                 });
                
            });
            
            return deferred.promise;
		
            
        },
        sendCebitRequest : function(data){
            var deferred = q.defer();
             var Message = "Jemand möchte auf die Cebit:";
              Message += "<br />";
              Message += "Name: ";
              Message += data.name;
              Message += "<br />";
              Message += "Email: ";
              Message += data.email;
              Message += "<br />";
              Message += "Tel: ";
              Message += data.tel;
              Message += "<br />";
              Message += "Unternehmen: ";
              Message += data.company;
              Message += "<br />";
              Message += "Will LiveDemo: ";
              Message += data.wantsDemo;
              Message += "<br />";
              Message += "Will NewsLetters: ";
              Message += data.wantsNewsletter;
              Message += "<br />";
              Message += "Will Fish-NewsLetters: ";
              Message += data.wantsFishNewsletter;
              Message += "<br />";
              var topic = "Jemand möchte auf die CeBit";
                sendMail("cebit@mailtastic.de", "cebit@mailtastic.de" ,topic, Message, function(ret){
                        if(ret === true){
                            deferred.resolve(true);
                        }else{
                            deferred.resolve(false);
                        }
                });
            return deferred.promise;
	},
        sendOtherMailClientMessage : function(data){
              var deferred = q.defer();
             var Message = "Jemand hat in der Webapp einen Client zu dem es keine Anleitung gibt:";
             
              Message += "<br />";
              Message += "Name: ";
              Message += data.firstname;
              Message += " ";
              Message += data.lastname;
              Message += "<br />";
              Message += "Email: ";
              Message += data.email;
              Message += "<br />";
              Message += "ID: ";
              Message += data.id;
              Message += "<br />";
               Message += "Mailclient: ";
              Message += data.client;
              Message += "<br />";
            var topic = "Mailclient ohne Anleitung!";
            sendMail("othermailclient@mailtastic.de","othermailclient@mailtastic.de", topic, Message, function(ret){
                    if(ret === true){
                            deferred.resolve(true);
                    }else{
                            deferred.resolve(false);
                    }
            });
            
            return deferred.promise;
            
            
        },
        
        sendPreregisterInformation : function(data){
             var deferred = q.defer();
             var Message = "Jemand hat sich auf der Webseite in das Formular eingetragen:";
             
              Message += "<br />";
              Message += "Name: ";
              Message += data.name;
               Message += "<br />";
              Message += "Email: ";
              Message += data.email;
              Message += "<br />";
            
            if(data.wantsBeta === true){
                 Message += "Er will an der Beta teilnehmen";
                 Message += "<br />";

             }
             if(data.wantsInfo === true){
                   Message += "Er will Info wenn es losgeht";
                   Message += "<br />";

             }
             
            var topic = "Jemand hat sich auf der Webseite eingetragen!";
            sendMail("preregister@mailtastic.de","preregister@mailtastic.de", topic, Message, function(ret){
                    if(ret === true){
                            deferred.resolve(true);
                    }else{
                            deferred.resolve(false);
                    }
            });
            
            return deferred.promise;
            
        },
        
        sendRetentionMail : function(inputData, template, topic){
           
           if(!template){
                logEror("1");
           }else{
                getTemplate(template,inputData , function(data){
                    if(data === false){
                        logEror("2");
                    }else{
                        if(!inputData.email){
                               logEror("3");
                        }else{
                            var recipient = inputData.email;
                            sendMailFromTao(recipient,"t.bauer@mailtastic.de", topic, data, function(ret){
                                if(ret ===false){
                                        logEror("4");
                                }
                            });
                        }

                    }
                });
            }
          
            function logEror(add){  //intern error log for this function
                console.error("Retentionmail konnte nicht verschickt werden" + add +": " + JSON.stringify(inputData) + " tpl: " + template + " topic: " + topic);
            }
        }
	
};
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    pool: true,
    host: 'smtp.mailtastic.de',
    port: 587,
    secure: false, // use SSL
    auth: {
        user: 'do_not_reply@mailtastic.de',
        pass: 'Oe1dc_98'
    }, // must be the same that can be reverse resolved by DNS for your IP
    tls: {rejectUnauthorized: false},
    debug:true
});
//var transporter = nodemailer.createTransport();
var htmlToText = require('nodemailer-html-to-text').htmlToText;
transporter.use('compile', htmlToText());
function sendMail(to,from,subject, content, callback){
		
		transporter.sendMail({
		    //from: from +" <do_not_reply@mailtastic.de>",
                    from: from +"<do_not_reply@mailtastic.de>",
		    to: to,
		    subject: subject,
                    //text: "Einladung zu Mailtastic. Bitte aktivieren Sie HTML-Inhalte, um den Inhalt dieser E-Mail korrekt anzuzeigen.",
		    html : content,
                    //html : "<div>Hello World</div>",
                    logger : true
		},function(error, response){
			 if(error){
				console.error("MAILERROR: " + error);
				//console.error("MAILERROR: " + JSON.stringify(response));
                                console.error(JSON.stringify({
                                    from: from +" <do_not_reply@mailtastic.de>",
                                    to: to,
                                    subject: subject,
                                    html : ""
                                }));
                                console.error("RESPONSE: " + JSON.stringify(response));
				callback(false);
			 }else{
				callback(true);
                                console.log("Mail sent to :" + to);
                                console.log(JSON.stringify(response));
		 	
			 }
			
		});
	
}

function sendMailFromTao(to,from,subject, content, callback){
		
		transporter.sendMail({
		    from: from +" <t.bauer@mailtastic.de>",
		    to: to,
		    subject: subject,
		    //text: "Nachricht von Mailtastic. Bitte aktivieren Sie HTML-Inhalte, um den Inhalt dieser E-Mail korrekt anzuzeigen.",
		    html : content
		},function(error, response){
			 if(error){
				console.error("MAILERROR: " + error);
				console.error("MAILERROR: " + JSON.stringify(response));
				callback(false);
			 }else{
				callback(true);
		 	
			 }
			
		});
	
}


function getTemplate(path, inputData , callback){
	if(!templateCache[path]){	//file ist not already in cache
			// read the file and use the callback to render
			fs.readFile(path, function(err, data){
			  if (!err) {
			    // make the buffer into a string
			    var source = data.toString();
			    templateCache[path] = source;
			    // call the render function
			    callback(renderToString(source, inputData));
			
			  } else {
			    // handle file read error
			    console.error(err);
                            console.error("TPL PATH : " + path);
			    callback(false);
			  }
			});
			
			
		}else{	//template is already in cache
			
			 callback(renderToString(templateCache[path], inputData));
		}
		
	
}



function renderToString(source, data){
	  	var template = Handlebars.compile(source);
	 	var outputString = template(data);
 	return outputString;
}


module.exports = handler;