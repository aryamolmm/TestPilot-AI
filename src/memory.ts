import fs from "fs";
import path from "path";

const MEMORY_FILE = path.join(process.cwd(), "memory.json");

export interface MemoryEntry {
  input: string;
  gherkin: string;
  testCode: string;
  coverage: string;
  timestamp: string;
}

export function saveMemory(data: MemoryEntry): void {
  try {
    let memory: MemoryEntry[] = [];
    if (fs.existsSync(MEMORY_FILE)) {
      const content = fs.readFileSync(MEMORY_FILE, "utf-8");
      memory = JSON.parse(content);
    }
    memory.push(data);
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
  } catch (error: any) {
    console.error(`❌ Error saving memory: ${error.message}`);
  }
}

export function loadMemory(): MemoryEntry[] {
  try {
    if (fs.existsSync(MEMORY_FILE)) {
      const content = fs.readFileSync(MEMORY_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error: any) {
    console.error(`❌ Error loading memory: ${error.message}`);
  }
  return [];
}
