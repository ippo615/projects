
function main( progress ){
    var scale = 0.1;
	var foldAngle = Math.PI/2.0 * progress;
	var size = 1.0;

    var width = 8.5 * scale;
    var height = 11.0 * scale;
    var thickness = 2.0 * scale;
    var coverThickness = 0.1 * scale;
    var overhang = 3.0 * scale;

	var spine = new Quad( thickness, thickness, height, 0, 0,0 );
	
	spine.right.extend( height, height, width, Math.PI/2.0*progress );
	spine.left.extend( height, height, width, Math.PI/2.0*progress );
	
	spine.right.far.extend( height, height, coverThickness, Math.PI/2.0*progress );
	spine.left.far.extend( height, height, coverThickness, Math.PI/2.0*progress );
	
	spine.right.far.far.extend( height, height, overhang, Math.PI/2.0*progress );
	spine.left.far.far.extend( height, height, overhang, Math.PI/2.0*progress );

	return spine;
}
