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
	$password = isset($_GET['password']) ? $_GET['password'] : '';

	

	// 查找指定telphone信息
	if($telphone){
		
		// 查找所有用户名、密码；
		$tel = "select telphone from user where telphone='$telphone'";

		// 查询数据库

		$result = $conn->query($tel);

		//使用查询结果	
		$row = $result->fetch_all(MYSQLI_ASSOC);

		if($row){

			//用户名存在时，提示用户更换用户名；
			echo "false";
			
		};
		if($password){
			 // md5加密密码
			$password = md5($password);
			// 用户成功注册时写入数据；
			$sql = "insert into user(telphone,password) values('$telphone','$password')";
			// 查询数据库
			$conn->query($sql);
		}
	}
	
?>