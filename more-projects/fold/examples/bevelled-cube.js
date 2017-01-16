
function main( progress ){
	var foldAngle = 0.5*Math.PI/2.0 * progress;
	var size = 1.0;
    var bevelSize = 0.2;

	var base = new Quad( size, size, size, 0, 0,0 );
	base.right.extend( size, size, bevelSize, foldAngle );
	base.left.extend( size, size, bevelSize, foldAngle );
	base.near.extend( size, size, bevelSize, foldAngle );
	base.far.extend( size, size, bevelSize, foldAngle );
	
	base.right.right.extend( bevelSize, 0, bevelSize, foldAngle );
	base.left.right.extend( bevelSize, 0, bevelSize, foldAngle );
	base.near.right.extend( bevelSize, 0, bevelSize, foldAngle );
	base.far.right.extend( bevelSize, 0, bevelSize, foldAngle );
	
	base.right.far.extend( size, size, size, foldAngle );
	base.left.far.extend( size, size, size, foldAngle );
	base.near.far.extend( size, size, size, foldAngle );
	base.far.far.extend( size, size, size, foldAngle );
	
	base.right.far.far.extend( size, size, bevelSize, foldAngle );
	base.left.far.far.extend( size, size, bevelSize, foldAngle );
	base.near.far.far.extend( size, size, bevelSize, foldAngle );
	base.far.far.far.extend( size, size, bevelSize, foldAngle );
	
	base.far.far.far.far.extend( size, size, size, foldAngle );
	
	base.right.far.right.extend( size, size, bevelSize, foldAngle );
	base.left.far.right.extend( size, size, bevelSize, foldAngle );
	base.near.far.right.extend( size, size, bevelSize, foldAngle );
	base.far.far.right.extend( size, size, bevelSize, foldAngle );
	
	base.right.far.far.right.extend( bevelSize, 0, bevelSize, foldAngle );
	base.left.far.far.right.extend( bevelSize, 0, bevelSize, foldAngle );
	base.near.far.far.right.extend( bevelSize, 0, bevelSize, foldAngle );
	base.far.far.far.right.extend( bevelSize, 0, bevelSize, foldAngle );

	return base;
}
