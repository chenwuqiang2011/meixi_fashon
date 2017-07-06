// 配置
// 依赖
require.config({
	// baseUrl:''
	paths:{
		jquery:'../lib/jquery3.1.1',
		gdszoom:'../lib/jquery-gdsZoom/jquery.gdsZoom',
		lxCarousel:'../lib/jquery.lxCarousel/jquery.lxCarousel'
	},
	shim:{
		// gdszoom依赖jquery
		gdszoom:['jquery'],
		lxCarousel:['jquery']
	}
});