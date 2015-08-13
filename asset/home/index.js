/**
 * 页面加载主包装函数
 */
define(function(require) {
	var home = {};
    home.template = require('text!./index.html');

	/**
	 * 在页面渲染之前执行，获取数据beforeRender
	 */
    home.beforeRender = function() {};

	/**
	 * 在页面渲染之后执行函数
	 */
    home.initBehavior = function() {
		$(document).trigger('Runner/hashChange');
		$('.top_bar').animate({'margin-left':0},500);
		/**
		 * Render图表渲染主函数
		 */
		var Render = {
			init: function () {
				var _this = this;
				this.render_nav().setDate().set_method().getServer(this.echarts_type['default']);
				$(document).click(function () {
					$('.dropdown').fadeOut(300);
				});
			},
			Method: {
				'time_type':'day',
				'ds':'20150811',
				'biz_name':'ershouche',
				'index_type': 'cate1_name',
				'value_name': 'pv'
				},
			screen: window.config.screen,
			dictionary: window.config.dictionary,
			echarts_type: window.config.echarts_type,
			_dropdown: function (type, offset) {
				$('.dropdown').remove();
				var _this = this,
					init = function () {
					var cHtml = '',
						aLi = '',
						list = _this.screen[type],
						oldIndex = 0;

					if (!list) return;
					for (var i = 0, len = list.length; i < len; i++) {
						list[i]['state'] && (oldIndex = i);
						aLi += '<li value="'+ list[i]['value'] +'" class="'+ (list[i]['state'] ? 'active': '') +'"><a href="javascript:;">'+ list[i]['text'] +'</a></li>';
					}

					cHtml += '<div class="dropdown">'
						  +      '<ul>'
						  +          aLi
						  +      '</ul>'
					      +  '</div>';
					$('body').append(cHtml);
					$('.dropdown').css({'left': offset.left, 'top': offset.top + 37});

					$('.dropdown li').click(function () {
						var $this = $(this);
						$this.addClass('active').siblings().removeClass('active');
						_this.screen[type][oldIndex].state = 0;
						_this.screen[type][$this.index()].state = 1;
						_this.dictionary[type] && (_this.Method[_this.dictionary[type]] = $this.attr('value'));
						_this.getServer(_this.echarts_type[type]);
					});
				};
				return {
					init: init
				};
			},
			getServer: function (type) {
				var _this = this,
					option;
				console.log('getServer',_this.Method);

				$.ajax({
					url: 'http://10.59.10.123/',
					type: 'post',
					async: true,
					data: _this.Method,
					dataType: 'json',
					success: function(data, textStatus) {
						console.log(data);
						//_this.render_charts(type, data);
						Render.chartsData.myCharts.dom.hideLoading();
					},
					error : function() {
						try{
							Render.chartsData.myCharts.dom.hideLoading();
						}catch(e){}
					}
				});
				if (type == 'line') {
					option = [{
						name:'周一',
						group:'最高气温',
						value:120
					},{
						name:'周二',
						group:'最高气温',
						value:132
					},{
						name:'周三',
						group:'最高气温',
						value:101
					},{
						name:'周四',
						group:'最高气温',
						value:134
					},{
						name:'周五',
						group:'最高气温',
						value:90
					},{
						name:'周六',
						group:'最高气温',
						value:230
					},{
						name:'周日',
						group:'最高气温',
						value:210
					},{
						name:'周一',
						group:'最低气温',
						value:220
					},{
						name:'周二',
						group:'最低气温',
						value:182
					},{
						name:'周三',
						group:'最低气温',
						value:191
					},{
						name:'周四',
						group:'最低气温',
						value:234
					},{
						name:'周五',
						group:'最低气温',
						value:290
					},{
						name:'周六',
						group:'最低气温',
						value:330
					},{
						name:'周日',
						group:'最低气温',
						value:310
					}];
				} else if (type == 'TreeMap' || type == 'Map' || type == 'PieLine' || type == 'PiePage' || type == 'PieDouble'  || type == 'Browser') {
					option = {
						'2002-01-01': [{
							name:'北京',
							group: '最高气温',
							value:11
						},{
							name:'天津',
							group: '最高气温',
							value:11
						},{
							name:'新疆',
							group: '最高气温',
							value:15
						},{
							name:'北京',
							group: '最低气温',
							value:8
						},{
							name:'天津',
							group: '最低气温',
							value:7
						},{
							name:'新疆',
							group: '最低气温',
							value:6
						}],
						'2003-01-01': [{
							name:'北京',
							group: '最高气温',
							value:15
						},{
							name:'天津',
							group: '最高气温',
							value:11
						},{
							name:'新疆',
							group: '最高气温',
							value:14
						}]
					};
					//PieDouble需要最低气温，其他的不需要

				}
				_this.render_charts(type, option);
				return _this;
			},
			render_charts: function (type, data) {
				var cOption;
				if (type == 'line') {
					cOption = EchartsCof.ChartOptionTemplates.Lines(data,'hellow-cookie',false, {
						'title': '未来一周气温变化-ga'
					});
				} else if (type == 'Browser') {
					cOption = EchartsCof.ChartOptionTemplates.Browser(data,'hellow-cookie',false, {
						'hasTime' : 1,
						'title': '未来一周气温变化-ga'
					});
				} else {
					cOption = EchartsCof.ChartOptionTemplates[type](data,'hellow-cookie', true, {
						'hasTime' : 1,
						'title': '未来一周气温变化-aa'
					});
				}console.log(JSON.stringify(cOption));
				/**
				 * echarts加载数据对象，渲染图表
				 */
				this.chartsData.myCharts.dom.clear();
				this.chartsData.myCharts.dom.setOption(cOption);
				this.chartsData.myCharts.data = cOption;
			},
			setDate : function () {
				var _this = this;
				$('.date_query a').click(function () {
					$(this).addClass('active').siblings().removeClass('active');
					_this.getServer('Map');
				});
				return _this;
			},
			set_method : function () {
				var _this = this;
				$('.query_wrap').on('click', 'a', function (ev) {
					var $this = $(this),
						cVal = $this.html(),
						_position = $this.offset(),
						ev = ev || window.event;
					$('.query_wrap a').removeClass('active');
					$this.addClass('active');
					switch (cVal) {
						case '日期':
							console.log('日期');
							require(['dep/jquery-ui-1.11.4/jquery-ui.js'],
								function () {
									var $datepicker = $( "#datepicker" );
									$datepicker.css({'left': _position.left - 37, 'top': _position.top});
									$datepicker.datepicker({ dateFormat: 'yy/mm/dd',onSelect: function(dateText, inst) {
										var date = $datepicker.datepicker().val();
										_this.Method.date = date;
										_this.getServer(_this.echarts_type[cVal]);
									} });
									$datepicker.datepicker('show');
									$('#ui-datepicker-div').css('top',_position.top +37);
								}
							);
							break;
						default:
							_this._dropdown(cVal, _position).init();console.log(cVal);
							_this.getServer(_this.echarts_type[cVal]);
							ev.stopPropagation();
					}
				});

				$('.menu-btn').click(function (ev) {
					var $this = $(this),
						cVal = $this.find('span').html(),
						_position = $this.offset(),
						ev = ev || window.event;
					_this._dropdown(cVal, _position).init();
					ev.stopPropagation();
				});
				return this;
			},
			chartsData : {
				'myCharts': {
					'dom': '',
					'data': '',
					'now_type': ''
				}
			},
			render_nav: function () {
				var _this = this;
				var cHTML = '<li>',
					data = [{
					'name': '日期'
				},{
					'name': '时段'
				},{
					'name': '一级分类'
				},{
					'name': '二级分类'
				},{
					'name': '页面类型'
				},{
					'name': '省份'
				},{
					'name': '城市'
				},{
					'name': '浏览器'
				},{
					'name': '操作系统'
				},{
					'name': '分辨率'
				}];

				for (var i = 0, len = data.length; i < len; i++) {
					var bBOOL = ((i+1)% 5 == 0);
					cHTML += '<a href="javascript:;"'+ (bBOOL ? 'class="c-span-last"' : '')+'>' + data[i]['name'] +'</a>'
					      + ( bBOOL ? '</li><li>'  : '');
				}
					cHTML += '</li>';
				$('.query_wrap ul').html(cHTML);

				/*获取平台业务线下拉数据*/
				$.ajax({
					url: 'http://10.9.17.55:8080/filter',
					type: 'post',
					async: true,
					data: {'dim_type':'biz'},
					dataType: 'json',
					success: function(data, textStatus) {
						_this.screen['业务线'] = data.biz_name;
					}
				});

				/*this.screen['业务线'] = [{
					'text': '001dian',
					'value': 1
				},{
					'text': '2点',
					'value': 2,
					'state': 1
				},{
					'text': '3点',
					'value': 3
				}];*/
				return this;
			}
		};
		/**
		 * echarts初始化函数
		 */
		require(['echarts/echarts-all','echarts/chart/macarons'],
			function (ec,theme) {
				var myChart,
					ecConfig = require('zrender');
				myChart = Render.chartsData.myCharts.dom = echarts.init(document.getElementById('main_wrap'),theme);
				$('#main_wrap > div').animate({'margin-left':0},500);
				//myChart.showLoading({
					//text: '正在努力的读取数据中...'
				//});
				Render.init();
			}
		);
	}

	return home;
});