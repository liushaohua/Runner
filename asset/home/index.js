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

		//首次进入初始化平台业务线
		if (!window.setPlatform) {
			$('.select_wrap').show();
			$('.top_bar').removeClass('active')
		}

		/**
		 * Render图表渲染主函数
		 */
		var Render = {
			init: function (fn) {
				var _this = this;
				this.render_nav().setDate().set_method().getServer(this.echarts_type['default']);
				$(document).click(function () {
					$('.dropdown').fadeOut(300);
					$('.query_wrap a i').add($('.menu-btn i')).attr('class','icon_down');
				});
				fn && fn();
			},
			Method: {
				'time_type':'day',
				'ds':'',
				'biz_name':'fangchan',
				'index_type': 'data_date',
				'platform': 'PC',
				'value_name': 'pv',
				'cate1_name': '',
				'dim_type': 'cate1'
			},
			changeParam: function (Param, value, cType, isR) {
				this.Method[Param] = value;
				var isR = isR || false;
				cType && (this.getServer(cType, isR));
			},
			screen: window.config.screen,
			dictionary: window.config.dictionary,
			echarts_type: window.config.echarts_type,
			_dropdown: function (type, offset, $_this) {
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
						$_this.find('span').html($this.text());
						_this.screen[type][oldIndex].state = 0;
						_this.screen[type][$this.index()].state = 1;
						_this.dictionary[type] && (_this.Method[_this.dictionary[type]] = $this.attr('value'));
						type == '一级分类' && (_this.Method[_this.dictionary[type]] = $this.attr('value'));
						type == '业务线' && ~function () {
							//_this.Method['dim_type'] = $this.attr('value');
							/*获取一级分类*/
							$.ajax({
								url: 'http://10.9.17.55:8080/filter',
								type: 'post',
								async: true,
								data: {'dim_type': 'cate1','biz_name': $this.attr('value')},
								dataType: 'json',
								success: function(data, textStatus) {
									data.data[0].state = 1;
									_this.screen['一级分类'] = data.data;
									$('.query_wrap').find('[value = "一级分类"]').find('span').html('一级分类');
								}
							});
						}();

						_this.getServer(_this.echarts_type[type]);
					});
				};
				return {
					init: init
				};
			},
			getServer: function (type, isR) {
				var _this = this,
					option;

				type = type || _this.nowType || _this.echarts_type.default;
				_this.nowType = type;

				$.ajax({
					url: 'http://10.9.17.55:8080/',
					type: 'post',
					async: true,
					data: _this.Method,
					dataType: 'json',
					success: function(data, textStatus) {
						data = data.data;

						if (type == 'TreeMap') {
							for (var i in data) {
								data[i].unshift({
									name: "default", group: "default", value: 1
								});
							}
						}

						if (window.Max) {
							if  (isR) {
								_this.render_charts(type, data, 'myChartsR');
							}else if(type == 'PieLine') {
								_this.render_charts(type, data, 'myChartsL');
							} else {
								_this.render_charts(type, data);
							}
						} else {
							_this.render_charts(type, data);
						}

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

					option2 = {
						"2015-08-10": [
							{
								"name": "special2",
								"group": "M",
								"value": 70
							},
						{
							"name": "special",
							"group": "PC",
							"value": 7
						},
						{
							"name": "changshang_volvo",
							"group": "PC",
							"value": 8
						},
						{
							"name": "che",
							"group": "PC",
							"value": 11
						},
						{
							"name": "chexing",
							"group": "PC",
							"value": 12
						}],
						"2015-08-12": [
							{
								"name": "special",
								"group": "PC",
								"value": 7
							},
							{
								"name": "changshang_volvo",
								"group": "PC",
								"value": 8
							},
							{
								"name": "che",
								"group": "PC",
								"value": 11
							},
							{
								"name": "chexing",
								"group": "PC",
								"value": 22
							}]

					};
				}
				//_this.render_charts(type, option);
				return _this;
			},
			render_charts: function (type, data, obj) {
				var cOption,
					_this = this,
					echartsObj = obj || 'myCharts';
				if (type == 'line') {
					cOption = EchartsCof.ChartOptionTemplates.Lines(data,'hellow-cookie',false, {
						'title': ' '
					});
				} else if (type == 'Browser') {
					cOption = EchartsCof.ChartOptionTemplates.Browser(data,'hellow-cookie',false, {
						'hasTime' : 1,
						'title': ' '
					});
				} else {
					cOption = EchartsCof.ChartOptionTemplates[type](data,'hellow-cookie', true, {
						'hasTime' : 1,
						'title': ' '
					});
				}
				/**
				 * echarts加载数据对象，渲染图表
				 */
				~function () {
					var $main = $('#main_wrap'),
						$double_wrap = $('.double_wrap');
					if (obj) {
						$double_wrap.show();
						$main.hide();
					}else {
						$double_wrap.hide();
						$main.show();
					}
				} ();

				this.chartsData[echartsObj].dom.clear();
				this.chartsData[echartsObj].dom.setOption(cOption);
				this.chartsData[echartsObj].data = cOption;

				type == 'MapContrast' && ~function () {
					_this.setMap(_this.chartsData.myCharts.dom, cOption, type, data);
				}();
			},
			setMap: function (myChart, option, type, data) {
				myChart.on(CecConfig.EVENT.MAP_SELECTED, function (param){
					if (type != 'MapContrast') {return;}
					$('.query_wrap a').removeClass('active');
					$('.query_wrap a').filter(function (index) {
						return $(this).html() == '城市';
					}).addClass('active');
					var selected = param.selected;
					var selectedProvince;
					var name;
					for (var i = 0, l = option.series[0].data.length; i < l; i++) {
						name = option.series[0].data[i].name;
						option.series[0].data[i].selected = selected[name];
						if (selected[name]) {
							selectedProvince = name;
						}
					}
					if (selectedProvince == '北京' || selectedProvince == '上海' || selectedProvince == '天津' || selectedProvince == '重庆') {return}
					if (typeof selectedProvince == 'undefined') {
						option.series.splice(1);
						option.legend = null;
						option.dataRange = null;
						myChart.setOption(option, true);
						return;
					}
					option.series[1] = {
						name: '随机数据',
						type: 'map',
						mapType: selectedProvince,
						itemStyle:{
							normal:{label:{show:true}},
							emphasis:{label:{show:true}}
						},
						mapLocation: {
							x: '35%'
						},
						roam: true,
						data: data
					};
					option.legend = {
						x:'right',
						data:['数据列表']
					};
					option.dataRange = {
						orient: 'horizontal',
						x: 'right',
						min: 0,
						max: 1000,
						color:['orange','yellow'],
						text:['高','低'],           // 文本，默认为数值文本
						splitNumber:0
					};
					myChart.setOption(option, true);
				});
			},
			setDate : function () {
				var _this = this;
				$('.date_query a').click(function () {
					var $this = $(this);
					$this.addClass('active').siblings().removeClass('active');
					_this.changeParam('time_type', $this.attr('value'));
					_this.getServer();
				});
				return _this;
			},
			set_method : function () {
				var _this = this;
				$('.query_wrap').on('click', 'a', function (ev) {
					var $this = $(this),
						cVal = $this.attr('value'),
						_position = $this.offset(),
						ev = ev || window.event,
						$i = $this.find('i');
					$('.query_wrap a').removeClass('active');
					$this.addClass('active');
					$i.length && ($i.attr('class','icon_up'));
					switch (cVal) {
						case '日期':
							require(['dep/jquery-ui-1.11.4/jquery-ui.js'],
								function () {
									var $datepicker = $( "#datepicker" );
									$datepicker.css({'left': _position.left - 37, 'top': _position.top});
									$datepicker.datepicker({ dateFormat: 'yymmdd',onSelect: function(dateText, inst) {
										var date = $datepicker.datepicker().val();
										_this.Method.ds = date;
										$this.html(date);
										_this.Method.index_type = 'data_date';
										_this.getServer(_this.echarts_type[cVal]);
									} });
									$datepicker.datepicker('show');
									$('#ui-datepicker-div').css('top',_position.top +37);
								}
							);
							break;
						default:
							_this._dropdown(cVal, _position, $this).init();
							if ($this.has('i').length) {
								_this.changeParam('index_type', _this.dictionary[cVal]);
							} else {
								_this.changeParam('index_type', _this.dictionary[cVal], _this.echarts_type[cVal]);
								window.echartType = _this.echarts_type[cVal];
								if (_this.echarts_type[cVal] == 'PieLine' && window.Max) {
									_this.changeParam('index_type', 'data_date', 'line', true);
									window.echartType = 'PieLine';
								}
							}

							//_this.getServer(_this.echarts_type[cVal]);
							ev.stopPropagation();
					}
				});

				$('.menu-btn').click(function (ev) {
					var $this = $(this),
						cVal = $this.attr('value'),
						_position = $this.offset(),
						ev = ev || window.event;

					$this.find('i').attr('class','icon_up');
					ev.stopPropagation();
					_this._dropdown(cVal, _position, $this).init();
				});
				return this;
			},
			chartsData : {
				'myCharts': {
					'dom': '',
					'data': ''
				},
				'myChartsL': {
					'dom': '',
					'data': ''
				},
				'myChartsR': {
					'dom': '',
					'data': ''
				},
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
					cHTML += '<a href="javascript:;"'+ (bBOOL ? 'class="c-span-last"' : '')+' value="'+ data[i]['name'] +'">'+ (data[i]['name'] == '一级分类' ? '<i class="icon_down"></i><span>'+ data[i]['name'] +'</span>' : data[i]['name']) +'</a>'
					      + ( bBOOL ? '</li><li>'  : '');
				}
					cHTML += '</li>';
				$('.query_wrap ul').html(cHTML).fadeIn(500);

				/*获取平台业务线下拉数据*/
				$.ajax({
					url: 'http://10.9.17.55:8080/filter',
					type: 'post',
					async: true,
					data: {'dim_type':'biz'},
					dataType: 'json',
					success: function(data, textStatus) {
						data.data[0].state = 1;
						_this.screen['业务线'] = data.data;
					}
				});

				/*获取一级分类*/
				$.ajax({
					url: 'http://10.9.17.55:8080/filter',
					type: 'post',
					async: true,
					data: {'dim_type': 'cate1','biz_name': 'fangchan'},
					dataType: 'json',
					success: function(data, textStatus) {
						data.data[0].state = 1;
						_this.screen['一级分类'] = data.data;
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
				var myChart, myChartL, myChartR;
				window.CecConfig = require('zrender');
				myChart = Render.chartsData.myCharts.dom = echarts.init(document.getElementById('main_wrap'),theme);
				myChartL = Render.chartsData.myChartsL.dom = echarts.init(document.getElementById('left_wrap'),theme);
				myChartR = Render.chartsData.myChartsR.dom = echarts.init(document.getElementById('right_wrap'),theme);
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