
var Preview = (function(){

	function nullAction(){}

	function Preview( options ){
		this.width = ('width' in options) ? options.width : 320;
		this.height = ('height' in options) ? options.height : 240;
		this.parent = ('parent' in options) ? options.parent : null;

		var renderer;
		if( 'renderer' in options ){
			renderer = options.renderer;
		}else{
			renderer = new THREE.WebGLRenderer();
			renderer.setSize(this.width,this.height);
		}
		this.renderer = renderer;

		if( this.parent ){
			this.parent.appendChild( this.renderer.domElement );
		}

		var scene;
		if( 'scene' in options ){
			scene = options.scene;
		}else{
			scene = new THREE.Scene();

			var light = new THREE.DirectionalLight(0xffffff, 2);
			light.position.set(1, 1, 1).normalize();
			scene.add(light);

			var light = new THREE.DirectionalLight(0xffffff);
			light.position.set(-1, -1, -1).normalize();
			scene.add(light);
		}
		this.scene = scene;

		var camera;
		if( 'camera' in options ){
			camera = options.camera;
		}else{
			camera = new THREE.PerspectiveCamera(
				50,
				this.width / this.height,
				1,
				10000
			);
			camera.position.z = -10;
			camera.lookAt( new THREE.Vector3(0,0,0) );
		}
		this.camera = camera;
		this.scene.add( this.camera );

		this.controls = new THREE.OrbitControls( camera );
		this.controls.damping = 0.2;
		//this.controls.addEventListener( 'change', render );

		var materials;
		if( 'materials' in options ){
			materials = options.materials;
		}else{
			materials = [
				new THREE.MeshLambertMaterial({
					color: 0x0088FF
				})
			];
		}
		this.materials = materials;

		if( 'geometry' in options ){
			this.geometry = options.geometry;
			this.object = THREE.SceneUtils.createMultiMaterialObject(
				this.geometry,
				this.materials
			);
		}else if( 'object' in options ){
			this.geometry = null;
			this.object = options.object;
		}

		this.scene.add( this.object );

		this.onRender = ('onRender' in options)? options.onRender : nullAction;
	}

	function makeRenderLoop( that ){
		return function loop(){
			that.render();
			requestAnimationFrame(loop);
		}
	}

	Preview.prototype.render = function(){
		this.onRender( this );
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	};
	Preview.prototype.setSize = function(w,h){
		this.renderer.setSize( w,h );
		this.camera.aspect = w/h;
		this.camera.updateProjectionMatrix();
	};

	function disposeChildren( parent ){
		var c = parent.children;
		if( c.length > 0 ){
			for( var i=0,l=c.length; i<l; i+=1 ){
				disposeChildren( c[i] );
			}
		}
		if( 'geometry' in parent ){
			parent.geometry.dispose();
		}
	}

	Preview.prototype.replaceGeometry = function(geometry){
		disposeChildren( this.object );
		this.scene.remove( this.object );
		this.geometry = geometry;
		this.object = THREE.SceneUtils.createMultiMaterialObject(
			this.geometry,
			this.materials
		);
		this.scene.add( this.object );
	};

	return Preview;

})();
