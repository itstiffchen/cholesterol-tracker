import { CholesterolRecord } from "@/types/cholesterol";

interface ParseResult {
  record: Partial<CholesterolRecord>;
  warnings: string[];
}

export async function parseQuestPdf(arrayBuffer: ArrayBuffer): Promise<ParseResult> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    (process.env.__NEXT_ROUTER_BASEPATH || "") + "/pdf.worker.min.mjs";

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const warnings: string[] = [];

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .filter((item) => "str" in item)
      .map((item) => (item as { str: string }).str);
    fullText += strings.join(" ") + "\n";
  }

  // Parse date
  const dateMatch = fullText.match(
    /(?:Date\s+Collected|Collection\s+Date|Date\s+of\s+Service|Date\s+Reported)[:\s]*(\d{1,2}\/\d{1,2}\/\d{4})/i,
  );
  let date = "";
  if (dateMatch) {
    const [m, d, y] = dateMatch[1].split("/");
    date = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  } else {
    warnings.push("Could not find test date. Please enter it manually.");
  }

  // Parse metrics
  const patterns: Record<string, RegExp[]> = {
    totalCholesterol: [
      /Cholesterol[,\s]+Total\s+(\d+)/i,
      /Total\s+Cholesterol\s+(\d+)/i,
    ],
    hdl: [
      /HDL\s+Cholesterol\s+(\d+)/i,
      /HDL[\s-]C(?:holesterol)?\s+(\d+)/i,
    ],
    ldl: [
      /LDL\s+Cholesterol(?:\s+Calc)?\s+(\d+)/i,
      /LDL[\s-]C(?:holesterol)?(?:\s+Calc)?\s+(\d+)/i,
    ],
    triglycerides: [
      /Triglycerides\s+(\d+)/i,
    ],
    nonHdl: [
      /Non[\s-]?HDL\s+Cholesterol\s+(\d+)/i,
      /Non[\s-]?HDL[\s-]C\s+(\d+)/i,
    ],
  };

  const values: Record<string, number | null> = {};
  for (const [key, regexes] of Object.entries(patterns)) {
    let found = false;
    for (const regex of regexes) {
      const match = fullText.match(regex);
      if (match) {
        values[key] = Number(match[1]);
        found = true;
        break;
      }
    }
    if (!found) {
      values[key] = null;
      warnings.push(`Could not extract ${key}. You can enter it manually.`);
    }
  }

  // Compute non-HDL if missing but total and HDL are present
  if (values.nonHdl === null && values.totalCholesterol !== null && values.hdl !== null) {
    values.nonHdl = values.totalCholesterol - values.hdl;
  }

  return {
    record: {
      date,
      totalCholesterol: values.totalCholesterol,
      ldl: values.ldl,
      hdl: values.hdl,
      triglycerides: values.triglycerides,
      nonHdl: values.nonHdl,
      source: "pdf",
    },
    warnings,
  };
}
