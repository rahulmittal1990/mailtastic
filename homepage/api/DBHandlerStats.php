<?php
require_once __DIR__ . '/Config.php';
require_once __DIR__ . '/Logger.php';


class DBHandlerStats {
	

	
		public static function getStats(){
			
			$dbconnection = self::getDBConnection();
                        $resultData = [];
                        
                        $query = "select id from User where isAdmin = 1";
                        $result = mysqli_query($dbconnection, $query);
                        if(!$result){
					Logger::error(mysqli_error($dbconnection));
					return "test";
			}
                        else{
                                echo "<table><tr><th>Nr. </th><th>E-Mail</th><th>Firma</th><th>Nachname</th><th>Vorname</th><th>Letzter Login</th><th>Logins</th><th>Kampagnen</th><th>Gruppen</th><th>Aktive Kampagnen</th><th>Clicks</th><th>Views</th><th>Anzahl Mitarbeiter</th><th>createdAt</th></tr>";
                           $index = 1;
                            while($row = mysqli_fetch_assoc($result)) {
                                ob_start();
                               $innerQuery = "select email, companyName,firstname, lastname,updatedAt as 'LastLogin', logins, createdAt, 
                                (select count(*) from Campaign where owner = u.id) as Kampagnen, 
                                (select count(*) from Groups where owner = u.id) as Gruppen, 
                                (select count(*) from Campaign where owner = u.id and id in (Select activeCampaign from Groups where owner =u.id)) as AktiveK,
                                (select count(*) from Click where userId IN (SELECT id from User where admin = u.id OR id = u.id )) as Clicks,
                                (select count(*) from User p where p.admin = u.id) as Mitarbeiter 
                                from User u where u.id = '" . $row['id'] . "' order by u.createdAt";	
//                                Logger::error($innerQuery);
                                $innerResult = mysqli_query($dbconnection, $innerQuery);
                                if(!$innerResult){
					Logger::error(mysqli_error($dbconnection));
					return "test";
                                }else{
                                    $innerRow = mysqli_fetch_assoc($innerResult);
                                    echo "<tr><td>".$index."</td><td>".$innerRow["email"]."</td><td>".$innerRow["companyName"]."</td><td>".$innerRow["firstname"]."</td><td>".$innerRow["lastname"]."</td><td>".$innerRow["LastLogin"]."</td><td>".$innerRow["logins"]."</td><td>".$innerRow["Kampagnen"]."</td><td>".$innerRow["Gruppen"]."</td><td>".$innerRow["AktiveK"]."</td><td>".$innerRow["Clicks"]."</td><td>"/*.$innerRow["Views"]."</td><td>"*/.$innerRow["Mitarbeiter"]."</td><td>".$innerRow["createdAt"]."</td></tr>";
                                    $index++;
                                }
                                
                                //echo ob_get_contents();
                                ob_end_flush();
                            }
                             echo "</table>";
                            
                        }
//                         if (count($resultData) > 0) {
//                                 //$index = 1;
//                             
//                                echo "<table><tr><th>Nr. </th><th>E-Mail</th><th>Firma</th><th>Nachname</th><th>Vorname</th><th>Letzter Login</th><th>Logins</th><th>Kampagnen</th><th>Gruppen</th><th>Aktive Kampagnen</th><th>Clicks</th><th>Views</th><th>Anzahl Mitarbeiter</th></tr>";
//                                for($index = 0; $index < count($resultData); $index++ ) {
//                                   $row = $resultData[$index];
//                                   echo "<tr><td>".$index."</td><td>".$row["email"]."</td><td>".$row["companyName"]."</td><td>".$row["firstname"]."</td><td>".$row["lastname"]."</td><td>".$row["LastLogin"]."</td><td>".$row["logins"]."</td><td>".$row["Kampagnen"]."</td><td>".$row["Gruppen"]."</td><td>".$row["AktiveK"]."</td><td>".$row["Clicks"]."</td><td>".$row["Views"]."</td><td>".$row["Mitarbeiter"]."</td></tr>";
//                                   $index++;
//                                   Logger::error("index: " . $index);
//                                   
//                                }
//                                  echo "</table>";
//                            } else {
//                                 Logger::error("Restuldata : 0");
//                                echo "0 results";
//                            }
                        
                        
                        
                        
                        
//			// $givenAnswers = json_decode($givenAnswers);
//			// $givenAnswers = implode(" _ ",$givenAnswers);
//			$query = "select email, companyName,firstname, lastname,updatedAt as 'LastLogin', logins, 
//                            (select count(*) from Campaign where owner = u.id) as Kampagnen, 
//                            (select count(*) from Groups where owner = u.id) as Gruppen, 
//                            (select count(*) from Campaign where owner = u.id and id in (Select activeCampaign from Groups where owner =u.id)) as AktiveK,
//                            (select count(*) from Click where userId IN (SELECT id from User where admin = u.id OR id = u.id )) as Clicks,
//                            (select count(*) from View where userId IN (SELECT id from User where admin = u.id OR id = u.id )) as Views,
//                            (select count(*) from User p where p.admin = u.id) as Mitarbeiter 
//                            from User u where u.isAdmin = 1 ORDER by companyName";	
//			Logger::error($query);
//                        $result = mysqli_query($dbconnection, $query);
//			if(!$result){
//					Logger::error(mysqli_error($dbconnection));
//					return "test";
//			}
//			else{
//                             if (mysqli_num_rows($result) > 0) {
//                                 $index = 1;
//                                echo "<table><tr><th>Nr. </th><th>E-Mail</th><th>Firma</th><th>Nachname</th><th>Vorname</th><th>Letzter Login</th><th>Logins</th><th>Kampagnen</th><th>Gruppen</th><th>Aktive Kampagnen</th><th>Clicks</th><th>Views</th><th>Anzahl Mitarbeiter</th></tr>";
//                                while($row = mysqli_fetch_assoc($result)) {
//                                   echo "<tr><td>".$index."</td><td>".$row["email"]."</td><td>".$row["companyName"]."</td><td>".$row["firstname"]."</td><td>".$row["lastname"]."</td><td>".$row["LastLogin"]."</td><td>".$row["logins"]."</td><td>".$row["Kampagnen"]."</td><td>".$row["Gruppen"]."</td><td>".$row["AktiveK"]."</td><td>".$row["Clicks"]."</td><td>".$row["Views"]."</td><td>".$row["Mitarbeiter"]."</td></tr>";
//                                   $index++;
//                                   
//                                }
//                                  echo "</table>";
//                            } else {
//                                echo "0 results";
//                            }
//			}
			
		}

//                
                
           
                
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