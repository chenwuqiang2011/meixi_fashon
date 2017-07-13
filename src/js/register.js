/*
	首页js文件
 */
require(['config'],function(){
	require(['jquery','common'],function($,com){

		$('.telphone_num').on('blur',()=>{

			//利用正则判断手机号是否合法；

			var _telphone = $('.telphone_num').val();
			if(!/^1[34578]\d{9}$/.test(_telphone)){
				$(".tips").html("手机号码不合法！")
				return false;
			};

			//判断用户是否存在；
			$.ajax({
				url:'../api/create_user.php',
				data:{
					telphone:$('.telphone_num').val()
				},
				success:(res)=>{
					console.log(res)
					if(res === "false"){
						$(".tips").html("用户已存在，请换一个用户名！")
						return false;
					}else {
						$(".tips").html("");
					}
				}
			});
		});

		//短信验证码
		$(".msg_value").blur(()=>{
			var _val= $(".msg_value").val();
			var _check_num = $(".msg_send").html();

			if(_val!= _check_num){
				$(".tips").html("请输入正确的验证码！");
			}else{
				$(".tips").html("");
			}
		});

		//密码验证;
		$("#password").blur(()=>{
			var _password = $("#password").val();
			if(!/^[^\s]{6,20}$/.test(_password)){
				$(".tips").html("密码不合法！");
			}else{
				$(".tips").html("");
			}
		});

		//密码确认;
		$("#confirm_pwd").blur(()=>{
			var _password = $("#password").val();
			var __password = $("#confirm_pwd").val();
			if(__password != _password){
				$(".tips").html("密码不相同！");
			}else{
				$(".tips").html("");
			}
		});
		
		//随机生成四位数验证码；
		var check_num = com.randomNum(1000,9999);
		$(".msg_send ").html(check_num);

		//点击按钮注册，把手机号和密码写入数据库，且跳转页面
		$(".login_btn button").click(()=>{

			//当所有验证符合条件时，写入数据库，并跳转页面；
			if($(".tips").html() == ""){console.log("可以注册")

				$.ajax({
					url:'../api/create_user.php',
					data:{
						telphone:$('.telphone_num').val(),
						password:$('.password').val()
					},
					success:(res)=>{
						console.log('php数据',res)
						var _phone = $(".telphone_num").val();
						var pwd = $(".password").val();

						//七天；
						var now = new Date();
						now.setDate(now.getDate()+1);
						//把登录用户名传到cookie;

						com.setCookie("name",_phone,now,"/");

						//跳转页面；
						// location.href = "./register_success.html?name=" +  _phone;

					}
				});
			}
		});

		
	});
});
