<?php
require_once __DIR__ . '/Config.php';
require_once __DIR__ . '/Logger.php';


class DBHandler {
	

	
		public static function addPrereg($name, $email, $wantsBeta, $wantsInfo){
			
			$dbconnection = self::getDBConnection();
			
			$name = mysqli_real_escape_string($dbconnection, $name) ;
                        $email = mysqli_real_escape_string($dbconnection, $email) ;
                        $wantsBeta = mysqli_real_escape_string($dbconnection, $wantsBeta) ;
                        $wantsInfo = mysqli_real_escape_string($dbconnection, $wantsInfo) ;
			// $givenAnswers = json_decode($givenAnswers);
			// $givenAnswers = implode(" _ ",$givenAnswers);
			$query = "INSERT INTO Preregister
			(name, email, wantsBeta, wantsInfo) 
			VALUES 
			('$name','$email',$wantsBeta, $wantsInfo)";	//TODO wenn schon mal hinzugef�gt nochmals hinzuf�gen nicht m�glich
			Logger::error($query);
			if(!mysqli_query($dbconnection, $query)){
					Logger::error(mysqli_error($dbconnection));
					return "test";
			}
			else{
				return true;
			}
			
		}
                
                   public static function addNewsletter($email){
//			
			$dbconnection = self::getDBConnection();
			
			
                        $email = mysqli_real_escape_string($dbconnection, $email) ;
                     
			   Logger::error("10");
			// $givenAnswers = implode(" _ ",$givenAnswers);
			$query = "INSERT INTO Newsletter
			(email) 
			VALUES 
			('$email')";	//TODO wenn schon mal hinzugef�gt nochmals hinzuf�gen nicht m�glich
			Logger::error($query);
			if(!mysqli_query($dbconnection, $query)){
					Logger::error(mysqli_error($dbconnection));
					return "test";
			}
			else{
				return true;
			}
			
		}
//                
                
                public static function addBetaAccount($name, $firstname, $company,  $email, $password, $key){
			
                    
                    
                    if($key != 666666){
                        return false;
                    }else{
                        $dbconnection = self::getDBConnection();
			
			$name = mysqli_real_escape_string($dbconnection, $name) ;
                        $firstname = mysqli_real_escape_string($dbconnection, $firstname) ;
                        $company = mysqli_real_escape_string($dbconnection, $company) ;
                        $email = mysqli_real_escape_string($dbconnection, $email) ;
                   
                        
                        //create user
                        
                        
			// $givenAnswers = json_decode($givenAnswers);
			// $givenAnswers = implode(" _ ",$givenAnswers);
			$query = "INSERT INTO Preregister
			(name, email, wantsBeta, wantsInfo) 
			VALUES 
			('$name','$email',$wantsBeta, $wantsInfo)";	//TODO wenn schon mal hinzugef�gt nochmals hinzuf�gen nicht m�glich
			Logger::error($query);
			if(!mysqli_query($dbconnection, $query)){
					Logger::error(mysqli_error($dbconnection));
					return "test";
			}
			else{
				return true;
			}
                    }
                    
			
			
		}
                
                /**
	 * This function returns the current db connection
	 * Connection data is defined in Config.php
	 */
	public static function getDBConnection() {
		ini_set('display_errors',1);
		error_reporting(E_ALL | E_STRICT);
		
	
		if (!isset($link)) {
			if (isset($GLOBALS['databaseport'])) {
				$link = mysqli_connect($GLOBALS['mysql_host'], $GLOBALS['mysql_user'], $GLOBALS['mysql_pwd'], $GLOBALS['databasename'], $GLOBALS['databaseport']);
				//Logger::error("New Connection:");
			} else {//use default port
				$link = mysqli_connect($GLOBALS['mysql_host'], $GLOBALS['mysql_user'], $GLOBALS['mysql_pwd'], $GLOBALS['databasename']);
				//Logger::error("New Connection:");
			}
			if (mysqli_connect_errno()) {
				Logger::error("Connect failed:" . mysqli_connect_error());
				exit();
			}
		}else{
			// Logger::error("Old Connection:");
			
		}
		
		
		/* change character set to utf8 */
		if (!mysqli_set_charset($link, "utf8")) {
   			 printf("Error loading character set utf8: %s\n", mysqli_error($link));
		} 

		
		
		
		return $link;
		// returns the link
	}

	
}	
?>