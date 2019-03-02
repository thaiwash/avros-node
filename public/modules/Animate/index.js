// tweening

class Animate extends OSModule {
	init() {
		this.loaded = false;
		var self = this;
		this.loadJS("https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js", function() {
			self.loadTween()
		})
		
		/* this.tweenTimer = setInterval(function () {
			TWEEN.update();
		}, 100); */
	}
	
	loadTween() {
		this.loaded = true;
		/*
		var position = { x : 0, y: 300 };
		var target = { x : 400, y: 50 };
		var tween = new TWEEN.Tween(position).to(target, 2000);
		
		tween.onUpdate(function(){
			console.log(position.x);
			console.log(position.y);
		});
		tween.start();
		*/
	}
	
	compileAnimation(group, funcCb) {
		if (group == null) { return null }
		
		if (!this.loaded) {
			var self = this;
			this.wait = setTimeout(function() { self.compileAnimation(group) }, 100);
			return;
		}
		var to = { cnt: 0 };
		var from = { cnt: group.length+1 };
		var tween = new TWEEN.Tween(from).to(to, 500);
		tween.onUpdate(function(){
			for (var i = 0; i < group.length; i ++) {
				group[i].material.color.setHex( spheres.defaultColor )
			}
			
			if (typeof group[Math.round(from.cnt)] !== "undefined") {
				group[Math.round(from.cnt)].material.color.setHex( 0xf4ff32 )
			}
		});
		
		//compiler.afterAnimation(group)
		setTimeout(function () {
			for (var i = 0; i < group.length; i ++) {
				group[i].material.color.setHex( spheres.defaultColor )
			}
			
			if (typeof compiler !== "undefined") {
				compiler.afterAnimation(group)
			}
		}, 600)
//console.log("here")
		/*tween.onComplete(function() {
			//delete(tween)
			tween = null
		});
		*/
		tween.start();
	}
	
	update() {
		if (!this.loaded) {
			return
		}
		// this or timer?
		TWEEN.update();
	}
	
}