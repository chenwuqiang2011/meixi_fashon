/*
	首页js文件
 */
require(['config'],function(){
	require(['jquery','common','gdszoom','lxCarousel'],function($,com){

		//判断用户是否登录；
		var name = com.getCookie('name');

		// 如果没有cookie，则赋值空数组
		// 有cookie就转换成对象
		if(name.length>0){
			name = JSON.parse(name);
		};

		if(name){
			$("#username").html(`您好！${name}`).show();
			$("#logout").show();
			$("#signin").hide();
			$("#signup").hide();
		}else{
			$("#username").html(`您好！${name}`).hide();
			$("#logout").hide();
			$("#signin").show();
			$("#signup").show();
		};

		//点击退出，删除cookie;
		$("#logout").click(function(){

			$("#username").html(`您好！${name}`).hide();
			$("#logout").hide();
			$("#signin").show();
			$("#signup").show();

			//同时删除cookie
			com.deleteCookie("name");
			
		}).mouseover(function(){
			$(this).css({"cursor":"pointer"});
		});

		//点出登录
		$("#signin").click(function(){
			location.href="./login.html";
		});

		//点出注册；
		$("#signup").click(function(){
			location.href="./register.html";
		});

		//购物袋鼠标移入移出；
		var timer;
		$(".car").mouseenter(function(){
			clearTimeout(timer);
			
			$(".total_car").show();
		});
		$(".car").mouseleave(function(){
			timer = setTimeout(function(){
				$(".total_car").hide();
			},300);
		});


		//发送ajax请求生成导航列表；

		$.ajax({
			url:"./api/nav_list.json",
			dataType:"json",
			success:function(res){
				res.map(function(item,idx){
					$("<div/>").addClass("subnav_list").appendTo($(".subnav"));
					try{
						item.list.map(function(item2,idx2){
							$("<ul/>").appendTo($(".subnav div").eq(idx)) ;
							item2.subnav.map(function(item3,idx3){
								var $ul=$(".subnav div").eq(idx);
								
								if(idx3 == 0){
									//即第一个列表项显示粗体
									$("<li/>").html(`<a href="#" class="active">${item3}</a>`).appendTo($($ul).find("ul").eq(idx2));
								}else{
									$("<li/>").html(`<a href="#">${item3}</a>`).appendTo($($ul).find("ul").eq(idx2));
								}
							});
						});
						
					}catch(e){
						$(".nav div").eq(idx).html("");
					};			
				})
			}
		});

		// 轮播图

		$('.lamp_lbt').lxCarousel({
			imgs:['./img/1450295955f4b5ae390.jpg','./img/1450575955f4d1d7f77.jpg',
				'./img/1451235955f4ebcfc0c.jpg','./img/17394259561c5ed549f.jpg','./img/17404459561c9c64f0c.jpg'],
			page:false,
			width:1200,
			height:600,
			type:'horizontal',
			seamless:true
		});

		//点击轮播图片跳转到列表页面；
		$(".lamp_lbt").on("click","img",function(e){
			location.href="./html/goodslist.html";

			//阻止浏览器默认行为；
			e.preventDefault();

		});

		//导航列表点击跳转列表页；
		$(".subnav").on("click","li",function(e){
			location.href="./html/goodslist.html";

			//阻止浏览器默认行为；
			e.preventDefault();
		});

		//点出登录
		$("#signin").click(function(){
			location.href="./html/login.html";
		});

		//点出注册；
		$("#signup").click(function(){
			location.href="./html/register.html";
		});

		//鼠标移到左上角的手机图标，出现APP下载二维码

		var timer;
		$(".app").mouseenter(function(){
			clearTimeout(timer);
			console.log(7777777777)
			$(".ewm").show();
			
		});
		$(".app").mouseleave(function(){
			timer = setTimeout(function(){
				$(".ewm").hide();
			},300);
		});

		//导航移入移出；
	
		$(".nav_list li").mouseenter(function(){	
			$(".subnav_list").eq($(this).index()).show().siblings().hide();
			// $(".header_nav_n .header_nav_sel").eq(thisIndex).show().siblings().hide()
		});

		$(".nav_list").mouseleave(function(){
			$(".subnav_list").hide();
		});

		//购物车点击结算跳转到购物车页面；
		$(".account").click(e=>{
			location.href = "html/car.html";
			e.preventDefault();
		});

		//生成已收藏商品；
		$.ajax({
			url:"./api/goods.php",
			dataType:"json",
			data:{qty:20},
			success:function(res){
				$ul = $("<ul/>");
				var html = res.data.map(function(item){

					return `
						<li class="col_pic" id=${item.id}>
							<a href="#">
								<img src="${item.imgurl}" alt="#" />
								<p>
									${item.brand}<br/>
									${item.name}
								</p>
								<div class="al_clo">已添加到收藏夹</div>
							</a>
						</li>
					`
				});
				$ul.html(html).appendTo($(".collected"));

				//生成已收藏商品轮播；
				var left = 0;
				var idx = 0;
				collect();
				function collect(){

					timer = setInterval(function(){
						idx++;
						left = -idx*$(".collected li").outerWidth(true);

						if(idx ==14){
							idx=0;
						}

						$(".collected ul").animate({left:left});

					},3000);
				}

				//点击上一张时；
				$(".collected").on("click",".cart_prev",function(){
					idx--;
					if(idx < 0){
						idx=14;
					}

					left = -idx*$(".collected li").outerWidth(true);
					$(".collected ul").animate({left:left});

				})
				//点击下一张时;
				.on("click",".cart_next",function(){
					idx++;
					if(idx > 14){
						idx=14;
					}
					left = -idx*$(".collected li").outerWidth(true);
					$(".collected ul").animate({left:left});
				})
				//鼠标移上去停止轮播；
				.on("mouseover",function(){

					clearInterval(timer);
				})
				//鼠标移开轮播继续；
				.on("mouseout",function(){
					collect();
				})
				//点击商品图片，跳转到详情页；
				.on("click","img",function(){
					var id = $(this).parents("li").attr("id");
					location.href = "./html/details.html?"+id;
				});


			}
		});

		//
	});
});
