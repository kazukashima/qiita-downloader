import { useState } from "react";
import { Download, CheckSquare, Square, Search, FileText } from 'lucide-react';

type Article = {
  id: string;
  title: string;
  body: string;
};

export function ArticleList({ articles }: { articles: Article[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");  // ← 検索機能

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // ← 全選択機能
  const toggleAll = () => {
    if (selectedIds.length === filteredArticles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredArticles.map(a => a.id));
    }
  };

  const handleDownload = (title: string, body: string) => {
    const blob = new Blob([body], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.md`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const handleBulkDownload = () => {
    const selectedArticles = articles.filter(x => selectedIds.includes(x.id));
    selectedArticles.forEach((article) => {
      handleDownload(article.title, article.body);
    });
  };

  // ← フィルター機能
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* ← ヘッダー部分全体（検索バー付き） */}
      <div className="p-6 border-b border-gray-100 bg-white">
        {/* 記事一覧、0件表示中 */}
        <div className="flex items-center gap-2 mb-4">
          <FileText className="text-indigo-600" size={20} />
          <h2 className="text-xl font-semibold text-gray-800">記事一覧</h2>
          <span className="ml-auto text-sm text-gray-600">
            {selectedIds.length}件選択中
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="記事を検索..."
          />
        </div>
      </div>

      {/* ← アクションバー（すべて選択とダウンロードボタン） */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <button
          onClick={toggleAll}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
        >
          {selectedIds.length === filteredArticles.length ? (
            <CheckSquare size={18} className="text-indigo-600" />
          ) : (
            <Square size={18} />
          )}
          すべて選択
        </button>
        <button
          onClick={handleBulkDownload}
          disabled={selectedIds.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
        >
          <Download size={18} />
          選択した記事をダウンロード
        </button>
      </div>

      {/* ← 記事リスト（ul/liからdivに変更） */}
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
              className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                selectedIds.includes(article.id) ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* ← チェックボックスをアイコンに変更 */}
                <div className="pt-1">
                  {selectedIds.includes(article.id) ? (
                    <CheckSquare size={20} className="text-indigo-600" />
                  ) : (
                    <Square size={20} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-800 font-medium mb-1 leading-relaxed">
                    {article.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();  // ← 親要素のクリックを防ぐ
                      handleDownload(article.title, article.body);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    .mdダウンロード
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ← 検索結果なしのメッセージ */}
      {filteredArticles.length === 0 && articles.length > 0 && (
        <div className="p-12 text-center text-gray-500">
          検索結果が見つかりませんでした
        </div>
      )}
    </div>
  );
}


