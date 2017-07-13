 /*
	首页js文件
 */
require(['config'],function(){
	require(['jquery','common'],function($,com){

		//发送ajax请求生成导航列表；

		$.ajax({
			url:"../api/goodslist.php",
			dataType:"json",
			data:{qty:30},
			success:function(res){
				res.data.map(function(item){
					$("<tr/>").html(`
						<td>${item.id}</td>
						<td>${item.brand}</td>
						<td>${item.name}</td>
						<td>${item.price}</td>
						<td>${item.color}</td>
						<td>${item.imgurl}</td>
						<td>${item.size}</td>
						`).appendTo($("table"));
				})
			
			}
		});


	});
});
