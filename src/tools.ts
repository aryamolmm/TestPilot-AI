import fs from "fs";
import path from "path";

export function saveTestFile(code: string): string {
  const testsDir = path.join(process.cwd(), "tests");
  if (!fs.existsSync(testsDir)) {
    fs.mkdirSync(testsDir, { recursive: true });
  }

  const filePath = path.join(testsDir, "generated.spec.ts");
  fs.writeFileSync(filePath, code);
  return filePath;
}

export function saveGherkin(text: string): string {
  const docsDir = path.join(process.cwd(), "docs");
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const filePath = path.join(docsDir, "gherkin.txt");
  fs.writeFileSync(filePath, text);
  return filePath;
}
