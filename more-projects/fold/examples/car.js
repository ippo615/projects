
function main( progress ){
	
    // Roof / windows
	var roof = new Quad( 1.0, 1.0, 1.0, 0, 0,0 );
	roof.right.extend( 1.0, 2.0, 1.0, Math.PI/2 * progress );
	roof.left.extend( 1.0, 2.0, 1.0, Math.PI/2 * progress );
	roof.near.extend( 1.0, 1.0, 1.1, Math.PI/2.8 * progress );
	roof.far.extend( 1.0, 1.0, 1.1, Math.PI/2.8 * progress );
	
	// Sides
	roof.right.far.extend( 2.0, 2.0, 0.5, 0 * progress );
	roof.left.far.extend( 2.0, 2.0, 0.5, 0 * progress );
	roof.near.far.extend( 1.0, 1.0, 0.5, Math.PI/8.0 * progress );
	
	// Hood
	var hood = roof.far.far;
	hood.extend( 1.0, 1.0, 1.01, -Math.PI/2.8 * progress );
	hood.far.extend( 1.0, 1.0, 0.5, Math.PI/2 * progress );
	hood.right.extend( 1.0, 1.0, 0.5, Math.PI/2 * progress );
	hood.left.extend( 1.0, 1.0, 0.5, Math.PI/2 * progress );

	// Bottom
    hood.right.far.extend( 1.0, 1.0, 0.5, Math.PI/2*progress );
    hood.left.far.extend( 1.0, 1.0, 0.5, Math.PI/2*progress );
    roof.right.far.far.extend( 2.0, 2.0, 0.5, Math.PI/2*progress );
    roof.left.far.far.extend( 2.0, 2.0, 0.5, Math.PI/2*progress );

	return roof;
	
}
