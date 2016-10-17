<?php

define('LOGFILE', __DIR__ . '/' . "log.txt");

class Logger
{	
	private static $logLevel = Logger::LOG_LEVEL_INFO;
	
	const LOG_LEVEL_ERROR = 0;
	const LOG_LEVEL_WARNING = 1;
	const LOG_LEVEL_INFO = 2;
	
	private static $logFileHandle=null;
	
	public static function setLogLevel($logLevelToSet){
		if(isset($logLevelToSet) && is_int($logLevelToSet) && $logLevelToSet > -1 && $logLevelToSet > 3){
			self::$logLevel = $logLevelToSet;
		}
	}
	
	
	public static function error($message)
	{
		if(self::$logLevel >= Logger::LOG_LEVEL_ERROR){
			$toLog = Logger::date() . ' (Error in function: ' . Logger::getCaller() . '): ' . $message;
			Logger::log($toLog);
		}
	}
	
	public static function info($message)
	{
		if(self::$logLevel >= Logger::LOG_LEVEL_INFO){
			$toLog = Logger::date() . ' (Info: ' . Logger::getCaller() . '): ' . $message;
			Logger::log($toLog);
		}
	}
	
	public static function warning($message)
	{
		if(self::$logLevel >= Logger::LOG_LEVEL_WARNING){
			$toLog = Logger::date() . ' (Warning: ' . Logger::getCaller() . '): ' . $message;
			Logger::log($toLog);
		}
	}
	
	private static function log($message)
	{
		Logger::logToFile($message);
	}
	
	private static function logToEcho($message)
	{
		echo "$message";
	}
	
	private static function logToFile($message)
	{
		file_put_contents(LOGFILE, $message . "\n", FILE_APPEND | LOCK_EX);
	}
	
	private static function getCaller() 
	{
	    $trace = debug_backtrace();
		if (!isset($trace[2]))
			return 'global';
	    $name = $trace[2]['function'];
	    return empty($name) ? 'global' : $name;
	}
	
	private static function date()
	{
		return date('Y-m-d H:i:s');
	}
}

?>