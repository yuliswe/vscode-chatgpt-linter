import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { lintCurrentFileCommand } from "./chatgpt";

function updateDiagnosticsFromFile(
  lintFilePath: string,
  diagnosticCollection: vscode.DiagnosticCollection,
) {
  if (!fs.existsSync(lintFilePath)) {
    return;
  }

  const json = fs.readFileSync(lintFilePath, "utf-8");
  let diagnosticsData;
  try {
    diagnosticsData = JSON.parse(json);
  } catch (err) {
    console.error("Invalid JSON in chatgpt-lint.json");
    return;
  }

  diagnosticCollection.clear();

  for (const diagnosticEntry of diagnosticsData) {
    const { file, line, message, severity } = diagnosticEntry;
    const fileUri = vscode.Uri.file(
      path.join(vscode.workspace.workspaceFolders?.[0].uri.fsPath || "", file),
    );

    const doc = vscode.workspace.textDocuments.find(
      (d) => d.uri.fsPath === fileUri.fsPath,
    );
    if (!doc) {
      continue;
    }

    const range = new vscode.Range(
      line - 1,
      0,
      line - 1,
      doc.lineAt(line - 1).text.length,
    );
    const diagnostic = new vscode.Diagnostic(
      range,
      message,
      severity === "error"
        ? vscode.DiagnosticSeverity.Error
        : vscode.DiagnosticSeverity.Warning,
    );
    diagnostic.source = "(ChatGPT Linter)";

    diagnosticCollection.set(fileUri, [
      ...(diagnosticCollection.get(fileUri) || []),
      diagnostic,
    ]);
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "chatgptLinter.lintCurrentFileCommand",
      lintCurrentFileCommand,
    ),
  );

  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection("chatgptLinter");
  const config = vscode.workspace.getConfiguration("chatgptLinter");
  const lintFileName =
    config.get<string>("lintFileName") || ".chatgpt-lint.json";
  const lintFilePath = path.join(
    vscode.workspace.workspaceFolders?.[0].uri.fsPath || "",
    lintFileName,
  );

  const runDiagnostics = () =>
    updateDiagnosticsFromFile(lintFilePath, diagnosticCollection);

  const watcher = vscode.workspace.createFileSystemWatcher(
    `**/${lintFileName}`,
  );
  watcher.onDidChange(runDiagnostics);
  watcher.onDidCreate(runDiagnostics);
  watcher.onDidDelete(() => diagnosticCollection.clear());

  context.subscriptions.push(diagnosticCollection, watcher);

  // Initial load
  runDiagnostics();
}

export function deactivate() {}
