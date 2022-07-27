

class MVVM{
    constructor(options) {
        //将可用内容挂载到实例上
        this.$el=options.el;
        this.$data = options.data;
        
        if(this.$el){
            //数据劫持
            new Observer(this.$data);

            //编译
            new Compile(this.$el,this,0);
        }
    }
    // getCompile(){
    //     return new Compile(this.$el,this)
    // }
}

