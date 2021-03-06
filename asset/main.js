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

	var routerObj = {
		'/pvuv/': 'home/index',
		'/click/': 'home/index',
		'/jump/': 'home/index',
		'/viewout/': 'home/index',
		'/newusers/': 'home/index',
		'/2weeks/': 'home/index',
		'/3weeks/': 'home/index',
		'/faith/': 'home/index'
	};

	registerRouter(routerObj);

	function registerRouter(obj) {
		for (var i in obj) {
			router.registerRouter({
				path: i,
				type: obj[i]
			});
		}
	}

	router.start('/pvuv/');

	cPage = {
		init : function () {
			var _this = this,
				$drop_togo_btn = $('.dropdown-toggle'),
				$select_bar = $('.select_bar');
			/**
			 * hashChange
			 */
			$(document).on("Runner/hashChange",function(){
				var hash = location.hash,
					$hashDom = $('a[href="'+ hash +'"]'),
					$date_query = $('.date_query');

				$('.submenu li').removeClass('active');
				$hashDom.parent().addClass('active');
				$('.menu_wrap').hide();
				$hashDom.parents('.menu_wrap').show();

				var hashTable = {
					'#/pvuv/': 'pvuv,|pv',
					'#/click/': 'click,|click_times',
					'#/jump/': 'jump,|jump_times',
					'#/viewout/': 'viewout,|viewout_times',
					'#/newusers/': 'newusers,|pv',
					'#/2weeks/': '2weeks,|click_times',
					'#/3weeks/': '3weeks,|jump_times',
					'#/faith/': 'faith,|viewout_times'
				},
				hashStr = hashTable[hash].split('|');

				window.hashMethod = {
					index_type: hashStr[0],
					value_name: hashStr[1]
				};

				//用户构成-月数据置灰
				var gray_Index = {
					'#/newusers/': 1,
					'#/2weeks/': 1,
					'#/3weeks/': 1,
					'#/faith/': 1
				};
				if (gray_Index[hash]) {
					$date_query.find('a[value="month"]').addClass('gray');
				} else {
					$date_query.find('a').removeClass('gray');
				}

				$('.menu-btn').each(function (i, v) {
					var $this = $(this);
					$this.find('span').html($this.attr('value'));
				});
			});

			$('.submenu a').click(function () {
				var $this = $(this),
					$href = $this.attr('href');
				window.setPlatform = true;
				$select_bar.fadeIn(500);
				$('.fix_select').empty();
				if (!$select_bar.find('.select_wrap').length) {
					$('.select_wrap').appendTo($select_bar);
				}

			});

			$('.p_name').html(sessionStorage._user);

			//logot
			$('.out').click(function () {
				sessionStorage.removeItem('_user');
				window.location.reload();
			});

			require(['niceScroll'],function () {
				$('body').niceScroll({
					cursorcolor:"#489bd3",
					cursorborder: '1px solid #489bd3',
					zIndex:3
				});
				$(document).scroll(function() {
					if ($('.dropdown')[0]) {
						var left = $('.dropdown').offset().left;
						if (left < 200) {
							$('.dropdown').hide();
							$(document).click();
						}
					}
				});
			});

			$drop_togo_btn.click(function () {
				var $this = $(this),
					$li = $this.parent(),
					$next = $this.next();

				$('.dropdown-toggle .icon_cur').removeClass('icon_up').addClass('icon_down');

				if ($next.is(':hidden')) {
					$('.menu_wrap').slideUp();
					$next.stop().slideDown();
					$this.find('.icon_cur').removeClass('icon_down').addClass('icon_up');
				} else {
					$this.next().slideUp();
				}
			});

			var $show_bar = $('.side_show'),
				$hide_bar = $('.side_hide'),
				$main = $('#main'),
				$fix_logon = $('.fix_logo'),
				$fix_select = $('.fix_select'),
				$logo = $('.logo'),
				$p_info = $('.p_info');

			$hide_bar.click(function () {
				window.Max = true;
				var $select_wrap = $('.select_wrap');
				$('.left_bar').animate({'left': -223});
				$fix_select.fadeIn(1000);
				$show_bar.css('left',226).add($fix_logon).fadeIn(1000);
				$('.select_wrap').fadeOut(500);
				$main.animate({'margin-left': 74},500, function() {
					$select_bar.fadeIn(500);
					$select_wrap.appendTo($fix_select);
					if ($select_wrap.length > 1) {
						$select_wrap.eq(1).remove();
					}
					$select_wrap.fadeIn(500);

					$('.top_bar').addClass('active');
					doubleCharts();
				});
			});

			$show_bar.click(function () {
				window.Max = false;
				$('.left_bar').animate({'left': 0});
				$fix_select.hide();
				$show_bar.hide().css('left',0);
				$fix_logon.fadeOut(500);
				//$fix_select.appendTo($select_bar);
				$('.select_wrap').appendTo($select_bar);
				$main.animate({'margin-left': 223});
				doubleCharts();
			});

			function doubleCharts () {
				if (window.echartType == 'PieLine') {
					$('.query_wrap').find('[value="时段"]').click();
				}
			}

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
