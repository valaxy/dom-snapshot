requirejs.config({
	baseUrl: '../../',

	paths: {
		'jquery'                      : 'bower_components/jquery/dist/jquery.min',
		'underscore'                  : 'bower_components/underscore/underscore-min',
		'chance'                      : 'node_modules/chance/chance',
		'protobuf'                    : 'bower_components/protobuf/dist/ProtoBuf.min',
		'ByteBuffer'                  : 'bower_components/bytebuffer/dist/ByteBufferAB',
		'Long'                        : 'bower_components/long/dist/Long',
		'text'                        : 'bower_components/requirejs-text/text',
		'algorithm-data-structure'    : 'node_modules/algorithm-data-structure/',
		'algorithm-tree-edit-distance': 'node_modules/algorithm-tree-edit-distance/lib/diff',
		'cjs'                         : 'node_modules/cjs/cjs',
		'amd-loader'                  : 'node_modules/amd-loader/amd-loader'
	},

	cjs: {
		cjsPaths: [
			'algorithm-data-structure',
			'algorithm-tree-edit-distance'
		]
	}
})