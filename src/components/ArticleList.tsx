// import { useState } from "react";
// import { Download, CheckSquare, Square, Search, FileText } from 'lucide-react';

// import { markdownToQiitaHTML } from "../lib/markdownToQiitaHTML";
// import html2pdf from "html2pdf.js";
// import "../styles/qiita.css";



// type Article = {
//   id: string;
//   title: string;
//   body: string;
// };

// export function ArticleList({ articles }: { articles: Article[] }) {
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");  // ← 検索機能

//   const toggleSelect = (id: string) => {
//     if (selectedIds.includes(id)) {
//       setSelectedIds(selectedIds.filter((x) => x !== id));
//     } else {
//       setSelectedIds([...selectedIds, id]);
//     }
//   };

//   // ← 全選択機能
//   const toggleAll = () => {
//     if (selectedIds.length === filteredArticles.length) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(filteredArticles.map(a => a.id));
//     }
//   };

//   const handleDownload = (title: string, body: string) => {
//     const blob = new Blob([body], { type: "text/markdown" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${title}.md`;
//     a.click();
//     setTimeout(() => URL.revokeObjectURL(url), 100);
//   };

//   const handlePdfDownload = (title: string, body: string) => {
//   // Markdown → HTML
//   const html = markdownToQiitaHTML(body);

//   // 一時的にDOMを作成
//   const container = document.createElement("div");
//   container.innerHTML = html;
//   container.className = "qiita-preview";

//   document.body.appendChild(container);

//   html2pdf()
//     .set({
//       margin: 10,
//       filename: `${title}.pdf`,
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//     })
//     .from(container)
//     .save()
//     .then(() => {
//       document.body.removeChild(container);
//     });
// };



//   const handleBulkDownload = () => {
//     const selectedArticles = articles.filter(x => selectedIds.includes(x.id));
//     selectedArticles.forEach((article) => {
//       handleDownload(article.title, article.body);
//     });
//   };

//   // ← フィルター機能
//   const filteredArticles = articles.filter(article =>
//     article.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//       {/* ← ヘッダー部分全体（検索バー付き） */}
//       <div className="p-6 border-b border-gray-100 bg-white">
//         {/* 記事一覧、0件表示中 */}
//         <div className="flex items-center gap-2 mb-4">
//           <FileText className="text-indigo-600" size={20} />
//           <h2 className="text-xl font-semibold text-gray-800">記事一覧</h2>
//           <span className="ml-auto text-sm text-gray-600">
//             {selectedIds.length}件選択中
//           </span>
//         </div>
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//             placeholder="記事を検索..."
//           />
//         </div>
//       </div>

//       {/* ← アクションバー（すべて選択とダウンロードボタン） */}
//       <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
//         <button
//           onClick={toggleAll}
//           className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
//         >
//           {selectedIds.length === filteredArticles.length ? (
//             <CheckSquare size={18} className="text-indigo-600" />
//           ) : (
//             <Square size={18} />
//           )}
//           すべて選択
//         </button>
//         <button
//           onClick={handleBulkDownload}
//           disabled={selectedIds.length === 0}
//           className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
//         >
//           <Download size={18} />
//           選択した記事をダウンロード
//         </button>
//       </div>

//       {/* ← 記事リスト（ul/liからdivに変更） */}
//       {articles.length === 0 ? (
//         <div className="p-12 text-center text-gray-500">
//           記事がありません
//         </div>
//       ) : (
//         <div className="divide-y divide-gray-100">
//           {filteredArticles.map((article) => (
//             <div
//               key={article.id}
//               onClick={() => toggleSelect(article.id)}
//               className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
//                 selectedIds.includes(article.id) ? 'bg-indigo-50' : ''
//               }`}
//             >
//               <div className="flex items-start gap-3">
//                 {/* ← チェックボックスをアイコンに変更 */}
//                 <div className="pt-1">
//                   {selectedIds.includes(article.id) ? (
//                     <CheckSquare size={20} className="text-indigo-600" />
//                   ) : (
//                     <Square size={20} className="text-gray-400" />
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-gray-800 font-medium mb-1 leading-relaxed">
//                     {article.title}
//                   </h3>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();  // ← 親要素のクリックを防ぐ
//                       handleDownload(article.title, article.body);
//                     }}
//                     className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
//                   >
//                     .mdダウンロード
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ← 検索結果なしのメッセージ */}
//       {filteredArticles.length === 0 && articles.length > 0 && (
//         <div className="p-12 text-center text-gray-500">
//           検索結果が見つかりませんでした
//         </div>
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import {
  Download,
  CheckSquare,
  Square,
  Search,
  FileText,
} from "lucide-react";

import { markdownToQiitaHTML } from "../lib/markdownToQiitaHTML";
import html2pdf from "html2pdf.js";
// import "../assets/qiita.css";

type Article = {
  id: string;
  title: string;
  body: string;
};

