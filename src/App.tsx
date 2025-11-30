import { useState } from 'react'
import { SettingForm } from './components/SettingForm'
import { ArticleList } from './components/ArticleList'
import { fetchQiitaArticles } from './utils/qiitaAPI';

function App() {
  const [articles,setArticles] = useState([]);
  const [token, setToken]=useState("");
  const [userId, setUserId]=useState("");

  const handleSave=async(id:string,tk:string)=>{
    setUserId(id);
    setToken(tk)


    const items= await fetchQiitaArticles(id,tk);
    setArticles(items);
  };

  return (
  <div className="min-h-screen bg-[#f3f6ff] px-6 py-10">

    {/* ===== HERO HEADER ===== */}
    <div className="max-w-5xl mx-auto mb-10">
      <div className="flex items-center gap-4">
        {/* 緑のアイコンボックス */}
        <div className="bg-green-500 p-3 rounded-xl text-white shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
            />
          </svg>
        </div>

        {/* タイトルと説明 */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Qiita Downloader
          </h1>
          <p className="text-gray-600 text-lg mt-1">
            Qiita記事を簡単にダウンロード・管理
          </p>
        </div>
      </div>
    </div>

    {/* ===== MAIN CONTENT AREA ===== */}
    <div className="max-w-5xl mx-auto space-y-8">
      <SettingForm onSave={handleSave} />
      <ArticleList articles={articles} />
    </div>
  </div>
);

}

export default App
