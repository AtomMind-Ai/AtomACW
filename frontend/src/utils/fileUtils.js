import { saveAs } from "file-saver";
import mammoth from "mammoth";

export async function readFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "txt") return await readText(file);
  if (ext === "docx") return await readDocx(file);
  throw new Error("Only .txt and .docx supported");
}

function readText(file) {
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = (e) => resolve(e.target.result);
    r.readAsText(file);
  });
}

async function readDocx(file) {
  const buf = await file.arrayBuffer();
  const res = await mammoth.extractRawText({ arrayBuffer: buf });
  return res.value;
}

export function saveText(content, name = "document.txt") {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  saveAs(blob, name);
}

export async function saveDocx(content, name = "document.docx") {
  const blob = new Blob([content], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  saveAs(blob, name);
}
