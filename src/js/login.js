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


			$.ajax({
				url:'../api/user.php',
				data:{
					telphone:$('.telphone_num').val(),
					password:$('.password').val()
				},
				success:(res)=>{
					console.log(res)
					if(res === "false"){
						$(".tips").html("用户存在，请重新注册！")
						return false;
					}else if(res === "true"){
						$(".tips").html("")
					}
				}

			});

		
		})

		//短信验证码
		$(".msg_value").blur(()=>{
			var _msg_value = $(".msg_value").val();
			if(!/^\d{4}$/.test(_msg_value)){
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
		
		//点击按钮注册，把手机号和密码写入数据库，且跳转页面
		$(".login_btn button").click(()=>{
			$.ajax({
				url:'../api/create_user.php',
				data:{
					telphone:$('.telphone_num').val(),
					password:$('.password').val()
				},
				success:(res)=>{
					console.log(res)
					var _phone = $(".telphone_num").val();
					var pwd = $(".password").val();
					if(res === "false"){
						$(".tips").html("用户存在，请重新注册！")
						return false;
					}else if(res === "true"){
						$(".tips").html("")

						//将用户名密码写入cookie;
						com.setCookie("name",_phone);
					
						location.href = "./register_success.html?name=" +  _phone;

					}
				}

			});
		})
        // $('.sign_in').validate({
        //     // 验证规则
        //     rules:{
        //         username:{
        //             required:true,
        //             rangelength:11
        //         },
        //         passowrd:{
        //             required:true,
        //             rangelength:[6,12]
        //         }
        //     },

        //     // 自定义提示
        //     messages:{
        //         // username:{
        //         //     required:'老谢说这是必填的',
        //         //     rangelength:'输入的长度不合法'
        //         // }
        //     }
        // })
	});
});
