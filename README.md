# ChatGPT Linter

**AI-powered code linter for VS Code, powered by ChatGPT and your own rules.**

This extension allows you to define a custom rules (in plain text or Markdown), and have ChatGPT analyze your code for violations. Results are written to a JSON file and displayed as inline squiggles—just like ESLint.


## ✨ Features

✅ Analyze the active file using ChatGPT  
✅ Custom rules support  
✅ Inline squiggle diagnostics (warnings & errors)  
✅ Uses OpenAI models (configurable)  
✅ Fully customizable through VS Code settings  


## 🚀 Getting Started

### 1. Install the Extension

Search for `ChatGPT Linter` in the **VS Code Extensions Marketplace** or install it manually from `.vsix`.

### 2. Set Your OpenAI API Key

In VS Code settings (`Ctrl + ,`):

> `ChatGPT Lint › Api Key For Open Ai` 

Set your OpenAI API key ([get one here](https://platform.openai.com/account/api-keys)).

### 3. Create Your Style Guide

Create a file like `chatgpt-linter-prompt.md` in your workspace:

```md
## Style Guide

- Use camelCase for variable names
- No `any` type
- Prefer `const` over `let` when not reassigned
```

You can use Markdown, plain text, or bullet lists.

## How to Lint Your File

Run the command (Using VSC `Cmd+Shift+P`)

> ChatGPT Lint: Generate Lint File

This will:
* Send the open file + rules to ChatGPT
* Generate a .chatgpt-lint.json file
* Show squiggles for any issues found



## ⚙️ Configuration Options

In settings.json or the VS Code settings UI:

| Setting                         | Description                                      | Default                          |
|---------------------------------|--------------------------------------------------|----------------------------------|
| `chatgptLinter.apiKeyForOpenAi` | Your OpenAI API key                              | `""`                             |
| `chatgptLinter.model`           | Model to use (`gpt-4`, etc.)                     | `"3o-mini"`                      |
| `chatgptLinter.stylePath`       | Path to your rules file                          | `"./chatgpt-linter-prompt.md"`   |
| `chatgptLinter.lintFileName`    | Output file for lint results                     | `".chatgpt-lint.json"`           |



## 🧠 How It Works

1.	The extension sends both your code and your custom rules to ChatGPT via OpenAI’s API
2.	ChatGPT reviews your code. The results are saved to `.chatgpt-lint.json`
5.	Squiggles appear automatically using VS Code’s Diagnostics API, like eslint does.



## 🔐 API Usage & Rate Limits

This extension uses your own OpenAI API key. Make sure your key is valid and you’re aware of your rate limits and token quotas.


## 💡 Tips

* You can use different models for faster/cheaper responses
* You can use other tools to generate `.chatgpt-lint.json` to make squiggles
  show up. The built-in command is just one option.


## 🛠 Contributing

Pull requests welcome! Feel free to open issues or feature requests.


## 📄 License

MIT


## Made with 💬 by @yuliswe

### Let me know if you'd like:
- A badge section (e.g. marketplace, version, license)
- GitHub Actions instructions for auto-publishing
- Screenshots or demo GIF sections added

Happy to help with any branding or polish!
