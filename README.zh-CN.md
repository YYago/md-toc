# yyago-toc

解析（或者创建）`[TOC]` 标题目录 (页面内上下文标题ID导航）。

1. 生成的 HTML 列表有缩进（体现上下文关系）。
2. 已有 `id` 属性的标题其 "id" 属性值不会被更改。
3. 没有设置 `id` 属性值的标题会被加上唯一的值 (id值是可控的，如果不巧默认的id设置和你原有的id格式有冲突，请定义 `id_prefix` 参数)。
4. 生成的 HTML 都是没有格式化的。

**实际上它只处理 HTML 内容，markdown 应该先解析成HTML**

如果传入的 HTML 代码中没有标题（任意h1-h6标签）会报错，因此你应该在有较为完整文章结构的 HTML 内容上使用，而不是用在片段代码中。

## 示例

```js
 const tocRender = require('yyago-toc')

 //const htmlcontents = ......
 
 const toc = tocRender(htmlcontents,{id_prefix: "headers-", liSign: "+",});

 console.log(toc.HTML)          // New full html with 'TOC_box_HTML'.

 console.log(toc.TOC_markdown)  // Markdown list constents.
 /*
  *  + [example A](#headers-1)
  *    + [how](#headers-2)
 */
 console.log(toc.TOC_box_HTML)  // The DIV with the lists of headings.
 /*
  * <div ...>
  *   <ul>
  *     <li> <a href="#headers-1">example A </a>
  *     ....
  *   ....
  * <div>
 */
```

## 技巧

* 使用`[TOC]`会把页面撑高（页面内容变长，有些长标题还会影响阅读体验，你需要写额外的 CSS 来处理这些问题，有很多标题的话最好把`[TOC]`的内容脱离文档流固定在浏览器侧面，而不是让它随着文档流滚动而从可视界面中消失——那样`[TOC]`就没有什么用了，反而成了败笔）。
* 应该尽可能使用具有连续性的标题，以增加准确解析的几率。 H1 之后直接来个 H4（中间没有H2和H3） ，这不仅影响阅读，也给程序出了不少难题。

## LICENSE

[MIT](LICENSE)