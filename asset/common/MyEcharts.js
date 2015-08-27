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
                var chart_type = 'line',
                    pack = pack || {};
                if (type)
                    chart_type = type || 'line';

                function HandleData (data, is_only) {
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
                                if (type == "map" || type == "pieline" || type == 'piedouble') {
                                    temp.push({ name: data[j].name, value: data[j].value });
                                } else if (type == "treemap") {
                                    temp.push({
                                        name: data[j].name,
                                        value: data[j].value,
                                        itemStyle: {
                                            normal: {
                                                color: function(lower, upper) {
                                                    return '#' + Math.floor(Math.random() * (upper - lower + 1) + lower).toString(16);
                                                }(0, 0xF0F0F0),
                                            },
                                            emphasis: {
                                                label: {
                                                    show: false
                                                }
                                            }
                                        }
                                    });
                                } else if (type == "piepage") {console.log('uioioio');
                                    temp.push({
                                        name: data[j].name,
                                        value: data[j].value,
                                        itemStyle : {normal : {
                                            label : {show : j > 28},
                                            labelLine : {show : j > 28, length:20}
                                        }}
                                    });
                                } else {
                                    temp.push(data[j].value);
                                }
                            }

                        }

                        switch (type) {
                            case 'bar':
                                var series_temp = {
                                    name: group[i],
                                    data: temp,
                                    type: chart_type ,
                                    itemStyle: {
                                        normal: {
                                            color: function(params) {
                                                // build a color map as your need.
                                                var colorList = [
                                                    '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                                ];
                                                return colorList[params.dataIndex]
                                            },
                                            label: {
                                                show: true,
                                                position: 'top',
                                                formatter: '{b}\n{c}'
                                            }
                                        }
                                    },
                                };
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

                            case 'pieline':
                                var series_temp = {
                                    name: group[i], type: 'pie',
                                    center: ['50%', '45%'],
                                    radius: '50%',
                                    data: temp
                                };
                                break;

                            case 'piedouble':
                                //var centerNum = ['25%', '75%'];
                                var centerNum = ['50%', '75%'];
                                var series_temp = {
                                    name: group[i], type: 'pie',
                                    radius : '55%',
                                    center : [centerNum[i], '47%'],
                                    roseType : 'radius',
                                    width: '40%',       // for funnel
                                    max: 10000000,
                                    data: temp
                                };
                                if (i == 0) {
                                    series_temp.itemStyle = {
                                        normal : {
                                            label : {
                                                show : false
                                            },
                                            labelLine : {
                                                show : false
                                            }
                                        },
                                        emphasis : {
                                            label : {
                                                show : true
                                            },
                                            labelLine : {
                                                show : true
                                            }
                                        }
                                    };
                                } else {
                                    series_temp.sort = 'ascending';
                                }
                                break;

                            case 'piepage':
                                var series_temp = {
                                    name: group[i], type: 'pie',
                                    radius : [i * 4 + 40, i * 4 + 43],
                                    markPoint: {
                                        symbol:'emptyCircle',
                                        symbolSize:[i * 4 + 40, i * 4 + 43],
                                        effect:{show:true,scaleSize:12,color:'rgba(250,225,50,0.8)',shadowBlur:10,period:30},
                                        data:[{x:'50%',y:'50%'}]
                                    },
                                    data: temp
                                };
                                break;

                            case 'treemap':
                                var series_temp = {
                                    name: group[i], type: chart_type,
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: true,
                                                formatter: "{b}: {c}",
                                                textStyle: {
                                                    color: '#00ffdd',
                                                    fontFamily: 'Times New Roman",Georgia,Serif',
                                                    fontSize: 20,
                                                    fontStyle: 'italic',
                                                    fontWeight: 'bolder'
                                                }
                                            },
                                            borderWidth: 1,
                                            borderColor: '#000'
                                        },
                                        emphasis: {
                                            label: {
                                                show: true,
                                                textStyle: {
                                                    color: '#0000ff',
                                                    fontFamily: 'Times New Roman",Georgia,Serif',
                                                    fontSize: 18,
                                                    fontStyle: 'normal',
                                                    fontWeight: 'bold'
                                                }
                                            },
                                            color: '#cc99cc',
                                            borderWidth: 3,
                                            borderColor: '#996699'
                                        }
                                    },
                                    data: temp
                                };
                                break;

                            case 'line':
                                var series_temp = { name: group[i], data: temp, type: chart_type };
                                if (is_stack) {
                                    series_temp = $.extend({}, {stack: 'stack'}, series_temp);
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
                                } else {
                                    series_temp.itemStyle = {normal: {areaStyle: {type: 'default'}}};
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

                    if (type == 'map' || type == 'pieline' || type == 'piepage' || type == 'piedouble') {
                        return { category: group, series: series };
                    }else if (type == 'treemap') {
                        return {series: series};
                    }
                    return { category: group, xAxis: xAxis, series: series };
                }

                if (pack['hasTime']) {
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
                    ],
                    label : {
                        formatter : function(s) {
                            return s.slice(0, 10);
                        },
                        textStyle: {
                            color: '#fff'
                        }
                    },
                },
                options : [{}]
            },

            CommonLineOption: {//通用的折线图表的基本配置
                tooltip: {
                    trigger: 'axis'
                },
                calculable : true,
                toolbox: {
                    show: false,
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
                var pack = pack || {},
                    timeLineData = (function () {
                        var cData = [];
                        if (pack['hasTime']) {
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
                        subtext: ''
                    },
                    dataZoom: {
                        show: true,
                        start: 30
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
                        },
                        splitLine : {    // 轴线
                            show: false
                        }
                    }],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}',
                                textStyle:{
                                    color:"#fff"
                                }
                            },
                            splitLine : {    // 轴线
                                show: false
                            }
                        }
                    ],
                    series: stackline_datas.series
                };

                /*if (pack['hasTime']) {
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
                    var optionLine = ECharts.ChartOptionTemplates.CommonLineOptionTimeLine;
                    optionLine.timeline['data'] = timeLineData;
                    optionLine.options = stackline_datas;
                    return optionLine;

                }*/
                return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
            },

            Bars: function (data, name, is_stack) {
                //data:数据格式：{name：xxx,group:xxx,value:xxx}...
                var bars_dates = ECharts.ChartDataFormate.FormateGroupData(data, 'bar', is_stack);
                var option = {
                    dataZoom: {
                        show: true,
                        start: 30
                    },
                    legend:{
                        data: bars_dates.category,
                        textStyle:{color: '#fff'}
                    },
                    xAxis: [{
                        type: 'category',
                        data: bars_dates.xAxis,
                        axisLabel : {
                            textStyle:{
                                color:"#fff"
                            }
                        },
                        splitLine : {    // 轴线
                            show: false
                        }
                    }],

                    yAxis: [{
                        type: 'value',
                        axisLabel : {
                            formatter: '{value}',
                            textStyle:{
                                color:"#fff"
                            }
                        },
                        splitLine : {    // 轴线
                            show: false
                        }
                    }],
                    series: bars_dates.series
                };

                return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
            },

            Map: function (data, name, is_stack, pack) {
                var pack = pack || {},
                    timeLineData = (function () {
                        var cData = [];
                        if (pack['hasTime']) {
                            for (var i in data) {
                                cData.push(i);
                            }
                        }
                        return cData;
                    } ()),
                    stackline_datas = ECharts.ChartDataFormate.FormateGroupData(data, 'map', is_stack, pack);
                var option = {
                    title : {
                        text: pack['title'] || '未设置title',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    legend: {
                        data: stackline_datas.category,
                        orient: 'vertical',
                        x:'left',
                        textStyle:{color: '#fff'}
                    },
                    dataRange: {
                        min: 0,
                        max: 10000000,
                        x: 'left',
                        y: 'bottom',
                        text:['高','低'],           // 文本，默认为数值文本
                        calculable : true
                    },
                    toolbox: {
                        show: false
                    },
                    roamController: {
                        show: true,
                        x: 'right',
                        mapTypeControl: {
                            'china': true
                        }
                    },
                    series: stackline_datas.series
                };

                if (pack['hasTime']) {
                    var option2 = {
                        title : {
                            text: pack['title'] || '未设置title',
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item'
                        },
                        legend: {
                            data: stackline_datas.origin.category,
                            orient: 'vertical',
                            x:'left',
                            textStyle:{color: '#fff'}
                        },
                        dataRange: {
                            min: 0,
                            max: 1000000,
                            x: 'left',
                            y: 'bottom',
                            text:['高','低'],           // 文本，默认为数值文本
                            calculable : true
                        },
                        toolbox: {
                            show: false,
                            orient : 'vertical',
                            x: 'right',
                            y: 'center',
                            feature : {
                                mark : {show: true},
                                dataView : {show: true, readOnly: false},
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },
                        roamController: {
                            show: true,
                            x: 'right',
                            mapTypeControl: {
                                'china': true
                            }
                        }
                    };

                    stackline_datas = stackline_datas.options;
                    stackline_datas[0] = $.extend({}, stackline_datas[0],option2);
                    var optionLine = ECharts.ChartOptionTemplates.CommonLineOptionTimeLine;
                    optionLine.timeline['data'] = timeLineData;
                    optionLine.options = stackline_datas;
                    return optionLine;

                }
                return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
            },
            PiePage: function (data, name, is_stack, pack) {
                var pack = pack || {},
                    timeLineData = (function () {
                        var cData = [];
                        if (pack['hasTime']) {
                            for (var i in data) {
                                cData.push(i);
                            }
                        }
                        return cData;
                    } ()),
                    stackline_datas = ECharts.ChartDataFormate.FormateGroupData(data, 'piepage', is_stack, pack);

                if (pack['hasTime']) {
                    var option = {
                        title : {
                            text: pack['title'] || '未设置title',
                            x:'right',
                            y:'bottom'
                        },
                        tooltip : {
                            trigger: 'item'
                        },
                        legend: {
                            orient : 'vertical',
                            x : 'left',
                            data: stackline_datas.origin.category
                        },
                        toolbox: {
                            show : true,
                            feature : {
                                mark : {show: true},
                                dataView : {show: true, readOnly: false},
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },
                        calculable : false
                    };

                    stackline_datas = stackline_datas.options;
                    stackline_datas[0] = $.extend({}, stackline_datas[0],option);

                    var optionLine = ECharts.ChartOptionTemplates.CommonLineOptionTimeLine;
                    optionLine.timeline['data'] = timeLineData;
                    optionLine.options = stackline_datas;
                    return optionLine;

                }
                return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
            },
            TreeMap: function (data, name, is_stack, pack) {
                var pack = pack || {},
                    timeLineData = (function () {
                        var cData = [];
                        if (pack['hasTime']) {
                            for (var i in data) {
                                cData.push(i);
                            }
                        }
                        return cData;
                    } ()),
                    stackline_datas = ECharts.ChartDataFormate.FormateGroupData(data, 'treemap', is_stack, pack);

                if (pack['hasTime']) {
                    function sortArr(m,n){
                        return m['value']>n['value']?1:(m['value']<n['value']?-1:0);
                    }
                    var option = {
                        title : {
                            text: pack['title'] || '未设置title'
                        },
                        tooltip : {
                            trigger: 'item'
                        },
                        legend: {
                            data: function () {
                                var cData = [],
                                    sList = data[timeLineData[1]].sort(sortArr).reverse().slice(0,5);
                                for (var i = 0,len = sList.length; i < len; i++) {
                                    cData.push(sList[i].name);
                                }
                                return cData;
                            }(),
                            textStyle:{color: '#fff'}
                        },
                        toolbox: {
                            show : false
                        },
                        hoverable : true
                    };

                    stackline_datas = stackline_datas.options;
                    stackline_datas[0] = $.extend({}, stackline_datas[0],option);
                    stackline_datas[0].series[0]['name'] = stackline_datas[0].series[1]['name'] = '';
console.log('zzzz',stackline_datas[0].series[0]);
                    var optionLine = ECharts.ChartOptionTemplates.CommonLineOptionTimeLine;
                    optionLine.timeline['data'] = timeLineData;
                    optionLine.timeline['y'] = '90%';
                    optionLine.options = stackline_datas;
                    return optionLine;

                }
                return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
            },
            PieLine: function (data, name, is_stack, pack) {
                var pack = pack || {},
                    timeLineData = (function () {
                        var cData = [];
                        if (pack['hasTime']) {
                            for (var i in data) {
                                cData.push(i);
                            }
                        }
                        return cData;
                    } ()),
                    stackline_datas = ECharts.ChartDataFormate.FormateGroupData(data, 'pieline', is_stack, pack);

                if (pack['hasTime']) {
                    var option = {
                        title : {
                            text: pack['title'] || '未设置title'
                        },
                        tooltip : {
                            trigger: 'item'
                        },
                        legend: {
                            data: function () {
                                var c = 0,
                                    cData = [];
                                for (var i in data) {
                                    var data_array = data[i];
                                    if (c == 0)  {
                                        for (var j = 0, len = data_array.length; j < len; j++) {
                                            cData.push(data_array[j]['name']);
                                        }
                                        c = 1;
                                    }
                                }
                                return cData;
                            } (),
                            textStyle:{color: '#fff'},
                            orient : 'center',
                            x : 'left',
                            itemWidth: 33
                        },
                        toolbox: {
                            show : false
                        },
                        hoverable : true
                    };

                    stackline_datas = stackline_datas.options;
                    stackline_datas[0] = $.extend({}, stackline_datas[0],option);

                    var optionLine = ECharts.ChartOptionTemplates.CommonLineOptionTimeLine;
                    optionLine.timeline['data'] = timeLineData;
                    optionLine.options = stackline_datas;
                    return optionLine;

                }
                return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
            },
            PieDouble: function (data, name, is_stack, pack) {
                var pack = pack || {},
                    timeLineData = (function () {
                        var cData = [];
                        if (pack['hasTime']) {
                            for (var i in data) {
                                cData.push(i);
                            }
                        }
                        return cData;
                    } ()),
                    stackline_datas = ECharts.ChartDataFormate.FormateGroupData(data, 'piedouble', is_stack, pack);

                if (pack['hasTime']) {
                    var option = {
                        title : {
                            text: pack['title'] || '未设置title',
                            x:'left'
                        },
                        tooltip : {
                            trigger: 'item'
                        },
                        legend: {
                            data: function () {
                                var c = 0,
                                    cData = [];
                                for (var i in data) {
                                    var data_array = data[i];
                                    if (c == 0)  {
                                        for (var j = 0, len = data_array.length; j < len; j++) {
                                            cData.push(data_array[j]['name']);
                                        }
                                        c = 1;
                                    }
                                }
                                return cData;
                            } (),
                            x : 'center',
                            y : 'top',
                            textStyle:{color: '#fff'}
                        },
                        toolbox: {
                            show : false
                        },
                        calculable : true
                    };

                    stackline_datas = stackline_datas.options;
                    stackline_datas[0] = $.extend({}, stackline_datas[0],option);

                    var optionLine = ECharts.ChartOptionTemplates.CommonLineOptionTimeLine;
                    optionLine.timeline['data'] = timeLineData;
                    optionLine.timeline['y'] = '88%';
                    optionLine.options = stackline_datas;
                    return optionLine;

                }
                return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
            },
            MapContrast: function (data) {
                var option = {
                    tooltip : {
                        trigger: 'item'
                    },
                    toolbox: {
                        show : false
                    },
                    series : [
                        {
                            tooltip: {
                                trigger: 'item',
                                formatter: '{b}'
                            },
                            name: '选择器',
                            type: 'map',
                            mapType: 'china',
                            mapLocation: {
                                x: 'left',
                                y: 'top',
                                width: '30%'
                            },
                            roam: true,
                            selectedMode : 'single',
                            itemStyle:{
                                emphasis:{label:{show:true}}
                            },
                            data:[
                                {name: '北京', selected:false},
                                {name: '天津', selected:false},
                                {name: '上海', selected:false},
                                {name: '重庆', selected:false},
                                {name: '河北', selected:false},
                                {name: '河南', selected:false},
                                {name: '云南', selected:false},
                                {name: '辽宁', selected:false},
                                {name: '黑龙江', selected:false},
                                {name: '湖南', selected:false},
                                {name: '安徽', selected:false},
                                {name: '山东', selected:false},
                                {name: '新疆', selected:false},
                                {name: '江苏', selected:false},
                                {name: '浙江', selected:false},
                                {name: '江西', selected:false},
                                {name: '湖北', selected:false},
                                {name: '广西', selected:false},
                                {name: '甘肃', selected:false},
                                {name: '山西', selected:false},
                                {name: '内蒙古', selected:false},
                                {name: '陕西', selected:false},
                                {name: '吉林', selected:false},
                                {name: '福建', selected:false},
                                {name: '贵州', selected:false},
                                {name: '广东', selected:false},
                                {name: '青海', selected:false},
                                {name: '西藏', selected:false},
                                {name: '四川', selected:false},
                                {name: '宁夏', selected:false},
                                {name: '海南', selected:false},
                                {name: '台湾', selected:false},
                                {name: '香港', selected:false},
                                {name: '澳门', selected:false}
                            ]
                        }
                    ],
                    animation: false
                };
                return option;
            },
            Radar: function (data) {
                var data = [
                    {
                        name : '降水量1',
                        value : [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 75.6, 82.2, 48.7, 18.8, 6.0, 2.3],
                    },
                    {
                        name:'蒸发量',
                        value:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 35.6, 62.2, 32.6, 20.0, 6.4, 3.3]
                    }
                ];
                var title = [];
                for (var i = 0; i < data.length; i++) {
                    title.push(data[i]['name']);
                }
                console.log(JSON.stringify(data));
                var option = {
                    title : {
                        text: '多雷达图'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        x : 'center',
                        data:title,
                        textStyle:{color: '#fff'}
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    polar : [
                        {
                            name: {
                                show: true,
                                textStyle:{
                                    color:"#fff"
                                }
                            },
                            indicator : (function (){
                                var res = [];
                                for (var i = 1; i <= 24; i++) {
                                    res.push({text:i+'月',max:100});
                                }
                                return res;
                            })(),
                            radius : 80,
                            textStyle:{color: '#fff'}
                        }
                    ],
                    series : [
                        {
                            type: 'radar',
                            polarIndex : 0,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data : [
                                {
                                    name : '降水量',
                                    value : [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 75.6, 82.2, 48.7, 18.8, 6.0, 2.3],
                                },
                                {
                                    name:'蒸发量',
                                    value:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 35.6, 62.2, 32.6, 20.0, 6.4, 3.3]
                                }
                            ]
                        }
                    ]
                };

                option.data = data;
                return option;
            },
            Browser: function (data, name, is_stack, pack) {
                var pack = pack || {},
                    timeLineData = (function () {
                        var cData = [];
                        if (pack['hasTime']) {
                            for (var i in data) {
                                cData.push(i);
                            }
                        }
                        return cData;
                    } ()),
                    stackline_datas = ECharts.ChartDataFormate.FormateGroupData(data, 'bar', is_stack, pack);

                if (pack['hasTime']) {
                    var option = {
                        title : {
                            text: pack['title'] || '未设置title',
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item'
                        },
                        xAxis: [{
                            type: 'category', //X轴均为category，Y轴均为value
                            data: stackline_datas.origin.xAxis,
                            show: false
                        }],
                        yAxis: [{
                            type: 'value',
                            show: false
                        }],
                        calculable: true,
                        grid: {
                            borderWidth: 0,
                            y: 80,
                            y2: 60
                        }
                    };

                    stackline_datas = stackline_datas.options;
                    stackline_datas[0] = $.extend({}, stackline_datas[0],option);

                    var optionLine = ECharts.ChartOptionTemplates.CommonLineOptionTimeLine;
                    optionLine.timeline['data'] = timeLineData;
                    optionLine.options = stackline_datas;
                    return optionLine;

                }
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
