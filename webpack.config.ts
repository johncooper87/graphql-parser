// import path from 'path';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
// //import { DuplicatesPlugin } from 'inspectpack/plugin';

// export default {
//   mode: 'development',
//   devtool: 'source-map',
//   target: 'web',

//   entry: './example/index.tsx',
//   module: {
//     rules: [
//       {
//         test: /\.ts(x?)$/,
//         use: 'ts-loader?configFile=tsconfig.json',
//         exclude: /node_modules/,
//       },
//     ],
//   },
//   resolve: {
//     extensions: [ '.tsx', '.ts', '.js' ],
//     //modules: ["src", "node_modules"]
//   },
//   output: {
//     filename: 'main.js',
//     path: path.resolve(__dirname, 'dist'),
//   },

//   // entry: './example/index.js',
//   // output: {
//   //   path: path.resolve(__dirname, 'dist'),
//   //   filename: 'main.js',
//   //   publicPath: '/'
//   // },

//   // module: {
//   //   rules: [
//   //     {
//   //       test: /\.ts$/,
//   //       include: [
//   //         'node_modules/@kemsu',
//   //         'src',
//   //         'example'
//   //       ].map(incl => path.resolve(__dirname, incl)),
//   //       loader: 'babel-loader'
//   //     }
//   //   ]
//   // },

//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './example/index.html'
//     }),
//     //new DuplicatesPlugin({})
//   ],

//   // externals: {
//   //   "react": "React",
//   //   "react-dom": "ReactDOM"
//   // },

//   optimization: {
//     namedChunks: true,
//     namedModules: true,
//     splitChunks: {
//       cacheGroups: {
//         vendor: {
//           test: /node_modules/,
//           name: 'vendor',
//           chunks: 'all'
//         }
//       }
//     }
//   },

//   // resolve: {
//   //   alias: {
//   //     '@components': path.resolve(__dirname, 'src/components/'),
//   //     '@hooks': path.resolve(__dirname, 'src/hooks/'),
//   //     '@lib': path.resolve(__dirname, 'src/lib/')
//   //   }
//   // },

//   devServer: {
//     port: 3000,
//     historyApiFallback: true
//   }
// };