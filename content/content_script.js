let translatedPanel = null;

// 唯一的任務：監聽來自 background 的訊息，並顯示翻譯結果
browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'SHOW_LOADING_PANEL') {
    // 收到「顯示載入中」指令，呼叫函式並傳入特殊內容
    showTranslationPanel("等待回應中...");
  } else if (message.type === 'TRANSLATION_RESULT') {
    // 收到「翻譯結果」指令，呼叫同一個函式來更新內容
    updatePanelContent(message.text);
  }
});

// 顯示翻譯結果的面板
// 建立並顯示面板的函式 (只在第一次創建時呼叫)
function showTranslationPanel(initialContent) {
  // 如果已有面板，先移除
  if (translatedPanel) {
    translatedPanel.remove();
  }
  
  // 建立面板 DOM
  translatedPanel = document.createElement('div');
  translatedPanel.id = 'gemini-translation-panel';
  translatedPanel.innerHTML = `
    <div class="panel-header">
      <span>Daifuku Translator</span>
      <button class="close-btn">&times;</button>
    </div>
    <div class="panel-body"> 
        <!-- 內容將由 JS 動態填入 --> 
    </div>
  `;
  document.body.appendChild(translatedPanel);

  //呼叫Update填入初始內容
  updatePanelContent(initialContent);

  // 關閉按鈕的邏輯
  translatedPanel.querySelector('.close-btn').addEventListener('click', () => {
    translatedPanel.remove();
    translatedPanel = null;
  });
}

// 更新面板內容的函式
function updatePanelContent(htmlContent) {
  if (!translatedPanel) return; // 如果面板不存在，直接返回

  const panelBody = translatedPanel.querySelector('.panel-body');
  if (panelBody) {
    // 替換換行符，並可以加入一個載入中的 CSS class
    if (htmlContent === "等待回應中...") {
        panelBody.innerHTML = `<div class="loading-indicator">${htmlContent}</div>`;
    } else {
        // 使用 DOMPurify 清理來自 API 的內容
        const cleanHtml = DOMPurify.sanitize(htmlContent.replace(/\n/g, '<br>'));
        // 將清理過的、安全的 HTML 賦值給 innerHTML
        panelBody.innerHTML = cleanHtml;
    }
  }
}