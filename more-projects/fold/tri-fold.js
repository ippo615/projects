
var TriFold = (function(THREE){

	function Tri( width, zAngle, x, y ){

		this.geometry = new THREE.Geometry();
		this.parent = null;

		this.wasMade = false;
		this.right = null;
		this.left = null;
		this.base = null;

		this.width = width;
		this.len = 0.0;
		this.pos = 0.0;
		this.zAngle = zAngle || 0.0;
		this.origin = new THREE.Vector3( x||0.0, y||0.0, 0.0 );
		this.localTransform = (new THREE.Matrix4()).identity();
	}

	Tri.prototype.extend = function( position, length, angle ){

		if( this.wasMade ){
			throw new Error( 'Triangle has been defined already' );
		}

		this.geometry.vertices.push( new THREE.Vector3(-this.width*0.5, 0.0, 0.0) );
		this.geometry.vertices.push( new THREE.Vector3( this.width*0.5, 0.0, 0.0) );
		this.geometry.vertices.push( new THREE.Vector3( 0.0, 0.0, 0.0) );

		var basePoint = this.geometry.vertices[0].clone().lerp( this.geometry.vertices[1], position );
		var delta = this.geometry.vertices[0].clone().sub( this.geometry.vertices[1] );
		var ptAngle = Math.PI/2 + Math.atan2( delta.y, delta.x );
		//this.vertices[0].angleTo( this.vertices[1] );

		this.geometry.vertices[2].x = basePoint.x + length*Math.cos( ptAngle );
		this.geometry.vertices[2].y = basePoint.y + length*Math.sin( ptAngle );

		this.geometry.faces.push(new THREE.Face3(0,1,2));

		this.wasMade = true;

		this.base = new Tri(
			this.geometry.vertices[1].clone().sub( this.geometry.vertices[0] ).length(),
			this.zAngle
		);

		var r = this.geometry.vertices[1].clone().sub( this.geometry.vertices[2] );
		this.right = new Tri(
			r.length(),
			Math.atan2(r.y,r.x)
		);
		this.right.origin = this.geometry.vertices[2].clone().add( this.geometry.vertices[1] ).multiplyScalar(0.5);

		var l = this.geometry.vertices[2].clone().sub( this.geometry.vertices[0] );
		this.left = new Tri(
			l.length(),
			Math.atan2(l.y,l.x)
		);
		this.left.origin = this.geometry.vertices[0].clone().add( this.geometry.vertices[2] ).multiplyScalar(0.5);

		this.base.parent = this;
		this.left.parent = this;
		this.right.parent = this;

		this.localTransform.compose(
			this.origin,
			(new THREE.Quaternion()).setFromEuler( new THREE.Euler(
				angle,
				0.0,
				this.zAngle,
				'YZX'
			)),
			new THREE.Vector3(1,1,1)
		);
		this.geometry.applyMatrix( this.getWorldTransform() );

		this.wasMade = true;
	};

	Tri.prototype.getWorldTransform = function(){
		if( this.parent ){
			return (new THREE.Matrix4()).multiplyMatrices( this.parent.getWorldTransform(), this.localTransform );
		}else{
			return this.localTransform;
		}
	};

	Tri.prototype.getGeometry = function(){
		var geometry = this.geometry.clone();
		if( this.base.wasMade ){ geometry.merge( this.base.getGeometry() ); }
		if( this.left.wasMade ){ geometry.merge( this.left.getGeometry() ); }
		if( this.right.wasMade ){ geometry.merge( this.right.getGeometry() ); }
		geometry.mergeVertices();
		return geometry;
	};

	return Tri;
})(THREE);

