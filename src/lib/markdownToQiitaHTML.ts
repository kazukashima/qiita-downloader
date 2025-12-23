import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

// 👇 md の型を明示
const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,

  // 👇 戻り値の型を string に明示
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre class="hljs"><code>${
        hljs.highlight(str, { language: lang }).value
      }</code></pre>`;
    }

    return `<pre class="hljs"><code>${
      md.utils.escapeHtml(str)
    }</code></pre>`;
  },
});

// 外部から使う関数
export function markdownToQiitaHTML(text: string): string {
  return md.render(text);
}
