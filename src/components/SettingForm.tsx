import { useState } from "react";
import { Settings } from 'lucide-react';  

type Props = {
  onSave: (id: string, token: string) => void;
};

export function SettingForm({ onSave }: Props) {
  const [id, setId] = useState("");
  const [token, setToken] = useState("");

  const handleSave = () => {
    console.log("入力されたQiita ID:", id);
    console.log("入力されたAPIトークン:", token);
    onSave(id, token);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
      {/* ← アイコン付きヘッダーに変更 */}
      <div className="flex items-center gap-2 mb-4">
        <Settings className="text-indigo-600" size={20} />
        <h2 className="text-xl font-semibold text-gray-800">Qiita設定</h2>
      </div>
      
      {/* ← グリッドレイアウトに変更 */}
      {/* 入力欄全体 */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ユーザー名
          </label>
          <input
            type="text"
            placeholder="Qiita ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            // Qiitaid入力欄枠付ける
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            APIトークン
          </label>
          <input
            type="password"
            placeholder="API token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>
      <button
        onClick={handleSave}
    
        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
      >
        保存
      </button>
    </div>
  );
}
