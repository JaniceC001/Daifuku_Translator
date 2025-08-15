// 預設 Prompt
const DEFAULT_PROMPT_BG = `請將以下文字翻譯成繁體中文，不要總結::\n\n---\n{text}\n---`;

// 安裝或更新時建立右鍵選單（僅桌面支援）
browser.runtime.onInstalled.addListener(() => {
  if (browser.contextMenus && browser.contextMenus.create) {
    browser.contextMenus.create({
      id: "translate-selection",
      title: "使用Daifuku Translator",
      contexts: ["selection"]
    });
  } else {
    console.log("contextMenus API 在此平台不支援，將使用替代方案");
  }
});

//翻譯
async function startTranslation(textToTranslate, tab) {
  if (!tab || !tab.id) return;

  browser.tabs.sendMessage(tab.id, { type: 'SHOW_LOADING_PANEL' });

  const settings = await browser.storage.local.get([
    'selectedModel', 'geminiApiKey', 'mistralApiKey', 'userPrompt'
  ]);

  const model = settings.selectedModel || 'gemini';
  const promptTemplate = settings.userPrompt || DEFAULT_PROMPT_BG;
  const finalPrompt = promptTemplate.replace('{text}', textToTranslate);

  let translatedText = '';
  if (model === 'gemini') {
    translatedText = settings.geminiApiKey
      ? await callGeminiApi(finalPrompt, settings.geminiApiKey)
      : '錯誤：請在設定頁面輸入您的 Gemini API Key。';
  } else if (model.startsWith('mistral')) {
    if (!settings.mistralApiKey) {
        translatedText = '錯誤：請在設定頁面輸入您的 Mistral API Key。';
      } else {
        // 將完整的模型值 ( "mistral-large-2411") 傳遞給 API 函式
        translatedText = await callMistralApi(finalPrompt, settings.mistralApiKey, model);
      }
  }

  browser.tabs.sendMessage(tab.id, {
    type: 'TRANSLATION_RESULT',
    text: translatedText
  });
}

// 監聽右鍵選單（僅桌面）
if (browser.contextMenus && browser.contextMenus.onClicked) {
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "translate-selection") {
      startTranslation(info.selectionText, tab);
    }
  });
}

// 監聽懸浮按鈕（桌面 + Android 通用）
browser.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'TRANSLATE_TEXT_FROM_BUTTON') {
    startTranslation(message.text, sender.tab);
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

// Mistral API
async function callMistralApi(prompt, apiKey, modelId) {
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
        model: modelId, // 或者其他模型
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