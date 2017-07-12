<?php
	/*
		分页获取数据：
	    * pageNo=1    
	    该地址请求多条微博信息，分页获取，pageNo指定获取第几页的数据

	    json_encode():把数组转成json字符串
	    * php5.4+ 使用JSON_UNESCAPED_UNICODE防止中文转义
	 */
	$page_no = isset($_GET['pageNo']) ? $_GET['pageNo'] : 1;

	// 每页显示数
	$qty = isset($_GET['qty']) ? $_GET['qty'] : 10;

	// 商品id;
	$id = isset($_GET['id']) ? $_GET['id'] : "";

	$file_url = './goods.json';

	// 打开文件
	$myfile = fopen($file_url, 'r');

	// 读取打开的文件
	$content = fread($myfile, filesize($file_url));

	// 把读取到的内容转成数组
	$arr_data = json_decode($content);

	//输出数组用print_r
	// print_r ($arr_data);

	$res=array();
	foreach ($arr_data as $list) {
		foreach ($list -> list as $brand) {
			foreach ($brand -> goods as $goods) {
				$res[] = $goods;
			}
		}
	};
	
	// 根据分布截取数据；
	$data = array(
		'data'=>array_slice($res, ($page_no-1)*$qty,$qty),
		'qty'=>$qty,
		'total'=>count($res)
	);

	
	//输出json字符串；
	if($id){

		//遍历商品，找到相同id的商品；
		foreach ($res as $currentGoods){
			if($currentGoods ->id == $id ){
				echo json_encode($currentGoods,JSON_UNESCAPED_UNICODE);
				break;
			}
		}
	}else{

		//分页输出；
		echo json_encode($data,JSON_UNESCAPED_UNICODE);
	}

	fclose($myfile);

?>