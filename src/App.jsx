import React, { useState } from 'react';
import { extractPatentData } from './patentDataExtractor';
import { parseXmlString } from './xmlUtils';
import PatentViewer from './PatentViewer';
import './App.css';

/**
 * 特許公報XMLビューワーのメインアプリケーションコンポーネント
 * @returns {JSX.Element}
 */
function App() {
  const [patentData, setPatentData] = useState(null);
  const [imageFiles, setImageFiles] = useState({});
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('XMLファイルと関連する画像ファイルを選択してください。');

  /**
   * ファイルインプットでファイルが選択されたときに実行されるハンドラ
   * @param {React.ChangeEvent<HTMLInputElement>} event - ファイル選択イベント
   */
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // 状態をリセット
    setError('');
    setPatentData(null);
    setImageFiles({});

    // .xml または .txt で終わるファイルを探します
    const xmlFile = files.find(file => {
      const lowerCaseName = file.name.toLowerCase();
      return lowerCaseName.endsWith('.xml') || lowerCaseName.endsWith('.txt');
    });

    // ファイルが見つからない場合のエラー処理
    if (!xmlFile) {
      setError('XMLまたはTXTファイルが見つかりません。どちらかのファイルを必ず含めてください。');
      setStatusMessage('ファイル選択に失敗しました。');
      return;
    }

    setStatusMessage(`処理中: ${xmlFile.name} を読み込んでいます...`);

    const reader = new FileReader();
    reader.onload = (e) => {
      //try {
        const xmlString = e.target.result;
        const xmlDoc = parseXmlString(xmlString);
        const extractedData = extractPatentData(xmlDoc);
        
        setPatentData(extractedData);
        setStatusMessage(`読み込み完了: ${xmlFile.name} `);
      //} catch (err) {
      //  console.error("Data Extraction Error:", err);
      //  setError(`処理中にエラーが発生しました: ${err.message}`);
      //  setStatusMessage('ファイル処理中にエラーが発生しました。');
      //}
    };
    reader.onerror = () => {
        setError('ファイルの読み込みに失敗しました。');
        setStatusMessage('ファイル読み込みエラー。');
    }
    reader.readAsText(xmlFile);
  };

  return (
    <div className="container">
      <header>
        <h1>特許公報ビューアー</h1>
      </header>
      <main>
        <div className="upload-section">
          <div className="upload-box">
            <h2>ファイル選択</h2>
            <p>XMLファイルを選択してください。</p>
            <input 
              type="file" 
              multiple 
              accept=".txt,.xml"
              onChange={handleFileSelect} 
            />
            <p className="status-message">{statusMessage}</p>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        
        {patentData && <PatentViewer patentData={patentData} />}
      </main>
    </div>
  );
}

export default App;
