# Daifuku_Translator
目前只支援Firefox, 電腦與Android皆可使用(Android需要使用開發者模式)

## 使用方法
選取文字後使用LLM進行翻譯

需要在【管理擴充元件-選項】或點選Daifuku Translator圖示進入設定頁面，設定API key

Android：選取文字後出現【翻譯】的懸浮按鈕，按下即可翻譯。

PC：選取文字後可以右鍵開啟選單，選擇【使用Daifuku Translator】或 使用懸浮按鈕翻譯。

## 安裝&初始設定

### PC
1. 下載xpi檔案，下載連結：[release](https://github.com/JaniceC001/Daifuku_Translator/tree/39e0b3c3864b39dc86d7675b0340317c4225e968/release)
2. 在Firefox瀏覽器的`about:addons`裡, 選擇`從檔案安裝附加元件`
3. 選擇剛剛下載的xpi檔案
4. 點選Daifuku Trasnlator的圖示 或 在`管理附加元件`中選擇`選項`打開 設定頁面
5. 選擇模型和輸入API key
6. 儲存設定
7. 去網頁選擇文字 > 按下懸浮按鈕【翻譯】
8. 等待回覆

### Android
（待填）

## Q&A
Q: Api Key存取在哪裡？

A: 存取在browser.storage.local

<br>

Q: 安全嗎？

A: 沒有絕對的安全，本擴充已經使用了DOMPurify過濾惡意攻擊，剩下的可能性請由使用者自己承擔，請不要隨意瀏覽不明網站。

## Third-Party Libraries
- [DOMPurify](https://github.com/cure53/DOMPurify)
    Licensed under Apache License 2.0 or Mozilla Public License 2.0.
    For full license details, see `LICENSE_DOMPurify.txt` in this project.