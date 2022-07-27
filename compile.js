// const {Watcher} = require("./watcher");

class Compile{
    constructor(el,vm,status) {
        if(status!==1) {
            //从html获取数据
            this.el = this.isElementNode(el) ? el : document.querySelector(el);
            this.vm = vm;
            if (this.el) {
                //如果获取元素，开始进行编译
                //1.获得dom
                let fragment = this.nodeToFragment(this.el);

                //2.提取节点
                this.compile(fragment);

                //把fragment放回页面中
                this.el.appendChild(fragment);
            }
        }
    }
    //辅助方法

    //是否是元素节点
    isElementNode(node){
        return node.nodeType===1;
    }

    isDirective(name){
        return name.includes('v-');
    }

    //重要方法
    nodeToFragment(el) {//// 将el中的内容转到内存中
        let fragment = document.createDocumentFragment();
        let firstChild;
        while(firstChild = el.firstChild){
            fragment.appendChild(firstChild);
        }
        return fragment;

    }

    compile(fragment) {
        let childNodes=fragment.childNodes;
        Array.from(childNodes).forEach(childNode=>{
            if(this.isElementNode(childNode)){
                //元素节点
                // console.log('元素节点',childNode);
                //编译元素节点
                this.compileElement(childNode);
                this.compile(childNode);
            }else{
                //文本节点
                // console.log('文本节点',childNode)
                //编译文本节点
                this.compileText(childNode);
            }
        })
        // console.log(childNodes);
    }

    compileText(node) {
        //{{message}}
        let text =node.textContent;
        let cri=/\{\{([^{]+)\}\}/g;
        if(cri.test(text)) {
            CompileUtil['text'](node,this.vm,text);
        }
        // console.log(text)


    }

    compileElement(node) {
        let attrs=node.attributes;
        Array.from(attrs).forEach(attr=>{
            //遍历属性并筛选
            let attrName=attr.name;
            if(this.isDirective(attrName)){
                let expresion =attr.value;
                let attrType = attrName.slice(2);
                // console.log(attrType)
                CompileUtil[attrType](node,this.vm,expresion);
            }
        })

    }
}

//工具类
CompileUtil = {
    getValue(vm,expr) {
        // console.log(expr)
        let exprArray=expr.split('.');
        // console.log(exprArray)
        // console.log(exprArray.reduce((previous,next)=>{
        //     return previous[next];
        // },vm.$data))
        return exprArray.reduce((previous,next)=>{
            return previous[next];
        },vm.$data);

    },
    text(node,vm,text){
        let updater=this.update['updateText'];
        //去除括号
        let expression=text.trim();
        expression=expression.slice(2,expression.length-2);
        // console.log(expression);

        new Watcher(vm,expression,(newValue)=>{
            updater(node,this.getValue(vm,expression))
        })

        updater(node,this.getValue(vm,expression))

    },
    model(node,vm,expression){
        let updater=this.update['updateModel'];

        new Watcher(vm,expression,(newValue)=>{
            updater(node,this.getValue(vm,expression));
        })

        node.addEventListener('input',(e)=>{
            let newValue = e.target.value;
            let expr=expression.split('.');
            expr.reduce((prev,next,currentIndex)=>{
                if(currentIndex===expr.length-1){
                    return prev[next]=newValue;
                }
                return prev[next];
            },vm.$data)
        })
        updater(node,this.getValue(vm,expression));

    },
    update:{
        updateText(node,value){
           node.textContent = value;
        },
        updateModel(node,value){
            node.value =value
        }
    }
}
module.exports={
    Compile
}