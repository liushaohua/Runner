define(function(require) {

    var router = require('router');

	router.registerRouter({
		path: '/home/',
		type: 'home/index'
	});

	router.registerRouter({
		path: '/tool/',
		type: 'tool/index'
	});

    router.registerRouter({
        path: '/info/',
        type: 'info/index'
    })
	router.start('/home/');
});


/*
* path代表的是哪个hash触发这个action，type代表触发这个action的时候获取哪个文件
* */
