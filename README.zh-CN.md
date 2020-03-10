# yyago-toc

解析（或者创建）`[TOC]` 标题目录 (页面内上下文标题ID导航）。

1. 生成的 HTML 列表有缩进（体现上下文关系）。
2. 已有 `id` 属性的标题其 "id" 属性值不会被更改。
3. 没有设置 `id` 属性值的标题会被加上唯一的值 (id值是可控的，如果不巧默认的id设置和你原有的id格式有冲突，请定义 `id_prefix` 参数)。
4. 生成的 HTML 都是没有格式化的。

**实际上它只处理 HTML 内容，Markdown 应该先解析成HTML**

## v0.0.3

* The TOC RegExp string: `"<p>[TOC]</p>"` . default:`/\<p\>\[(TOC)\]\<\/p\>/`.
* Remove "throw".
* If no heading tags matched by `":heading"` : 
    * `.HTML` —— Return the string you given.
    * `.TOC_markdown` —— "".
    * `.TOC_box_HTML` —— "".

## v0.0.2

* fix: The generated markdown results are not fully parsed And the HTML has pre markup(*The problems may still exist*). 
* delete：`<h7></h7>`;


## 示例

javaScript file.

```js

const yytoc = require('yyago-toc');

let foo = `
<p>[TOC]</p>
<h1>test</h1>
<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>

<h2>test-h2</h2>
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
`;

let tar = yytoc.renderTOC(foo,{id_prefix:'heading-',useDIV_id:'myTOC'});

console.log(`
HTML=> ${tar.HTML}
TOC_markdown => ${tar.TOC_markdown}
TOC_box_HTML => ${tar.TOC_box_HTML}
`)
```

### Result:

* HTML=> 
    ```html
    <div id="myTOC" class="TOC_box" style="_font-size:inherit">
        <ul>
            <li><a href="#toc_targetid_0">test</a>
                <ul>
                    <li><a href="#toc_targetid_1">test-h2</a></li>
                </ul>
            </li>
        </ul>
    </div>
    <h1 id="toc_targetid_0">test</h1>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>

    <h2 id="toc_targetid_1">test-h2</h2>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
    ```
* TOC_markdown => 
    ```md
    * [test](#toc_targetid_0)
    * [test-h2](#toc_targetid_1)
    ```
    

* TOC_box_HTML =>
    ```html
    <div id="myTOC" class="TOC_box" style="_font-size:inherit">
        <ul>
            <li><a href="#toc_targetid_0">test</a>
                <ul>
                    <li><a href="#toc_targetid_1">test-h2</a></li>
                </ul>
            </li>
        </ul>
    </div>
    ```

## LICENSE

[MIT](LICENSE)

## 技巧

* 使用`[TOC]`会把页面撑高（页面内容变长，有些长标题还会影响阅读体验，你需要写额外的 CSS 来处理这些问题，有很多标题的话最好把`[TOC]`的内容脱离文档流固定在浏览器侧面，而不是让它随着文档流滚动而从可视界面中消失——那样`[TOC]`就没有什么用了，反而成了败笔）。
* 应该尽可能使用具有连续性的标题，以增加准确解析的几率。 H1 之后直接来个 H4（中间没有H2和H3） ，这可能会导致不能生成的导航错乱。

## LICENSE

[MIT](LICENSE)