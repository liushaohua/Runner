define(function(require) {
	
	var home = {};

    home.template = require('text!./index.html');

	//require('../dep/jquery-ui-1.11.4/jquery-ui.css');


    home.beforeRender = function() {
		//在页面渲染之前执行，获取数据
		console.log('beforeRender');
	};

    home.initBehavior = function() {
		//在页面渲染之后执行，对页面进行操作
		console.log('initBehavior','uuu');
		// 使用
		$(document).trigger('Runner/hashChange');
		var Render = {
			init: function () {
				var _this = this;
				this.render_nav().setDate().set_method().getServer();
				$(document).click(function () {
					$('.dropdown').fadeOut(300);
				});

				/*setTimeout(function () {
					_this.screen['省份'] = [{
						'text': '河1',
						'value': '11'
					},{
						'text': '江西2',
						'value': '江西',
						'state': 1
					},{
						'text': '广东3',
						'value': '广东'
					},{
						'text': '甘肃4',
						'value': '甘肃'
					}];
				},1000);*/

				$.ajax({
					url: 'http://10.9.17.55:8080/filter',
					type: 'post',
					async: true,
					data: {
						'prov_id': 1
					},
					dataType: 'json',
					success: function(data, textStatus) {
						_this.screen['省份'] = data.data;
						console.log(data);
					}
				});
			},
			Method: {
				'time_type':'day',
				'ds':'20150717',
				'biz_name':'ershouche',
				'browser_type':'chrome',
				'limit':'5',
				'date': $('#datepicker').val(),
				'time': '',
				'business': ''
			},
			screen: window.config.screen,
			dictionary: window.config.dictionary,
			_dropdown: function (type, offset) {
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
						_this.getServer(type);

					});
				};
				return {
					init: init
				};
			},
			getServer: function (type) {
				var _this = this;
				console.log('getServer',_this.Method);
				$.ajax({
					url: 'http://10.59.10.123/',
					type: 'post',
					async: true,
					data: _this.Method,
					dataType: 'json',
					success: function(data, textStatus) {
						console.log(data);
						_this.render_charts('line', data);
						Render.chartsData.myCharts.dom.hideLoading();
					},
					error : function() {
						try{
							Render.chartsData.myCharts.dom.hideLoading();
						}catch(e){}
					}
				});
			},
			render_charts: function (type, data) {
				var cOption;
				if (type == 'line') {
					cOption = EchartsCof.ChartOptionTemplates.Lines(option,'hellow-cookie',true, {
						'title': '未来一周气温变化-ga'
					});
				}
				// 为echarts对象加载数据
				Render.chartsData.myCharts.dom.setOption(cOption);
				Render.chartsData.myCharts.data = cOption;
			},
			setDate : function () {
				var _this = this;
				$('.date_query a').click(function () {
					$(this).addClass('active').siblings().removeClass('active');
					var option = [{
						name:'周一',
						group:'最高气温',
						value:11
					},{
						name:'周二',
						group:'最高气温',
						value:11
					},{
						name:'周三',
						group:'最高气温',
						value:15
					},{
						name:'周四',
						group:'最高气温',
						value:13
					},{
						name:'周五',
						group:'最高气温',
						value:12
					},{
						name:'周六',
						group:'最高气温',
						value:13
					},{
						name:'周日',
						group:'最高气温',
						value:10
					},{
						name:'周一',
						group:'最低气温',
						value:1
					},{
						name:'周二',
						group:'最低气温',
						value:-3
					},{
						name:'周三',
						group:'最低气温',
						value:2
					},{
						name:'周四',
						group:'最低气温',
						value:5
					},{
						name:'周五',
						group:'最低气温',
						value:3
					},{
						name:'周六',
						group:'最低气温',
						value:2
					},{
						name:'周日',
						group:'最低气温',
						value:0
					}];
					var cOption = EchartsCof.ChartOptionTemplates.Lines(option,'hellow-cookie',true).series,
						data = Render.chartsData.myCharts.data.series;

					Render.chartsData.myCharts.data.series = $.extend({}, data, cOption);
					console.log(Render.chartsData.myCharts.data);

					Render.chartsData.myCharts.dom.setOption(Render.chartsData.myCharts.data);
					//Render.chartsData.myCharts.dom.refresh();
					window.onresize = Render.chartsData.myCharts.dom.resize;
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
										_this.getServer(cVal);
									} });
									$datepicker.datepicker('show');
									$('#ui-datepicker-div').css('top',_position.top +37);
									//$("#ui-datepicker-div").css('font-size','0.2em') //改变大小*/
								}
							);
							break;
						default:
							console.log('其他');
							_this._dropdown(cVal, _position).init();
							ev.stopPropagation();
					}
					if (cVal == '时段') {
						var option = [{
							name:'周一',
							group:'最高气温',
							value:11
						},{
							name:'周二',
							group:'最高气温',
							value:11
						},{
							name:'周三',
							group:'最高气温',
							value:15
						}];

						var option_map = [{
							name:'北京',
							group:'最高气温',
							value:11
						},{
							name:'天津',
							group:'最高气温',
							value:11
						},{
							name:'新疆',
							group:'最高气温',
							value:15
						}];

						var option_map2 = {
							'2002-01-01': [{
								name:'北京',
								group:'最高气温',
								value:11
							},{
								name:'天津',
								group:'最高气温',
								value:11
							},{
								name:'新疆',
								group:'最高气温',
								value:15
							},{
								name:'北京',
								group:'最低气温',
								value:2
							},{
								name:'天津',
								group:'最低气温',
								value:1
							},{
								name:'新疆',
								group:'最低气温',
								value:-1
							}],
							'2003-01-01': [{
								name:'北京',
								group:'最高气温',
								value:15
							},{
								name:'天津',
								group:'最高气温',
								value:11
							},{
								name:'新疆',
								group:'最高气温',
								value:14
							},{
								name:'北京',
								group:'最低气温',
								value:2
							},{
								name:'天津',
								group:'最低气温',
								value:3
							},{
								name:'新疆',
								group:'最低气温',
								value:-2
							}]
						};

						var option2 = {
							'2002-01-01': [{
								name:'周一',
								group:'最高气温',
								value:11
							},{
								name:'周二',
								group:'最高气温',
								value:11
							},{
								name:'周三',
								group:'最高气温',
								value:15
							},{
								name:'周一',
								group:'最低气温',
								value:2
							},{
								name:'周二',
								group:'最低气温',
								value:1
							},{
								name:'周三',
								group:'最低气温',
								value:-1
							}],
							'2003-01-01': [{
								name:'周一',
								group:'最高气温',
								value:11
							},{
								name:'周二',
								group:'最高气温',
								value:11
							},{
								name:'周三',
								group:'最高气温',
								value:14
							},{
								name:'周一',
								group:'最低气温',
								value:2
							},{
								name:'周二',
								group:'最低气温',
								value:3
							},{
								name:'周三',
								group:'最低气温',
								value:-2
							}]
						};
						var cOption = EchartsCof.ChartOptionTemplates.Pie(option,'hellow-cookie',true, {
							'title': '未来一周气温变化-aa'
						});

						var cOption_map = EchartsCof.ChartOptionTemplates.Map(option_map,'hellow-cookie',true, {
							'title': '未来一周气温变化-aa'
						});


						//console.log(JSON.stringify(cOption_map),'zz0y');

						var cOption2 = EchartsCof.ChartOptionTemplates.Lines(option2,'hellow-cookie',true, {
							'hasTime' : 1,
							'title': '未来一周气温变化-aa'
						});

						var cOption23 = EchartsCof.ChartOptionTemplates.Map(option_map2,'hellow-cookie',true, {
							'hasTime' : 1,
							'title': '未来一周气温变化-aa'
						});

						console.log(JSON.stringify(cOption23),'wwwaiaiai');
						Render.chartsData.myCharts.dom.clear();
						//Render.chartsData.myCharts.dom.setOption(cOption);
						Render.chartsData.myCharts.dom.setOption(cOption23);
						Render.chartsData.myCharts.data = cOption;
					}
				});
				return this;
			},
			chartsData : {
				'myCharts': {
					'dom': '',
					'data': ''
				}
			},
			render_nav: function () {
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
					var bBOOL = ((i+1)% 6 == 0);
					cHTML += '<a href="javascript:;"'+ (bBOOL ? 'class="c-span-last"' : '')+'>' + data[i]['name'] +'</a>'
					      + ( bBOOL ? '</li><li>'  : '');
				}
					cHTML += '</li>';
				$('.query_wrap ul').html(cHTML);
				return this;
			}
		};

		Render.init();

		require(['echarts/echarts-all','echarts/chart/macarons'],
			function (ec,theme) {;
				var myChart;
				myChart = Render.chartsData.myCharts.dom = echarts.init(document.getElementById('main_wrap'),theme);

				//myChart.showLoading({
					//text: '正在努力的读取数据中...'
				//});

				Render.getServer();

				var option = [{
					name:'周一',
					group:'最高气温',
					value:11
				},{
					name:'周二',
					group:'最高气温',
					value:11
				},{
					name:'周三',
					group:'最高气温',
					value:15
				},{
					name:'周四',
					group:'最高气温',
					value:13
				},{
					name:'周五',
					group:'最高气温',
					value:12
				},{
					name:'周六',
					group:'最高气温',
					value:13
				},{
					name:'周日',
					group:'最高气温',
					value:10
				},{
					name:'周一',
					group:'最低气温',
					value:1
				},{
					name:'周二',
					group:'最低气温',
					value:-2
				},{
					name:'周三',
					group:'最低气温',
					value:2
				},{
					name:'周四',
					group:'最低气温',
					value:5
				},{
					name:'周五',
					group:'最低气温',
					value:3
				},{
					name:'周六',
					group:'最低气温',
					value:2
				},{
					name:'周日',
					group:'最低气温',
					value:0
				}];
				var cOption = EchartsCof.ChartOptionTemplates.Lines(option,'hellow-cookie',true, {
					'title': '未来一周气温变化-ga'
				});
//console.log(JSON.stringify(cOption));
				// 为echarts对象加载数据
				Render.chartsData.myCharts.dom.setOption(cOption);
				Render.chartsData.myCharts.data = cOption;
			}
		);
	}

	return home;
});