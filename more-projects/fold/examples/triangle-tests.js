
function main( progress ){
	var foldAngle = Math.PI/2.0 * progress;
	var size = 1.0;

    var tri = new Tri(0,0,1,0);
    tri.extend(0,1);

    tri.left.extend( 0,1 );
    tri.right.extend( 0,1 );
    tri.base.extend( 0,1 );

	return tri;
}
	

function main( progress ){
	var foldAngle = Math.PI/2.0 * progress;
	var size = 1.0;

	var base = new Tri( 0, 0, 1, 0 );
	base.extend( 0, 1 );

    base.right.extend( 0, -1 );
    base.left.extend( 0, -1 );
    
    base.right.right.extend(0,1);
    base.right.left.extend(0,1);

	return base;
}


function main( progress ){
	var foldAngle = Math.PI/2.0 * progress;
	var size = 1.0;

	var base = new Tri( 0, 0, 1, 0 );
	base.extend( 0, 1 );

	return base;
}


function main( progress ){
	var foldAngle = Math.PI/2.0 * progress;
	var size = 1.0;

	var tri = new Tri( 0, 0, 1, 0 );
	tri.extend( 0, 1 );
	tri.base.extend(0.5, 1);
	tri.right.extend(0.5, 1);
	tri.left.extend(0.5, 1);

    return base;
}

function main( progress ){
	var geometry = new THREE.BoxGeometry( 1,1,1 );
	var heir = new TriNode(0,null);
	nest( geometry, heir, heir );
	return nestToTri( geometry, heir );
}


function main( progress ){
	var geometry = new THREE.BoxGeometry( 1,1,1 );
	var heir = new TriNode(0,null);
	nest( geometry, heir, heir );
	var tri = nestToTri( geometry, heir );
	tri.right.extend(0,1);
	tri.left.extend(0,1);
	return tri;
}

// Manual Folding Triangle:

function main( progress ){
	var foldAngle = Math.PI/4.0 * progress;
	var size = 1.0;

	var base = new TriFold( 1, 1 );
	base.extend(0.5,1);
	base.right.extend( 0.5, 1, foldAngle );
	base.right.right.extend( 0.5, 1, foldAngle );
	base.right.left.extend( 0.5, 1, foldAngle );
	base.left.extend( 0.5, 1, foldAngle );

	return base;
}
