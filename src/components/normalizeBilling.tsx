import { Billing } from "../types/billing";
export function normalizeBilling(json: any): Billing {
  return {
    id: "",
    period: {
      from: json.header.split("...")[0] || "",
      to: json.header.split("...")[1]?.split("\n")[0] || ""
    },
    locationDate: {
      city: json.header.split("\n")[1]?.split(",")[0]?.replace("V ", "") || "",
      date: json.header.split(", ")[1] || ""
    },
    tenant: {
      name: json.najemnik?.[0] || "",
      address: json.najemnik?.[1] || "",
      zip: json.najemnik?.[2] || ""
    },
    owner: {
      name: json.najemce?.[0] || "",
      email: json.najemce?.[1] || ""
    },
    sources: json.zdroje || [],
    coldWater: {
      start: json["studena voda"]?.[0]?.["O 2025-01-01"] || 0,
      end: json["studena voda"]?.[1]?.["O 2025-10-01"] || 0,
      sv2025: json["studena voda"]?.[2]?.["SV 2025"] || 0,
    },
    hotWater: {
      start: json["tepla voda"]?.[0]?.["O 2025-01-01"] || 0,
      end: json["tepla voda"]?.[1]?.["O 2025-10-01"] || 0,
      sv2025: json["tepla voda"]?.[2]?.["SV 2025"] || 0,
      zs2025: json["tepla voda"]?.[3]?.["ZS 2025"] || 0,
      ss2025: json["tepla voda"]?.[4]?.["SS 2025"] || 0,
    },
    heating: {
      year2025: json.vytapeni?.[0]?.[2025] || 0,
    },
    otherFees: {
      year2025: json["ostatni poplatky"]?.[0]?.[2025] || 0,
    },
    deposits: (json.zalohy || []).map((obj: Record<string, number>) => {
      const date = Object.keys(obj)[0];
      const amount = obj[date];
      return { date, amount };
    }),
    customItems: Object.entries(json.custom || {}).map(([k, v]) => ({
      label: k,
      amount: Number(v) || 0
    }))
  };
}
