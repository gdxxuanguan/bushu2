// const {Dep} = require("./observer");

class Watcher{
    constructor(vm,expr,cb) {
        this.vm=vm;
        this.expr=expr;
        this.cb=cb;
        this.value=this.get();
    }

    get() {
        Dep.target = this;
        let val=this.getValue(this.vm,this.expr);
        Dep.target = null;

        return val;
    }

    update(){
        let newValue=this.getValue(this.vm,this.expr);
        let oldValue=this.value;
        if(oldValue!==newValue){
            this.cb(newValue);
        }
    }

    getValue(vm,expr) {
        // console.log(expr)
        let exprArray=expr.split('.');
        // console.log(exprArray)
        return exprArray.reduce((previous,next)=>{
            return previous[next];
        },vm.$data);

    }
}
module.exports={
    Watcher
}