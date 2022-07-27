# MVVM大作业文档

### 赵浩博 南京大学 191250201

#### 联系方式：18762257713

#### QQ：2267361693



[TOC]

运行：show.html

测试：test.js 需去除compile.js和watcher.js第一行的注释

## 1.数据劫持

本次作业使用object.defineProperty来实现数据劫持，实现位置为observer.js文件中，在MVVM.js中创建Observer，对于传入data通过keys.forEach来进行遍历，递归对每个对象以及子对象的属性进行劫持。

![image-20220720095107849](resource/image-20220720095107849.png)

```javascript
class Observer{
    constructor(data) {
        this.observe(data);
    }

    observe(data){
        if(!data||typeof data!=='object'){
            return;
        }
        Object.keys(data).forEach(key=>{
            //劫持
            this.defineReactive(data,key,data[key])
            this.observe(data[key]);
        })
    }

    defineReactive(obj, key, value) {
        let that = this;
        let dep=new Dep();
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get(){
                // console.log('get')
                Dep.target && dep.addSub(Dep.target)
                return value;
            },
            set(newValue){
                if(newValue!==value){
                    that.observe(newValue)
                    value=newValue;
                    dep.notify();

                }
            }
        });
    }
}
```

## 2.发布订阅模式

Observer用来给数据添加dep依赖，data每个对象包括子对象都拥有一个dep对象, 当所绑定的数据有变更时, 通过dep.notify()通知Watcher。

```javascript
class Dep{
    constructor(){
        this.subs=[]
    }
    addSub(watcher){
        this.subs.push(watcher);
    }
    notify(){
        this.subs.forEach(watcher=>watcher.update());
    }
}
```

```javascript
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
}
```

![image-20220720100527010](resource/image-20220720100527010.png)

![image-20220720100543321](resource/image-20220720100543321.png)

## 3.单向绑定

主要代码在compile.js中，对传入的dom进行遍历分析并编译，处理格式后获取数据并传回网页中。

```javascript
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
```

![image-20220720101144224](resource/image-20220720101144224.png)

![image-20220720101212845](resource/image-20220720101212845.png)

## 4.双向绑定

在输入框编译处理部分使用addEventListener来实现双向绑定，一旦输入框改变，将会对data的值进行随时的改变。

```javascript
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
}
```

![image-20220720101540017](resource/image-20220720101540017.png)

## 5.单元测试

**注：由于文件引用问题，在进行测试前需要将compile.js和watcher.js最上方的require引用注释去除，正常运行时需注释掉，否则会出现require报错**

本次作业使用jest来进行单元测试，共进行了20个测试，覆盖率满足了百分之八十的要求。代码位置在test.js文件中。

![image-20220721160954391](resource/image-20220721160954391.png)