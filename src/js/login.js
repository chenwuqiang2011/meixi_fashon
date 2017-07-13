/*
	首页js文件
 */
require(['config'],function(){
	require(['jquery','common'],function($,com){
	
		//发送ajax请求判断用户名与密码;

		//点击按钮注册，把手机号和密码写入数据库，且跳转页面
		$(".login_btn").click(function(){
			$.ajax({
				url:'../api/user.php',
				data:{
					telphone:$('.telphone_num').val(),
					password:$('.password').val()
				},
				success:(res)=>{
					console.log(res)
					if(res === "true"){
						$(".tips").html("");
						var _phone=$('.telphone_num').val();

						//七天；
						var now = new Date();
						now.setDate(now.getDate()+1);
						//把登录用户名传到cookie;

						com.setCookie("name",_phone,now,"/");

						//跳转页面；
						location.href = "./register_success.html?name=" +  _phone;
					}else {
						$(".tips").html("用户或者密码不正确！")
						return false;
					}
				}
			});	
		})
	});
});
