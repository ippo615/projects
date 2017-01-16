
function main(progress){
	var geometry = new THREE.SphereGeometry( 1, 5, 4 );
	geometry.mergeVertices();
	var idxGeo = new IndexGeometry( geometry );
	idxGeo.triNode = new TriNode( geometry.faces[0] );
	idxGeo.toIterable( idxGeo.triNode );

	var base = idxGeo.orientedFaceToTri( idxGeo.geometry, idxGeo.triNode.face );
	var flat = new TriFold(base.width);

	flat.extend( base.position, base.len );
	buildTriFold( idxGeo.geometry, idxGeo.triNode, flat, progress );

	return flat;
}
