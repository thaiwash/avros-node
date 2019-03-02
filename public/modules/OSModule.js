class OSModule {
	loadJS(src, cb) {
		var script = document.createElement('script');
		script.onload = function () {
			cb();
		}
		script.src = src;
		document.head.appendChild(script);
	}
	loadImg(src, cb) {
		var img = document.createElement('img');
		img.onload = function () {
			cb(img);
		}
		img.src = src;
		//document.head.appendChild(img);
	}
}