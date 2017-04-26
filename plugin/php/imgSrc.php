<?php
	require_once('config.php');
	$name = $_GET['name'];
	$Model = new DB('user');
	$db = $Model->init();
	$result = $db->query("SELECT * from imgsrc where name='$name'");
	$row = $result->fetch_assoc();
	$json = json_encode($row);
	echo $json;
?>