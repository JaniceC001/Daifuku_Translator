let translatedPanel = null;
let floatingButton = null; //懸浮按鈕


// 監聽來自 background 的訊息，並顯示翻譯結果
browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'SHOW_LOADING_PANEL') {
    // 收到「顯示載入中」指令，呼叫函式並傳入特殊內容
    showTranslationPanel("等待回應中...");
  } else if (message.type === 'TRANSLATION_RESULT') {
    // 收到「翻譯結果」指令，呼叫同一個函式來更新內容
    updatePanelContent(message.text);
  }
});

//監聽文字選取事件，以顯示/隱藏懸浮按鈕
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText.length > 0) {
    // 如果有選取文字，就顯示按鈕
    showFloatingButton(selection);
  } else {
    // 如果沒有選取文字（例如使用者點擊了頁面空白處），就隱藏按鈕
    hideFloatingButton();
  }
});

//點擊頁面其他地方時，也隱藏按鈕
document.addEventListener('mousedown', (event) => {
    // 如果點擊的不是我們的懸浮按鈕，且沒有選取文字，則隱藏按鈕
    if (floatingButton && !floatingButton.contains(event.target) && window.getSelection().toString().trim().length === 0) {
        hideFloatingButton();
    }
});

//建立和顯示懸浮按鈕
async function showFloatingButton(selection) {
  if (!floatingButton) {
    // 如果按鈕不存在，就建立它
    floatingButton = document.createElement('div');
    floatingButton.id = 'gemini-floating-button';
    floatingButton.textContent = '翻譯'; // 或者放一個圖示
    document.body.appendChild(floatingButton);

    // 為按鈕添加點擊事件
    floatingButton.addEventListener('click', () => {
      const textToTranslate = window.getSelection().toString().trim();
      if (textToTranslate.length > 0) {
        // 發送一個新的訊息類型給 background
        browser.runtime.sendMessage({
          type: 'TRANSLATE_TEXT_FROM_BUTTON', // 使用新的類型以區分來源
          text: textToTranslate
        });
      }
      // 點擊後立即隱藏按鈕和選取
      hideFloatingButton();
      window.getSelection().removeAllRanges();
    });
  }

  const { buttonPosition } = await browser.storage.sync.get('buttonPosition');
  const position = buttonPosition || 'bottom-right'; // 如果未設定，預設為右上角

  // 計算按鈕位置
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  // 將按鈕定位在選取範圍的右上角
  if (position === 'top-right'){
    floatingButton.style.top = `${window.scrollY + rect.top - 30}px`; // 往上偏移30px
    floatingButton.style.left = `${window.scrollX + rect.right}px`;
  } else if (position === 'bottom-right'){
    //右下角
    floatingButton.style.top = `${window.scrollY + rect.bottom + 5}px`;
    floatingButton.style.left = `${window.scrollX + rect.right - 15}px`;
  }
  floatingButton.style.display = 'block';
}

// 隱藏懸浮按鈕的函式
function hideFloatingButton() {
  if (floatingButton) {
    floatingButton.style.display = 'none';
  }
}


// 顯示翻譯結果的面板
// 建立並顯示面板的函式 (只在第一次創建時呼叫)
async function showTranslationPanel(initialContent) {
  
  console.log("成功呼叫Panel，初始內容是:", initialContent);
  // 如果已有面板，先移除
  if (translatedPanel) {
    translatedPanel.remove();
  }

  // 獲取尺寸設定
  const { panelWidth, panelMaxHeight } = await browser.storage.sync.get([
    'panelWidth', 
    'panelMaxHeight'
  ]);

  // 設定預設值
  const width = panelWidth || 350;
  const maxHeight = panelMaxHeight || 400;
  
  // 建立面板 DOM
  translatedPanel = document.createElement('div');
  translatedPanel.id = 'gemini-translation-panel';
  // 4. 將尺寸設定應用為 inline style
  translatedPanel.style.width = `${width}px`;

  translatedPanel.innerHTML = `
    <div class="panel-header">
      <span>Daifuku Translator</span>
      <button class="close-btn">&times;</button>
    </div>
    <div class="panel-body"> 
        <!-- 內容將由 JS 動態填入 --> 
    </div>
  `;

  // 為 panel-body 設定 max-height
  const panelBody = translatedPanel.querySelector('.panel-body');
  if (panelBody) {
    panelBody.style.maxHeight = `${maxHeight}px`;
  }

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