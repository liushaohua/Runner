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
			lastMethod: '',
			Method: {
				'time_type':'day',
				'ds':'',
				'biz_name':'fangchan',
				'index_type': window.hashMethod.index_type + 'data_date',
				'platform': 'PC',
				//'value_name': window.hashMethod.value_name,
				'cate1_name': '',
				'dim_type': 'cate1',
				'data_type': 'view'
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
						type == '一级分类' && (type = '二级分类');
						//如果上一个状态是二级分类
						_this.getServer(_this.nowType == 'PieDouble'? 'to_cate1': _this.echarts_type[type]);
					});
				};
				return {
					init: init
				};
			},
			setDetailDate: function (fn, list_num, pageInit) {
				var _this = this;

				$('.data_model_head a').click(function () {
					var $this = $(this);
					require(['dep/jquery-ui-1.11.4/jquery-ui.js'],
						function () {
							var $datepicker = $( "#detail_datepicker" );

							$(".hasDatepicker").removeClass("hasDatepicker");
							$datepicker.datepicker("destroy");
							$datepicker.datepicker({ dateFormat: 'yymmdd',onSelect: function(dateText, inst) {
								var date = $datepicker.datepicker().val();
								$this.html(date);
								$this.data('date', date);
								fn(0, list_num, pageInit);
							} });
							$datepicker.datepicker('show');
						}
					);
				});

				return _this;
			},
			getServer: function (type, isR) {
				var _this = this,
					option,
					list_num = 10;

				//如果是从二级分类修改业务线切过来的 手动修改为一级分类
				if (type == 'to_cate1') {
					$('.query_wrap a[value="一级分类"]').click();
					return;
				}
				type = type || _this.nowType || _this.echarts_type.default;
				_this.nowType = type;
				Render.chartsData.myCharts.dom.showLoading();
				$.ajax({
					url: 'http://10.9.17.55:8080/',
					type: 'post',
					async: true,
					data: _this.Method,
					dataType: 'json',
					success: function(data, textStatus) {
						//data = isR ?  data.data2 : data.data;
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

						$('.data_model_head').data('method', _this.Method);
					},
					error : function() {
						try{
							Render.chartsData.myCharts.dom.hideLoading();
						}catch(e){}
					}
				});

				//list context
				pageServe (0, list_num, pageInit);

				if (_this.setDetailDate) {
					_this.setDetailDate(pageServe, list_num, pageInit);
					delete _this.setDetailDate;
				}

				function renHtml (data, isBool) {
					var origin_method = $('.data_model_head').data('method') || _this.Method,
						cHTML = '',
						$thead = $('.table_model thead'),
						$tbody = $('.table_model tbody'),
						s_type = origin_method['index_type'].split(',')[1],
						hashTitle = {
							'#/click/': '<th>点击量&nbsp;&nbsp;' +
							'<i value="click_times" class="icon-arrow-up"></i></th><th>点击率&nbsp;&nbsp;<i value="click_percent" class="icon-arrow-up"></i></th>',
							'#/jump/': '<th>跳出量&nbsp;&nbsp;<i value="jump_times" class="icon-arrow-up"></i></th><th>跳出率&nbsp;&nbsp;<i value="jump_percent" class="icon-arrow-up"></i></th>',
							'#/viewout/': '<th>退出量&nbsp;&nbsp;<i value="viewout_times" class="icon-arrow-up"></i></th><th>退出率&nbsp;&nbsp;<i value="viewout_percent" class="icon-arrow-up"></i></th>',
							'#/pvuv/': '<th>PV&nbsp;&nbsp;<i value="pv" class="icon-arrow-up"></i></th>'
						},
						hashType = window.config.dictionary_etoc,$thModel = '';

					if (s_type != 'data_date') {
						$thModel = '<th>'+ hashType[s_type] +'</th>';
					}

					var $th = '<th>日期</th>' + hashTitle[location.hash] + $thModel +'<th>业务线</th><th>来源</th>';
					!isBool && ($thead.html('<tr>' + $th +'</tr>'));
					for (var i = 0, len = data.length; i < len; i++) {
						var hashStr = location.hash.slice(2,location.hash.length -1),
							tds,$tdMdel = '';
						if (location.hash != '#/pvuv/') {
							tds = '<td>'+ data[i][hashStr+'_times'] +'</td>'
								+ '<td>'+ data[i][hashStr+'_percent'] +'</td>'
						} else {
							tds = '<td>'+ data[i]['pv'] +'</td>';
						}

						if (s_type != 'data_date') {
							$tdMdel = '<td>'+ data[i][s_type] +'</td>';
						}

						cHTML+= '<tr>'
							+		'<td>'+ data[i]['ds'] +'</td>'
							+		tds + $tdMdel
							+		'<td>'+ data[i]['biz_name'] +'</td>'
							+      '<td>'+ data[i]['platform'] +'</td>'
							+	'</tr>';
					}
					$tbody.html(cHTML);
					if (isBool) {
						return;
					}
					//sort
					$('.table_model i').unbind('click');
					$('.table_model i').click(function () {
						var $this = $(this),
							method,
							order = 'asc';

						if ($this.attr('value')) {
							if ($this.hasClass('icon-arrow-down')) {
								$this.removeClass('icon-arrow-down');
								$this.addClass('icon-arrow-up');
								$this.attr('title','升序');
								order = 'desc';
							} else {
								$this.addClass('icon-arrow-down');
								$this.removeClass('icon-arrow-up');
								$this.attr('title','降序');
							}
						}
						method = $.extend({}, Render.lastMethod, {
							'sort_by': $this.attr('value'),
							'order': order
						});

						$.ajax({
							url: 'http://10.9.17.55:8080/',
							type: 'post',
							async: true,
							data: method,
							dataType: 'json',
							success: function(data, textStatus) {
								if (data.status == "failed") return;
								var s_data = data,
									data = data.data;
								data && (renHtml(data, true));
							}
						});
					});
				}

				function pageInit(total, data_count) {
					require(['dep/kkpager/kkpager.min.js'],function () {
						kkpager.generPageHtml({
							pno : 1,
							mode : 'click',
							// 总页码
							total : total,
							// 总数据条数
							totalRecords : data_count,
							click : function(n) {
								pageServe((n-1) * list_num, list_num);
								this._config['total'] = this.total;
								this._config['totalRecords'] = this.totalRecords;
								this.selectPage(n);
							},
							lang : {
								prePageText : '<',
								nextPageText : '>',
								gopageButtonOkText : '跳转',
							},
							getHref : function(n) {
								return '#';
							}
						}, true);
					});
				}

				function pageServe(offset, limit, fn) {
					var origin_method = $('.data_model_head').data('method') || _this.Method,
					    listMechod = $.extend({}, origin_method, {
							data_type: 'list',
							offset: offset,
							limit: limit,
							ds: $('.detail_date').data('date') || ''
						});
					Render.lastMethod = listMechod;	console.log('last',Render.lastMethod);
					$.ajax({
						url: 'http://10.9.17.55:8080/',
						type: 'post',
						async: true,
						data: listMechod,
						dataType: 'json',
						success: function(data, textStatus) {
							if (data.status == "failed") return;
							var s_data = data,
								data = data.data,
								data_count = s_data.rows_count,
								total = Math.ceil(data_count / 10);

							fn && fn(total, data_count);
							data && (renHtml(data));
						}
					});
				}

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
				} else if (type == 'TreeMap' || type == 'Map' || type == 'PieLine' || type == 'PiePage' || type == 'PieDouble'  || type == 'Browser' || type == 'Column' || type == 'ColumnLine') {
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
				//_this.pageServe = pageServe;
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
				this.chartsData[echartsObj].dom.hideLoading();
				
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
						name: '城市数据',
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
						max: 100000,
						color:['orange','yellow'],
						text:['高','低'],           // 文本，默认为数值文本
						splitNumber:0,
						calculable : true,
						textStyle:{color: '#fff'}
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

					if (/no-drop/.test($this.attr('class')) ) return;

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
										$('a[value="日期"]').html(date);
										Render.chartsData.myCharts.dom = window.myChart;
										_this.Method.index_type = window.hashMethod.index_type + 'data_date';
										_this.getServer(_this.echarts_type[cVal]);
									} });
									$datepicker.datepicker('show');
									$('#ui-datepicker-div').css('top',_position.top +37);
								}
							);
							break;
						default:
							//二级分类
							if ($this.attr('value') == '二级分类') {
								_this._dropdown('一级分类', $this.prev().offset(), $this).init();
								_this.changeParam('index_type', window.hashMethod.index_type + _this.dictionary[cVal]);
								ev.stopPropagation();
								return;
							}

							if (cVal != '一级分类') {
								_this._dropdown(cVal, _position, $this).init();
							}

							if ($this.has('i').length && cVal != '一级分类') {
								_this.changeParam('index_type', window.hashMethod.index_type + _this.dictionary[cVal]);
							} else {
								_this.changeParam('index_type', window.hashMethod.index_type + _this.dictionary[cVal], _this.echarts_type[cVal]);
								window.echartType = _this.echarts_type[cVal];
								if (_this.echarts_type[cVal] == 'PieLine' && window.Max) {
									_this.changeParam('index_type', window.hashMethod.index_type + _this.dictionary[cVal], 'ColumnLine', true);
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

				$.ajax({
					url: 'http://10.9.17.55:8080/filter',
					type: 'post',
					async: true,
					data: {'dim_type':window.hashMethod.index_type.replace(',','')},
					dataType: 'json',
					success: function(data, textStatus) {
						var cHTML = '<li>',
							data = data.data;
						var data_old = [{
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
							'name': '分辨率',
							'disabled': true
						}];

						for (var i = 0, len = data.length; i < len; i++) {
							var name = window.config.dictionary_etoc[data[i]['text']],
							    bBOOL = ((i+1)% 5 == 0),
								disabled = data[i]['value'] == 0;
							cHTML += '<a href="javascript:;" class="'+ (bBOOL ? 'c-span-last' : '')+ (disabled ? ' no-drop' : '')+'" value="'+ name +'">'+ (name == '一级分类' ? '<i class="icon_down"></i><span>'+ name +'</span>' : name) +'</a>'
								+ ( bBOOL ? '</li><li>'  : '');
						}
						cHTML += '</li>';
						$('.query_wrap ul').html(cHTML).fadeIn(500);
					}
				});

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
				window.myChart = Render.chartsData.myCharts.dom = echarts.init(document.getElementById('main_wrap'),theme);
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