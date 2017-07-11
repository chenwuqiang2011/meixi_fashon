/*
	首页js文件
 */
require(['config'],function(){
	require(['jquery','common'],function($,com){

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

		//导航移入移出；
		$(".nav_list li").mouseenter(function(){	
			console.log(999)
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

		//生成喜欢的商品数据；
		$.ajax({
			url:"../api/goodslist.php",
			dataType:"json",
			success:function(res){
				console.log(res);

				var $ul = $('<ul/>');
				res.data.map(function(item,idx){
					if(idx/2 == 0){
						try{
							$("<li/>").addClass("goods fl").html(`
								<div class="details" id=goods${idx}>
									<div class="pic">
										<a href="#"><img src="${item.imgurl}" alt="" /></a>
									</div>
									<div class="global">
										<div class="${item.true}"></div>
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
					}
				});
				$ul.appendTo($(".like_list"));
			}
		});


		//购物车商品；
		showGoods();

		//cookie生成商品函数；
		function showGoods(){

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

			$table = $("<table/>").addClass("tableList");

			//定义总价格
			var total_price = 0;

			//定义商品的数量；
			var total_num = 0;
			goodslist.map(function(item){
				console.log(item.guid)

				//截取价格；
				price = item.price.match(/\d+\.\d+$/);

				//计算每个商品总价；
				total = (item.qty*price).toFixed(2);

				//商品总价；
				total_price += Number(total);

				//商品数量总数；
				total_num += item.qty;
				try{
					$("<tr/>").html(`
						<td class="rel" id=${item.guid}>
							<input type="checkbox" class="goods_check"/>
							<div class="car_goods_pic fl">
								<a href="#"><img src="${item.imgurl}" alt="" /></a>
							</div>
							<div class="car_goods_details fr">
								<p class="goods_brand">${item.brand}</p>
								<p class="goods_name">${item.name}</p>
						
							</div>
						</td>	
						<td>
							<div class="car_goods_price">￥&nbsp;${price}</div>
						</td>	
						<td>
							<div class="car_goods_num">
								<div>
									<a class="num_jian" href="#">-</a>
									<input type="text" value= "${item.qty}" />
									<a class="num_jia" href="#">+</a>
								</div>
							</div>
						</td>	
						<td>
							<div class="car_goods_total"><div>￥&nbsp;<span class="goods_single">${total}</span></div></div>
						</td>	
						<td>
							<div class="car_goods_del">
								<a href="#">加入收藏</a><br />
								<a href="#" class="goods_delete">删除</a>
							</div>
						</td>	
					`).appendTo($table);
					
				}catch(err){}
			});

			//添加到页面
			$table.appendTo($(".goodsList"));

			//显示第个商品的数量
			$(".total_num").html(total_num);
			$(".total_price").html(total_price.toFixed(2));
		}

		//点击减少按钮，减少一个商品；
	/*	$(".tableList").on("click",".num_jian",function(e){

			//获取当前数量；
			var _num_jian = $(this).siblings("input").val();
			if(_num_jian > 1){
				_num_jian--;
				//如果数量大于1，则减1
				$(this).siblings("input").val(_num_jian);
			};

			//单个商品单价；
			var sin_price = $(this).parents("td").next().find(".goods_single").html();
			console.log(sin_price);

			//单个商品改变总价；
			$(this).parents("td").next().find(".goods_single").html((sin_price*_num_jian).toFixed(2));

			//阻止浏览器默认行为；
			e.preventDefault();

		}).on("click",".num_jia",function(e){

			//获取当前数量；
			var _num_jia = $(this).siblings("input").val();

			//数量加1;
			_num_jia++;
			$(this).siblings("input").val(_num_jia);

			//阻止浏览器默认行为；
			e.preventDefault();
			console.log($(this))
		})
*/
		//点击减少按钮，减少一个商品；
		$(".tableList").on("click",".num_jian",function(e){
			//获取当前数量；
			var _num_jian = $(this).siblings("input").val();
			if(_num_jian > 1){
				_num_jian--;
				//如果数量大于1，则减1
				$(this).siblings("input").val(_num_jian);

				//当前cookie商品数量减1；

			};

			//阻止浏览器默认行为；
			e.preventDefault();

		}).on("click",".num_jia",function(e){

			//获取当前数量；
			var _num_jia = $(this).siblings("input").val();

			//数量加1;
			_num_jia++;
			$(this).siblings("input").val(_num_jia);

			//阻止浏览器默认行为；
			e.preventDefault();
			console.log($(this))
		});
	});
});
