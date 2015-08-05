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
				this.render_nav().setDate().render_charts();
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
			render_charts : function () {
				$('.query_wrap').on('click', 'a', function () {
					var $this = $(this),
						cVal = $this.html(),
						_position = $this.offset();
					$('.query_wrap a').removeClass('active');
					$this.addClass('active');
					switch (cVal) {
						case '日期':
							console.log('日期');
							require(['dep/jquery-ui-1.11.4/jquery-ui.js'],
								function () {
									var $datepicker = $( "#datepicker" );
									$datepicker.css({'left': _position.left - 37, 'top': _position.top});
									$datepicker.datepicker();
									$datepicker.datepicker('show');
									$('#ui-datepicker-div').css('top',_position.top +37);
									$("#ui-datepicker-div").css('font-size','0.2em') //改变大小*/
									var date = $('#datepicker').datepicker({ dateFormat: 'yy/mm/dd' }).val();
									console.log(date);

								}
							);
							break;
						default:
							console.log('其他');
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
					'name': '业务线'
				},{
					'name': '日期'
				}];

				for (var i = 0, len = data.length; i < len; i++) {
					var bBOOL = ((i+1)% 6 == 0 && i+1 != len);
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

				myChart.showLoading({
					text: '正在努力的读取数据中...'
				});

				$.ajax({
					url: 'http://10.59.10.123/',
					type: 'post',
					async: true,
					data:{
						'time_type':'day',
						'ds':'20150717',
						'biz_name':'ershouche',
						'browser_type':'chrome',
						'limit':'5'
					},
					dataType: 'json',
					success: function(data, textStatus) {
						console.log(data);
						myChart.hideLoading();
					},
					error : function() {
						//console.log(55);
						myChart.hideLoading();
					}
				});

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

				// 为echarts对象加载数据
				Render.chartsData.myCharts.dom.setOption(cOption);
				Render.chartsData.myCharts.data = cOption;
			}
		);
	}

	return home;
});