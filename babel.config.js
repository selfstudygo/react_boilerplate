module.exports = {
  presets: ['react-app'],
  plugins: [
    'const-enum',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-transform-classes',
    [
      '@babel/plugin-transform-typescript',
      {
        isTSX: true,
        allExtensions: true,
        allowNamespaces: true,
      },
    ],
  ],
  env: {
    test: {
      plugins: [
        [
          'babel-plugin-styled-components',
          {
            fileName: false,
          },
        ],
      ],
    },
    development: {
      plugins: ['babel-plugin-styled-components'],
    },
  },
};
