# yyago-toc

[中文](README.zh-CN.md)

1. The generated `ul'list is indented (reflecting context).
2. The title of an existing `id` attribute will not change the value of its `id` attribute.
3. Headings without `id` attribute values are added with unique values (id values are controllable. If the default ID settings coincide with your original ID format, define the `id_prefix' parameter).
4. Output HTML is not formatted.

## last version

* fix: The generated markdown results are not fully parsed And the HTML has pre markup(*The problems may still exist*). 
* delete：`<h7></h7>`;

>**Use continuous headings as much as possible.**

## Example

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

## LICENSE

[MIT](LICENSE)