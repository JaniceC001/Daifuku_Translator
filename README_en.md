# Daifuku_Translator
[中文](README.md) | [English](README_en.md)

**This extension does not yet offer other interface language settings.**

**This Readme content is translated by an LLM and may contain ambiguities or errors.**

## About This Extension
This extension uses AI (LLM) to translate web pages and requires your own API key. For questions about API key storage and security, please see our [Q&A](https://github.com/JaniceC001/Daifuku_Translator/blob/main/README_en.md#qa).

This extension is an **open-source project**. LINCSES is licensed under the Apache 2.0 License, and the license file is located in the root directory as `LICENSE`.

We use the [DOMPurify](https://github.com/cure53/DOMPurify) library to ensure security. For full license details, see `libs\LICENSE_DOMPurify.txt`.

## Supported browser
Firefox(PC & Android)

## Release
[Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/daifuku-translator/)


# Quirk Start
## Initial Setup
### PC

Click on the Daifuku Translator icon *or* select the option in the add-on management to open the settings page.

### Android

Click on the `⠸` in the upper right corner to open the menu, select the extension, and click on Daifuku Translator to open the settings page

### Settings Page
- Select the model, currently available models are:
    - Gemini 2.0 Flash
    - Mistral large 2411
    - Mistral small latest
- Enter the API key, the method to obtain the API key can be found on the official websites of the respective model providers
- *(Optional)* Choose the position of the floating button: top right/bottom right
- *(Optional)* Set the size of the translation page
- *(Optional)* Customize the Prompt, if you want the AI to translate the content into another language, please modify the Prompt yourself
- Save settings

## Usage Method

Android: After selecting text, a floating button with the word `Translate` will appear; press it to translate.

PC: After selecting text, you can right-click to open the menu, choose `Use Daifuku Translator`, or use the floating button to translate.

## Q&A

#### Q: Where is the Api Key stored?

A: It is stored in `browser.storage.local`, it means that the keys are stored only on your local computer and are not uploaded to any server.

<br>

#### Q: Is it secure?

A: There is no absolute security. This extension has used [DOMPurify](https://github.com/cure53/DOMPurify) to filter malicious attacks. The remaining possibilities are to be borne by the user. Please do not browse unknown websites indiscriminately.

<br>

#### Q: Why does the API call fail/give an error message/not translate?

A: Please check your own API key and model provider. Most issues are with the model provider. Some are due to the AI refusing to respond to sensitive content. Please modify the Prompt/translation content yourself.

<br>

#### Q: My AI keeps giving me summaries/comment/additional information, what should I do?

A: Modify the Prompt. You can try the following Prompt template.

***It may not necessarily solve the problem, please modify it further according to the situation.***
```
Please translate the following text into English, NO summarize, No comment, Only translate text:

---
{text}
---
```

<br>

#### Q: I found a bug.

A: Please report it on GitHub, thank you!


## Third-Party Libraries
- [DOMPurify](https://github.com/cure53/DOMPurify)
    Licensed under Apache License 2.0 or Mozilla Public License 2.0.
    For full license details, see `libs\LICENSE_DOMPurify.txt` in this project.