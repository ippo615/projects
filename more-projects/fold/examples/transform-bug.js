
function main( progress ){
	var foldAngle = Math.PI/2.0 * progress;
	var foldAngle2 = -Math.PI/2.0 * progress; 
	var size = 1.0;

	var base = new Quad( size, size, size, 0, 0,0 );
	base.right.extend( size, size, size, foldAngle );
	base.right.right.extend( size, size, size, foldAngle2 );
	base.left.extend( size, size, size, foldAngle );
	base.near.extend( size, size, size, foldAngle );
	base.far.extend( size, size, size, foldAngle );
	base.far.far.extend( size, size, size, foldAngle );

	return base;
}
