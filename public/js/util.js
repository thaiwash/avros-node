
function detachAllChildren(object) {
	while (object.children.length) {
		THREE.SceneUtils.detach(
			object.children[0],
			object,
			OS.scene
		)
	}
}

function removeAllChildren(object) {
}

function getMatrixPosition(object) {
	//OS.scene.updateMatrixWorld()
	var vector = new THREE.Vector3();
	vector.setFromMatrixPosition( object.matrixWorld );
	return vector;
}
	
function getSceneParent(object) {
	while (object.parent.type != "Scene") {
		object = object.parent;
	}
	return object
}

Util = {}
Util.getMatrixPosition = getMatrixPosition