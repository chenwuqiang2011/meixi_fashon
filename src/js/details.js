 /*
	首页js文件
 */
require(['config'],function(){
	require(['jquery','common','gdszoom'],function($,com){

		// 获取商品数据，并写入页面
		var id = location.search.substring(1);
		console.log(id);
		$.ajax({
			url:"../api/goods.php",
			dataType:"json",
			data:{id:id},
			success:function(res){console.log(res);

				var str = res.size.slice(1,-1);
				var _str =str.replace(/"/gi,"");
				var arr = _str.split(",");
				
				console.log(arr,res.size);

				//遍历尺码；
				var html = arr.map(function(item,idx){
					return `
						<div id=${idx} class="size fl">${item}</div>
					`
				}).join("");

				//截取价格；
				var price = res.price.match(/\d+\.\d+$/);

				//写到页面；
				$("<div/>").addClass("allDetails").html(`
					<div class="details_fl fl clearfix">
						<div class="small_img"></div>
						<div class="nor_img">
							<img src="${res.imgurl}" data-big="${res.imgurl}" />
						</div>
					</div>
					<div class="details_fr fl">
						<h1><a href="#"/>${res.brand}</a></h1>
						<div class="details_name">${res.name}</div>
						<div class="details_price clearfix"><span class="price_l fl">美西价&nbsp;&nbsp;&nbsp&nbsp;</span><span class="details_l price_b fl">￥${price}</span></div>
						<div class="details_color clearfix"><span class="price_l fl">颜色&nbsp;&nbsp;&nbsp</span><span class="details_l fl">${res.color}</span></div>
						<div class="details_size clearfix">
							<div class="allSize fl">尺码</div>
							<div class="size_num fl clearfix">${html}</div>
						</div>
						<p><a href="#">查看尺码要求</a></p>
						<div class="details_buy clearfix">
							<div class="buy_now fl"><a href="#">即刻购买</a></div>
							<div class="atc fl"><a href="#">加入购物车</a></div>
							<div class="details_share fr clearfix">
								<a href="#" class="collect "></a>
								<div class="share"></div>
							</div>
						</div>
						<div class="arrive">
							<span class="arrive_time">到货时间</span><span>该商品到货时间预计5-10个工作日<span>
						</div>
					</div>
				`).appendTo($(".details"));

				// 放大镜引用；获宽高；
				$width = $('.nor_img img').width();
				$height = $('.nor_img img').height();

				$('.nor_img').gdsZoom({width:$width,height:$height,gap:20});

				//默认选中第一个尺码；
				$(".size").first().addClass("active");

				//点出切换；
				$(".size_num").on("click",".size",function(){
					$(this).addClass("active").siblings(".size").removeClass("active");
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
				$(".details_buy").on("click",".atc",function(){

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
					
					var currentGUID = id;

					// 遍历goodslist，查看是否存在相同商品
					// [{guid:'xx',qty:10}],[]
					var data = goodslist.filter(function(item){
						return item.id === currentGUID;
					});

					// 如果已存在，则当前商品添加数量属性且值为1；
					if(data.length>0){
						data[0].qty++;
					}else{		
						res.qty=1;
						// 往商品列表中添加当前商品信息
						goodslist.push(res);
					}

					//写入cookie;
					com.setCookie('goodslist',JSON.stringify(goodslist));

					//同时将数据写入购物袋；
					showGoods(goodslist);

				});

				//点出删除商品及cookie;
				$(".goods_buy").on("click",".goods_delete",function(){
					
					//删除当前商品；
					$(this).parent().hide().remove();

					// 重新获取cookie中的值
					var goodslist = com.getCookie('goodslist');

					//转为json;
					goodslist = JSON.parse(goodslist);

					//遍历商品；
					goodslist.map(function(item,idx){

						//找出点击删除的商品；
						if(item.id === id){
							

							//删除商品；
							goodslist.splice(idx,1);
							console.log(goodslist);

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

					//购物车点击即刻购买跳转到购物车页面；
				$(".buy_now").click(e=>{
					location.href = "./login.html";
					
					e.preventDefault();
				});		
			}
			
		});


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

		//商品详情点击切换；
		$(".details_tab").on("click","li",function(){
			$(this).addClass("tab_active").siblings("li").removeClass("tab_active");
		})

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
			e.preventDefault();
		});

	

	});
});
