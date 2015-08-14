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
			init: function (fn) {
				var _this = this;
				this.render_nav().setDate().set_method().getServer(this.echarts_type['default']);
				$(document).click(function () {
					$('.dropdown').fadeOut(300);
				});
				fn && fn();
			},
			Method: {
				'time_type':'day',
				'ds':'20150811',
				'biz_name':'ershouche',
				'index_type': 'cate1_name',
				'platform': 'PC',
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
					url: 'http://10.9.17.55:8080/',
					type: 'post',
					async: true,
					data: _this.Method,
					dataType: 'json',
					success: function(data, textStatus) {
						type == 'line' && (data = data.data);
						//修改了数据
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
				var cOption,
					_this = this;
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

				type == 'MapContrast' && ~function () {
					_this.setMap(_this.chartsData.myCharts.dom, cOption, type);
				}();
			},
			setMap: function (myChart, option, type) {
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
						data:[
							{name: '重庆市',value: Math.round(Math.random()*1000)},
							{name: '北京市',value: Math.round(Math.random()*1000)},
							{name: '天津市',value: Math.round(Math.random()*1000)},
							{name: '上海市',value: Math.round(Math.random()*1000)},
							{name: '香港',value: Math.round(Math.random()*1000)},
							{name: '澳门',value: Math.round(Math.random()*1000)},
							{name: '巴音郭楞蒙古自治州',value: Math.round(Math.random()*1000)},
							{name: '和田地区',value: Math.round(Math.random()*1000)},
							{name: '哈密地区',value: Math.round(Math.random()*1000)},
							{name: '阿克苏地区',value: Math.round(Math.random()*1000)},
							{name: '阿勒泰地区',value: Math.round(Math.random()*1000)},
							{name: '喀什地区',value: Math.round(Math.random()*1000)},
							{name: '塔城地区',value: Math.round(Math.random()*1000)},
							{name: '昌吉回族自治州',value: Math.round(Math.random()*1000)},
							{name: '克孜勒苏柯尔克孜自治州',value: Math.round(Math.random()*1000)},
							{name: '吐鲁番地区',value: Math.round(Math.random()*1000)},
							{name: '伊犁哈萨克自治州',value: Math.round(Math.random()*1000)},
							{name: '博尔塔拉蒙古自治州',value: Math.round(Math.random()*1000)},
							{name: '乌鲁木齐市',value: Math.round(Math.random()*1000)},
							{name: '克拉玛依市',value: Math.round(Math.random()*1000)},
							{name: '阿拉尔市',value: Math.round(Math.random()*1000)},
							{name: '图木舒克市',value: Math.round(Math.random()*1000)},
							{name: '五家渠市',value: Math.round(Math.random()*1000)},
							{name: '石河子市',value: Math.round(Math.random()*1000)},
							{name: '那曲地区',value: Math.round(Math.random()*1000)},
							{name: '阿里地区',value: Math.round(Math.random()*1000)},
							{name: '日喀则地区',value: Math.round(Math.random()*1000)},
							{name: '林芝地区',value: Math.round(Math.random()*1000)},
							{name: '昌都地区',value: Math.round(Math.random()*1000)},
							{name: '山南地区',value: Math.round(Math.random()*1000)},
							{name: '拉萨市',value: Math.round(Math.random()*1000)},
							{name: '呼伦贝尔市',value: Math.round(Math.random()*1000)},
							{name: '阿拉善盟',value: Math.round(Math.random()*1000)},
							{name: '锡林郭勒盟',value: Math.round(Math.random()*1000)},
							{name: '鄂尔多斯市',value: Math.round(Math.random()*1000)},
							{name: '赤峰市',value: Math.round(Math.random()*1000)},
							{name: '巴彦淖尔市',value: Math.round(Math.random()*1000)},
							{name: '通辽市',value: Math.round(Math.random()*1000)},
							{name: '乌兰察布市',value: Math.round(Math.random()*1000)},
							{name: '兴安盟',value: Math.round(Math.random()*1000)},
							{name: '包头市',value: Math.round(Math.random()*1000)},
							{name: '呼和浩特市',value: Math.round(Math.random()*1000)},
							{name: '乌海市',value: Math.round(Math.random()*1000)},
							{name: '海西蒙古族藏族自治州',value: Math.round(Math.random()*1000)},
							{name: '玉树藏族自治州',value: Math.round(Math.random()*1000)},
							{name: '果洛藏族自治州',value: Math.round(Math.random()*1000)},
							{name: '海南藏族自治州',value: Math.round(Math.random()*1000)},
							{name: '海北藏族自治州',value: Math.round(Math.random()*1000)},
							{name: '黄南藏族自治州',value: Math.round(Math.random()*1000)},
							{name: '海东地区',value: Math.round(Math.random()*1000)},
							{name: '西宁市',value: Math.round(Math.random()*1000)},
							{name: '甘孜藏族自治州',value: Math.round(Math.random()*1000)},
							{name: '阿坝藏族羌族自治州',value: Math.round(Math.random()*1000)},
							{name: '凉山彝族自治州',value: Math.round(Math.random()*1000)},
							{name: '绵阳市',value: Math.round(Math.random()*1000)},
							{name: '达州市',value: Math.round(Math.random()*1000)},
							{name: '广元市',value: Math.round(Math.random()*1000)},
							{name: '雅安市',value: Math.round(Math.random()*1000)},
							{name: '宜宾市',value: Math.round(Math.random()*1000)},
							{name: '乐山市',value: Math.round(Math.random()*1000)},
							{name: '南充市',value: Math.round(Math.random()*1000)},
							{name: '巴中市',value: Math.round(Math.random()*1000)},
							{name: '泸州市',value: Math.round(Math.random()*1000)},
							{name: '成都市',value: Math.round(Math.random()*1000)},
							{name: '资阳市',value: Math.round(Math.random()*1000)},
							{name: '攀枝花市',value: Math.round(Math.random()*1000)},
							{name: '眉山市',value: Math.round(Math.random()*1000)},
							{name: '广安市',value: Math.round(Math.random()*1000)},
							{name: '德阳市',value: Math.round(Math.random()*1000)},
							{name: '内江市',value: Math.round(Math.random()*1000)},
							{name: '遂宁市',value: Math.round(Math.random()*1000)},
							{name: '自贡市',value: Math.round(Math.random()*1000)},
							{name: '黑河市',value: Math.round(Math.random()*1000)},
							{name: '大兴安岭地区',value: Math.round(Math.random()*1000)},
							{name: '哈尔滨市',value: Math.round(Math.random()*1000)},
							{name: '齐齐哈尔市',value: Math.round(Math.random()*1000)},
							{name: '牡丹江市',value: Math.round(Math.random()*1000)},
							{name: '绥化市',value: Math.round(Math.random()*1000)},
							{name: '伊春市',value: Math.round(Math.random()*1000)},
							{name: '佳木斯市',value: Math.round(Math.random()*1000)},
							{name: '鸡西市',value: Math.round(Math.random()*1000)},
							{name: '双鸭山市',value: Math.round(Math.random()*1000)},
							{name: '大庆市',value: Math.round(Math.random()*1000)},
							{name: '鹤岗市',value: Math.round(Math.random()*1000)},
							{name: '七台河市',value: Math.round(Math.random()*1000)},
							{name: '酒泉市',value: Math.round(Math.random()*1000)},
							{name: '张掖市',value: Math.round(Math.random()*1000)},
							{name: '甘南藏族自治州',value: Math.round(Math.random()*1000)},
							{name: '武威市',value: Math.round(Math.random()*1000)},
							{name: '陇南市',value: Math.round(Math.random()*1000)},
							{name: '庆阳市',value: Math.round(Math.random()*1000)},
							{name: '白银市',value: Math.round(Math.random()*1000)},
							{name: '定西市',value: Math.round(Math.random()*1000)},
							{name: '天水市',value: Math.round(Math.random()*1000)},
							{name: '兰州市',value: Math.round(Math.random()*1000)},
							{name: '平凉市',value: Math.round(Math.random()*1000)},
							{name: '临夏回族自治州',value: Math.round(Math.random()*1000)},
							{name: '金昌市',value: Math.round(Math.random()*1000)},
							{name: '嘉峪关市',value: Math.round(Math.random()*1000)},
							{name: '普洱市',value: Math.round(Math.random()*1000)},
							{name: '红河哈尼族彝族自治州',value: Math.round(Math.random()*1000)},
							{name: '文山壮族苗族自治州',value: Math.round(Math.random()*1000)},
							{name: '曲靖市',value: Math.round(Math.random()*1000)},
							{name: '楚雄彝族自治州',value: Math.round(Math.random()*1000)},
							{name: '大理白族自治州',value: Math.round(Math.random()*1000)},
							{name: '临沧市',value: Math.round(Math.random()*1000)},
							{name: '迪庆藏族自治州',value: Math.round(Math.random()*1000)},
							{name: '昭通市',value: Math.round(Math.random()*1000)},
							{name: '昆明市',value: Math.round(Math.random()*1000)},
							{name: '丽江市',value: Math.round(Math.random()*1000)},
							{name: '西双版纳傣族自治州',value: Math.round(Math.random()*1000)},
							{name: '保山市',value: Math.round(Math.random()*1000)},
							{name: '玉溪市',value: Math.round(Math.random()*1000)},
							{name: '怒江傈僳族自治州',value: Math.round(Math.random()*1000)},
							{name: '德宏傣族景颇族自治州',value: Math.round(Math.random()*1000)},
							{name: '百色市',value: Math.round(Math.random()*1000)},
							{name: '河池市',value: Math.round(Math.random()*1000)},
							{name: '桂林市',value: Math.round(Math.random()*1000)},
							{name: '南宁市',value: Math.round(Math.random()*1000)},
							{name: '柳州市',value: Math.round(Math.random()*1000)},
							{name: '崇左市',value: Math.round(Math.random()*1000)},
							{name: '来宾市',value: Math.round(Math.random()*1000)},
							{name: '玉林市',value: Math.round(Math.random()*1000)},
							{name: '梧州市',value: Math.round(Math.random()*1000)},
							{name: '贺州市',value: Math.round(Math.random()*1000)},
							{name: '钦州市',value: Math.round(Math.random()*1000)},
							{name: '贵港市',value: Math.round(Math.random()*1000)},
							{name: '防城港市',value: Math.round(Math.random()*1000)},
							{name: '北海市',value: Math.round(Math.random()*1000)},
							{name: '怀化市',value: Math.round(Math.random()*1000)},
							{name: '永州市',value: Math.round(Math.random()*1000)},
							{name: '邵阳市',value: Math.round(Math.random()*1000)},
							{name: '郴州市',value: Math.round(Math.random()*1000)},
							{name: '常德市',value: Math.round(Math.random()*1000)},
							{name: '湘西土家族苗族自治州',value: Math.round(Math.random()*1000)},
							{name: '衡阳市',value: Math.round(Math.random()*1000)},
							{name: '岳阳市',value: Math.round(Math.random()*1000)},
							{name: '益阳市',value: Math.round(Math.random()*1000)},
							{name: '长沙市',value: Math.round(Math.random()*1000)},
							{name: '株洲市',value: Math.round(Math.random()*1000)},
							{name: '张家界市',value: Math.round(Math.random()*1000)},
							{name: '娄底市',value: Math.round(Math.random()*1000)},
							{name: '湘潭市',value: Math.round(Math.random()*1000)},
							{name: '榆林市',value: Math.round(Math.random()*1000)},
							{name: '延安市',value: Math.round(Math.random()*1000)},
							{name: '汉中市',value: Math.round(Math.random()*1000)},
							{name: '安康市',value: Math.round(Math.random()*1000)},
							{name: '商洛市',value: Math.round(Math.random()*1000)},
							{name: '宝鸡市',value: Math.round(Math.random()*1000)},
							{name: '渭南市',value: Math.round(Math.random()*1000)},
							{name: '咸阳市',value: Math.round(Math.random()*1000)},
							{name: '西安市',value: Math.round(Math.random()*1000)},
							{name: '铜川市',value: Math.round(Math.random()*1000)},
							{name: '清远市',value: Math.round(Math.random()*1000)},
							{name: '韶关市',value: Math.round(Math.random()*1000)},
							{name: '湛江市',value: Math.round(Math.random()*1000)},
							{name: '梅州市',value: Math.round(Math.random()*1000)},
							{name: '河源市',value: Math.round(Math.random()*1000)},
							{name: '肇庆市',value: Math.round(Math.random()*1000)},
							{name: '惠州市',value: Math.round(Math.random()*1000)},
							{name: '茂名市',value: Math.round(Math.random()*1000)},
							{name: '江门市',value: Math.round(Math.random()*1000)},
							{name: '阳江市',value: Math.round(Math.random()*1000)},
							{name: '云浮市',value: Math.round(Math.random()*1000)},
							{name: '广州市',value: Math.round(Math.random()*1000)},
							{name: '汕尾市',value: Math.round(Math.random()*1000)},
							{name: '揭阳市',value: Math.round(Math.random()*1000)},
							{name: '珠海市',value: Math.round(Math.random()*1000)},
							{name: '佛山市',value: Math.round(Math.random()*1000)},
							{name: '潮州市',value: Math.round(Math.random()*1000)},
							{name: '汕头市',value: Math.round(Math.random()*1000)},
							{name: '深圳市',value: Math.round(Math.random()*1000)},
							{name: '东莞市',value: Math.round(Math.random()*1000)},
							{name: '中山市',value: Math.round(Math.random()*1000)},
							{name: '延边朝鲜族自治州',value: Math.round(Math.random()*1000)},
							{name: '吉林市',value: Math.round(Math.random()*1000)},
							{name: '白城市',value: Math.round(Math.random()*1000)},
							{name: '松原市',value: Math.round(Math.random()*1000)},
							{name: '长春市',value: Math.round(Math.random()*1000)},
							{name: '白山市',value: Math.round(Math.random()*1000)},
							{name: '通化市',value: Math.round(Math.random()*1000)},
							{name: '四平市',value: Math.round(Math.random()*1000)},
							{name: '辽源市',value: Math.round(Math.random()*1000)},
							{name: '承德市',value: Math.round(Math.random()*1000)},
							{name: '张家口市',value: Math.round(Math.random()*1000)},
							{name: '保定市',value: Math.round(Math.random()*1000)},
							{name: '唐山市',value: Math.round(Math.random()*1000)},
							{name: '沧州市',value: Math.round(Math.random()*1000)},
							{name: '石家庄市',value: Math.round(Math.random()*1000)},
							{name: '邢台市',value: Math.round(Math.random()*1000)},
							{name: '邯郸市',value: Math.round(Math.random()*1000)},
							{name: '秦皇岛市',value: Math.round(Math.random()*1000)},
							{name: '衡水市',value: Math.round(Math.random()*1000)},
							{name: '廊坊市',value: Math.round(Math.random()*1000)},
							{name: '恩施土家族苗族自治州',value: Math.round(Math.random()*1000)},
							{name: '十堰市',value: Math.round(Math.random()*1000)},
							{name: '宜昌市',value: Math.round(Math.random()*1000)},
							{name: '襄樊市',value: Math.round(Math.random()*1000)},
							{name: '黄冈市',value: Math.round(Math.random()*1000)},
							{name: '荆州市',value: Math.round(Math.random()*1000)},
							{name: '荆门市',value: Math.round(Math.random()*1000)},
							{name: '咸宁市',value: Math.round(Math.random()*1000)},
							{name: '随州市',value: Math.round(Math.random()*1000)},
							{name: '孝感市',value: Math.round(Math.random()*1000)},
							{name: '武汉市',value: Math.round(Math.random()*1000)},
							{name: '黄石市',value: Math.round(Math.random()*1000)},
							{name: '神农架林区',value: Math.round(Math.random()*1000)},
							{name: '天门市',value: Math.round(Math.random()*1000)},
							{name: '仙桃市',value: Math.round(Math.random()*1000)},
							{name: '潜江市',value: Math.round(Math.random()*1000)},
							{name: '鄂州市',value: Math.round(Math.random()*1000)},
							{name: '遵义市',value: Math.round(Math.random()*1000)},
							{name: '黔东南苗族侗族自治州',value: Math.round(Math.random()*1000)},
							{name: '毕节地区',value: Math.round(Math.random()*1000)},
							{name: '黔南布依族苗族自治州',value: Math.round(Math.random()*1000)},
							{name: '铜仁地区',value: Math.round(Math.random()*1000)},
							{name: '黔西南布依族苗族自治州',value: Math.round(Math.random()*1000)},
							{name: '六盘水市',value: Math.round(Math.random()*1000)},
							{name: '安顺市',value: Math.round(Math.random()*1000)},
							{name: '贵阳市',value: Math.round(Math.random()*1000)},
							{name: '烟台市',value: Math.round(Math.random()*1000)},
							{name: '临沂市',value: Math.round(Math.random()*1000)},
							{name: '潍坊市',value: Math.round(Math.random()*1000)},
							{name: '青岛市',value: Math.round(Math.random()*1000)},
							{name: '菏泽市',value: Math.round(Math.random()*1000)},
							{name: '济宁市',value: Math.round(Math.random()*1000)},
							{name: '德州市',value: Math.round(Math.random()*1000)},
							{name: '滨州市',value: Math.round(Math.random()*1000)},
							{name: '聊城市',value: Math.round(Math.random()*1000)},
							{name: '东营市',value: Math.round(Math.random()*1000)},
							{name: '济南市',value: Math.round(Math.random()*1000)},
							{name: '泰安市',value: Math.round(Math.random()*1000)},
							{name: '威海市',value: Math.round(Math.random()*1000)},
							{name: '日照市',value: Math.round(Math.random()*1000)},
							{name: '淄博市',value: Math.round(Math.random()*1000)},
							{name: '枣庄市',value: Math.round(Math.random()*1000)},
							{name: '莱芜市',value: Math.round(Math.random()*1000)},
							{name: '赣州市',value: Math.round(Math.random()*1000)},
							{name: '吉安市',value: Math.round(Math.random()*1000)},
							{name: '上饶市',value: Math.round(Math.random()*1000)},
							{name: '九江市',value: Math.round(Math.random()*1000)},
							{name: '抚州市',value: Math.round(Math.random()*1000)},
							{name: '宜春市',value: Math.round(Math.random()*1000)},
							{name: '南昌市',value: Math.round(Math.random()*1000)},
							{name: '景德镇市',value: Math.round(Math.random()*1000)},
							{name: '萍乡市',value: Math.round(Math.random()*1000)},
							{name: '鹰潭市',value: Math.round(Math.random()*1000)},
							{name: '新余市',value: Math.round(Math.random()*1000)},
							{name: '南阳市',value: Math.round(Math.random()*1000)},
							{name: '信阳市',value: Math.round(Math.random()*1000)},
							{name: '洛阳市',value: Math.round(Math.random()*1000)},
							{name: '驻马店市',value: Math.round(Math.random()*1000)},
							{name: '周口市',value: Math.round(Math.random()*1000)},
							{name: '商丘市',value: Math.round(Math.random()*1000)},
							{name: '三门峡市',value: Math.round(Math.random()*1000)},
							{name: '新乡市',value: Math.round(Math.random()*1000)},
							{name: '平顶山市',value: Math.round(Math.random()*1000)},
							{name: '郑州市',value: Math.round(Math.random()*1000)},
							{name: '安阳市',value: Math.round(Math.random()*1000)},
							{name: '开封市',value: Math.round(Math.random()*1000)},
							{name: '焦作市',value: Math.round(Math.random()*1000)},
							{name: '许昌市',value: Math.round(Math.random()*1000)},
							{name: '濮阳市',value: Math.round(Math.random()*1000)},
							{name: '漯河市',value: Math.round(Math.random()*1000)},
							{name: '鹤壁市',value: Math.round(Math.random()*1000)},
							{name: '大连市',value: Math.round(Math.random()*1000)},
							{name: '朝阳市',value: Math.round(Math.random()*1000)},
							{name: '丹东市',value: Math.round(Math.random()*1000)},
							{name: '铁岭市',value: Math.round(Math.random()*1000)},
							{name: '沈阳市',value: Math.round(Math.random()*1000)},
							{name: '抚顺市',value: Math.round(Math.random()*1000)},
							{name: '葫芦岛市',value: Math.round(Math.random()*1000)},
							{name: '阜新市',value: Math.round(Math.random()*1000)},
							{name: '锦州市',value: Math.round(Math.random()*1000)},
							{name: '鞍山市',value: Math.round(Math.random()*1000)},
							{name: '本溪市',value: Math.round(Math.random()*1000)},
							{name: '营口市',value: Math.round(Math.random()*1000)},
							{name: '辽阳市',value: Math.round(Math.random()*1000)},
							{name: '盘锦市',value: Math.round(Math.random()*1000)},
							{name: '忻州市',value: Math.round(Math.random()*1000)},
							{name: '吕梁市',value: Math.round(Math.random()*1000)},
							{name: '临汾市',value: Math.round(Math.random()*1000)},
							{name: '晋中市',value: Math.round(Math.random()*1000)},
							{name: '运城市',value: Math.round(Math.random()*1000)},
							{name: '大同市',value: Math.round(Math.random()*1000)},
							{name: '长治市',value: Math.round(Math.random()*1000)},
							{name: '朔州市',value: Math.round(Math.random()*1000)},
							{name: '晋城市',value: Math.round(Math.random()*1000)},
							{name: '太原市',value: Math.round(Math.random()*1000)},
							{name: '阳泉市',value: Math.round(Math.random()*1000)},
							{name: '六安市',value: Math.round(Math.random()*1000)},
							{name: '安庆市',value: Math.round(Math.random()*1000)},
							{name: '滁州市',value: Math.round(Math.random()*1000)},
							{name: '宣城市',value: Math.round(Math.random()*1000)},
							{name: '阜阳市',value: Math.round(Math.random()*1000)},
							{name: '宿州市',value: Math.round(Math.random()*1000)},
							{name: '黄山市',value: Math.round(Math.random()*1000)},
							{name: '巢湖市',value: Math.round(Math.random()*1000)},
							{name: '亳州市',value: Math.round(Math.random()*1000)},
							{name: '池州市',value: Math.round(Math.random()*1000)},
							{name: '合肥市',value: Math.round(Math.random()*1000)},
							{name: '蚌埠市',value: Math.round(Math.random()*1000)},
							{name: '芜湖市',value: Math.round(Math.random()*1000)},
							{name: '淮北市',value: Math.round(Math.random()*1000)},
							{name: '淮南市',value: Math.round(Math.random()*1000)},
							{name: '马鞍山市',value: Math.round(Math.random()*1000)},
							{name: '铜陵市',value: Math.round(Math.random()*1000)},
							{name: '南平市',value: Math.round(Math.random()*1000)},
							{name: '三明市',value: Math.round(Math.random()*1000)},
							{name: '龙岩市',value: Math.round(Math.random()*1000)},
							{name: '宁德市',value: Math.round(Math.random()*1000)},
							{name: '福州市',value: Math.round(Math.random()*1000)},
							{name: '漳州市',value: Math.round(Math.random()*1000)},
							{name: '泉州市',value: Math.round(Math.random()*1000)},
							{name: '莆田市',value: Math.round(Math.random()*1000)},
							{name: '厦门市',value: Math.round(Math.random()*1000)},
							{name: '丽水市',value: Math.round(Math.random()*1000)},
							{name: '杭州市',value: Math.round(Math.random()*1000)},
							{name: '温州市',value: Math.round(Math.random()*1000)},
							{name: '宁波市',value: Math.round(Math.random()*1000)},
							{name: '舟山市',value: Math.round(Math.random()*1000)},
							{name: '台州市',value: Math.round(Math.random()*1000)},
							{name: '金华市',value: Math.round(Math.random()*1000)},
							{name: '衢州市',value: Math.round(Math.random()*1000)},
							{name: '绍兴市',value: Math.round(Math.random()*1000)},
							{name: '嘉兴市',value: Math.round(Math.random()*1000)},
							{name: '湖州市',value: Math.round(Math.random()*1000)},
							{name: '盐城市',value: Math.round(Math.random()*1000)},
							{name: '徐州市',value: Math.round(Math.random()*1000)},
							{name: '南通市',value: Math.round(Math.random()*1000)},
							{name: '淮安市',value: Math.round(Math.random()*1000)},
							{name: '苏州市',value: Math.round(Math.random()*1000)},
							{name: '宿迁市',value: Math.round(Math.random()*1000)},
							{name: '连云港市',value: Math.round(Math.random()*1000)},
							{name: '扬州市',value: Math.round(Math.random()*1000)},
							{name: '南京市',value: Math.round(Math.random()*1000)},
							{name: '泰州市',value: Math.round(Math.random()*1000)},
							{name: '无锡市',value: Math.round(Math.random()*1000)},
							{name: '常州市',value: Math.round(Math.random()*1000)},
							{name: '镇江市',value: Math.round(Math.random()*1000)},
							{name: '吴忠市',value: Math.round(Math.random()*1000)},
							{name: '中卫市',value: Math.round(Math.random()*1000)},
							{name: '固原市',value: Math.round(Math.random()*1000)},
							{name: '银川市',value: Math.round(Math.random()*1000)},
							{name: '石嘴山市',value: Math.round(Math.random()*1000)},
							{name: '儋州市',value: Math.round(Math.random()*1000)},
							{name: '文昌市',value: Math.round(Math.random()*1000)},
							{name: '乐东黎族自治县',value: Math.round(Math.random()*1000)},
							{name: '三亚市',value: Math.round(Math.random()*1000)},
							{name: '琼中黎族苗族自治县',value: Math.round(Math.random()*1000)},
							{name: '东方市',value: Math.round(Math.random()*1000)},
							{name: '海口市',value: Math.round(Math.random()*1000)},
							{name: '万宁市',value: Math.round(Math.random()*1000)},
							{name: '澄迈县',value: Math.round(Math.random()*1000)},
							{name: '白沙黎族自治县',value: Math.round(Math.random()*1000)},
							{name: '琼海市',value: Math.round(Math.random()*1000)},
							{name: '昌江黎族自治县',value: Math.round(Math.random()*1000)},
							{name: '临高县',value: Math.round(Math.random()*1000)},
							{name: '陵水黎族自治县',value: Math.round(Math.random()*1000)},
							{name: '屯昌县',value: Math.round(Math.random()*1000)},
							{name: '定安县',value: Math.round(Math.random()*1000)},
							{name: '保亭黎族苗族自治县',value: Math.round(Math.random()*1000)},
							{name: '五指山市',value: Math.round(Math.random()*1000)}
						]
					};
					option.legend = {
						x:'right',
						data:['随机数据']
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
				var myChart;
					window.CecConfig = require('zrender');
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