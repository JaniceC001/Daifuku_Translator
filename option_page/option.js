const apiKeyInput = document.getElementById('apiKey');
const promptTextarea = document.getElementById('promptTemplate'); // 獲取 textarea
const saveButton = document.getElementById('saveButton');
const statusDiv = document.getElementById('status');

// 定義一個預設的 Prompt，當使用者還沒有設定時使用
const DEFAULT_PROMPT = `請將以下文字翻譯成繁體中文，並提供1到2種不同的翻譯風格或選項，不要總結:\n\n---\n{text}\n---`;

// 頁面載入時，讀取已儲存的設定
browser.storage.sync.get('GeminiApiKey').then(res => {
  apiKeyInput.value = res.GeminiApiKey || '';
  // 如果儲存中有 userPrompt，就用它；否則，使用我們定義的預設值
  promptTextarea.value = res.userPrompt || DEFAULT_PROMPT;
});

// 點擊儲存按鈕
// browser.storage.local 本地儲存
saveButton.addEventListener('click', () => {
  const apiKey = apiKeyInput.value;
  const userPrompt = promptTextarea.value;

  // 驗證 prompt 是否包含 {text}
  if (!userPrompt.includes('{text}')) {
    alert('錯誤：自訂 Prompt 必須包含 {text} 預留位置！');
    return; // 阻止儲存
  }

  browser.storage.sync.set({
    GeminiApiKey: apiKey,
    userPrompt: userPrompt
  }).then(() => {
    statusDiv.textContent = '設定已儲存！';
    setTimeout(() => statusDiv.textContent = '', 2000);
  });
});