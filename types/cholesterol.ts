export interface CholesterolRecord {
  id: string;
  date: string; // ISO 8601: "2026-04-22"
  totalCholesterol: number | null;
  ldl: number | null;
  hdl: number | null;
  triglycerides: number | null;
  nonHdl: number | null;
  source: "manual" | "pdf";
  notes?: string;
}

export interface ReferenceRange {
  key: keyof Pick<CholesterolRecord, "totalCholesterol" | "ldl" | "hdl" | "triglycerides" | "nonHdl">;
  label: string;
  desirableMax: number;
  desirableMin?: number;
  borderlineMax?: number;
  unit: string;
  color: string;
  description: string;
  details: string;
}
