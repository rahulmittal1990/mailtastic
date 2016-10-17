<?php
//echo "HALLOFIRST";
require_once __DIR__ . '/Config.php';
require_once __DIR__ . '/Logger.php';
require_once __DIR__ . '/DBHandlerStats.php';
ini_set('display_errors',0);
ini_set('display_startup_errors',0);
error_reporting(0);
@ini_set('display_errors', 0);
//increase max execution time of this script to 150 min:
ini_set('max_execution_time', 9000);
//increase Allowed Memory Size of this script:
ini_set('memory_limit','960M');
if ($GLOBALS['useXdebug']) {
	//xdebug_disable();
	//disable xdebug echo anything
}
//echo "HALLO";
//echo "<form action='stats.php'>";
//echo "<input name='first' type='text'/>";
//echo "<input name='second'  type='password'/>";
//echo "<input type='submit' value='Submit'>";
//echo "</form>";
if ($_GET) {
echo "<form method='post' action='stats.php'>";
echo "<input name='first' type='text'/>";
echo "<input name='second'  type='password'/>";
echo "<input type='submit' value='Submit'>";
echo "</form>";

} else if ($_POST) {
    Logger::error("2");
	
    if($_POST['command'])
    Logger::error("3");
	if(!isset($_POST['first'])  || !isset($_POST['second']) || $_POST['second'] != '19Celeron1_87' || $_POST['first'] != 'statsnow'){
	   Logger::error("4");	
            echo "ACCESS DENIED!";
            //return;
        }else{
            DBHandlerStats::getStats();
            //return;
            
        }

	
}


?>