# ChatGPT Linter

**AI-powered code linter for VS Code, powered by ChatGPT and your own rules.**

This extension allows you to define a custom style guide (in plain text or Markdown), and have ChatGPT analyze your code for violations. Results are written to a JSON file and displayed as inline squiggles—just like ESLint.

---

## ✨ Features

- ✅ Analyze the active file using ChatGPT
- ✅ Custom style guide support
- ✅ Inline squiggle diagnostics (warnings & errors)
- ✅ Uses OpenAI models (configurable)
- ✅ Fully customizable through VS Code settings

---

## 🚀 Getting Started

### 1. Install the Extension

Search for `ChatGPT Linter` in the **VS Code Extensions Marketplace** or install it manually from `.vsix`.

### 2. Set Your OpenAI API Key

In VS Code settings (`Ctrl + ,`):

- `ChatGPT Lint › Api Key For Open Ai`: Your OpenAI API key ([get one here](https://platform.openai.com/account/api-keys))

### 3. Create Your Style Guide

Create a file like `chatgpt-linter-prompt.md` in your workspace:

```md
# Style Guide

- Use camelCase for variable names
- No `any` type
- Prefer `const` over `let` when not reassigned

You can use Markdown, plain text, or bullet lists.

4. Lint Your File

Run the command:

ChatGPT Lint: Generate Lint File

This will:
	•	Send the open file + style guide to ChatGPT
	•	Generate a .chatgpt-lint.json file
	•	Show squiggles for any issues found

⸻

⚙️ Configuration Options

In settings.json or the VS Code settings UI:

Setting	Description	Default
chatgptLinter.apiKeyForOpenAi	Your OpenAI API key	""
chatgptLinter.model	Model to use (gpt-3.5-turbo, gpt-4, etc.)	"gpt-4"
chatgptLinter.stylePath	Path to your style guide file	"./chatgpt-linter-prompt.md"
chatgptLinter.lintFileName	Output file for lint results	".chatgpt-lint.json"



⸻

🧠 How It Works
	1.	You run a command on the current editor file
	2.	The extension loads your custom style guide
	3.	It sends both to ChatGPT via OpenAI’s API
	4.	The model responds with structured lint results
	5.	The results are saved to .chatgpt-lint.json
	6.	Squiggles appear automatically using VS Code’s Diagnostics API

⸻

🔐 API Usage & Rate Limits

This extension uses your own OpenAI API key. Make sure your key is valid and you’re aware of your rate limits and token quotas.
	•	Check your OpenAI usage here

⸻

💡 Tips
	•	You can use "gpt-3.5-turbo" for faster/cheaper responses
	•	You can manually edit .chatgpt-lint.json to test squiggle display
	•	Works great alongside ESLint — they can co-exist

⸻

🧪 Roadmap
	•	Multi-file/project-wide analysis
	•	GitHub Copilot-style fix suggestions
	•	Hover tooltips and quick fixes

⸻

🛠 Contributing

Pull requests welcome! Feel free to open issues or feature requests.

⸻

📄 License

MIT

⸻

Made with 💬 by @yuliswe

---

Let me know if you'd like:
- A badge section (e.g. marketplace, version, license)
- GitHub Actions instructions for auto-publishing
- Screenshots or demo GIF sections added

Happy to help with any branding or polish!
