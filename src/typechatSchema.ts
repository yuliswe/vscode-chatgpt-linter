// src/schemas.ts
export interface ChatGPTLintDiagnostic {
  file: string; // Relative file path
  line: number; // 1-based line number
  message: string; // Description of the violation
  severity: "error" | "warning";
}

export interface ChatGPTLintDiagnostics {
  diagnostics: ChatGPTLintDiagnostic[];
}
