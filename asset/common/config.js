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
            'value': 'pc'
        },{
            'text': 'M',
            'state': 'm'
        },{
            'text': 'APP',
            'value': 'app'
        }]
    };

    /**
     * 中英文转换词典
     * @type {Object}
     */
    config.dictionary = {
        '日期': 'ds',
        '业务线': 'biz_name',
        '操作系统': 'caozuo',
        '浏览器': 'browser_type'
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
        '业务线': 'TreeMap',
        '日期': 'line',
        '页面类型': 'PieDouble',
        '一级分类': 'PieDouble',
        '二级分类': 'PieDouble'
    };

    window.config = config;
}());