export function ArticleList({ articles }: { articles: Article[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  /* -------------------------
   * 選択関連
   * ------------------------- */
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAll = () => {
    if (selectedIds.length === filteredArticles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredArticles.map((a) => a.id));
    }
  };

  /* -------------------------
   * Markdown ダウンロード
   * ------------------------- */
  const handleDownload = (title: string, body: string) => {
    const blob = new Blob([body], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.md`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const handleBulkPdfDownload = () => {
  const selectedArticles = articles.filter(x =>
    selectedIds.includes(x.id)
  );

  selectedArticles.forEach(article => {
    handlePdfDownload(article.title, article.body);
  });
};

  /* -------------------------
   * PDF ダウンロード（MVP3）
   * ------------------------- */
const handlePdfDownload = async (title: string, body: string) => {
  const html = markdownToQiitaHTML(body);

  // iframeを作る（PDF専用の独立世界）
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument!;
  doc.open();

  doc.write(`
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    /* ✅ ここが超重要：PDFの“用紙幅”を固定して横はみ出しを殺す */
    @page { size: A4; margin: 8mm; }
    html, body { margin:0; padding:0; background:#fff; }
    * { box-sizing: border-box; }
    img { max-width: 100%; height: auto; }

    /* ✅ コンテンツの幅をA4に寄せる（右側の黒帯の原因を潰す） */
    .qiita-preview {
      width: 190mm;          /* A4(210mm) - margin(8mm*2) くらい */
      max-width: 190mm;
      overflow: hidden;
      font-family: "Noto Sans JP", system-ui, -apple-system, "Segoe UI", sans-serif;
      color: #000;
      line-height: 1.8;
      font-size: 14px;
    }

    /* ✅ これも重要：コードブロックは白系に固定（黒帯を避ける） */
    pre {
      background: #f5f5f5 !important;
      color: #000 !important;
      padding: 12px;
      border-radius: 6px;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    code {
      background: #eee;
      color: #000;
      padding: 2px 4px;
      border-radius: 4px;
    }

    /* ✅ “途中で切れない” */
    pre, blockquote, ul, ol, table { page-break-inside: avoid; }
    h1, h2, h3 { page-break-after: avoid; }
  </style>
</head>
<body>
  <div class="qiita-preview">
    ${html}
  </div>
</body>
</html>
  `);

  doc.close();

  // ✅ iframe内が描画されるのをちょい待つ（画像やフォント対策）
  await new Promise((r) => setTimeout(r, 300));

  html2pdf()
    .set({
      margin: [8, 8, 8, 8],
      filename: `${title}.pdf`,
      html2canvas: {
  scale: 2,
  backgroundColor: "#fff",
  windowWidth: 794,
  width: 794,
}
,
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    } as any)
    .from(doc.body)
    .save()
    .then(() => {
      document.body.removeChild(iframe);
    });
};




  // 追加
const PDF_CSS = `
.qiita-preview {
  font-family: "Noto Sans JP", sans-serif;
  font-size: 14px;
  line-height: 1.8;
  color: #000;
  background: #fff;
}

.qiita-preview h1,
.qiita-preview h2,
.qiita-preview h3 {
  page-break-after: avoid;
}

.qiita-preview pre,
.qiita-preview pre.hljs {
  background: #f5f5f5 !important;
  color: #000 !important;
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 6px;
  page-break-inside: avoid;
}

.qiita-preview pre code,
.qiita-preview pre span {
  color: #000 !important;
  background: none !important;
}

.qiita-preview ul,
.qiita-preview ol {
  page-break-inside: avoid;
}
`;


  /* -------------------------
   * 一括 Markdown DL（既存）
   * ------------------------- */
  const handleBulkDownload = () => {
    const selectedArticles = articles.filter((x) =>
      selectedIds.includes(x.id)
    );
    selectedArticles.forEach((article) => {
      handleDownload(article.title, article.body);
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* ===== ヘッダー ===== */}
      <div className="p-6 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="text-indigo-600" size={20} />
          <h2 className="text-xl font-semibold text-gray-800">記事一覧</h2>
          <span className="ml-auto text-sm text-gray-600">
            {selectedIds.length}件選択中
          </span>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="記事を検索..."
          />
        </div>
      </div>

      {/* ===== アクションバー ===== */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <button
          onClick={toggleAll}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
        >
          {selectedIds.length === filteredArticles.length ? (
            <CheckSquare size={18} className="text-indigo-600" />
          ) : (
            <Square size={18} />
          )}
          すべて選択
        </button>

        {/* <button
          onClick={handleBulkDownload}
          disabled={selectedIds.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
        >
          <Download size={18} />
          選択した記事をダウンロード
        </button> */}


<button
    onClick={handleBulkDownload}
    disabled={selectedIds.length === 0}
    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300"
  >
    <Download size={16} />
    .md でDL
  </button>

  <button
    onClick={handleBulkPdfDownload}
    disabled={selectedIds.length === 0}
    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg disabled:bg-gray-300"
  >
    <Download size={16} />
    .pdf でDL
  </button>

      </div>

      {/* ===== 記事一覧 ===== */}
      {articles.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          記事がありません
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => toggleSelect(article.id)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedIds.includes(article.id) ? "bg-indigo-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="pt-1">
                  {selectedIds.includes(article.id) ? (
                    <CheckSquare size={20} className="text-indigo-600" />
                  ) : (
                    <Square size={20} className="text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-gray-800 font-medium mb-1">
                    {article.title}
                  </h3>

                  {/* ★ ここが追加ポイント */}
                  <div className="flex gap-3 text-xs font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(article.title, article.body);
                      }}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      .md
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePdfDownload(article.title, article.body);
                      }}
                      className="text-green-600 hover:text-green-700"
                    >
                      .pdf
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== 検索結果なし ===== */}
      {filteredArticles.length === 0 && articles.length > 0 && (
        <div className="p-12 text-center text-gray-500">
          検索結果が見つかりませんでした
        </div>
      )}
    </div>
  );
}
