'use strict';

module.exports = api => {
	api.cache(true);

	const presets = [
		[
			'@babel/preset-env',
			{
				targets: {
					esmodules: true,
					node: true,
				},
			},
		],
		[
			'@babel/preset-typescript',
			{
				declaration: true,
				allowNamespaces: true,
				optimizeConstEnums: true,
				isolatedModules: true,
			},
		],
	];
	const plugins = [['tsconfig-paths-module-resolver']];

	return {
		presets,
		plugins,
	};
};
