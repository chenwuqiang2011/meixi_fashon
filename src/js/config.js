// 配置
// 依赖
require.config({
	// baseUrl:''
	
    urlArgs: new Date().getTime(),
    
	paths:{
		jquery:'../lib/jquery3.1.1',
		gdszoom:'../lib/jquery-gdsZoom/jquery.gdsZoom',
		lxCarousel:'../lib/jquery.lxCarousel/jquery.lxCarousel',
		validate:'../lib/jquery-validate/jquery.validate',
		common:'common'
	},
	shim:{
		// gdszoom依赖jquery
		gdszoom:['jquery'],
		lxCarousel:['jquery'],
		validate:['jquery']
	}
});