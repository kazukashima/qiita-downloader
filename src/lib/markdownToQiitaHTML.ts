import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`;
    }
    return `<pre><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

export function markdownToQiitaHTML(text: string): string {
  const rendered = md.render(text);

  return `
<div class="qiita-markdown-root">
  ${rendered}
  <div style="height: 1px; clear: both;"></div>
</div>
`;
}