import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

// md に型を付ける
const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,

  // 型を明示
  highlight: (str: string, lang: string): string => {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre><code>${
        hljs.highlight(str, { language: lang }).value
      }</code></pre>`;
    }

    // md を直接参照しない（自己参照回避）
    return `<pre><code>${
      MarkdownIt.prototype.utils.escapeHtml(str)
    }</code></pre>`;
  },
});

export function markdownToQiitaHTML(text: string): string {
  return `
<div class="qiita-markdown-root">
  ${md.render(text)}
  <div style="height: 1px; clear: both;"></div>
</div>
`;
}
