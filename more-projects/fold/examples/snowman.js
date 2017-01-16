
function main( progress ){
	var foldAngle = Math.PI/2.0 * progress;
	var headSize = 0.8;
	var bodySize = 1.0;

	var body = new Quad( bodySize, bodySize, bodySize, 0, 0,0 );
	body.right.extend( bodySize, bodySize, bodySize, foldAngle );
	body.left.extend( bodySize, bodySize, bodySize, foldAngle );
	body.near.extend( bodySize, bodySize, bodySize, foldAngle );
	body.far.extend( bodySize, bodySize, bodySize, foldAngle );
	body.far.far.extend( bodySize, bodySize, bodySize, foldAngle );

    var head = body.far.far.far;
    head.extend( headSize, headSize, headSize, -foldAngle );
    head.far.extend( headSize, headSize, headSize, -foldAngle );
	head.far.far.extend( headSize, headSize, headSize, -foldAngle );
    head.far.right.extend( headSize, headSize, headSize, -foldAngle );
	head.far.left.extend( headSize, headSize, headSize, -foldAngle );

	return body;
}
