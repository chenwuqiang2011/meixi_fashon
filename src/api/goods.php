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
	$id = isset($_GET['id']) ? $_GET['id'] : '';

	$page_no = isset($_GET['pageNo']) ? $_GET['pageNo'] : 1;

	// 每页显示数
	$qty = isset($_GET['qty']) ? $_GET['qty'] : 10;

	//有传id过来时，获取一个商品信息；

	if($id){
		// 查找对应商品的所有信息；
		$res = "select * from goods where id='$id'";

		// 查询数据库
		$result = $conn->query($res);

		//使用查询结果	
		$row = $result->fetch_all(MYSQLI_ASSOC);

		echo json_encode($row[0],JSON_UNESCAPED_UNICODE);
	}else{

		//没有传id时，输出所有商品；

		$goods = "select * from goods";
		// 查询数据库
		$result = $conn->query($goods);

		//使用查询结果	
		$row = $result->fetch_all(MYSQLI_ASSOC);

		// print_r ($row);

		// 根据分布截取数据；
		$data = array(
			'data'=>array_slice($row, ($page_no-1)*$qty,$qty),
			'qty'=>$qty,
			'total'=>count($row)
		);

		echo json_encode($data,JSON_UNESCAPED_UNICODE);

	}

?>