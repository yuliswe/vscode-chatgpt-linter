import * as fs from "fs";
import * as path from "path";
import {
  createJsonTranslator,
  error,
  success,
  type PromptSection,
  type TypeChatLanguageModel,
} from "typechat";
import { createTypeScriptJsonValidator } from "typechat/ts";
import * as vscode from "vscode";
import { ChatGPTLintDiagnostics } from "./typechatSchema";

/**
 * Sleeps for the given number of milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns true of the given HTTP status code represents a transient error.
 */
function isTransientHttpError(code: number): boolean {
  switch (code) {
    case 429: // TooManyRequests
    case 500: // InternalServerError
    case 502: // BadGateway
    case 503: // ServiceUnavailable
    case 504: // GatewayTimeout
      return true;
  }
  return false;
}

function createLanguageModel(args: {
  url: string;
  headers: object;
  modelName: string;
}) {
  const { url, headers, modelName } = args;

  const model: TypeChatLanguageModel = {
    complete,
  };
  return model;

  async function complete(prompt: string | PromptSection[]) {
    let retryCount = 0;
    const retryMaxAttempts = model.retryMaxAttempts ?? 3;
    const retryPauseMs = model.retryPauseMs ?? 1000;
    const messages =
      typeof prompt === "string" ? [{ role: "user", content: prompt }] : prompt;
    while (true) {
      const options = {
        method: "POST",
        body: JSON.stringify({
          model: modelName,
          messages,
          n: 1,
        }),
        headers: {
          "content-type": "application/json",
          ...headers,
        },
      };
      const response = await fetch(url, options);
      if (response.ok) {
        const json = (await response.json()) as {
          choices: { message: PromptSection }[];
        };
        if (typeof json.choices[0].message.content === "string") {
          return success(json.choices[0].message.content ?? "");
        } else {
          return error(
            `REST API unexpected response format: ${JSON.stringify(json.choices[0].message.content)}`,
          );
        }
      }
      if (
        !isTransientHttpError(response.status) ||
        retryCount >= retryMaxAttempts
      ) {
        return error(
          `REST API error ${response.status}: ${response.statusText}`,
        );
      }
      await sleep(retryPauseMs);
      retryCount++;
    }
  }
}

export async function lintCurrentFileCommand() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor.");
    return;
  }

  const code = editor.document.getText();
  const filename = vscode.workspace.asRelativePath(editor.document.uri.fsPath);

  const config = vscode.workspace.getConfiguration("chatgptLinter");
  const apiKey = config.get<string>("apiKeyForOpenAi");
  if (!apiKey) {
    vscode.window.showErrorMessage(
      "ChatGPT API key not set. Go to Settings → ChatGPT Lint to configure it.",
    );
    return;
  }

  const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";
  const stylePath =
    config.get<string>("stylePath") || "./chatgpt-linter-prompt.md";
  const styleGuidePath = path.join(workspaceRoot, stylePath);
  if (!fs.existsSync(styleGuidePath)) {
    vscode.window.showErrorMessage(`${stylePath} not found in project root.`);
    return;
  }
  const styleGuide = fs.readFileSync(styleGuidePath, "utf-8");
  const modelName = config.get<string>("model") || "o3-mini";
  const model = createLanguageModel({
    url: "https://api.openai.com/v1/chat/completions",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "OpenAI-Organization": "",
    },
    modelName,
  });
  const schema = fs.readFileSync(
    path.join(__dirname, "typechatSchema.ts"),
    "utf-8",
  );
  const validator = createTypeScriptJsonValidator<ChatGPTLintDiagnostics>(
    schema,
    "ChatGPTLintDiagnostics",
  );
  const translator = createJsonTranslator(model, validator);

  const prompt = `
<--- Instruction --->
${styleGuide}

<-- Code to lint -->
// ${filename}
${code}
  `;

  try {
    vscode.window.showInformationMessage(
      `Sending request to OpenAI. This make take a while...`,
    );
    const response = await translator.translate(prompt);
    if (!response.success) {
      const message = `Failed to get valid diagnostics from ChatGPT. ${response.message}`;
      vscode.window.showErrorMessage(message);
      console.error(message);
      console.error(JSON.stringify(response));
      return;
    }

    const lintFileName =
      config.get<string>("lintFileName") || ".chatgpt-lint.json";
    const lintFilePath = path.join(workspaceRoot, lintFileName);
    fs.writeFileSync(
      lintFilePath,
      JSON.stringify(response.data.diagnostics, null, 2),
      "utf-8",
    );
    vscode.window.showInformationMessage(
      `${lintFileName} generated successfully.`,
    );
  } catch (err) {
    vscode.window.showErrorMessage(
      "Error during ChatGPT linting: " + (err as Error).message,
    );
  }
}
