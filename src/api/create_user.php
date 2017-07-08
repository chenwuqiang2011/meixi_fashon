<?php
	/*
		与用户相关的所有操作
		* 增 insert
		* 删 delete
		* 查 select
		* 改 update
	 */
	
	// 第一步
	// 配置信息
	$servername = 'localhost';
	$username = 'root';
	$password = '';
	$database = 'meixi';

	// 连接数据库
	$conn = new mysqli($servername,$username,$password,$database);

	if ($conn->connect_error) {
	    die("连接失败: " . $conn->connect_error);
	} 

	// 设置编码格式
	$conn->set_charset('utf8');

	// 接收前端传回的数据
	$telphone = isset($_GET['telphone']) ? $_GET['telphone'] : '';
	$password = isset($_GET['password']) ? $_GET['password'] : '123456';

	// md5加密密码
	$password = md5($password);

	// 查找指定telphone信息
	if($telphone){
		

		// 查找所有用户信息
		$telphones = "select telphone from user where telphone='$telphone'";

		// 查询数据库

		$result = $conn->query($telphones);

		//使用查询结果	
		$row = $result->fetch_all(MYSQLI_ASSOC);

		if($row){
			echo "false";
		}else{
			// 写入数据；
			$sql = "insert into user(telphone,password) values('$telphone','$password')";

			// 查询数据库
			$results = $conn->query($sql);

			//使用查询结果	
			if($results){
				echo "true";
			}
		}
	}
?>