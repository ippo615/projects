
function main( progress ){
	var foldAngle = Math.PI/2.0 * progress;
	var scale = 0.2;
	var length = 11.0*scale;
	var width = 8.0*scale;
	var depth = 2.0*scale;
	var size = 1.0;
    var bevelSize = 0.2;

	var base = new Quad( width, width, length, 0, 0,0 );
	base.right.extend( length, length, depth, foldAngle );
	base.left.extend( length, length, depth, foldAngle );
	base.near.extend( width, width, depth, foldAngle );
	base.far.extend( width, width, depth*2/3, foldAngle );
	
	base.right.left.extend( depth, depth*0.5, depth*0.5, foldAngle );
	base.left.right.extend( depth, depth*0.5, depth*0.5, foldAngle );
	
	base.near.left.extend( depth, depth*0.6, depth, foldAngle );
	base.near.right.extend( depth, depth*0.6, depth, foldAngle );
	
	base.right.far.extend( length, length, width, foldAngle );
	base.right.far.left.extend( width, width, depth*0.5, foldAngle );

	return base;
}
