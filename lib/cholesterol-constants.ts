import { ReferenceRange } from "@/types/cholesterol";

export const METRICS: ReferenceRange[] = [
  {
    key: "totalCholesterol",
    label: "Total Cholesterol",
    desirableMax: 200,
    borderlineMax: 239,
    unit: "mg/dL",
    color: "#3d5a9e",
    description:
      "Total cholesterol is the overall amount of cholesterol in your blood, including LDL, HDL, and a portion of triglycerides.",
    details:
      "Desirable: below 200 mg/dL. Borderline high: 200–239 mg/dL. High: 240 mg/dL and above. High total cholesterol increases your risk for heart disease and stroke.",
  },
  {
    key: "ldl",
    label: "LDL (Bad Cholesterol)",
    desirableMax: 100,
    borderlineMax: 159,
    unit: "mg/dL",
    color: "#e74c3c",
    description:
      "LDL (low-density lipoprotein) carries cholesterol to your arteries. High levels cause plaque buildup, narrowing arteries and increasing heart attack risk.",
    details:
      "Optimal: below 100 mg/dL. Near optimal: 100–129 mg/dL. Borderline high: 130–159 mg/dL. High: 160–189 mg/dL. Very high: 190 mg/dL and above.",
  },
  {
    key: "hdl",
    label: "HDL (Good Cholesterol)",
    desirableMin: 60,
    desirableMax: 999,
    unit: "mg/dL",
    color: "#27ae60",
    description:
      "HDL (high-density lipoprotein) helps remove LDL cholesterol from your arteries. Higher levels are better and protective against heart disease.",
    details:
      "Good: 60 mg/dL and above (protective). Acceptable: 40–59 mg/dL. Risk factor: below 40 mg/dL for men, below 50 mg/dL for women.",
  },
  {
    key: "triglycerides",
    label: "Triglycerides",
    desirableMax: 150,
    borderlineMax: 199,
    unit: "mg/dL",
    color: "#f39c12",
    description:
      "Triglycerides are the most common type of fat in your body. They store excess energy from your diet. High levels contribute to artery hardening.",
    details:
      "Normal: below 150 mg/dL. Borderline high: 150–199 mg/dL. High: 200–499 mg/dL. Very high: 500 mg/dL and above.",
  },
  {
    key: "nonHdl",
    label: "Non-HDL Cholesterol",
    desirableMax: 130,
    borderlineMax: 159,
    unit: "mg/dL",
    color: "#8e44ad",
    description:
      "Non-HDL cholesterol is your total cholesterol minus HDL. It includes LDL and other bad cholesterol types, giving a broader picture of heart disease risk.",
    details:
      "Desirable: below 130 mg/dL. Borderline: 130–159 mg/dL. High: 160–189 mg/dL. Very high: 190 mg/dL and above. Calculated as Total Cholesterol minus HDL.",
  },
];

export const METRIC_KEYS = METRICS.map((m) => m.key);
