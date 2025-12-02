type VyuctovaniJSON = {
  [key: string]: any; // každá sekce bude klíč, hodnota může být pole, objekt nebo číslo
};

export function parseUcToJSON(text: string): VyuctovaniJSON {
  const lines = text.split("\n").map(line => line.trim());
  const result: VyuctovaniJSON = {};
  let currentSection: string | null = "header";
  result[currentSection] = [];

  for (const line of lines) {
    if (!line) continue; // přeskočit prázdné řádky

    const sectionMatch = line.match(/^\[(.+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].includes(":") 
        ? "custom" 
        : sectionMatch[1];
      if (!result[currentSection]) {
        result[currentSection] = sectionMatch[1].includes(":") ? {} : [];
      }
      continue;
    }

    // zpracování custom: hodnoty
    if (currentSection === "custom") {
      const [key, ...rest] = line.split(/[:]/); 
      const value = rest.join(":").trim();
      const numValue = Number(value);
      result[currentSection][key.trim()] = isNaN(numValue) ? value : numValue;
    } else if (Array.isArray(result[currentSection])) {
      // normální sekce jako pole
      const numValue = Number(line.split(":")[1]?.trim());
      if (!isNaN(numValue)) {
        const [key] = line.split(":");
        (result[currentSection] as any).push({ [key.trim()]: numValue });
      } else {
        (result[currentSection] as any).push(line);
      }
    } else {
      // objekty typu "studena voda", "tepla voda", ...
      const [key, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      const numValue = Number(value);
      result[currentSection][key.trim()] = isNaN(numValue) ? value : numValue;
    }
  }

  // pokud v header jen jedno pole, převeď na string
  if (Array.isArray(result["header"])) {
    result["header"] = (result["header"] as string[]).join("\n");
  }

  return result;
}
