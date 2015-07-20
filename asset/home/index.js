define(function(require) {
	
	var home = {};

    home.template = require('text!./index.html');

    home.beforeRender = function() {
		//在页面渲染之前执行，获取数据

		console.log('beforeRender');
	}

    home.initBehavior = function() {
		//在页面渲染之后执行，对页面进行操作
		console.log('initBehavior','uuu');
		// 使用
		$(document).trigger('Runner/hashChange')
		require(['echarts/echarts-all','echarts/chart/macarons'],
			function (ec,theme) {
				// 基于准备好的dom，初始化echarts图表
				var myChart = echarts.init(document.getElementById('main2'),theme);

				var option = {
					tooltip: {
						show: true
					},
					legend: {
						data:['销量','销量3']
					},
					xAxis : [
						{
							type : 'category',
							data : ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
						}
					],
					yAxis : [
						{
							type : 'value'
						}
					],
					series : [
						{
							"name":"销量",
							"type":"bar",
							"data":[5, 20, 40, 10, 10, 20]
						},
						{
							"name":"销量3",
							"type":"bar",
							"data":[52, 25, 40, 10, 10, 20]
						}
					]
				};

				// 为echarts对象加载数据
				myChart.setOption(option);
			}
		);
	}

	return home;
});