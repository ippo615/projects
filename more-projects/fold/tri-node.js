
var TriNode = (function(THREE){

	function TriNode( face, parent ){
		this.face = face;
		this.parent = parent;
		this.children = [];
	}	

	TriNode.prototype.hasFace = function( face ){
		if( this.face === face ){
			return true;
		}
		for( var i=0, l=this.children.length; i<l; i+=1 ){
			if( this.children[i].hasFace(face) ){
				return true;
			}
		}
		return false;
	};

	return TriNode;
})(THREE);

function triNodeFromGeometry( geometry ){

	var root = TriNode( geometry.faces[0] );
	var visitedFaces = [0];
	

}

function geometryGetFaceNeighbors( geometry, faceIndex ){
	var faces = geometry.faces;
	var face = faces[faceIndex];
	var a = face.a;
	var b = face.b;
	var c = face.c;

	function edgeMatch( a1,b1, a2,b2 ){
		return (
			(a1 === a2 && b1 === b2) ||
			(a1 === b2 && b1 === a2)
		);
	}

	var neighbors = [];

	var i = faces.length;
	while( i-- ){
		if( i === faceIndex ){ continue; }
		var iFace = faces[i];

		// there must be a better way 
		// maybe I'm being redundant
		if( edgeMatch( a,b, iFace.c, iFace.a ) ||
		    edgeMatch( a,b, iFace.c, iFace.b ) ||
		    edgeMatch( a,c, iFace.b, iFace.a ) ||
		    edgeMatch( a,c, iFace.b, iFace.c ) ||
		    edgeMatch( b,c, iFace.a, iFace.b ) ||
		    edgeMatch( b,c, iFace.a, iFace.c ) ||
		    edgeMatch( a,b, iFace.a, iFace.b ) ||
		    edgeMatch( b,c, iFace.b, iFace.c ) ||
		    edgeMatch( c,a, iFace.c, iFace.a )
		){
			neighbors.push( i );
		}
	}

	return neighbors;
}

var geometry = new THREE.SphereGeometry( 100, 3, 4 );
geometry.mergeVertices();
console.info( geometry );
console.info( geometryGetFaceNeighbors( geometry, 0 ) );

function buildNestedGeometry( geometry, startIndex ){
	startIndex = startIndex || 0;
	var root = TriNode( startIndex, null );
	var faces = geometry.faces;
	var visited = [];
	
}

function nest( geometry, triNode, root ){
	var neighbors = geometryGetFaceNeighbors( geometry, triNode.face );
	for( var i=0,l=neighbors.length; i<l; i+=1 ){
		if( root.hasFace( neighbors[i] ) ){
			continue;
		}
		triNode.children.push( new TriNode(neighbors[i],triNode) );
	}
	for( var i=0,l=triNode.children.length; i<l; i+=1 ){
		nest( geometry, triNode.children[i], root );
	}
	return triNode;
}

var heir = new TriNode(0,null);
nest( geometry, heir, heir );
console.info( heir );

function nestToTri( geometry, nest ){

	// There is more to be done in this function: adding the children.
	// Some things we need to determine:
	//  - for the root triangle:
	//    - which of a,b,c is base,left,right
	//  - for the other triangles:
	//    - which of a,b,c is left,right (we know base is the parent)
	// how to compute/determine that?
	//     Maybe just match vertices
	// perhaps api:
	//     computeLR( parent[tri], child[triNode] ) -> {
	//         left: { pos, len },
	//         righ: { pos, len }
	//     }
	// or (also needs geometry parameter):
	//     nestExtend( triParent, triNodeChild )
	//     could be recursive, a null parent sets the base
	
	var face = geometry.faces[ nest.face ];
	var a = geometry.vertices[ face.a ];
	var b = geometry.vertices[ face.b ];
	var c = geometry.vertices[ face.c ];

	var base = new Tri( a.x, a.y, b.x, b.y );

	var ab = a.clone().sub(b);
	var ac = a.clone().sub(c);
	var pos = ab.dot( ac ) / ( ab.length()*ac.length() );
	var baseCoord = a.clone().add( ab.clone().normalize().multiplyScalar( pos ) );
	var len = baseCoord.sub( c ).length();
	base.extend( pos, len );

	return base;
}

console.info( nestToTri( geometry, heir ) );

function triangleToTriFold( geometry, faceIndex, sideOrder ){
	var face = geometry.faces[ faceIndex ];
	var a = geometry.vertices[ face[sideOrder[0]] ];
	var b = geometry.vertices[ face[sideOrder[1]] ];
	var c = geometry.vertices[ face[sideOrder[2]] ];

	var base = b.clone().sub(a);
	var right = c.clone().sub(b);
	var left = a.clone.sub(c);

	var origin = base.clone().multiplyScalar( 0.5 );
	
	var ab = a.clone().sub(b);
	var ac = a.clone().sub(c);
	var pos = ab.dot( ac ) / ( ab.length()*ac.length() );
	var baseCoord = a.clone().add( ab.clone().normalize().multiplyScalar( pos ) );
	var len = baseCoord.sub( c ).length();
	
	var angle = Math.atan2( ab.y, ab.x );

	return {
		pos: pos,
		len: len,
		angle: angle
	};
}


