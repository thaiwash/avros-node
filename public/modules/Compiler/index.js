class Compiler {
	compile(group) {
		var self = this
		//console.log("compile")
		headText.add("Compiling: "+spheres.getGroupText(group))
		animate.compileAnimation(group)	
	}
	
	afterAnimation(group) {
		//console.log("compile "+group.length)
		headText.add("Compile Out: "+this.evalCompile(spheres.getGroupText(group)))
	}
	
	evalCompile(str) {
		console.log("eval "+ str)
		var out = null
		try {
			out = eval(str); 
		} catch (e) {
			if (e instanceof SyntaxError) {
				console.log("syntax error");
			}
			
			headText.add(e.message)
		}
		return out;
	}
}