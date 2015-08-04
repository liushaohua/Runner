define(function(require) {
    var ECharts = {
        ChartDataFormate: {
            FormateNOGroupData: function (data) {
                //data的格式如上的Result1，这种格式的数据，多用于饼图、单一的柱形图的数据源
                var categories = [];
                var datas = [];
                for (var i = 0; i < data.length; i++) {
                    categories.push(data[i].name || "");
                    datas.push({ name: data[i].name, value: data[i].value || 0 });
                }
                return { category: categories, data: datas };
            },

            FormateGroupData: function (data, type, is_stack, pack) {
                //data的格式如上的Result2，type为要渲染的图表类型：可以为line，bar，is_stack表示为是否是堆积图，这种格式的数据多用于展示多条折线图、分组的柱图
                var chart_type = 'line';
                if (type)
                    chart_type = type || 'line';

                function HandleData (data, is_only) {console.log(data);
                    var xAxis = [];
                    var group = [];
                    var series = [];

                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < xAxis.length && xAxis[j] != data[i].name; j++);
                        if (j == xAxis.length)
                            xAxis.push(data[i].name);

                        for (var k = 0; k < group.length && group[k] != data[i].group; k++);
                        if (k == group.length)
                            group.push(data[i].group);
                    }

                    for (var i = 0; i < group.length; i++) {
                        var temp = [];
                        for (var j = 0; j < data.length; j++) {
                            if (group[i] == data[j].group) {
                                if (type == "map") {
                                    temp.push({ name: data[j].name, value: data[i].value });
                                } else {
                                    temp.push(data[j].value);
                                }
                            }

                        }

                        switch (type) {
                            case 'bar':
                                var series_temp = { name: group[i], data: temp, type: chart_type };
                                if (is_stack)
                                    series_temp = $.extend({}, { stack: 'stack' }, series_temp);
                                break;

                            case 'map':
                                var series_temp = {
                                    name: group[i], type: chart_type, mapType: 'china', selectedMode: 'single',
                                    itemStyle: {
                                        normal: { label: { show: true} },
                                        emphasis: { label: { show: true} }
                                    },
                                    data: temp
                                };
                                break;

                            case 'line':
                                var series_temp = { name: group[i], data: temp, type: chart_type };
                                if (is_stack) {
                                    //series_temp = $.extend({}, {stack: 'stack'}, series_temp);
                                    series_temp.markPoint = {
                                        data : [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                        series_temp.markLine = {
                                            data : [
                                                {type: 'average', name: '平均值'}
                                            ]
                                        }
                                }
                                break;

                            default:
                                var series_temp = { name: group[i], data: temp, type: chart_type };
                        }
                        series.push(series_temp);
                    }
                    if (is_only) {
                        return {series: series };
                    }
                    return { category: group, xAxis: xAxis, series: series };
                }

                if (pack['hasTime']) {
                    console.log(HandleData(data),'niaiwo');
                    var handOption = {
                        origin: function () {
                            var c = 0;
                            for (var i in data) {
                                if (!c) {
                                    c = true;
                                    var d = HandleData(data[i]);
                                    return d;
                                }
                            }
                        } (),
                        options: [function () {
                            var c = 0;
                            for (var i in data) {
                                if (!c) {
                                    c = true;
                                    var d = HandleData(data[i]);
                                    delete data[i];
                                    return d;
                                }
                            }
                        } ()]
                    };

                    for (var i in data) {
                        handOption.options.push(function () {
                            return HandleData(data[i],true);
                        } ());
                    }
                    //console.log(handOption);
                    return handOption;
                }

                return HandleData(data);
            }
        },
        ChartOptionTemplates: {
            CommonOption: {
                //通用的图表基本配置
                tooltip: {
                    trigger: 'axis'//tooltip触发方式:axis以X轴线触发,item以每一个数据项触发
                },
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                }
            },

            CommonLineOptionTimeLine: {//同用配置and add Time line
                timeline : {
                    data : [
                        '2013-001-01', '2013-02-01', '2013-03-01', '2013-04-01', '2013-05-01'
                    ]
                },
                options : [{}]
            },

            CommonLineOption: {//通用的折线图表的基本配置
                tooltip: {
                    trigger: 'axis'
                },
                calculable : true,
                dataZoom: {
                    show: true,
                    start: 30
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: { readOnly: false }, //数据预览
                        restore: true, //复原
                        saveAsImage: true, //是否保存图片
                        magicType: ['line', 'bar']//支持柱形图和折线图的切换
                    }
                }
            },

            Pie: function (data, name) {
                //data:数据格式：{name：xxx,value:xxx}...
                var pie_datas = ECharts.ChartDataFormate.FormateNOGroupData(data);

                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b} : {c} ({d}/%)',
                        show: true
                    },

                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: pie_datas.category
                    },

                    calculable: true,

                    toolbox: {
                        show: true,
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: true },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    series: [
                        {
                            name: name || "",
                            type: 'pie',
                            radius: '65%',
                            center: ['50%', '50%'],
                            data: pie_datas.data
                        }
                    ]
                };
                return $.extend({}, ECharts.ChartOptionTemplates.CommonOption, option);
            },

            Lines: function (data, name, is_stack, pack) {
                //data:数据格式：{name：xxx,group:xxx,value:xxx}...
                console.log(data,'wwwwwwwwwwwwwwwwapp');
                var pack = pack || {},
                    timeLineData = (function () {
                        var cData = [];
                        console.log(pack['hasTime']);
                        if (pack['hasTime']) {
                            console.log(data,666);
                            for (var i in data) {
                                cData.push(i);
                            }
                        }
                        return cData;
                    } ()),
                    stackline_datas = ECharts.ChartDataFormate.FormateGroupData(data, 'line', is_stack, pack);
                var option = {
                    title : {
                        text: pack['title'] || '未设置title',
                        subtext: '纯属虚构'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data: stackline_datas.category,
                        textStyle:{color: '#fff'}
                    },
                    xAxis: [{
                        type: 'category', //X轴均为category，Y轴均为value
                        data: stackline_datas.xAxis,
                        boundaryGap: false,//数值轴两端的空白策略
                        axisLabel : {
                            textStyle:{
                                color:"#fff"
                            }
                        }
                    }],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} °C',
                                textStyle:{
                                    color:"#fff"
                                }
                            }
                        }
                    ],
                    series: stackline_datas.series
                };
                console.log(stackline_datas,'mm');


                if (pack['hasTime']) {
                    var option2 = {
                        title : {
                            text: pack['title'] || '未设置title',
                            subtext: '纯属虚构'
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data: stackline_datas.origin.category,
                            textStyle:{color: '#fff'}
                        },
                        xAxis: [{
                            type: 'category', //X轴均为category，Y轴均为value
                            data: stackline_datas.origin.xAxis,
                            boundaryGap: false,//数值轴两端的空白策略
                            axisLabel : {
                                textStyle:{
                                    color:"#fff"
                                }
                            }
                        }],
                        yAxis : [
                            {
                                type : 'value',
                                axisLabel : {
                                    formatter: '{value} °C',
                                    textStyle:{
                                        color:"#fff"
                                    }
                                }
                            }
                        ]
                    };

                    stackline_datas = stackline_datas.options;
                    stackline_datas[0] = $.extend({}, stackline_datas[0],option2);
                    ECharts.ChartOptionTemplates.CommonLineOptionTimeLine.timeline['data'] = timeLineData;
                    ECharts.ChartOptionTemplates.CommonLineOptionTimeLine.options =  stackline_datas;

                    return ECharts.ChartOptionTemplates.CommonLineOptionTimeLine;

                }
                return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
            },

            Bars: function (data, name, is_stack) {
                //data:数据格式：{name：xxx,group:xxx,value:xxx}...
                var bars_dates = ECharts.ChartDataFormate.FormateGroupData(data, 'bar', is_stack);
                var option = {
                    legend: bars_dates.category,
                    xAxis: [{
                        type: 'category',
                        data: bars_dates.xAxis,
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            rotate: 0,
                            margion: 8
                        }
                    }],

                    yAxis: [{
                        type: 'value',
                        name: name || '',
                        splitArea: { show: true }
                    }],
                    series: bars_dates.series
                };
                return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
            }
        },

        Charts: {
            RenderChart: function (option) {
                require([

                    'echarts',
                    'echarts/chart/line',
                    'echarts/chart/bar',
                    'echarts/chart/pie',
                    'echarts/chart/k',
                    'echarts/chart/scatter',
                    'echarts/chart/radar',
                    'echarts/chart/chord',
                    'echarts/chart/force',
                    'echarts/chart/map'
                    ],

                  function (ec) {
                      echarts = ec;
                      if (option.chart && option.chart.dispose)
                          option.chart.dispose();

                      option.chart = echarts.init(option.container);
                      window.onresize = option.chart.resize;
                      option.chart.setOption(option.option, true);
                  });
            }
        },
        RenderMap: function (option) { }
    };
    return ECharts;
});
  