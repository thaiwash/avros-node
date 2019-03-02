class qMaze extends OSModule {
	constructor(config) {
		super()
		this.mouseCrd = [0,0]
		this.lastCrd = [0,0]
		this.dragChange = [0,0]
		this.mouseDown = false
		this.selectedButton = "point"
		this.actionable = {}
		this.sliderStatus = {}
		
		this.drawData = []
		this.drawingLine = false
		this.drawingRect = false
		
		this.config = config
		
	}
	
	updateTextArea() {
		document.getElementById("qMazeTextArea").value = JSON.stringify(this.drawData, 0, 4)
	}
	
	createInputElements() {
		var textInput = document.createElement("input")
		textInput.id = "qMazeTextInput"
		textInput.style.position = "absolute"
		textInput.style.top = this.config.y + "px"
		textInput.style.left = (this.config.width + this.config.x + 10) + "px"
		textInput.style.width =  150 + "px"
		document.body.appendChild(textInput)
		
		var textArea = document.createElement("textarea")
		textArea.id = "qMazeTextArea"
		textArea.style.fontSize = "10px"
		textArea.style.position = "absolute"
		textArea.style.top =  (this.config.y + 30) + "px"
		textArea.style.left = (this.config.width + this.config.x + 10) + "px"
		textArea.style.width =  150 + "px"
		textArea.style.height = (this.config.height + this.config.y - 40) + "px"
		document.body.appendChild(textArea)
	}
	
	init() {
		var self = this;
		this.createInputElements()
		this.loadJS("CanvasObject.js", function () {
			self.loadImg("img/point.png", function(pointImg) {
				self.pointImg = pointImg;
				self.loadImg("img/delete.png", function(deleteImg) {
					self.deleteImg = deleteImg;
					self.loadImg("img/rect.png", function(rectImg) {
						self.rectImg = rectImg;
						self.afterLoad();
						
					})
				})
			})
		})
	}
	
	/*
	fill(crd, rgb) {
		if (!this.fillStop) {
			this.fillStop = this.getPixel(crd)
		}
		
		this.fill
	}*/
	
	getPixel(crd) {
		var px = this.ctx.getImageData(crd[0], crd[1], 1, 1).data;
		return px;
	}
	
	setPixel(crd, rgb) {
		var id = this.ctx.createImageData(1,1); // only do this once per page
		var d  = id.data;                        // only do this once per page
		d[0]   = rgb[0];
		d[1]   = rgb[1];
		d[2]   = rgb[2];
		
		if (rgb.length > 3) {
			d[3] = rgb[3];
		} else {
			d[3] = 255;
		}
		this.ctx.putImageData( id, crd[0], crd[1] );  
	}
	
	slider(_name, crd) {
		function isEven(n) {
		   return n % 2 == 0;
		}
		var self = this
		crd[0] += 32 + 5
		
		var color = [150,150,150]
		//this.setPixel(crd, color)
		for (var i = 0; i < 5; i ++) {
			this.setPixel([crd[0]+i,crd[1]], color)
		}
		
		for (var i = 0; i < 32; i ++) {
			this.setPixel([crd[0]+2,crd[1]+i], [220,220,220])
			/*
			if (isEven(crd[1]+i)) {
			}	*/
		}
		
		for (var i = 0; i < 32/4; i ++) {
			this.setPixel([crd[0]+1,crd[1]+(i*4)], color)
			this.setPixel([crd[0]+2,crd[1]+(i*4)], color)
			this.setPixel([crd[0]+3,crd[1]+(i*4)], color)
			/*
			if (isEven(crd[1]+i)) {
			}	*/
		}
		
		for (var i = 0; i < 5; i ++) {
			this.setPixel([crd[0]+i,crd[1]+32], color)
		}
		
		var sliderAt = 16
		if (typeof self.sliderStatus[_name] !== "undefined") {
			sliderAt = self.sliderStatus[_name]
		}
		
        this.ctx.fillStyle = 'black'
	    this.ctx.fillRect(crd[0], crd[1]+sliderAt, 5, 3)
		this.ctx.stroke();
		
		if (!self.actionable[_name]) {
			self.actionable[_name] = [
				[crd[0], crd[1], 5, 32],
				function(crd, type) {
					if (type == "drag") {
						//console.log(crd)
						self.sliderStatus[_name] = crd[1];
						self.redraw()
					}
				}
			]
		}
	}
	
	clear() {
        this.ctx.fillStyle = 'white'
	    this.ctx.fillRect(0, 0, this.canvasObject.canvas.width, this.canvasObject.canvas.height)
	    this.ctx.rect(0, 0, this.canvasObject.canvas.width, this.canvasObject.canvas.height)
		this.ctx.stroke();
	}
	
	redraw() {
		this.clear()
		this.buttons()
		this.drawArea()
		this.updateTextArea()
	}
	
	drawArea() {
		var rect = [
			10,
			10, 
			this.canvasObject.canvas.width-15-15-32-5, 
			this.canvasObject.canvas.height-20
		]
		this.ctx.lineWidth = 1;
	    this.ctx.strokeRect(rect[0], rect[1], rect[2], rect[3])
		this.ctx.stroke();
		this.ctx.fillStyle = 'rgb(68, 119, 201)'
	    this.ctx.fillRect(rect[0], rect[1], rect[2], rect[3])
	    this.ctx.stroke();
		
        this.ctx.strokeStyle = 'rgb(0, 59, 155)'
		this.ctx.lineWidth = 1;
		for (var i = 0; i < rect[2]; i += 10){
			this.ctx.beginPath();
			this.ctx.moveTo(rect[0]+i, rect[1]);
			this.ctx.lineTo(rect[0]+i, rect[3]+10);
			this.ctx.stroke(); 
			this.ctx.closePath();
		}
		for (var i = 0; i < rect[3]; i += 10){
			this.ctx.beginPath();
			this.ctx.moveTo(rect[0], rect[1]+i);
			this.ctx.lineTo(rect[2]+10, rect[1]+i);
			this.ctx.stroke(); 
			this.ctx.closePath();
		}
		
		
		for (var i = 0; i < this.drawData.length; i ++) {
			var selected = (this.selectedObject != null) ? (this.selectedObject.id == this.drawData[i].id) : false
			
			if (this.drawData[i].type == "point") {
				this.drawPoint(this.drawData[i].crd, selected)
			}
			
			if (this.drawData[i].type == "line") {
				this.drawLine(this.drawData[i].crd, this.drawData[i].crd2, this.drawData[i].width, selected)
			}
			
			if (this.drawData[i].type == "rect") {
				this.drawRect(this.drawData[i].crd, this.drawData[i].size, selected)
			}
			
		}
		/*
		if (this.selectedObject != null) {
			if (this.selectedObject.type == "point") {
				this.drawPoint(this.selectedObject.crd, true)
			}
		}*/
		
		
		var self = this
		this.actionable["drawArea"] = [rect, function(crd, type) { self.constructiveAction(crd, type) }]
	}
	
	intersectionCheck(crd) {
		for (var i = 0; i < this.drawData.length; i ++) {
			this.clear()
			if (this.drawData[i].type == "point") {
				this.drawPoint(this.drawData[i].crd)
			}
			
			if (this.drawData[i].type == "line") {
				this.drawLine(this.drawData[i].crd, this.drawData[i].crd2, this.drawData[i].width)
			}
			
			if (this.drawData[i].type == "rect") {
				this.drawRect(this.drawData[i].crd, this.drawData[i].size)
			}
			
			if (this.getPixel([crd[0]+10,crd[1]+10])[0] != 255) {
				this.redraw()
				return this.drawData[i]
			}
		}
		this.redraw()
		return null
	}
	
	drawPoint(crd, selected = false) {
		if (selected) {
			this.ctx.strokeStyle = 'red'
			this.ctx.fillStyle = 'red'
		} else {
			this.ctx.strokeStyle = 'rgb(0, 0, 0)'
			this.ctx.fillStyle = 'rgb(0, 0, 0)'
		}
		this.ctx.beginPath();
		this.ctx.arc(crd[0]+10, crd[1]+10, 5, 0, 2 * Math.PI);
		this.ctx.stroke(); 
		this.ctx.fill(); 
		this.ctx.closePath();
	}
	
	drawLine(crd, crd2, width = 5, selected = false) {
		this.ctx.lineWidth = width;
		if (selected) {
			this.ctx.strokeStyle = 'red'
		} else {
			this.ctx.strokeStyle = "rgb(0,0,0)"
		}
		this.ctx.beginPath();
		this.ctx.moveTo(crd[0]+10,crd[1]+10);
		this.ctx.lineTo(crd2[0]+10,crd2[1]+10);
		this.ctx.stroke(); 
		this.ctx.closePath();
		this.ctx.lineWidth = 1;
	}
	
	drawRect(crd, size, selected = false) {
		
		if (selected) {
			this.ctx.fillStyle = 'red'
		} else {
			this.ctx.fillStyle = "rgb(0,0,0)"
		}

		this.ctx.fillRect(crd[0]+10, crd[1]+10, size[0], size[1]);
		this.ctx.stroke(); 
		
	}
	
	getObjectById(id) {
		for (var i = 0; i < this.drawData.length; i ++) {
			if (this.drawData[i].id == id) {
				return this.drawData[i]
			}
		}
	}
	
	removeObjectById(id) {
		for (var i = 0; i < this.drawData.length; i ++) {
			if (this.drawData[i].id == id) {
				this.drawData.splice(i, 1)
			}
		}
	}
	
	constructiveAction(crd, type) {
		var intersecting = this.intersectionCheck(crd)
			
		if (type == "click") {
			if (intersecting != null) {
				this.selectedObject = intersecting;
				this.redraw()
				return;
			}
		}
		
		var needUpdate = false;
		if (type == "drag") {
			if (this.drawingLine) {
				var line = this.getObjectById(this.drawingLine)
				line.crd2 = crd;
				needUpdate = true;
			} else if (this.drawingRect) {
				var rect = this.getObjectById(this.drawingRect)
				rect.size[0] += this.dragChange[0]
				rect.size[1] += this.dragChange[1]
				needUpdate = true;
			} else if (this.selectedObject != null) {
				for (var i = 0; i < this.drawData.length; i++) {
					if (this.selectedObject.type == "point") {
						if (this.drawData[i].id == this.selectedObject.id) {
							this.drawData[i].crd = crd
						}
					}
					
					if (this.selectedObject.type == "line") {
						var line = this.getObjectById(this.selectedObject.id)
						line.crd[0] += this.dragChange[0]
						line.crd[1] += this.dragChange[1]
						line.crd2[0] += this.dragChange[0]
						line.crd2[1] += this.dragChange[1]
						break;
					}
					
					if (this.selectedObject.type == "rect") {
						if (this.drawData[i].id == this.selectedObject.id) {
							this.drawData[i].crd[0] += this.dragChange[0]
							this.drawData[i].crd[1] += this.dragChange[1]
						}
					}
				}
				needUpdate = true;
			}
		}
		
		if (needUpdate) {
			this.redraw()
		}
		if (type == "hover" || type == "drag") {
			if (this.selectedObject != null || intersecting != null) {
				var obj = this.selectedObject
				if (this.intersecting != null) {
					obj = this.intersecting
				}
				this.ctx.fillStyle = 'yellow'
				this.ctx.font = "10px Arial";
				var txt = obj.crd[0]+", "+obj.crd[1];
				
				if (obj.type == "rect"){ txt += ", "+obj.size[0]+", "+obj.size[1] }
				
				this.ctx.fillText(
					txt, 
					obj.crd[0], obj.crd[1]
				); 
			}
		}
		if (needUpdate) {
			return;
		}
					
		if (type == "click") {
			if (this.selectedButton == "point") {
				var obj = {
					id: Math.random(),
					type: "point",
					crd: crd
				}
				this.selectedObject = obj;
				this.drawData.push(obj)
				this.redraw()
			}
			
			if (this.selectedButton == "line") {
				var width = 5;
				if (typeof this.sliderStatus["lineSlider"] !== "undefined") {
					width = Math.round(this.sliderStatus["lineSlider"] / 3);
				}
				
				var id = Math.random()
				var obj = {
					id: id,
					type: "line",
					crd: crd,
					crd2: crd,
					width: width
				}
				this.selectedObject = obj;
				this.drawData.push(obj)
				this.drawingLine = id
			}
			
			if (this.selectedButton == "rect") {
				var id = Math.random()
				var obj = {
					id: id,
					type: "rect",
					crd: crd,
					size: [0,0]
				}
				this.selectedObject = obj;
				this.drawData.push(obj)
				this.drawingRect = id
			}
		}
		
		if (type == "end") {
			this.drawingLine = false
			this.drawingRect = false
		}
		
	}
	
	buttons() {
		var self = this
		function registerAsButton(_name, _area) {
			if (!self.actionable[_name]) {
				self.actionable[_name] = [
					[_area[0], _area[1], _area[2], _area[3]],
					function(crd, type) {
						if (type == "click") {
							self.selectedButton = _name
							self.redraw()
						}
					}
				]
			}
		}
		
		
		var rect = [this.canvasObject.canvas.width - 15 - 32, 10, 32, 32]
		if (this.selectedButton == "point") {
			this.ctx.fillStyle = 'yellow'
			this.ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
		} else {
			this.ctx.fillStyle = 'white'
			this.ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
		}
		registerAsButton("point", rect)
		
		
		this.ctx.drawImage(this.pointImg, rect[0], rect[1], rect[2], rect[3]);
		this.ctx.rect(rect[0], rect[1], rect[2], rect[3]);
		this.ctx.strokeStyle = "rgb(0,0,0)"
		this.ctx.stroke();
		
		rect[1] += 32+10;
		
		registerAsButton("line", rect)
		var pointCrd = [rect[0], rect[1]]
		//setTimeout(function() {
			self.slider("lineSlider",[pointCrd[0], pointCrd[1]])
		//},0)
		
		if (this.selectedButton == "line") {
			this.ctx.fillStyle = 'yellow'
			this.ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
		} else {
			this.ctx.fillStyle = 'white'
			this.ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
		}
		
		
		if (typeof this.sliderStatus["lineSlider"] !== "undefined") {
			this.ctx.lineWidth = Math.round(this.sliderStatus["lineSlider"] / 3);
		} else {
			this.ctx.lineWidth = 5;
		}
		
		this.ctx.strokeStyle = "rgb(0,0,0)"
		this.ctx.beginPath();
		this.ctx.moveTo(rect[0]+5, rect[1]+5);
		this.ctx.lineTo(rect[0]+rect[2]-5, rect[1]+rect[3]-5);
		this.ctx.stroke(); 
		this.ctx.closePath();
			this.ctx.lineWidth = 1;
		//this.ctx.drawImage(this.lineImg, rect[0], rect[1], rect[2], rect[3]);
		this.ctx.rect(rect[0], rect[1], rect[2], rect[3]);
		this.ctx.stroke();
		
			
		rect[1] += 32+10;
		
		registerAsButton("rect", rect)
		if (this.selectedButton == "rect") {
			this.ctx.fillStyle = 'yellow'
			this.ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
		} else {
			this.ctx.fillStyle = 'white'
			this.ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
		}
		this.ctx.drawImage(this.rectImg, rect[0], rect[1], rect[2], rect[3]);
		this.ctx.rect(rect[0], rect[1], rect[2], rect[3]);
		this.ctx.stroke();
		
		
		rect[1] += 32+10;
		this.ctx.drawImage(this.deleteImg, rect[0], rect[1], 16, 16);
		if (!self.actionable["delete"]) {
			self.actionable["delete"] = [
				[rect[0], rect[1], 16, 16],
				function(crd, type) {
					if (type == "click") {
						if (self.selectedObject != null) {
							self.removeObjectById(self.selectedObject.id)
							self.selectedObject = null
							self.redraw	()
						}
					}
				}
			]
		}
		
		/*
		this.ctx.drawImage(this.deleteImg, rect[0], rect[1], 16, 16);
		this.ctx.rect(rect[0], rect[1], 16, 16);
		this.ctx.stroke();**/
		
	}
	
	afterLoad() {
		var self = this;
		this.canvasObject = new CanvasObject(this.config)
		setTimeout(function() {
			self.canvasRect = self.canvasObject.canvas.getBoundingClientRect()
		}, 50);
		this.canvasObject.createCanvasWindow()
		this.ctx = this.canvasObject.ctx;
				
		this.registerMouse();
		this.redraw()
		//ctx.stroke();
	}
	
	action(crd, type) {
		function within(x, y, left, top, width, height) {
			//console.log
			return (y >= top && y < top + height && x >= left && x < left + width);
		}
		var key = Object.keys(q.actionable)
		for (var i = 0; i < key.length; i ++) {
			if (within(
				crd[0],
				crd[1],
				this.actionable[key[i]][0][0],
				this.actionable[key[i]][0][1],
				this.actionable[key[i]][0][2],
				this.actionable[key[i]][0][3]
			)) {
				console.assert(typeof this.actionable[key[i]][1] === "function")
				if (typeof this.actionable[key[i]][1] === "function") {
					this.actionable[key[i]][1]([
						crd[0] - this.actionable[key[i]][0][0],
						crd[1] - this.actionable[key[i]][0][1]
					], type)
				}
			}
		}
	}
	
	registerMouse() {
		var self = this
		document.onmousedown = function(e) {
			//console.log(self.canvasRect)
			self.mouseCrd = [
				e.clientX - self.canvasRect.x, 
				e.clientY - self.canvasRect.y
			]
			self.mouseDown = true
			self.action(self.mouseCrd, "click")
		}


		document.onkeypress = function(e) {
			if (e.key == "Enter") {
				console.log(document.getElementById("t3xt").value)
				commands(document.getElementById("t3xt").value)
			}
		}

		
		document.onmousemove = function(e) {
			self.mouseCrd = [
				e.clientX - self.canvasRect.x, 
				e.clientY - self.canvasRect.y
			]
			if (self.mouseDown) {
				self.dragChange = [
					self.mouseCrd[0] - self.lastCrd[0], 
					self.mouseCrd[1] - self.lastCrd[1]
				]
				self.action(self.mouseCrd, "drag")
			} else {
				self.action(self.mouseCrd, "hover")
			}
			self.lastCrd = [
				self.mouseCrd[0],
				self.mouseCrd[1]
			]
		}
			//pos x 5.77 y 0.01 z -1.52
			/*width 10 height 1
			privot 0.5 0
			scale 0.3 0.3 0.3
			Vertex Color black
			font size 8
			110 up
			107 l
			10eit Down
			10nin r*/
			
			// 4.24 0.05 -1.05
		document.onmouseup = function(e) {
			self.mouseCrd = [
				e.clientX - self.canvasRect.x, 
				e.clientY - self.canvasRect.y
			]
			self.action(self.mouseCrd, "end")
			self.mouseDown = false
		}
				
		document.onkeypress = function(e) {
			if (e.key == "Enter") {
				console.log(document.getElementById("qMazeTextInput").value)
				if (document.getElementById("qMazeTextInput").value == "load") {
					self.drawData = JSON.parse(document.getElementById("qMazeTextArea").value)
					self.redraw()
				}
			}
		}
	}
	
	update() {
		
	}
}