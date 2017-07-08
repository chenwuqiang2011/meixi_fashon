/*
	首页js文件
 */
require(['config'],function(){
	require(['jquery','common'],function($,com){

		// 获取数据，并写入页面
		var params = location.search.substring(1);
		var arr = params.split('&');
		var name;
		arr.forEach(function(item){
			var temp = item.split('=');
			name = temp[0];
		})
		var data = com.getCookie(name);
console.log(data)

		$(".login span").html(data);
		$(".login div").click(()=>{
		
			location.href = "../index.html";

		}).mouseover(()=>{
			$(".login div").css({"cursor":"pointer"})
		});

		$(".logout").click(()=>{

			//删除cookie
			com.deleteCookie(name);

			//回到主页；
			location.href = "../index.html";

		}).mouseover(()=>{
			$(".logout").css({"cursor":"pointer"})
		});

			

	});
});
