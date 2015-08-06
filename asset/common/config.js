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
     * @type {Array}
     */
    config.screen = {
        '业务线': [{
            'value': '1点'
        },{
            'value': '2点',
            'state': 1
        },{
            'value': '3点'
        },{
            'value': '4点'
        },{
            'value': '5点'
        },{
            'value': '6点'
        }, {
            'value': '7点'
        }],
        '一级分类': [{
            'value': '1z点'
        },{
            'value': '2点',
            'state': 1
        },{
            'value': '3点'
        },{
            'value': '4点'
        },{
            'value': '5点'
        },{
            'value': '6点'
        }, {
            'value': '7点'
        }]
    };

    window.config = config;
}());