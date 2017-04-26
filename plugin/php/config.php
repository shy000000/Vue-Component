<?php
	class DB{
		public $host;
		public $username;
		public $password;
		public $tablename;
		public $mysqli;
		public $charset;
		function __construct($tablename) {
        	$this->host = '127.0.0.1';
        	$this->username = 'root';
        	$this->password = 'root';
        	$this->tablename = $tablename;
        	$this->charset = 'utf8'; 
        	$this->mysqli = new mysqli($this->host,$this->username,$this->password,$this->tablename);
        	$this->mysqli->set_charset('utf8');
    	}
    	public function init(){
    		return $this->mysqli;
    	}
    }
?>