<?php

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

	//引用文件地址；
	$file_url = './goods.json';

	// 打开文件
	$myfile = fopen($file_url, 'r');

	// 读取打开的文件
	$content = fread($myfile, filesize($file_url));

	// 把读取到的内容转成数组
	$arr_data = json_decode($content);

	//获取商品数；
	foreach ($arr_data as $value) {
		foreach ($value as $goods) {
			$_size = "";
			foreach ($goods->size as $val) {
				$_size .= $val.",";
			};
			// print_r($goods);
		 	$_true = property_exists($goods,'global'); 
			// var_dump($_true);
			if($_true){
				$sql = "insert into goods(id,brand,name,color,price,imgurl,size,global) values('$goods->id','$goods->brand','$goods->name','$goods->color','$goods->price','$goods->imgurl','$_size','$goods->global')";
			}else{
				$sql = "insert into goods(id,brand,name,color,price,imgurl,size,global) values('$goods->id','$goods->brand','$goods->name','$goods->color','$goods->price','$goods->imgurl','$_size','')";
			}
			// 查询数据库
			$conn->query($sql);
			echo $sql;
		};
		
	};

	fclose($myfile);
?>