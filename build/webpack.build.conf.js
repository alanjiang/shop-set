var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = merge(baseWebpackConfig, {
  //entry: './src/components/amapsearch/search.vue',
  //entry: './src/main.js',
  output: {
    path: resolve('mappc'),
    filename: 'build.js'
   
  },
  module: {
    rules: [
    	{ 
    		test: /\.styl(us)?$/,
    		loader: 'style-loader!css-loader!stylus-loader' 
    	},
    	  {
            test: /\.less$/,
            use: [
            {
                loader: "style-loader" // creates style nodes from JS strings
            }, 
            {
                loader: "css-loader" // translates CSS into CommonJS
            }, 
            {
                loader: "less-loader" // compiles Less to CSS
            }]
    	  },
    	  
    	    {
    		   test: /\.js$/,
    		   loader: 'babel-loader',
    		   include: [resolve('src'), resolve('test'), resolve('/node_modules/vue-image-crop-upload/upload-2.vue')]
    		 },

    	  
    	  
    	 /*  
    	 {
    		test: /\.(jsx?|babel|es5|es6)$/,
            
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
             
            },
          },
          */
          
          {
              test: /\.vue$/,
              loader: 'vue-loader',
              options: {
                compilerOptions: {
                  preserveWhitespace: false
                }
              }
           },
    	
    	{
            test: /\.css$/,
            loaders: ['style-loader', 'css-loader']
          },
          
    ]
  },
  performance: {
    hints: false
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#source-map',
  externals: {
   
  },
  plugins: [
    new ExtractTextPlugin("[name].css"),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'template.html',
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
      }),
      
      new VueLoaderPlugin()
      
      
    
  ]
})
