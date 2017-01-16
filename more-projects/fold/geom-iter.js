
function TriNode( face ){
	this.face = face;
	this.left = null;
	this.right = null;
	this.base = null;
	this.parent = null;
}
TriNode.prototype.hasFace = function( face ){
	if( this.face === face ){ return true; }
	if( this.left && this.left.hasFace( face ) ){ return true; }
	if( this.right && this.right.hasFace( face ) ){ return true; }
	if( this.base && this.base.hasFace( face ) ){ return true; }
	return false;
};

// This is a geometry that allows for querying of faces by vertex.
// Given a vertex number: you can quickly get a list of all the faces
// that touch the vertex.
function IndexGeometry( geometry ){
	var faces = geometry.faces;
	this.geometry = geometry;
	this.vertices = {};
	this.triNode = null;

	var keys = 'abc'.split('');
	for( var i=0, l=faces.length; i<l; i+=1 ){
		var face = faces[i];
		for( var j=0, jl=keys.length; j<jl; j+=1 ){
			if( this.vertices.hasOwnProperty( face[keys[j]] ) ){
				this.vertices[''+face[keys[j]]].push( face );
			}else{
				this.vertices[''+face[keys[j]]] = [ face ];
			}
		}
	}
}

// To find faces that are touching: find faces that share an edge (or
// 2 vertices). Given a vertex we have a list of faces; we have 3 of
// these lists per face. For faces to be neighbors they must share 2
// vertices and will therefore appear in 2 of the lists. If we further
// restrict our geometries to 2-manifold geometries (which is entirely
// reasonable) we realize that the ONLY face that will appear in 2 of
// the lists is a neighbor (and the original face [which is easy to 
// filter]).
IndexGeometry.prototype.getNeighbors = function( face ){
	function inBoth(a,b,that){
		var hashMap = {};
		for( var i=0,l=a.length; i<l; i+=1 ){
			var face = a[i];
			var hash = [face.a,face.b,face.c].join(',');
			hashMap[hash] = face;
		}
		for( var i=0,l=b.length; i<l; i+=1 ){
			var face = b[i];
			var hash = [face.a,face.b,face.c].join(',');
			if( hashMap.hasOwnProperty( hash ) && that !== face ){
				return face;
			}
		}
	}

	return [
		inBoth( this.vertices[ face.a ], this.vertices[ face.b ], face ),
		inBoth( this.vertices[ face.b ], this.vertices[ face.c ], face ),
		inBoth( this.vertices[ face.c ], this.vertices[ face.a ], face )
	];
};
IndexGeometry.prototype.matchEdge = function( faces, a, b ){
	for( var i=0, l=faces.length; i<l; i+=1 ){
		var face = faces[i];
		var hasA = (face.a === a || face.b === a || face.c === a);
		var hasB = (face.a === b || face.b === b || face.c === b);
		if( hasA && hasB ){
			return faces[i];
		}
	}
};
IndexGeometry.prototype.getNeighborsObj = function( face ){
	var neighbors = this.getNeighbors( face );
	return {
		base: this.matchEdge( neighbors, face.a, face.b ),
		right: this.matchEdge( neighbors, face.b, face.c ),
		left: this.matchEdge( neighbors, face.c, face.a )
	}
};

IndexGeometry.prototype.toIterable_old = function( parent ){
	var neighbors = this.getNeighborsObj( parent.face );
	// I have not yet oriented the triangles properly so a "base" face
	// is possible. In the future, I'll need to orient them based on
	// the parent and prevent children from having bases.
	//if( parent.parent === null ){
		if( ! this.triNode.hasFace( neighbors.base ) ){
			parent.base = new TriNode( neighbors.base );
			parent.base.parent = parent;
			this.toIterable( parent.base );
		}
	//}
	if( ! this.triNode.hasFace( neighbors.left ) ){
		parent.left = new TriNode( neighbors.left );
		parent.left.parent = parent;
		this.toIterable( parent.left );
	}
	if( ! this.triNode.hasFace( neighbors.right ) ){
		parent.right = new TriNode( neighbors.right );
		parent.right.parent = parent;
		this.toIterable( parent.right );
	}
};

