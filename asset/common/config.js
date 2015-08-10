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
            'text': '1z点',
            'value': '1u'
        },{
            'text': '2点',
            'state': '2u'
        },{
            'text': '3点',
            'value': '3u'
        },{
            'text': '4点',
            'value':'4u'
        },{
            'text': '5点',
            'value': '5u'
        },{
            'text': '6点',
            'value': '6u'
        }, {
            'text': '7点',
            'value': '7u'
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

    window.config = config;
}());