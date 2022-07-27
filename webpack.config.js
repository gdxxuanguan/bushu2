
let path=require('path') //引入path模块
let htmlpackplu=require('html-webpack-plugin')//引入HTML模块
let htmlpack=new htmlpackplu({
    template:'./index.html', //html文件路径
    filename:'index.html' //打包后的名字
})
module.exports={
    entry:'./MVVM.js', //入口文件
    output:{  //打包完成后的选项
        publicPath:"./", // 设置静态路径
        filename:'okpack.js', //打包之后的js文件名
        path:path.resolve(__dirname,'wenjianjia') //两个参数，第一个是打包后的文件夹存放位置，__dirname代表根目录，第二个代表生成的新的js文件所在的文件夹的路径
    },
    plugins:[htmlpack], //打包html所需要的插件
    module:{
        rules:[
            {
                test:/\.css$/, //查找所有的css文件
                use:['style-loader','css-loader'] //需要用到的插件，下载命令为npm i style-loader css-loader
            },  //这里面写的是打包css文件所用到的东西
            {
                test:/\.(jpg|png|gif)&/,  //查找所有图片
                    loader:"url-loader",// 打包图片需要用到 url-loader file-loader
                options:{
                limit:80*1024 //打包完图片大小限制
                }
            },
            {
                test:/\.html$/,
                    // 处理html中图片问题，负责引入从而可以时img标签加载图片
                    loader:"html-loader"
            },
        ]
    }
}
