"use client";

import { parseMarkdown } from "@/components/ui/Markdown";
import type { ParsedSection } from "./parse";

const strip = (s: string) =>
  s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*([^*\s][^*]*)\*/g, "$1")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, "$1 ($2)");

function toBinaryString(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    out += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return out;
}

async function loadFont(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Не удалось загрузить шрифт для PDF");
  return toBinaryString(await res.arrayBuffer());
}

/** Экспорт ТЗ в PDF с кириллическим шрифтом (PT Sans, OFL). Загружается лениво. */
export async function exportPdf(opts: {
  idea: string;
  meta: string;
  sections: ParsedSection[];
  fileName: string;
}) {
  const [{ jsPDF }, regular, bold] = await Promise.all([
    import("jspdf"),
    loadFont("/fonts/PT_Sans-Web-Regular.ttf"),
    loadFont("/fonts/PT_Sans-Web-Bold.ttf"),
  ]);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.addFileToVFS("PTSans-Regular.ttf", regular);
  doc.addFont("PTSans-Regular.ttf", "PTSans", "normal");
  doc.addFileToVFS("PTSans-Bold.ttf", bold);
  doc.addFont("PTSans-Bold.ttf", "PTSans", "bold");

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 56;
  const width = pageW - margin * 2;
  let y = margin;

  const ensure = (h: number) => {
    if (y + h > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const write = (text: string, size: number, style: "normal" | "bold" = "normal", indent = 0, color = 30) => {
    doc.setFont("PTSans", style);
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, width - indent) as string[];
    const lh = size * 1.45;
    for (const line of lines) {
      ensure(lh);
      doc.text(line, margin + indent, y);
      y += lh;
    }
  };

  // Обложка-шапка
  doc.setFillColor(7, 9, 13);
  doc.rect(0, 0, pageW, 110, "F");
  doc.setFont("PTSans", "bold");
  doc.setFontSize(10);
  doc.setTextColor(99, 164, 255);
  doc.text("VIBE TOWER · AI PROMPT GENERATOR", margin, 48);
  doc.setFontSize(22);
  doc.setTextColor(255);
  doc.text("Техническое задание", margin, 80);
  y = 140;

  write(opts.meta, 9, "normal", 0, 110);
  y += 6;
  write("Исходная идея", 11, "bold");
  write(opts.idea, 10, "normal", 0, 60);
  y += 10;

  for (const section of opts.sections) {
    ensure(48);
    y += 12;
    doc.setDrawColor(40, 107, 255);
    doc.setLineWidth(1);
    doc.line(margin, y - 12, margin + 28, y - 12);
    write(section.title, 15, "bold", 0, 15);
    y += 2;
    for (const b of parseMarkdown(section.body)) {
      if (b.type === "p") write(strip(b.text), 10.5);
      else if (b.type === "h") write(strip(b.text), 11.5, "bold");
      else if (b.type === "quote") write(strip(b.text), 10.5, "normal", 12, 80);
      else if (b.type === "code") write(b.code, 9, "normal", 12, 70);
      else if (b.type === "list") {
        b.items.forEach((it, i) => write(`${b.ordered && it.depth === 0 ? `${i + 1}.` : "•"} ${strip(it.text)}`, 10.5, "normal", 10 + it.depth * 14));
      }
      y += 4;
    }
  }

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("PTSans", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(`VIBE TOWER — ${i} / ${pages}`, pageW - margin, pageH - 28, { align: "right" });
  }

  doc.save(opts.fileName);
}
