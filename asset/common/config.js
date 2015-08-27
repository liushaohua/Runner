/**
 * 配置对象
 * @copyright 银翼
 * @author liushaohua
 */
(function() {
    'use strict';
    var config = {};
    /**
     * 搜索筛选条件
     * @type {Object}
     */
    config.screen = {
        '业务线': [{
            'text': '1点',
            'value': 1
        },{
            'text': '2点',
            'value': 2,
            'state': 1
        },{
            'text': '3点',
            'value': 3
        },{
            'text': '4点',
            'value': 4
        },{
            'text': '5点',
            'value': 5
        },{
            'text': '6点',
            'value': 6
        }, {
            'text': '7点',
            'value': 7
        }],
        '平台': [{
            'text': 'PC',
            'value': 'pc',
            'state': '1'
        },{
            'text': 'M',
            'value': 'M'
        },{
            'text': 'APP',
            'value': 'APP'
        }],
        '一级分类': [{
            'text': 'PC',
            'value': 'pc'
        },{
            'text': 'M',
            'value': 'M',
            'state': '1'
        },{
            'text': 'APP',
            'value': 'app'
        }]
    };

    /**
     * select参数转换词典
     * @type {Object}
     */
    config.dictionary = {
        '日期': 'ds',
        '时段': 'time_window',
        '一级分类': 'cate1_name',
        '二级分类': 'cate2_name',
        '页面类型': 'page_type',
        '省份': 'province_name',
        '城市': 'city_name',
        '操作系统': 'os_type',
        '分辨率': 'window_size',
        '浏览器': 'browser_type',
        '业务线': 'biz_name',
        '平台': 'platform'
    };

    /**
     * echarts类型转换
     * @type {Object}
     */
    config.echarts_type = {
        '省份': 'Map',
        '时段': 'PieLine',
        '操作系统': 'TreeMap',
        '浏览器': 'TreeMap',
        '分辨率': 'TreeMap',
        'default': 'line',
        //'业务线': 'Radar',
        //'日期': 'line',
        '日期': 'line',
        '页面类型': 'TreeMap',
        '一级分类': 'PieDouble',
        '二级分类': 'PieDouble',
        '城市': 'MapContrast'
    };

    window.config = config;
}());