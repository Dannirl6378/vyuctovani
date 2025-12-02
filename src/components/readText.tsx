import { Vyúčtování, MěřenáPoložka } from "../types/docUc";

/**
 * Převede text dokumentu ve formátu UC na JSON objekt.
 * @param ucContent Obsah dokumentu jako řetězec.
 * @returns Objekt Vyúčtování.
 */
export function parseUcToVyúčtování(ucContent: string): Vyúčtování {
	// Inicializace výsledného objektu
	const výsledek: Partial<Vyúčtování> = {};

	// Rozdělení textu na řádky a filtrace prázdných řádků
	const řádky = ucContent
		.split("\n")
		.map((r) => r.trim())
		.filter((r) => r.length > 0);

	// Regulární výraz pro sekce [název]
	const sekceRegex = /^\[([a-zA-ZáéíóúýčďěňřšťžůúÁÉÍÓÚÝČĎĚŇŘŠŤŽŮÚ: ]+)\]$/;
	let aktuálníSekce: string | null = null;
	const dataSekce: { [klíč: string]: string[] } = {};

	// První průchod: Rozdělení textu do sekcí a extrakce úvodních dat
	for (const řádek of řádky) {
		// Extrakce období a data vystavení
		if (!výsledek.období && řádek.includes("...")) {
			výsledek.období = řádek;
			continue;
		}
		if (!výsledek.datum_vystavení && řádek.startsWith("V Praze,")) {
			výsledek.datum_vystavení = řádek.replace("V Praze, ", "");
			continue;
		}

		// Změna sekce
		const match = řádek.match(sekceRegex);
		if (match) {
			aktuálníSekce = match[1].toLowerCase().replace(/\s/g, "_"); // Např. "studená voda" -> "studená_voda"
			dataSekce[aktuálníSekce] = [];
			continue;
		}

		// Ukládání řádku do aktuální sekce
		if (aktuálníSekce && dataSekce[aktuálníSekce]) {
			dataSekce[aktuálníSekce].push(řádek);
		}
	}

	// Druhý průchod: Parsování dat uvnitř sekcí
	for (const sekce in dataSekce) {
		const data = dataSekce[sekce];

		switch (sekce) {
			case "najemnik":
				výsledek.nájemník = {
					jméno: data[0],
					ulice: data[1],
					psc_mesto: data[2],
				};
				break;

			case "najemce":
				výsledek.nájemce = {
					jméno: data[0],
					email: data[1],
				};
				break;

			case "zdroje":
				výsledek.zdroje = data;
				break;

			case "studena_voda":
			case "tepla_voda":
				const položka: MěřenáPoložka = {};
				for (const řádek of data) {
					const [typ, hodnotaStr] = řádek.split(":").map((s) => s.trim());
					const hodnota = parseFloat(hodnotaStr.replace(",", ".")); // Zajistí parsování čísel

					if (typ.startsWith("O")) {
						// O <datum>: <stav>
						const datum = typ.split(" ")[1];
						if (datum.endsWith("01")) {
							// 01.01. je počáteční stav
							položka.počáteční_stav = hodnota;
						} else {
							// 01.10. je konečný stav
							položka.konečný_stav = hodnota;
						}
					} else if (typ.startsWith("SV")) {
						položka.cena_za_jednotku = hodnota;
					} else if (typ.startsWith("ZS")) {
						položka.cena_za_spotřebu = hodnota;
					} else if (typ.startsWith("SS")) {
						položka.cena_za_službu = hodnota;
					}
				}
				if (sekce === "studena_voda") {
					výsledek.studená_voda = položka;
				} else {
					výsledek.teplá_voda = položka;
				}
				break;

			case "vytapeni":
				výsledek.vytápění = parseFloat(data[0].replace(",", "."));
				break;

			case "ostatni_poplatky":
				výsledek.ostatní_poplatky = parseFloat(data[0].replace(",", "."));
				break;

			case "zalohy":
				výsledek.zálohy = data.map((řádek) => {
					const [datum, částkaStr] = řádek.split(":").map((s) => s.trim());
					return {
						datum,
						částka: parseFloat(částkaStr.replace(",", ".")),
					};
				});
				break;

			// Zpracování Custom sekcí (např. custom:Kauce)
			default:
				if (sekce.startsWith("custom:")) {
					if (!výsledek.custom) výsledek.custom = {};
					// Klíč: odstraníme 'custom:' a převedeme na camelCase/ponecháme
					const klíč = sekce.substring("custom:".length);
					výsledek.custom[klíč] = parseFloat(data[0].replace(",", "."));
				}
				break;
		}
	}

	// Vynucení, že výsledek je kompletní (za předpokladu, že všechny klíče jsou nalezeny)
	return výsledek as Vyúčtování;
}

export default parseUcToVyúčtování;
