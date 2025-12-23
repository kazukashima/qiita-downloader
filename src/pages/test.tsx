import { markdownToQiitaHTML } from "../lib/markdownToQiitaHTML";
import "../styles/qiita.css";
import html2pdf from "html2pdf.js";

export default function TestPage() {
  const markdownText = `
# テストタイトル

これは **太字** です。

- リスト1
- リスト2

\`\`\`js
console.log("hello");
\`\`\`
`;

  const html = markdownToQiitaHTML(markdownText);

  const downloadPDF = () => {
    const element = document.getElementById("qiita-preview");
    if (!element) return;

    html2pdf()
      .set({
        margin: 10,
        filename: "qiita-article.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Markdown → HTML 変換テスト</h2>

      <button onClick={downloadPDF}>
        PDFダウンロード
      </button>

      {/* PDF化対象 */}
      <div
        id="qiita-preview"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
