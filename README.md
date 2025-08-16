# Daifuku_Translator
[中文](README.md) | [English](README_en.md)


目前只支援Firefox, 電腦與Android皆可使用

## 使用方法
選取文字後使用LLM進行翻譯

需要在【管理擴充元件-選項】或點選Daifuku Translator圖示進入設定頁面，設定API key

Android：選取文字後出現【翻譯】的懸浮按鈕，按下即可翻譯。

PC：選取文字後可以右鍵開啟選單，選擇【使用Daifuku Translator】或 使用懸浮按鈕翻譯。

## 初始設定

### PC
點選Daifuku Trasnlator的圖示 或 在`管理附加元件`中選擇`選項`打開設定頁面

### Android
點擊右上角`⠸`打開選單，選擇`擴充套件`，點選`Daifuku Translator`打開設定頁面

### 設定頁面

- 選擇模型，目前提供模型有: 
    - Gemini 2.0 Flash
    - Mistral large 2411
    - Mistral small latest
- 輸入API key，API key獲取方法請自己到各個模型供應商官網尋找
- <scan style="color: blue;">(可選)</scan>選擇懸浮按鈕的位置：右上角/右下角
- <scan style="color: blue;">(可選)</scan>設定翻譯頁面大小
- <scan style="color: blue;">(可選)</scan>自訂Prompt，若你想讓AI將內容翻譯成其他語言，請自己修改Prompt
- 儲存設定


## Q&A
Q: Api Key存取在哪裡？

A: 存取在browser.storage.local

<br>

Q: 安全嗎？

A: 沒有絕對的安全，本擴充已經使用了DOMPurify過濾惡意攻擊，剩下的可能性請由使用者自己承擔，請不要隨意瀏覽不明網站。

<br>

Q: API呼叫失敗/給出錯誤訊息/沒有翻譯，為什麼？

A: 請檢查你自己的API key與模型供應商，大部分都是模型供應商問題。
有一些是AI拒絕回覆敏感內容，請自己修改Prompt。

<br>

Q: 我發現了bug。

A: 請在Github回報，謝謝！

## Third-Party Libraries
- [DOMPurify](https://github.com/cure53/DOMPurify)
    Licensed under Apache License 2.0 or Mozilla Public License 2.0.
    For full license details, see `libs\LICENSE_DOMPurify.txt` in this project.