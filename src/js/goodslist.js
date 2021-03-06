 /*
	首页js文件
 */
require(['config'],function(){
	require(['jquery','common'],function($,com){

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
		})


		//发送ajax请求生成导航列表；

		$.ajax({
			url:"../api/nav_list.json",
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
				});

				//商品列表点击显示隐藏；
				$(".list").on("click",".listItem",function(){
					//当前li显示隐藏；
					$(this).next(".listItem_b").toggle();

					//+,-号切换
					if($(this).next(".listItem_b").css("display") == "none"){
						$(this).find(".lt_state").html("+");

					}else if($(this).next(".listItem_b").css("display") == "block"){
						$(this).find(".lt_state").html("-")
					}

				});
			}
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

		//点击加入购物车；
		// 先获取cookie中的值
		var goodslist = com.getCookie('goodslist');

		// 如果没有cookie，则赋值空数组
		// 有cookie就转换成对象
		if(goodslist.length>0){
			goodslist = JSON.parse(goodslist);
		}else{
			goodslist = [];
		};

		//刷新页面自动加载购物车信息
		showGoods(goodslist);
		function showGoods(goodslist){

			//先清空购物车；
			$(".goods_buy").html("");	
			$ul = $("<ul/>");
			var total = 0;
			
			var $html = goodslist.map(function(item){

				//计算总价；				
				total += item.qty * item.price.match(/\d+\.\d+$/);

				return `
						<li class="single_goods clearfix" id=${item.id}>
							<div class="goods_url fl">
								<a href="#"><img src="${item.imgurl}" alt="" /></a>
							</div>
							<div class="goods_details fr">
								<p class="goods_brand">${item.brand}</p>
								<p class="goods_name">${item.name}</p>
								<p class="goods_price">
									<span>${item.price}</span>&nbsp;&nbsp;&nbsp;&times;
									<span class="goods_qty">${item.qty}</span>
								</p>
							</div>
							<div class="goods_delete">╳</div>
						</li>
				`
			});

			$(".goods_buy").html($ul.html($html));

			//显示购物车商品数量；
			$(".goodsnum").html(goodslist.length);

			//显示总价
			$(".total_price span").html(total.toFixed(2))

			//判断显示总价；
			if(goodslist.length == 0){
				$(".total_price").hide();
				$(".goods_emty").show();
				
			}else{
				$(".total_price").show();
				$(".goods_emty").hide();
			}
			
		}

		//点击添加到购物袋；
		$(".goodslist").on("click",".bigCar",function(){

			// 先获取cookie中的值
			var goodslist = com.getCookie('goodslist');

			// // 如果没有cookie，则赋值空数组
			// // 有cookie就转换成对象
			if(goodslist.length>0){
				goodslist = JSON.parse(goodslist);
			}else{
				goodslist = [];
			};
			// 先获取当前li
			// 同一个商品，只添加数量
			var $currentList = $(this).parent().parent();
			var currentGUID = $currentList.attr("id");

			// 遍历goodslist，查看是否存在相同商品
			// [{guid:'xx',qty:10}],[]
			var res = goodslist.filter(function(item){
				return item.id === currentGUID;
			});

			// 如果已存在，则数量+1
			if(res.length>0){
				res[0].qty++;
			}else{
				var item = {
					id:currentGUID,
					imgurl:$currentList.children($(".pic")).find($("img")).attr("src"),
					brand:$currentList.children($(".goodsname")).find($("span")).html(),
					name:$currentList.children($(".goodsname")).find($("i")).html(),
					price:$currentList.children($(".price")).find($("p")).html(),
					qty:1
				}

				// 往商品列表中添加当前商品信息
				goodslist.push(item);
			}

			//写入cookie;
			com.setCookie('goodslist',JSON.stringify(goodslist));

			//同时将数据写入购物袋；
			showGoods(goodslist);

		});

		//点出删除商品及cookie;
		$(".goods_buy").on("click",".goods_delete",function(){

			var currentId = $(this).parent().attr("id");
			
			//删除当前商品；
			$(this).parent().hide().remove();

			// 重新获取cookie中的值
			var goodslist = com.getCookie('goodslist');

			//转为json;
			goodslist = JSON.parse(goodslist);

			//遍历商品；
			goodslist.map(function(item,idx){

					console.log(currentId)
				//找出点击删除的商品；
				if(item.id === currentId){

					//删除商品；
					goodslist.splice(idx,1);
					console.log(currentId,goodslist);

					//显示购物车商品数量；
					$(".goodsnum").html(goodslist.length);

					//判断当前cookie没有商品时，隐藏去结算；
					if(goodslist.length == 0){
						$(".total_price").hide();
						$(".goods_emty").show();
						
					}else{
						$(".total_price").show();
						$(".goods_emty").hide();
					}
					
					// 重新写入cookie
					com.setCookie('goodslist',JSON.stringify(goodslist));

					// 更新价格		
					var _total = $(".total_price span").html();	
					_total -= item.qty * item.price.match(/\d+\.\d+$/);
					
					$(".total_price span").html(_total);	
				};


			});
		});

		//点出登录
		$("#signin").click(function(){
			location.href="./login.html";
		});

		//点出注册；
		$("#signup").click(function(){
			location.href="./register.html";
		});


		//导航移入移出；
	
		$(".nav_list li").mouseenter(function(){	
			$(".subnav_list").eq($(this).index()).show().siblings().hide();
			// $(".header_nav_n .header_nav_sel").eq(thisIndex).show().siblings().hide()
		});

		$(".nav_list").mouseleave(function(){
			$(".subnav_list").hide();
		});

		//点击返回顶部按钮事件
		$(".to_top").click(function(){
			$("body").animate({scrollTop:0},500);
		});

		//侧边栏移入显示二维码
		var timer_app;
		$(".phone_ewm").mouseover(function(){
			clearTimeout(timer_app);
			$(".consult_app").show();
		});
		$(".phone_ewm").mouseleave(function(){
			timer_app = setTimeout(function(){
				$(".consult_app").hide();
			},500)
		});

		//购物车点击结算跳转到购物车页面；
		$(".account").click(e=>{
			location.href = "./car.html";
			console.log(5555)
			e.preventDefault();
		})

		//发送ajax请求生成商品
		var pageNo = 1;
		// var lastPage = 1;
		$.ajax({
			url:"../api/goods.php",
			dataType:"json",
			data:{pageNo:pageNo,qty:8},
			success:function(res){
				console.log(res);
				//生成分页

				var pageLen = Math.ceil(res.total/res.qty);
				console.log(pageLen)
				$(".page").html("");
				$(".page").map(function(){
					for(var i = 1;i <= pageLen;i++){
						$span = $("<span/>");
						if(i===pageNo){
							$span.addClass("page_active");
						}
						$span.html(i).appendTo($(this));

					};
					
				})
			
				var $ul = $('<ul/>').addClass("clearfix");
				res.data.map(function(item,idx){
					console.log(item);
					try{
						$("<li/>").addClass("goods").html(`
							<div class="details" id=${item.id}>
								<div class="pic">
									<a href="#"><img src="${item.imgurl}" alt="" /></a>
								<div class="global">
									<div class="${item.global}"></div>
								</div>
								</div>
								<div class="goodsname">
									<a href="#">
										<span>${item.brand}</span><br/>
										<i>${item.name}</i>
									</a>
								</div>
								<div class="price">
									<p>${item.price}</p>
								</div>
								<div class="goodsCar">
									<div class="bigCar">加入购物袋</div>
								</div>
							</div>
						`).appendTo($ul);
					}catch(err){
						console.log(666)
					}			
				});

				$ul.appendTo($(".goodslist"));
				pageNo++;
			}
		});

		//点击分页显示；

		$(".page").on("click","span",function(){
			pageNo = $(this).html();
			$(this).index();

			//遍历上下显示相同页码；
			$(".page").map((idx,item)=>{
				$(item).find("span").eq($(this).index()).addClass("page_active").siblings("span").removeClass("page_active");
			})

			//点击发送ajax请求
			$.ajax({
				url:"../api/goods.php",
				dataType:"json",
				data:{pageNo:pageNo,qty:8},
				success:function(res){
					console.log(res);
					//清空ul的内容；
					$(".goodslist ul").html("");
					res.data.map(function(item){
						try{
							$("<li/>").addClass("goods").html(`
							<div class="details">
								<div class="pic">
									<a href="#"><img src="${item.imgurl}" alt="" /></a>
								</div>
								<div class="global">
									<div class="${item.global}"></div>
								</div>
								<div class="goodsname">
									<a href="#">
										<span>${item.brand}</span><br/>
										${item.name}
									</a>
								</div>
								<div class="price">
									<p>${item.price}</p>
								</div>
								<div class="goodsCar">
									<div class="bigCar">加入购物袋</div>
								</div>
							</div>
						`).appendTo($(".goodslist ul"));
						}catch(err){
							console.log(666)
						}			
					});
					//商品列表点击显示隐藏；
					// $(".list").on("click",".listItem",function(){
					// 	//当前li显示隐藏；
					// 	$(this).next(".listItem_b").toggle();

					// 	//+,-号切换
					// 	if($(this).next(".listItem_b").css("display") == "none"){
					// 		$(this).find(".lt_state").html("+");

					// 	}else if($(this).next(".listItem_b").css("display") == "block"){
					// 		$(this).find(".lt_state").html("-")
					// 	}

					// });
				}
			});
			
		});

		//点出商品图片，跳转到商品详情页；
		$(".goodslist").on("click","img",function(){
			console.log(999)
			var id = $(this).parents(".details").attr("id");

			//把当前商品id传到详情页；
			location.href = "details.html?"+ id;
		})
			
		//滚动时，列表到达顶部时定位；
		var height = $(".content_left").offset().top;
		$(window).on("scroll",function(){
			//滚动条高度；
			var scrollTop = $(window).scrollTop();
			// console.log((height-scrollTop));

			//下面页码的偏移高度；
		
			var _top = $(".page").eq(1).offset().top;
			var _owid = $(".content_left").outerHeight();

			var _result = _top - scrollTop;
	

			if(scrollTop >= height ){
				$(".content_left").addClass("content_fixed");
			}else{
				$(".content_left").removeClass("content_fixed");

			};

			//滚动到下面页码时，跟随页面滚动；
			if(_owid >= _result){
				$(".content_left").css({top:-(_owid - _result)});
			}
		})

/*		// 滚动更多，懒加载；
		$(window).on('scroll',function(){
			var scrollTop = $(window).scrollTop();
			var winHeight = $(window).height();
			var scrollHeight = $('html').outerHeight();

			// 如何判断滚动到最底部
			if(scrollTop >= scrollHeight - winHeight - 600){
				if(pageNo == lastPage) return;
					$.ajax({
						url:"../api/goodslist.php",
						dataType:"json",
						data:{pageNo:pageNo,qty:8},
						success:function(res){
							console.log(res);
							res.data.map(function(item){
								try{
									$("<li/>").addClass("goods").html(`
										<div class="details">
											<div class="pic">
												<a href="#"><img src="${item.imgurl}" alt="" /></a>
											</div>
											<div class="global ${item.true}"></div>
											<div class="goodsname">
												<a href="#">
													<span>${item.brand}</span><br/>
													${item.name}
												</a>
											</div>
											<div class="price">
												<p>${item.price}</p>
											</div>
										</div>
									`).appendTo($(".goodslist").find($("ul")));
								}catch(err){
									console.log(666)
								}			
							});
							pageNo++;
						}
					});

				// 更新lastPage
				lastPage = pageNo;
			}
		});*/

	});
});
