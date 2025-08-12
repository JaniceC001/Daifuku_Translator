const modelSelector = document.getElementById('selectedModel');
const geminiSettings = document.getElementById('gemini-settings');
const mistralSettings = document.getElementById('mistral-settings');
const geminiApiKeyInput = document.getElementById('geminiApiKey');
const mistralApiKeyInput = document.getElementById('mistralApiKey');
const promptTextarea = document.getElementById('promptTemplate');
const saveButton = document.getElementById('saveButton');
const positionRadios = document.querySelectorAll('input[name="buttonPosition"]');
const statusDiv = document.getElementById('status');

// 定義一個預設的 Prompt，當使用者還沒有設定時使用
const DEFAULT_PROMPT = `請將以下文字翻譯成繁體中文，不要總結:\n\n---\n{text}\n---`;

// 根據選擇的LLM顯示對應的設定區塊
function showRelevantSettings() {
  const selected = modelSelector.value;
  geminiSettings.style.display = (selected === 'gemini') ? 'block' : 'none';
  mistralSettings.style.display = (selected === 'mistral') ? 'block' : 'none';
}

// 頁面載入時，讀取所有設定
function loadSettings() {
  browser.storage.sync.get([
    'selectedModel',
    'geminiApiKey',
    'mistralApiKey',
    'userPrompt'
  ]).then(res => {
    modelSelector.value = res.selectedModel || 'gemini'; // 預設選 Gemini
    geminiApiKeyInput.value = res.geminiApiKey || '';
    mistralApiKeyInput.value = res.mistralApiKey || '';
    promptTextarea.value = res.userPrompt || DEFAULT_PROMPT;
    
    const savedPosition = res.buttonPosition || 'bottom-right'; // 預設為 'bottom-right'
    for (const radio of positionRadios) {
      if (radio.value === savedPosition) {
        radio.checked = true; // 根據儲存的值，選中對應的按鈕
        break;
      }
    }
    // 根據讀取到的設定，顯示對應的區塊
    showRelevantSettings();
  });
}

// 儲存所有設定
function saveSettings() {
  let selectedPosition = 'bottom-right'; // 預設值
  for (const radio of positionRadios) {
    if (radio.checked) {
      selectedPosition = radio.value;
      break;
    }
  }

  const settings = {
    selectedModel: modelSelector.value,
    geminiApiKey: geminiApiKeyInput.value,
    mistralApiKey: mistralApiKeyInput.value,
    userPrompt: promptTextarea.value,
    buttonPosition: selectedPosition
  };

  if (!settings.userPrompt.includes('{text}')) {
    alert('錯誤：自訂 Prompt 必須包含 {text} 預留位置！');
    return;
  }

  browser.storage.sync.set(settings).then(() => {
    statusDiv.textContent = '設定已儲存！';
    setTimeout(() => statusDiv.textContent = '', 2000);
  });
}

// 事件監聽
modelSelector.addEventListener('change', showRelevantSettings);
saveButton.addEventListener('click', saveSettings);

// 初始化
loadSettings();