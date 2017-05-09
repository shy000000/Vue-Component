<?php
	require_once('config.php');
	$username = $_GET['username'];
	$password = md5($_GET['password']);
	$type = $_GET['type'];
	$Model = new DB('user');
	$db = $Model->init();
	$result = $db->query("SELECT * from user where username='$username'");
	if($result&&$type=='login'){
		$res = $db->query("SELECT * from user where username='$username' AND password='$password'");
		$row = $res->fetch_assoc();
		if($row){
			$row['errorcode']=0;
			$json = json_encode($row);
			echo $json;
		}else{
			$row['errorcode']=-1;
			$json = json_encode($row);
			echo $json;
		}
	}else{
		if(!$result){
			$res = $db->query("INSERT INTO user (username,password) VALUES ('$username','$password')");
			var_dump($res);
			$row = $res->fetch_assoc();
			if($row){
				$row['errorcode']=1;
				$json = json_encode($row);
				echo $json;
			}else{
				$row['errorcode']=-99;
				$json = json_encode($row);
				echo $json;
			}
		}else{
			$row['errorcode']=-2;
			$json = json_encode($row);
			echo $json;
		}
	}
?>