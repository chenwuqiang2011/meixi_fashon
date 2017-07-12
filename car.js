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

				var $ul = $('<ul/>');
				res.data.map(function(item,idx){
				
					if(idx%2 == 0){
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
							
						}			
					}
				});
				$ul.appendTo($(".like_list"));
			}
		});


		//购物车商品；
		showGoods();

		//cookie生成商品函数；
		function showGoods(change){

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
			goodslist.map(function(item,idx){

				//截取价格；
				price = item.price.match(/\d+\.\d+$/);

				//计算每个商品总价；
				total = (item.qty*price).toFixed(2);

				//商品数量更新标识；
				if(change == 1){

					//更新单个商品总价；
					$(".goods_single").eq(idx).html(total);
					
					//如果商品没有被选中，则减去相应的价格，然后再写到页面；
					if(!$(".goods_check").eq(idx).prop("checked")){

						//商品总价；
						total = 0;

						//商品数量为0;
						item.qty = 0;

						//相应的商品数量也为0;
					}
				
				}

				//商品数量总数；
				total_num += item.qty;	

				//更新单个商品的数量
				$(".total_num").html(total_num);

				//商品总价；
				total_price += Number(total);

				try{
					$("<tr/>").attr("id",item.guid).html(`
						<td class="rel">
							<input type="checkbox" class="goods_check" checked/>
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

			//商品数量更新标识；
			if(change == 1){

				//更新总价格；
				$(".total_price").html(total_price.toFixed(2));

			}else{
				
				//再次更新购物车前先清空内容；
				$(".goodsList").html("");
				//添加到页面
				$table.appendTo($(".goodsList"));

				//显示第个商品的数量
				$(".total_num").html(total_num);
				$(".total_price").html(total_price.toFixed(2));
			}
		};

		//改变商品数量，并写入cookies函数；
		function change(currentId,num){
			//当前cookie商品数量减1；
			var goodslist = com.getCookie("goodslist");
			goodslist = JSON.parse(goodslist);

			//遍历cookie，找到相同的商品；
			var res = goodslist.filter(function(item){
				return item.guid === currentId;
			});

			//删除商品标识；
			if(num == 0){
				goodslist.forEach(function(goods,idx){
					// 判断cookie中是否存在当前商品
					// 存在则删除
					if(goods.guid === currentId){
						goodslist.splice(idx,1);
					}
				});
			}else{
				//改变商品的数量
				res[0].qty = num;
			}

			//将改变之后的数量写入cookie；
			console.log(goodslist);
			com.setCookie('goodslist',JSON.stringify(goodslist));

			//商品数量更新标识；
			var change = 1;
			
			//调用函数改变价格；
			showGoods(change);
		}

		//点击减少按钮，商品数量减1；
		$(".tableList").on("click",".num_jian",function(e){

			//获取当前商品id;
			var currentId = $(this).parents("tr").attr("id");
			
			//获取当前数量；
			var _num_jian = $(this).siblings("input").val();
			if(_num_jian > 1){
				_num_jian--;
				//如果数量大于1，则减1
				$(this).siblings("input").val(_num_jian);

				//调用写入cookie函数；
				change(currentId,_num_jian);
			};

			//阻止浏览器默认行为；
			e.preventDefault();

		})
		//点击增加按钮，商品数量+1；
		.on("click",".num_jia",function(e){

			//获取当前商品id;
			var currentId = $(this).parents("tr").attr("id");

			//获取当前数量；
			var _num_jia = $(this).siblings("input").val();

			//数量加1;
			_num_jia++;
			$(this).siblings("input").val(_num_jia);

			//调用写入cookie函数；
			change(currentId,_num_jia);

			//阻止浏览器默认行为；
			e.preventDefault();

		})
		//点击删除按钮，删除当前商品；
		.on("click",".goods_delete",function(e){
			//获取当前商品id;
			var currentId = $(this).parents("tr").attr("id");

			//删除当前商品；
			$(this).parents("tr").hide().remove();

			//定义要删除的商品数量为0；作为标识符使用；
			var num = 0;
			//调用写入cookie函数；
			change(currentId,num);

			//阻止浏览器默认行为；
			e.preventDefault();

		})

		//商品显示选中的总价；
		.on("click",".goods_check",function(){

			//如果有商品被取消，则全选按钮被取消；
			$(".goods_check").each(function(idx,item){
				
				if(!item.checked){console.log(111)

					//上下两个全选按钮同时被取消；
					$(".allCheck").prop("checked",false);

					return false;
				}

				//上下两个全选按钮同时被选中；
				$(".allCheck").prop("checked",true);

			});

			//商品数量更新标识；
			var change = 1;
			
			//调用函数改变价格；
			showGoods(change);
		});

		//点击全选按钮；
		$(".container").on("click",".allCheck",function(){
			
			if($(this).prop("checked")){

				//全选时，所有商品被选中；
				$(".goods_check").prop("checked",true);

				//上下两个全选按钮同时被选中；
				$(".allCheck").prop("checked",true);
			}else{
				//全选取消时，所有商品被取消；
				$(".goods_check").prop("checked",false);

				//上下两个全选按钮同时被取消；
				$(".allCheck").prop("checked",false);
			};

			//商品数量更新标识；
			var change = 1;
			
			//调用函数改变价格；
			showGoods(change);
		});

		//点击继续购物按钮事件；
		$(".go_on_buy ").click(function(e){

			//跳转到商品列表页面；
			location.href = "goodslist.html";

			//阻止浏览器默认行为；
			e.preventDefault();

		});

		//商品加入购物车；
		// $(".like_list").on("click",".bigCar",function(){

		// 	// 先获取cookie中的值
		// 	var goodslist = com.getCookie('goodslist');

		// 	// 如果没有cookie，则赋值空数组
		// 	// 有cookie就转换成对象
		// 	if(goodslist.length>0){
		// 		goodslist = JSON.parse(goodslist);
		// 	}else{
		// 		goodslist = [];
		// 	};

		// 	// 先获取当前li
		// 	// 同一个商品，只添加数量
		// 	var $currentList = $(this).parent().parent();
		// 	var currentGUID = $currentList.attr("id");

		// 	// 遍历goodslist，查看是否存在相同商品
		// 	// [{guid:'xx',qty:10}],[]
		// 	var res = goodslist.filter(function(item){
		// 		return item.guid === currentGUID;
		// 	});

		// 	// 如果已存在，则数量+1
		// 	if(res.length>0){
		// 		res[0].qty++;
		// 	}else{
		// 		var item = {
		// 			guid:currentGUID,
		// 			imgurl:$currentList.children($(".pic")).find($("img")).attr("src"),
		// 			brand:$currentList.children($(".goodsname")).find($("span")).html(),
		// 			name:$currentList.children($(".goodsname")).find($("i")).html(),
		// 			price:$currentList.children($(".price")).find($("p")).html(),
		// 			qty:1
		// 		}

		// 		// 往商品列表中添加当前商品信息
		// 		goodslist.push(item);
		// 	}

		// 	//写入cookie;
		// 	com.setCookie('goodslist',JSON.stringify(goodslist));

		// 	//同时将数据写入购物袋；
		// 	showGoods(goodslist);
		// })
	});
});
