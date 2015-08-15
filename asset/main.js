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
	try{
		require('niceScroll');
	}catch(e){}

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
    });
	router.start('/home/');

	cPage = {
		init : function () {
			var _this = this,
				$drop_togo_btn = $('.dropdown-toggle');
			/**
			 * hashChange
			 */
			$(document).on("Runner/hashChange",function(){
				var hash = location.hash;
				$('.submenu li').removeClass('active');
				$('a[href="'+ hash +'"]').parent().addClass('active');
			});

			$('body').niceScroll({
				cursorcolor:"#489bd3",
				cursorborder: '1px solid #489bd3',
				zIndex:3
			});

			$drop_togo_btn.click(function () {
				var $this = $(this),
					$li = $this.parent(),
					$next = $this.next();

				$('.dropdown-toggle .icon_cur').removeClass('icon_up').addClass('icon_down');
				$this.find('.icon_cur').removeClass('icon_down').addClass('icon_up');

				if ($next.is(':hidden')) {
					$('.menu_wrap').slideUp();
					$next.stop().slideDown();
				}
			});

			var $show_bar = $('.side_show'),
				$hide_bar = $('.side_hide'),
				$main = $('#main'),
				$fix_logon = $('.fix_logo'),
				$logo = $('.logo'),
				$p_info = $('.p_info');

			$hide_bar.click(function () {
				$('.left_bar').animate({'left': -223});
				$show_bar.css('left',240).add($fix_logon).fadeIn(1000);
				$main.animate({'margin-left': 74});
				//$('.select_wrap').appendTo($('.select_bar'));
			});

			$show_bar.click(function () {
				$('.left_bar').animate({'left': 0});
				$show_bar.hide().css('left',0);
				$fix_logon.fadeOut(500);
				$main.animate({'margin-left': 223});
			});

			$('.right_gap').click(function (ev) {
				var ev = ev || window.event;
				$p_info.fadeIn(500);
				ev.stopPropagation();
			});

			$(document).click(function () {
				$p_info.fadeOut(500);
			});

			var breath = [];

			breath[0] = function() {
				$logo.fadeTo(1000, 0.4, function() {
					breath[1]();
				});
			};

			breath[1] = function() {
				$logo.fadeTo(2000, 1, function() {
					breath[0]();
				});
			};

			breath[1]();
		},
		_select: function () {
			$('.menu-btn').click(function () {
				var $this = $(this),
					_position = $this.position(),
					$select_w = $this.next('.select_w');
				$select_w.css({'left': _position.left, 'top': _position.top + $this.height()}).slideDown(500);
			});
		}
	};
	cPage.init();
});
