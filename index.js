const mit = require('markdown-it');
const cheerio = require('cheerio');
const mdIt = new mit({ html: true })

/**
 * Render the TOC markup in HTML.
 * 
 * - By the default, All heading elements will be added with the "id" attribute unless it already has an ID attribute.
 * 
 * - And the strings of index matched by `options.id_prefix` will be replaced with HTML content(HTML list elements render from TOC markup). 
 * 
 * @param {string} html -Html content.
 * @param {object} options options.
 * @param {string} options.liSign The sign of li tag in markdown. default: "*".
 * @param {regexp|string} options.TOC_regexp TOC markup or Regexp or string. them will be replaced with heading list.
 * @param {string} options.id_prefix Prefix string of the value of id attribute. default: "toc_targetid_"(result:toc_targetid_1), Use custom prefixes to avoid duplication with other ID values.
 * @param {boolean} options.isUseNewIdVal If the value of the "id" attribute of heading element not "undefined" won't reset with new value. If you want reset them use the new value both,set "{isUseNewIdVal:true}". 
 * @param {string}  options.useDIV_id Value of the "id" attribute of DIV.
 * @param {string}  options.useDIV_class Value of the "class" attribute of DIV.
 * @param {string} options.useDIV_style CSS string of "style" attribute of DIV.like : "color:red;font-size:10px;......"
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
function renderTOC(html, options = { id_prefix: "", liSign: "", TOC_regexp: "", isUseNewIdVal: false, useDIV_id: '', useDIV_class: '', useDIV_style: '' }) {
    let foo = {
        liSign: "*",
        indent_Per_Level_heading: 2,
        TOC_regexp: /(\<p\>\[TOC\]\<\/p\>)/,
        id_prefix: "toc_targetid_",
        isUseNewIdVal: false,
        useDIV_id: "TOC_box",
        useDIV_class: "TOC_box",
        useDIV_style: "_font-size:inherit",
    }

    let opts_liSign = (() => { if (options.liSign == undefined) { return foo.liSign } else { return options.liSign } })();
    let opts_id_prefix = (() => { if (options.id_prefixn == undefined) { return foo.id_prefix } else { return options.id_prefix } })();
    let opts_TOC_regexp = (() => { if (options.TOC_regexp == undefined) { return foo.TOC_regexp } else { return options.TOC_regexp } })();
    let opts_isUseNewIdVal = (() => { if (options.isUseNewIdVal == undefined) { return foo.isUseNewIdVal } else { return options.isUseNewIdVal } })();
    let opts_useDIV_id = (() => { if (options.useDIV_id == undefined) { return foo.useDIV_id } else { return options.useDIV_id } })();
    let opts_useDIV_class = (() => { if (options.useDIV_class == undefined) { return foo.useDIV_class } else { return options.useDIV_class } })();
    let opts_useDIV_style = (() => { if (options.useDIV_style == undefined) { return foo.useDIV_style } else { return options.useDIV_style } })();

    const $ = cheerio.load(html);
    if ($(':header').length == 0) {
        throw Error(`No heading matched. heading count: ${$(':header').length}`)
    }
    const TOCList = $(':header').map((i, e) => {

        let title = $(e).text();// 标题名称
        title = title.replace(/\r|\n/g, "")
        let oldID = $(e).attr('id');
        // 处理ID
        let H_id

        if (opts_isUseNewIdVal) {
            H_id = opts_id_prefix + i;
        } else if (oldID == undefined) {
            H_id = opts_id_prefix + i;
        } else {
            H_id = oldID;
        }

        $(e).attr({ id: H_id });// add the attribute: id.
        let currentNode = $(e);
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
        }
        return `${" ".repeat(level)}${opts_liSign} [${title}](#${H_id})`;
    }).get().join('\n')
    // Render the TOC list
    let TOC2html = mdIt.render(TOCList);
    let reped = "/a>\n" + opts_liSign;
    TOC2html = TOC2html.replace(reped, "/a></li>\n<li>")
    // fix: Has pre>code ! 2019-05-02
    let resultHTML
    const reRender = cheerio.load(TOC2html);
    if (reRender('pre').length !== 0) {
        resultHTML = reRender('pre').each((i, e) => {
            let md = reRender(e).text()
            let rendermd = mdIt.render(md);
            reRender(e).parent('li').append(rendermd);
            reRender(e).remove();
        })
    } else {
        resultHTML = TOC2html;
    }
    const tocbox = `<div id="${opts_useDIV_id}" class="${opts_useDIV_class}" style="${opts_useDIV_style}">${resultHTML}</div>`;
    // Replace the Unrendered TOC mark(options.TOC_regexp) in HTML content with tocbox.
    const newhtml = $('body').html().replace(opts_TOC_regexp, tocbox)
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