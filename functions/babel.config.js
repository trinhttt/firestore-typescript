module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',//void: SyntaxError: Unexpected token 'export'
    ],
};