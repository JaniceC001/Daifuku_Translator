// 預設 Prompt
const DEFAULT_PROMPT_BG = `Please translate the following text into Traditional Chinese, NO summarize:\n\n---\n{text}\n---`;
let last_req = null; //最後一個請求的user input
let status = 'success'; //預設API請求都是成功

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
  
  last_req = {text : textToTranslate, tab: tab};
  browser.tabs.sendMessage(tab.id, { type: 'SHOW_LOADING_PANEL' });

  const settings = await browser.storage.local.get([
    'selectedModel', 'geminiApiKey', 'mistralApiKey', 'userPrompt'
  ]);

  const model = settings.selectedModel || 'gemini';
  const promptTemplate = settings.userPrompt || DEFAULT_PROMPT_BG;
  const finalPrompt = promptTemplate.replace('{text}', textToTranslate);

  let result = {status: 'success', data: ''};

  if (model.startsWith('gemini')) {
    if (!settings.geminiApiKey){
      result = {status: 'error', data: '錯誤：請在設定頁面輸入您的 Gemini API Key。'};
    } else {
      result = await callGeminiApi(finalPrompt, settings.geminiApiKey);
    }
  } else if (model.startsWith('mistral')) {
    if (!settings.mistralApiKey) {
        result = {status: 'error', data: '錯誤：請在設定頁面輸入您的 Mistral API Key。'};
      } else {
        // 將完整的模型值 ( "mistral-large-2411") 傳遞給 API 函式
        result = await callMistralApi(finalPrompt, settings.mistralApiKey, model);
      }
  }

  browser.tabs.sendMessage(tab.id, {
    type: 'TRANSLATION_RESULT',
    status: result.status,
    text: result.data
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
  }else if (message.type === 'REGENERATE_TRANSLATION') {
    if (last_req) {
      console.log("收到重新生成請求");
      // 使用儲存的原文和 tab 資訊，再次呼叫核心翻譯函式
      startTranslation(last_req.text, last_req.tab);
    } else {
      console.error("無法重新生成，找不到上一次的請求資訊。");
    }
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

    // 改善後的錯誤處理
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData.error?.message || '未知錯誤');
      // 不要記錄完整的 errorData (Gemini有機會回傳ENFOUNDED=有API key)
      return {
        status: 'error',
        data: `API 呼叫失敗: ${errorData.error?.message || '請求失敗'}`
      };
    }

    const data = await response.json();

    return {
      status: 'success',
      data: data.candidates[0].content.parts[0].text
    };
  } catch (error) {
    console.error('Fetch Error:', error);
    return {
      status: 'error',
      data:'網路請求失敗，請檢查主控台。'
    };
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
      return {
        status: 'error',
        data: `API 呼叫失敗: ${errorData.message || '未知錯誤'}`
      };
    }

    const data = await response.json();
    // Mistral 的回應結構不同
    return {
      status: 'success',
      data: data.choices[0].message.content
    };
  } catch (error) {
    console.error('Fetch Error:', error);
    return {
      status: 'error',
      data:'網路請求失敗，請檢查主控台。'
    };
  }
}