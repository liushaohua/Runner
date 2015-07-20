/**
 * 主main
 * @copyright 银翼流量可视化平台
 * @author liushaohua
 * @email fe.liushaohua#gmail.com
 */
define(function(require) {
	'use strict';
	require('jQuery');
    var router = require('router'),
		$ = jQuery,cPage = {};
		window.EchartsCof = require('common/MyEcharts');

	router.registerRouter({
		path: '/home/',
		type: 'home/index'
	});

	router.registerRouter({
		path: '/tool/',
		type: 'home/index'
	});

    router.registerRouter({
        path: '/info/',
        type: 'info/index'
    })
	router.start('/home/');

	cPage = {
		init : function () {

		}
	};
	cPage.init();
	//hashChange
	$(document).on("Runner/hashChange",function(){
		var hash = location.hash;
		$('a[href="'+ hash +'"]').addClass('active').siblings().removeClass('active');
	});
});
