# yyago-toc

[中文](README.zh-CN.md)

1. The generated `ul'list is indented (reflecting context).
2. The title of an existing `id` attribute will not change the value of its `id` attribute.
3. Headings without `id` attribute values are added with unique values (id values are controllable. If the default ID settings coincide with your original ID format, define the `id_prefix' parameter).
4. Output HTML is not formatted.

>**Use continuous headings as much as possible.**

## v0.0.3

* The TOC RegExp string: `"<p>[TOC]</p>"`. default:`"/\<p\>\[(TOC)\]\<\/p\>/"`.
* Remove "throw".
* If no heading tags matched by `":heading"` : 
    * `.HTML` —— Return the string you given.
    * `.TOC_markdown` —— "".
    * `.TOC_box_HTML` —— "".

## v0.0.2

* fix: The generated markdown results are not fully parsed And the HTML has pre markup(*The problems may still exist*). 
* delete：`<h7></h7>`;



## Example

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