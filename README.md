# Daifuku_Translator
[中文](README.md) | [English](README_en.md)

# 擴充介紹
此擴充是透過使用AI (LLM)來對網頁進行翻譯，需要使用者提供 API key，若你對API key存取方式或安全性有疑慮，可以先看看[Q&A](https://github.com/JaniceC001/Daifuku_Translator?tab=readme-ov-file#qa)。

此擴充是**開源項目**，LINCSES 是基於 Apache 2.0 授權條款，授權文件在根目錄的`LICENSE`。

本擴充使用了第三方庫[DOMPurify](https://github.com/cure53/DOMPurify)，你可以到`libs\LICENSE_DOMPurify.txt`查看完整的授權文件。

更新日志 | 歷史版本

### 適用瀏覽器
Firefox (PC & Android)

### 發佈版本
Firefox Add-ons 商店

### 歷史版本
[release](https://github.com/JaniceC001/Daifuku_Translator/tree/main/release)

# 快速開始
## 首次設定

### 1. 打開設定頁面
#### PC
點選Daifuku Trasnlator的圖示 或 在`管理附加元件`中選擇`選項`打開設定頁面

#### Android
點擊右上角`⠸`打開選單，選擇`擴充套件`，點選`Daifuku Translator`打開設定頁面

### 2.完成設定

- 選擇模型，目前提供模型有: 
    - Gemini 2.0 Flash
    - Mistral large 2411
    - Mistral small latest
- 輸入API key，API key獲取方法請自己到各個模型供應商官網尋找
- *(可選)* 選擇懸浮按鈕位置和翻譯頁面大小
- *(可選)* 自訂Prompt以滿足特定的翻譯需求，你可以透過此讓AI翻譯成其他語言，也可以讓AI根據你想要的格式輸出
- 點擊`儲存設定`

## 使用方法

在設定完成後，您可以透過以下方式進行翻譯：
### PC
1. 在網頁上選取您想翻譯的文字
2. 點擊出現的懸浮按鈕 或 點擊右鍵選擇 `使用Daifuku Translator`。

### Android
1. 在網頁上選取您想翻譯的文字。
2. 點擊出現的懸浮按鈕。

# Q&A
#### Q: Api Key存取在哪裡？

A: 存取在`browser.storage.local` ，這表示金鑰只會儲存在您自己的電腦上，不會上傳到任何伺服器。

<br>

#### Q: 安全嗎？

A: 沒有絕對的安全，本擴充已經使用了[DOMPurify](https://github.com/cure53/DOMPurify)過濾惡意攻擊，剩下的可能性請由使用者自己承擔，請不要隨意瀏覽不明網站。

<br>

#### Q: API呼叫失敗/給出錯誤訊息/沒有翻譯，為什麼？

A: 請檢查你自己的API key與模型供應商，大部分都是模型供應商問題。
有一些是AI拒絕回覆敏感內容，請自己修改Prompt/翻譯內容。

<br>

#### Q: 我的AI一直給總結/評價/額外資訊給我，怎麽辦？

A: 修改Prompt即可，可以嘗試以下的Prompt範本

***不一定能解決問題，請自己再根據情況修改***
```
Please translate the following text into Traditional Chinese, NO summarize, No comment, Only translate text:

---
{text}
---
```

<br>

#### Q: 我發現了bug。

A: 請在Github回報，謝謝！

# Third-Party Libraries
- [DOMPurify](https://github.com/cure53/DOMPurify)
    Licensed under Apache License 2.0 or Mozilla Public License 2.0.
    For full license details, see `libs\LICENSE_DOMPurify.txt` in this project.