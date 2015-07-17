define(function(require) {
	var routerConfig = [];

	var Router = {
		registerRouter: function(json) {
			if (json.path && json.type) {
				routerConfig.push(json);
			}
		},

		start: function(hash) {

			//如果传入hash，需要判断页面是否进来时候就带有hash，如果带有则
			// 需要判断已带有的hash是否有效，有效则使用，无效则进传入的hash
			if (Router.checkHash(window.location.hash)) {
				Router.enter(window.location.hash);
			} else {
				window.location.hash = hash;
				Router.enter(hash);
			}

			window.onhashchange = function() {
				Router.enter(window.location.hash);	
			}
		},

		enter: function(hash) {

			for (var i = 0; i<routerConfig.length; i++) {
				var path = '#'+routerConfig[i].path;
				if (hash == path) {
					//默认塞入template的容器id为main
					var oMain = document.getElementById('main');
					//alert(routerConfig[i].type)
					require([routerConfig[i].type], function(index) {
						index.beforeRender();
						//替换内容
						oMain.innerHTML = index.template;
						index.initBehavior();
					});
				}
			}
			
		},
		checkHash: function(hash) {
			for (var i = 0; i<routerConfig.length; i++) {
				var path = '#'+routerConfig[i].path;
				if (hash == path) {
					return true;
				}
			}
			return false;
		}
	};

	return Router;
});