// 預設 Prompt
const DEFAULT_PROMPT_BG = `請將以下文字翻譯成繁體中文，並提供1到2種不同的翻譯風格或選項，不要總結::\n\n---\n{text}\n---`;

// 在擴充功能安裝或更新時，建立右鍵選單
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "translate-selection",            // 給這個選單項一個唯一的 ID
    title: "使用Daifuku Translator",           // 顯示在右鍵選單上的文字
    contexts: ["selection"]               // 只在使用者選取了文字時才顯示
  });
});

// 2. 監聽右鍵選單的點擊事件
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  // 確保是我們自己的選單項被點擊
  if (info.menuItemId === "translate-selection") {
    
    // info.selectionText 會自動包含被選取的文字
    const textToTranslate = info.selectionText;

    // 讓 content_script 先顯示一個等待面板
    browser.tabs.sendMessage(tab.id, {
      type: 'SHOW_LOADING_PANEL', // 使用一個新的訊息類型
    });
    
    // 獲取所有相關設定 (不變)
    const settings = await browser.storage.sync.get([
      'selectedModel',
      'geminiApiKey',
      'mistralApiKey',
      'userPrompt'
    ]);

    const model = settings.selectedModel || 'gemini'; // 預設使用 gemini
    const promptTemplate = settings.userPrompt || DEFAULT_PROMPT_BG;
    const finalPrompt = promptTemplate.replace('{text}', textToTranslate);

    // 步驟 C: 進入模型選擇分支後，再檢查對應的 Key
    if (model === 'gemini') {
      // 只在選擇 Gemini 時，才檢查 Gemini 的 Key
      if (!settings.geminiApiKey) {
        translatedText = '錯誤：請在設定頁面輸入您的 Gemini API Key。';
      } else {
        translatedText = await callGeminiApi(finalPrompt, settings.geminiApiKey);
      }
    } else if (model === 'mistral') {
      // 只在選擇 Mistral 時，才檢查 Mistral 的 Key
      if (!settings.mistralApiKey) {
        translatedText = '錯誤：請在設定頁面輸入您的 Mistral API Key。';
      } else {
        translatedText = await callMistralApi(finalPrompt, settings.mistralApiKey);
      }
    } else {
      // 處理未知模型的錯誤情況
      translatedText = '錯誤：未知的 AI 模型被選擇。';
    }
    
    // 3. 將結果傳回給觸發事件的那個分頁 (content_script)
    browser.tabs.sendMessage(tab.id, {
      type: 'TRANSLATION_RESULT',
      text: translatedText
    });
  }
});

//按擴充圖示打開option頁面
browser.browserAction.onClicked.addListener(() => {
  console.log("工具列圖示被點擊，正在打開選項頁面...");
    // 使用 API 打開擴充功能的選項頁面
  browser.runtime.openOptionsPage();
});

// 呼叫 Gemini API 的函式
async function callGeminiApi(prompt, apiKey) {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return `API 呼叫失敗: ${errorData.error.message}`;
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Fetch Error:', error);
    return '網路請求失敗，請檢查主控台。';
  }
}

// --- 【新增 Mistral API 函式】 ---
async function callMistralApi(prompt, apiKey) {
  const API_URL = 'https://api.mistral.ai/v1/chat/completions';
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // Mistral 使用 Bearer Token
      },
      body: JSON.stringify({
        model: 'mistral-large-2411', // 或者其他模型
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Mistral API Error:', errorData);
      return `API 呼叫失敗: ${errorData.message || '未知錯誤'}`;
    }

    const data = await response.json();
    // Mistral 的回應結構不同
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Fetch Error:', error);
    return '網路請求失敗，請檢查主控台。';
  }
}