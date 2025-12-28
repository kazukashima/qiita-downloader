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

  /* -------------------------
   * PDF ダウンロード（MVP3）
   * ------------------------- */
  const handlePdfDownload = async (title: string, body: string) => {
    const html = markdownToQiitaHTML(body);

    // iframe（PDF専用）
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
@page { size: A4; }

html, body {
  margin: 0;
  padding: 0;
  background: #fff;
}

* {
  box-sizing: border-box;
}

.qiita-preview {
  width: 190mm;
  max-width: 190mm;
  margin: 0 auto;
  font-family: "Noto Sans JP", system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 14px;
  line-height: 1.8;
  color: #000;
}

/* 見出し */
h1 { font-size: 24px; page-break-after: avoid; }
h2 { font-size: 20px; page-break-after: avoid; }
h3 { font-size: 17px; page-break-after: avoid; }

p {
  margin: 0.6em 0;
}

/* コードブロック
   長いコードはページまたぎOK（行は壊さない） */
pre {
  background: #f5f5f5 !important;
  color: #000 !important;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  page-break-inside: auto;
}

code {
  background: #eee;
  padding: 2px 4px;
  border-radius: 4px;
}

blockquote, ul, ol, table {
  page-break-inside: avoid;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 12px 0;

  /*  画像は途中で切らせない */
  page-break-inside: avoid;
  page-break-after: avoid;

  p > img {
  page-break-inside: avoid;
}
}

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

    // 描画待ち
    await new Promise((r) => setTimeout(r, 300));

    // PDF生成
    await html2pdf()
  .set({
    filename: `${title}.pdf`,
    margin: [10, 8, 10, 8],
    html2canvas: {
      scale: 1.5,
      backgroundColor: "#fff",

      //  追加
      useCORS: true,
      allowTaint: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
  } as any)
  .from(doc.body)
  .save();

    document.body.removeChild(iframe);
  };

  /* -------------------------
   * 一括ダウンロード
   * ------------------------- */
  const handleBulkDownload = () => {
    const selectedArticles = articles.filter((x) =>
      selectedIds.includes(x.id)
    );
    selectedArticles.forEach((article) => {
      handleDownload(article.title, article.body);
    });
  };

  const handleBulkPdfDownload = () => {
    const selectedArticles = articles.filter((x) =>
      selectedIds.includes(x.id)
    );
    selectedArticles.forEach((article) => {
      handlePdfDownload(article.title, article.body);
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* ヘッダー */}
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

      {/* アクションバー */}
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

        <div className="flex gap-3">
          <button
            onClick={handleBulkDownload}
            disabled={selectedIds.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300"
          >
            <Download size={16} />
            .md
          </button>

          <button
            onClick={handleBulkPdfDownload}
            disabled={selectedIds.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg disabled:bg-gray-300"
          >
            <Download size={16} />
            .pdf
          </button>
        </div>
      </div>

      {/* 記事一覧 */}
      {articles.length === 0 ? (
        <div className="p-12 text-center text-gray-500">記事がありません</div>
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

      {filteredArticles.length === 0 && articles.length > 0 && (
        <div className="p-12 text-center text-gray-500">
          検索結果が見つかりませんでした
        </div>
      )}
    </div>
  );
}
