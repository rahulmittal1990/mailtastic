<?php
require_once __DIR__ . '/Config.php';
require_once __DIR__ . '/Logger.php';
require_once __DIR__ . '/DBHandler.php';
ini_set('display_errors',0);
ini_set('display_startup_errors',0);
error_reporting(0);
@ini_set('display_errors', 0);

if ($GLOBALS['useXdebug']) {
	//xdebug_disable();
	//disable xdebug echo anything
}

if ($_GET) {
Logger::error("1");

} else if ($_POST) {
	Logger::error("2");
	
    if($_POST['command'])
//    Logger::error("3");
	if(!isset($_POST['key']) || $_POST['key'] != "stagger"  || !isset($_POST['command'])){
//	   Logger::error("4");	
            echo false;
             
		return;
	}else{
            $command = $_POST['command'];
               Logger::error("5");
            switch($command){
                case  "preregister" : 
//                       Logger::error("6");
                    $Email = $_POST['email'];
                    $Name= $_POST['name'];
                    $wantsBeta = $_POST['wantsBeta'];
                    $wantsInfo = $_POST['wantsInfo'];
                    //email zusammenbauen
                    $topic = "Anfrage für Mailtastic erhalten!";
                    $message = "";
                    $message .= "Name: "  . $Name . "\r\n\n";
                    $message .= "E-Mail: " . $Email . "\r\n";
                    if($wantsBeta == true){
                          $message .= "Möchte an der beta teilnehmen \r\n\n";
                    }
                    if($wantsInfo == true){
                          $message .= "Möchte informiert werden wenn es losgeht \r\n\n";
                    }
                    $headers = "From:" . "preregister@mailtastic.de" . "\r\n";
                    $headers .= "MIME-Version: 1.0\r\n";
                    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
                    mail("management@netstag.com", $topic, $message, $headers);
                    DBHandler::addPrereg($Name, $Email, $wantsBeta, $wantsInfo);
                    echo true;
                    break;
                case  "newsletter" : 
                       Logger::error("7");
                    $Email = $_POST['email'];
                    //email zusammenbauen
                    $topic = "Newsletteranmeldung für Mailtastic erhalten!";
                    $message = "";
                    $message .= "E-Mail: " . $Email . "\r\n";
                    $headers = "From:" . "newsletter@mailtastic.de" . "\r\n";
                    $headers .= "MIME-Version: 1.0\r\n";
                    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
                    mail("management@netstag.com", $topic, $message, $headers);
                    DBHandler::addNewsletter($Email); //TODO
                     echo true;
		break;
                    
                  
                case  "kontakt"       :
//                       Logger::error("8");
                    $Email = $_POST['email'];
                    $firstname= $_POST['vorname'];
                    $lastname = $_POST['name'];
                    $nachricht = $_POST['nachricht'];
                    $unternehmen = $_POST['company'];
//                    $companyname = $_POST['companyname'];
                    $tel = $_POST['telefon'];
                    $anrede = $_POST['anrede'];
                    //email zusammenbauen
                    $topic = "Kontaktanfrage für Mailtastic erhalten!";
                    $message = "";
                    $message .= "Name: " . $anrede . " "  . $firstname . " " . $lastname . "\r\n\n";
                    $message .= "E-Mail: " . $Email . "\r\n";
                     $message .= "Unternehmen: " . $unternehmen . "\r\n";
//                    $message .= "Unternehmen: " . $companyname . "\r\n";
                    $message .= "Tel: " . $tel . "\r\n";
                     $message .= "Nachricht: " .$nachricht . "\r\n";
                    $headers = "From:" . "kontaktanfrage@mailtastic.de" . "\r\n";
                    $headers .= "MIME-Version: 1.0\r\n";
                    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
                    mail("management@netstag.com", $topic, $message, $headers);
                     echo true;
                    break;
                
            };
		
	}
	
}


?>