requirejs.config({
	baseUrl: '../../',

	paths: {
		'jquery'    : 'bower_components/jquery/dist/jquery.min',
		'underscore': 'bower_components/underscore/underscore-min',
		'chance'    : 'bower_components/chance/chance',
		'protobuf'  : 'bower_components/protobuf/dist/ProtoBuf.min',
		'ByteBuffer': 'bower_components/bytebuffer/dist/ByteBufferAB',
		'Long'      : 'bower_components/long/dist/Long',
		'text'      : 'bower_components/requirejs-text/text'
	},

	shim: {},

	map: {
		'*': {
			'tree-diff'        : 'bower_components/algorithm-tree-edit-distance/src/diff',
			'deep-first-search': 'bower_components/algorithm-data-structure/src/search/deep-first'
		}
	}
})