const {Compile}=require('./compile')
const {Observer}=require('./observer')


let option={
    "$el": "#app",
    "$data": {
        "message": "输入以进行改动",
        "a": {
            "ahdaiasd": "赵浩博"
        }
    }
}
let node1={
    'nodeType':3
}
let node2={
    'nodeType':1
}

let Comp=new Compile(option.$el,option,0);

/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    console.log(document);
    expect(element).not.toBeNull();
});

//基础方法测试
test('isElementNode 3',()=>{
    expect(Comp.isElementNode(node1)).toBe(false);
})

test('isElementNode 1',()=>{
    expect(Comp.isElementNode(node2)).toBe(true);
})

test('isDirective v-model',()=>{
    expect(Comp.isDirective('v-model')).toBe(true);
})
/**********************************************************************************/

//核心方法测试
document.write('    <div id="app">\n' +
    '        <input type="text" v-model="message">\n' +
    '        <div></div>\n' +
    '        {{message}}\n' +
    '        <br>\n' +
    '        <input type="text" v-model="a.ahdaiasd">\n' +
    '        <div></div>\n' +
    '        <ui></ui>\n' +
    '        {{a.ahdaiasd}}\n' +
    '    </div>');

let _el=document.querySelector(option.$el);

test('nodeToFragment',()=>{
    expect(Comp.nodeToFragment(_el)).not.toBeNull();
})

let fragment= Comp.nodeToFragment(_el);

let nodes=fragment.childNodes;    //编译细分测试
Array.from(nodes).forEach(childNode=>{
    if(Comp.isElementNode(childNode)){
        test('compileElementNode',()=>{
            Comp.compileElement(childNode);
        })
    }else{
        test('compileTextNode',()=>{
            Comp.compileText(childNode);
        })
    }
})
/**********************************************************************************/
test('compile',()=>{ //编译总体测试
    Comp.compile(fragment);
    option.$data.message='进行改变';
    expect(fragment).not.toBeNull();
})


/**********************************************************************************/
//observer测试
test('observer',()=>{
    let observer=new Observer(option.$data);
    expect(observer).not.toBeNull();
})