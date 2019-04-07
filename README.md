# yyago-toc

[中文](README.zh-CN.md)


Maybe not a package, just a function. If you've installed `cheerio` and `markdown-it` as your project dependencies, you just need to copy the following code (make sure you keep the LICENSE).

```js
/*
 * 
 * MIT License
 * 
 * Copyright (c) 2019 YYago [https://www.npmjs.com/~yyago]
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const mit = require('markdown-it');
const cheerio = require('cheerio');
const mdIt = new mit()

/**
 * Render the TOC markup in HTML.
 * 
 * - By the default, All heading elements will be added with the "id" attribute unless it already has an ID attribute.
 * 
 * - And the strings of index matched by `options.id_prefix` will be replaced with HTML content(HTML list elements render from TOC markup). 
 * 
 * @param {string|Buffer} html -Html content.
 * @param {object} options options.
 * @param {string} options.liSign The sign of li tag in markdown. default: "*".
 * @param {number} options.indent_Per_Level_heading indent.default: 2.
 * @param {regexp|string} options.TOC_regexp TOC markup or Regexp or string. them will be replaced with heading list.
 * @param {string} options.id_prefix Prefix string of the value of id attribute. default: "toc_targetid_"(result:toc_targetid_1), Use custom prefixes to avoid duplication with other ID values.
 * @param {boolean} options.isUseNewIdVal If the value of the "id" attribute of heading element not "undefined" won't reset with new value. If you want reset them use the new value both,set "{isUseNewIdVal:true}". 
 * @param {object} options.useDIV wow,Wrap up the TOC content with a DIV tag and add the "id" or "class" (or "style")attribute to it.
 * @param {string}  options.useDIV.id Value of the "id" attribute of DIV.
 * @param {string}  options.useDIV.class Value of the "class" attribute of DIV.
 * @param {string} options.useDIV.style CSS string of "style" attribute of DIV.like : "color:red;font-size:10px;......"
 * @example
 * //...
 * renderTOC(foo,{
 *      liSign:'+',
 *      useDIV:{
 *          id:"TOC_box",
 *          class:"TOC_box",
 *          style:"color:red"
 *      }
 * });
 *  // style key just give strings,likes this: `"color:red;font-family:...."` .
 *  // Because most of the time it's not dealing with complete HTML content, you need to complete the CSS part yourself - it can't be added.
 */
function renderTOC(html, options = { id_prefix: "", liSign: "", indent_Per_Level_heading: 2, TOC_regexp: "", isUseNewIdVal: false, useDIV: { id: '', class: '', style: '' } }) {
    let optionsSet = options || {};
    let opts = {
        liSign: optionsSet.liSign || '*',
        indent_Per_Level_heading: optionsSet.indent_Per_Level_heading || 2,
        TOC_regexp: optionsSet.TOC_regexp || /(\<p\>\[TOC\]\<\/p\>)/,
        id_prefix: optionsSet.id_prefix || "toc_targetid_",
        isUseNewIdVal: optionsSet.isUseNewIdVal || false,
        useDIV: {
            id: optionsSet.useDIV.id || "TOC_box",
            class: optionsSet.useDIV.class || "TOC_box",
            style: optionsSet.useDIV.style || "_font-size:inherit",
        }
    }

    const $ = cheerio.load(html)

    if($(':header').length==0){
        throw Error(`No heading matched. heading count: ${$(':header').length}`)
    }
    const TOCList = $(':header').map((i, e) => {
        let currentNode = $(e);
        let title = $(e).text();// 标题名称
        let oldID = $(e).attr('id');
        // 处理ID
        let H_id
        
        if (opts.isUseNewIdVal) {
            H_id = opts.id_prefix + i;
        } else if (oldID == undefined) {
            H_id = opts.id_prefix + i;
        } else {
            H_id = oldID;
        }

        $(e).attr({ id: H_id });// add the attribute: id.

        let level

        if (currentNode.is('h1')) {
            level = 0;
        } else if (currentNode.is('h2')) {
            level = 2;
        } else if (currentNode.is('h3')) {
            level = 4;
        } else if (currentNode.is('h4')) {
            level = 6
        } else if (currentNode.is('h5')) {
            level = 8
        } else if (currentNode.is('h6')) {
            level = 10
        } else if (currentNode.is('h7')) {
            level = 12
        }
        return `${" ".repeat(level)}${opts.liSign} [${title}](#${H_id})`;
    }).get().join('\n')
    // Render the TOC list
    const TOC2html = mdIt.render(TOCList);
    const tocbox = `<div id="${opts.useDIV.id}" class="${opts.useDIV.class}" style="${opts.useDIV.style}">${TOC2html}</div>`;
    // Replace the Unrendered TOC mark(options.TOC_regexp) in HTML content with tocbox.
    const newhtml = $('body').html().replace(opts.TOC_regexp, tocbox)
    /** @returns {object}*/
    return {
        /**@member {string} HTML Return changed HTML*/
        HTML: newhtml,
        /**@member {string} TOC_markdown Return markdown list(markdown).*/
        TOC_markdown: TOCList,
        /**@member {string} TOC_box_HTML Return rendered TOC markup(HTML code)*/
        TOC_box_HTML: tocbox,
    }
}

module.exports = {
    renderTOC,
}
```

## LICENSE

[MIT](LICENSE)

