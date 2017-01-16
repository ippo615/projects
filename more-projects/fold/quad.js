
//
// TODO:
//  - Clean code
//  - Allow for easier Quad definitions (via negative lengths):
//
//         // Copies the dimensions of the base
//         base.right.extend( -1, -1, -1, angle );
//
//         // Uses the length of the right edge as the nearWidth
//         base.right.extend( -1, farWidth, length, angle );
//
//         // Uses twice the length of the left edge as the farWidth
//         base.left.extend( nearWidth, -2, length, angle );
//
//  - Add a .seam(size,angle) method to create a small seam (for glueing
//    or sewing) on an edge, equivalent to
//    `base.right.extend( -1, -0.95, size, angle )`. Maybe this one is
//    not too useful.
// 
//  - Generate correct STL outputs: currently you can fold a part and
//    not have it match up perfectly with another edge. This can
//    generate stl files that look ok but cannot be 3d-printed. Provide
//    a way to ensure that edges mate exactly (or really closely). Also
//    the outside can become the inside on certain folds (see the
//    snowman example) we need to ensure that for STL printing that the
//    outside is the outside. Parts can be fixed in netfabb but I would
//    rather generate the correct output.
//    More Info: http://www.digits2widgets.com/FileFixing.html
//    More Info: http://www.shapeways.com/tutorials/fixing-non-manifold-models
//

var Quad = (function(THREE){
	function Quad(nearWidth,farWidth,length,zAngle,x,y){

		this.geometry = new THREE.Geometry();

		this.parent = null;

		this.zAngle = zAngle || 0.0;
		this.angle = 0.0;
		this.origin = new THREE.Vector3( x||0, y||0, 0 );
		this.localTransform = (new THREE.Matrix4()).identity();

		this.wasMade = false;
		this.right = null;
		this.left = null;
		this.far = null;
		this.near = null;

		if( nearWidth !== undefined
		&& farWidth !== undefined
		&& length !== undefined
		&& zAngle !== undefined ){
			this.makeGeometry( nearWidth,farWidth,length,0,zAngle );
			this.wasMade = true;
		}

	}

	Quad.prototype.getWorldTransform = function(){
		if( this.parent ){
			return (new THREE.Matrix4()).multiplyMatrices( this.parent.getWorldTransform(), this.localTransform );
		}else{
			return this.localTransform;
		}
	};

	Quad.prototype.makeGeometry = function(nearWidth,farWidth,length,angle,zAngle){
		this.geometry.vertices.push( new THREE.Vector3(-nearWidth*0.5, 0.0, 0.0) );
		this.geometry.vertices.push( new THREE.Vector3( nearWidth*0.5, 0.0, 0.0) );
		this.geometry.vertices.push( new THREE.Vector3( farWidth*0.5,  length, 0.0) );
		this.geometry.vertices.push( new THREE.Vector3(-farWidth*0.5,  length, 0.0) );
		this.geometry.faces.push(new THREE.Face3(0,1,2));
		this.geometry.faces.push(new THREE.Face3(2,3,0));

		this.angle = angle;

		this.localTransform.compose(
			this.origin,
			(new THREE.Quaternion()).setFromEuler( new THREE.Euler(
				angle,
				0.0,
				zAngle,
				'YZX'
			)),
			new THREE.Vector3(1,1,1)
		);

		this.right = new Quad();
		this.left = new Quad();
		this.far = new Quad();
		this.near = new Quad();

		this.right.parent = this;
		this.left.parent = this;
		this.far.parent = this;
		this.near.parent = this;

		this.near.zAngle = Math.atan2(
			this.geometry.vertices[0].y - this.geometry.vertices[1].y,
			this.geometry.vertices[0].x - this.geometry.vertices[1].x
		);
		this.near.origin = new THREE.Vector3(
			0.5*(this.geometry.vertices[0].x + this.geometry.vertices[1].x),
			0.5*(this.geometry.vertices[0].y + this.geometry.vertices[1].y),
			0.5*(this.geometry.vertices[0].z + this.geometry.vertices[1].z)
		);

		this.left.zAngle = Math.atan2(
			this.geometry.vertices[1].y - this.geometry.vertices[2].y,
			this.geometry.vertices[1].x - this.geometry.vertices[2].x
		);
		this.left.origin = new THREE.Vector3(
			0.5*(this.geometry.vertices[1].x + this.geometry.vertices[2].x),
			0.5*(this.geometry.vertices[1].y + this.geometry.vertices[2].y),
			0.5*(this.geometry.vertices[1].z + this.geometry.vertices[2].z)
		);

		this.far.zAngle = Math.atan2(
			this.geometry.vertices[2].y - this.geometry.vertices[3].y,
			this.geometry.vertices[2].x - this.geometry.vertices[3].x
		);
		this.far.origin = new THREE.Vector3(
			0.5*(this.geometry.vertices[2].x + this.geometry.vertices[3].x),
			0.5*(this.geometry.vertices[2].y + this.geometry.vertices[3].y),
			0.5*(this.geometry.vertices[2].z + this.geometry.vertices[3].z)
		);

		this.right.zAngle = Math.atan2(
			this.geometry.vertices[3].y - this.geometry.vertices[0].y,
			this.geometry.vertices[3].x - this.geometry.vertices[0].x
		);
		this.right.origin = new THREE.Vector3(
			0.5*(this.geometry.vertices[3].x + this.geometry.vertices[0].x),
			0.5*(this.geometry.vertices[3].y + this.geometry.vertices[0].y),
			0.5*(this.geometry.vertices[3].z + this.geometry.vertices[0].z)
		);

		this.geometry.applyMatrix( this.getWorldTransform() );

		this.wasMade = true;

	};

	Quad.prototype.extend = function( nearWidth, farWidth, length, angle ){
		if( this.wasMade ){
			throw new Error( 'Edge has been defined already' );
		}

		this.makeGeometry( nearWidth,farWidth,length,angle,this.zAngle,this.origin.x,this.origin.y );
	};

	Quad.prototype.getGeometry = function(){
		var geometry = this.geometry.clone();
		if( this.right.wasMade ){ geometry.merge( this.right.getGeometry() ); }
		if( this.left.wasMade ){ geometry.merge( this.left.getGeometry() ); }
		if( this.far.wasMade ){ geometry.merge( this.far.getGeometry() ); }
		if( this.near.wasMade ){ geometry.merge( this.near.getGeometry() ); }
		geometry.mergeVertices();
		return geometry;
	};

	return Quad;
})(THREE);
