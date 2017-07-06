;(function($){
	// $.prototype.lxCarousel = function(options){
	$.fn.lxCarousel = function(options){

		// 默认参数
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
		}

		// var opt = Object.assign({},defaults,options);
		var opt = $.extend({},defaults,options);


		return this.each(function(idx,ele){
			var $self = $(ele);

			var len = opt.imgs.length;

			// 添加特定类名
			$self.addClass('lxCarousel');

			// 定义宽高
			$self.css({
				width:opt.width,
				height:opt.height
			})

			// 生成大图
			var $ul = $('<ul/>');

			$.each(opt.imgs,function(idx,url){
				$('<li/>').css({height:opt.height,width:opt.width}).html(`<a href="#"><img src="${url}"></a>`).appendTo($ul);
			});

			$ul.appendTo($self);

			//无缝滚动；
			if(opt.seamless){
				//克隆第一张图片添加到ul最后；
				$ul.children().first().clone().appendTo($ul);
				//图片数量+1，index+1；
				// len++;

			}
			// 水平排列
			if(opt.type === 'horizontal'){

				//无缝判断；
				if(opt.seamless){
					$ul.width(opt.width*(len + 1));
				}else{
					$ul.width(opt.width*len);
				}
				$ul.addClass('horizontal');
			}


			// 默认显示图片
			var index = opt.index;
	
			// 生成分页
			if(opt.page){
				var $page = $('<div/>').addClass('page');
				for(var i=1;i<=len;i++){
					var $span = $('<span/>').text(i);

					// 给第一个span添加高亮
					if(i==index+1){
						$span.addClass('active');
					}
					$span.appendTo($page);
				}
				$page.appendTo($self);
			}
			


			// 前后按钮
			if(opt.buttons){
				$('<div/>').addClass('prev').html('&lt;').appendTo($self);
				$('<div/>').addClass('next').html('&gt;').appendTo($self);
			}
			
			$self.on("mouseover",function(){
				$self.find(".prev").show();
				$self.find(".next").show();
			}).on("mouseout",function(){
				$self.find(".prev").hide();
				$self.find(".next").hide();
			});

			var timer;

			// 上一页下一页
			$self.on('click','.prev',function(){
				index--;
				showPic();
			}).on('click','.next',function(){
				index++;
				showPic();
			})

			// 移入移出
			.on('mouseenter',function(){
				clearInterval(timer);
			}).on('mouseleave',function(){
				timer = setInterval(autoPlay,opt.duration);
			})


			// 点击页码
			.on('click','.page span',function(){
				index = $(this).index();
				showPic();
			})

			// 自动轮播
			if(opt.autoPlay){
				$self.trigger('mouseleave');
			}

			function autoPlay(){
				index++;
				showPic();
			}

			function showPic(){

				//无缝滚动；
				if(opt.seamless){
					// index++;
					if(index == len){
						index = len;
					}
				}else{
					// 到达最后一张时，重新回到第一张
					if(index > len-1){
						index = 0;
					}else if(index<0){
						index = len-1;
					}
				}

				// 滚动显示每一张图片
				var obj;

				if(opt.type === 'horizontal'){

					//无缝滚动判断；
					if(index > len){
						
						//立刻滚到第一张，即left值为0；
						$ul.css("left",0);
						obj = {left:-opt.width};


						//同时重置index为1,即从2开始；
						index = 1;
					}else{
						obj = {left:-index*opt.width};
						
					}
				}else{
					//无缝滚动判断；

					if(index > len){
						obj = {top:-opt.height};

						//立刻滚到第一张，即left值为0；
						$ul.css("top",0);

						//同时重置index为1,即从2开始；
						index = 1;
					}else{
						obj = {top:-index*opt.height};
					}
					
				}

				$ul.stop().animate(obj);

				// 高亮分页
				if(opt.page){
					if(opt.seamless && index == len){
						$page.children().eq(0).addClass('active').siblings().removeClass();
					}
					$page.children().eq(index).addClass('active').siblings().removeClass();
				}
			}
		});

		// return this;
	}

	// $.fn.lxTab = function(){}
	// $.fn.lxPopover = function(){}

	// 系列插件
	// $.fn.extend({
	// 	lxCarousel:function(){},
	// 	lxPopover:function(){},
	// 	lxTab:function(){}
	// });

	// 全局插件
	// $.lxTab = function(){

	// }

	// 系列插件
	// $.extend({
	// 	lxCarousel:function(){},
	// 	lxPopover:function(){},
	// 	lxTab:function(){}
	// });

	// $.lxTab()
})(jQuery);


//$('#lbt').lxCarousel();