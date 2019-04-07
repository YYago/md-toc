# @pwedu/md-toc

解析（或者创建）`[TOC]`标题目录(页面内上下文标题ID导航）。
>找了很久没有找到支持创建或者解析 markdow `[TOC]` 标记的包（准确地说找到的没能让我满意，也没有时间去一个个试)，如果你有好的也给我推荐推荐。

## 安装使用

如果你的项目已经有 cheerio 和 markdown-it 包，可以直接将以下的代码写成一个文件模块或者函数来调用就行了(务必保留 LICENSE 注释)。

源码在：[README.md](README.md)

## 实际上它只处理 HTML 内容

如果传入的 HTML 代码中没有标题（任意h1-h7标签）会报错，因此你应该在有较为完整文章结构的 HTML 内容上使用，而不是用在片段代码中。

### 探讨下

`[TOC]` 标记在 markdown 文本里是没有什么用的，只有解析之后才用的上——除非你的标题(H1-H7)都是用 HTML 写的（写的时候加上`id`属性以便定位）。但这就离使用 markdown 的初衷越来越远，写起来也更麻烦。

可能我们是这样期望的：

```md
# title

[TOC]

## h2
```

经过某种处理之后变成：

```md
<h1 id="x">title</h1>

* [title](#x)
  * [h2](#h2)

<h2 id="h2">h2</h2>

```

嗯，还是 markdown ——只是加了少量的 HTML 标记。
>探讨结束
-----

## 关于 md-toc

`“[TOC]”` 在解析之后才有意义，因此 md-toc 也仅仅针对 `markdown` to `HTML` 过程做最后的收尾处理，把未解析的 `“[TOC]”` 解析成 HTML 代码并替换掉 `"[TOC]"`.

```html

<!--有时候 markdown 里面的 `[TOC]` 转换为 HTML 之后得到的结果为 :-->
<p>[TOC]</p>

<!--本包是把上面的 p{[TOC]} 替换为:-->
<ul id = “TOC”>
    <li>
        <a href="#h2_1">title-h2</a>
        <!-- .... -->
    </li>
</ul>

<h2 id="h2_1">title-h2</h2>

<!--
    并且给所有的 h1-h7 都加上 id 属性，id 值与 ul#TOC 的链接一一对应。也就是说我们可以不用在 HTML 里加 JavaScript 来重写上下文以实现页内上下文导航的目的。
-->
```

剩下的就是选择题了：
1. markdown 转 HTML 的时候直接写入 `"[TOC]"`解析之后对应的 HTML代码（No JavaScript）——这正是本包在做的;
2. markdown 转 HTML 之后另外写入或者调用 JavaScript 达到生成渲染 `"[TOC]"` 的目的(Need JavaScript)。

其实，本包也就是一个函数而已，流程：HTML`-->` renderTOC() `-->` New HTML。Nothing else！

## 技巧

使用`[TOC]`会把页面撑高（页面高度值变大，页面内容变长，有些长标题还会影响阅读体验，你需要写额外的 CSS 来处理这些问题，有很多标题的话最好把`[TOC]`的内容脱离文档流固定在浏览器侧面，而不是让它随着文档流滚动而从可视界面中消失——那样`[TOC]`就没有什么用了，反而成了败笔）。

## LICENSE

[MIT](LICENSE)