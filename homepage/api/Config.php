<?php 

//debug:
//$useXdebug = false;

$documentRoot = getenv("DOCUMENT_ROOT");

$uploadDirectory = $documentRoot . "/uploads";
//define('SITE_ROOT', "../" .realpath(dirname(__FILE__)));

//strato vserver
$mysql_host = "localhost";
$databaseport = 3306;
$databasename = "mailtastic";
$mysql_user = "mailtasticadmin";
$mysql_pwd = "u!Ucd538";



//localhost mailtastic
//$mysql_host = "localhost";
//$databaseport = 3306;
//$databasename = "mailtastic";
//$mysql_user = "root";
//$mysql_pwd = "root";

//lokale Testumgebung MAMP:
 // $mysql_host = "localhost";
 // $databaseport = 8889;
 // $databasename = "kippple";
 // $mysql_user = "root";
 // $mysql_pwd = "root";


//database:
// $mysql_host = "localhost";
// $databaseport = 3306;
// $databasename = "lernduell";
// $mysql_user = "root";
// $mysql_pwd = "";

//database Peer:
// $mysql_host = "localhost";
// $databaseport = 3306;
// $databasename = "tdsfmzbd0";
// $mysql_user = "xdgw0fzhob";
// $mysql_pwd = "AndyS1607";

$app_token = "829289477083623|19LxJ0M7keG7W4Id_IISboNr20s";

$uploadpath = 

//email
$senderEmail = "service@mailtastic.de";

//Own Contact address
$contactEmail = "hello@mailtastic.de";

//Templates
//$_templateDir = "_templates/";



?>