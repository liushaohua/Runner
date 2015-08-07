/**
 * 主main
 * @copyright 银翼流量可视化平台
 * @author liushaohua
 * @email fe.liushaohua#gmail.com
 */
define(function(require) {
	'use strict';
	require('jQuery');
	//require('dep/jquery-ui-1.11.4/jquery-ui.js');
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
			var _this = this;
			//hashChange
			$(document).on("Runner/hashChange",function(){
				var hash = location.hash;
				$('.submenu li').removeClass('active');
				$('a[href="'+ hash +'"]').parent().addClass('active');
			});

			$('.dropdown-toggle').click(function () {
				var $li = $(this).parent();
				//$li.addClass('active').siblings().removeClass('active');
				$('.menu_wrap').slideUp();
				$(this).next().stop().slideDown();
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

			_this._select();
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
