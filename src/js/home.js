/*
	首页js文件
 */
require(['config'],function(){
	require(['jquery','gdszoom','lxCarousel'],function(){

		/*
			轮播图
			var defaults = {
			width:810,//ok
			height:320,//ok
			autoPlay:true,//ok
			small:false,
			buttons:true,//ok
			page:true,//ok
			duration:3000,//ok
			index:0,//ok
			type:'vertical',//vertical,horizontal,fade,show
			seamless:false
		*/

		jQuery(function($){

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

			//鼠标移到左上角的手机图标，出现APP下载二维码
			var timer;
			$(".app").mouseenter(function(){
				console.log(999)
				// clearTimeout(timer);
				$("<div/>").html(`<a href="#"><img src="./img/down_app.png" alt="下载APP二维码" /><span>扫码下载</span></a>`).addClass("ewm").appendTo($(".app"));
			}).mouseleave(function(){
				console.log(888)
				// timer = setTimeout(function(){console.log(777)
				// },500);
					$(".app").find(".ewm").remove();
				
			})
		});
	});
});
