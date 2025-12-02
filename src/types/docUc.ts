// Typ pro adresu
export interface Adresa {
	jméno: string;
	ulice: string;
	psc_mesto: string;
}

// Typ pro položky s měřením
export interface MěřenáPoložka {
	počáteční_stav?: number;
	konečný_stav?: number;
	cena_za_jednotku?: number; // SV - studená voda
	cena_za_spotřebu?: number; // ZS - záloha za spotřebu
	cena_za_službu?: number; // SS - společné služby
}

// Typ pro zálohy
export interface Záloha {
	datum: string; // Původní formát data
	částka: number;
}

// Typ pro sekci "custom"
export interface CustomPoložky {
	[klíč: string]: number;
}

// Hlavní struktura celého vyúčtování
export interface Vyúčtování {
	období: string;
	datum_vystavení: string;
	nájemník: Adresa;
	nájemce: {
		jméno: string;
		email: string;
	};
	zdroje: string[];
	studená_voda: MěřenáPoložka;
	teplá_voda: MěřenáPoložka;
	vytápění: number;
	ostatní_poplatky: number;
	zálohy: Záloha[];
	custom: CustomPoložky;
}
