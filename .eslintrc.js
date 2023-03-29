module.exports = {
	env: {
		es6: true,
		node: true,
		jest: true,
	},
	extends: [
		'xo',
		'plugin:security/recommended',
		'plugin:unicorn/recommended',
		'plugin:import/typescript',
	],
	overrides: [
		{
			extends: ['xo-typescript'],
			files: ['*.ts', '*.tsx'],
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['tsconfig.json'],
		tsconfigRootDir: './',
	},
	plugins: ['@typescript-eslint', 'security', 'unicorn', '@babel'],
	settings: {
		'import/resolver': {
			typescript: {},
		},
	},
	rules: {
		'no-underscore-dangle': 'off',
		'class-methods-use-this': 'off',
		'import/prefer-default-export': 'off',
		'max-classes-per-file': 'off',
		'max-len': [
			'error',
			{
				code: 80,
				ignoreUrls: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
				ignoreRegExpLiterals: true,
				ignoreComments: true,
			},
		],
		'unicorn/prefer-module': 'off',
	},
};