IndexGeometry.prototype.getNeighborsObj_raw = function( face ){
	var neighbors = this.getNeighbors( face );
	return {
		ab: this.matchEdge( neighbors, face.a, face.b ),
		bc: this.matchEdge( neighbors, face.b, face.c ),
		ca: this.matchEdge( neighbors, face.c, face.a )
	}
};
IndexGeometry.prototype.spinFace = function( face ){
	var d = face.a;
	face.a = face.b;
	face.b = face.c;
	face.c = d;
};
IndexGeometry.prototype.orientedFaceToTri = function( geometry, face, parentFace ){

	var a = geometry.vertices[ face.a ];
	var b = geometry.vertices[ face.b ];
	var c = geometry.vertices[ face.c ];

	//var base = new Tri( a.x, a.y, b.x, b.y );
	// ab.dot(ac)/len(ab) -> projection of ac onto ab
	// we that divide by len(ab) to get a normalized [0-1] length
	var ab = a.clone().sub(b);
	var ac = a.clone().sub(c);
	var pos = ab.dot( ac ) / ( ab.length()*ab.length() );
	var baseCoord = a.clone().add( b.clone().sub(a).multiplyScalar( pos ) );
	var len = baseCoord.sub( c ).length();

	// If we have a parent face, use the face normals to compute
	// the angle between the faces
	var angle = 0.0;
	if( parentFace ){
		var dot = parentFace.normal.clone().dot( face.normal );
		angle = Math.acos( dot / (parentFace.normal.length()*face.normal.length()) );
	}

	return {
		position: pos,
		len: len,
		angle: angle,
		width: ab.length()
	};
};
IndexGeometry.prototype.toIterable = function( parent ){
	// If this face has a parent, spin its abc definition so that its
	// base edge (ab) is coincident with the parent's right or left
	// edge (depending on if it's a right or left child).
	// NOTE: this assumes all faces are oriented the same way (either
	// clockwise or counterclockwisw).
	if( parent.parent ){
		if( parent.parent.right === parent ){
			while( parent.face.b !== parent.parent.face.b ){
				this.spinFace( parent.face );
			}
		}
		if( parent.parent.left === parent ){
			while( parent.face.a !== parent.parent.face.a ){
				this.spinFace( parent.face );
			}
		}
	}

	var neighbors = this.getNeighborsObj( parent.face );
	if( neighbors.base !== parent.parent ){
		//console.info( 'this should not happen: bad base orientation' );
	}

	if( ! this.triNode.hasFace( neighbors.left ) ){
		parent.left = new TriNode( neighbors.left );
		parent.left.parent = parent;
		this.toIterable( parent.left );
	}
	if( ! this.triNode.hasFace( neighbors.right ) ){
		parent.right = new TriNode( neighbors.right );
		parent.right.parent = parent;
		this.toIterable( parent.right );
	}
	if( parent.parent === null ){
		if( ! this.triNode.hasFace( neighbors.base ) ){
			parent.base = new TriNode( neighbors.base );
			parent.base.parent = parent;
			this.toIterable( parent.base );
		}
	}
};


function buildTriFold( geometry, tree, root, angle ){
	//console.info( 'Tree:' );
	//console.info( tree );
	if( tree.right ){
		var parms = IndexGeometry.prototype.orientedFaceToTri( geometry, tree.right.face, tree.face );
		root.right.extend( parms.position, parms.len, parms.angle*angle );
		buildTriFold( geometry, tree.right, root.right, angle );
	}
	if( tree.left ){
		var parms = IndexGeometry.prototype.orientedFaceToTri( geometry, tree.left.face, tree.face );
		root.left.extend( parms.position, parms.len, parms.angle*angle );
		buildTriFold( geometry, tree.left, root.left, angle );
	}
	if( tree.base ){
		var parms = IndexGeometry.prototype.orientedFaceToTri( geometry, tree.base.face, tree.face );
		root.base.extend( parms.position, parms.len, parms.angle*angle );
		buildTriFold( geometry, tree.base, root.base, angle );
	}
}

/*

function printTree( tree ){
	console.info( tree.face );
	if( tree.left ){ printTree( tree.left ); }
	if( tree.right ){ printTree( tree.right ); }
	if( tree.base ){ printTree( tree.base ); }
}

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
geometry.mergeVertices();

console.info( geometry );

var idxGeo = new IndexGeometry( geometry );
console.info( idxGeo );
console.info( geometry.faces[2] );
console.info( idxGeo.getNeighbors( geometry.faces[2] ) );
console.info( idxGeo.getNeighborsObj( geometry.faces[2] ) );

idxGeo.triNode = new TriNode( geometry.faces[0] );
idxGeo.toIterable( idxGeo.triNode );
console.info( idxGeo.triNode );

console.info( 'Tree:' );
printTree( idxGeo.triNode );

var base = idxGeo.orientedFaceToTri( idxGeo.geometry, idxGeo.triNode.face );
var flat = new TriFold(base.width);
var parms = idxGeo.orientedFaceToTri( idxGeo.geometry, idxGeo.triNode.face );
flat.extend( 0, base.len );
console.info( base );
buildTriFold( idxGeo.geometry, idxGeo.triNode, flat, 0 );
console.info( 'Flat:' );
console.info( flat );

// TODO: Iterater over the heirarchy of trianlges compute edge width,
// point projection, and length to make the folding heirachy.

previewFlat.replaceGeometry(flat.getGeometry());
previewFold.replaceGeometry(flat.getGeometry());
console.info( flat.getGeometry() );

function main(progress){
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	geometry.mergeVertices();
	var idxGeo = new IndexGeometry( geometry );
	idxGeo.triNode = new TriNode( geometry.faces[0] );
	idxGeo.toIterable( idxGeo.triNode );
	var base = idxGeo.orientedFaceToTri( idxGeo.geometry, idxGeo.triNode.face );
	var flat = new TriFold(base.width);
	var parms = idxGeo.orientedFaceToTri( idxGeo.geometry, idxGeo.triNode.face );
	flat.extend( 0, base.len );
	buildTriFold( idxGeo.geometry, idxGeo.triNode, flat, progress );

	return flat;
}

*/