import React, { useState, useEffect } from "react";
import { Vyúčtování } from "../types/docUc";
import parseUcToVyúčtování from "../components/readText";
import { loadFile } from "../backendData/fetchData";

const VyuctovaniKomponenta: React.FC = () => {
	const [data, setData] = useState<Vyúčtování | null>(null);
	const [načítání, setNačítání] = useState<boolean>(true);
	const [chyba, setChyba] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// 1. Krok: Načtení souboru přes helper
				const ucText = await loadFile();

				// 2. Krok: Parsování textu na JSON strukturu
				const parsedData = parseUcToVyúčtování(ucText);

				setData(parsedData);
			} catch (e) {
				console.error("Nastala chyba:", e);
				// Kontrola, zda je e instancí Error
				if (e instanceof Error) {
					setChyba(e.message);
				} else {
					setChyba("Nastala neznámá chyba při zpracování dat.");
				}
			} finally {
				setNačítání(false);
			}
		};

		fetchData();
	}, []); // [] zajistí, že se spustí pouze jednou po prvním renderu

	// Zobrazení stavu
	if (načítání) {
		return <div>Načítám data...</div>;
	}

	if (chyba) {
		return <div>Chyba: {chyba}</div>;
	}

	if (!data) {
		return <div>Data nebyla nalezena.</div>;
	}

	// 3. Krok: Zobrazení dat
	return (
		<div>
			<h2>Vyúčtování služeb</h2>
			<p>
				Období: <strong>{data.období}</strong>
			</p>
			<p>Vystaveno: {data.datum_vystavení}</p>

			<h3>Nájemník</h3>
			<p>{data.nájemník.jméno}</p>
			<p>{data.nájemník.ulice}</p>

			{/* Zde můžete vykreslit komplexní JSON strukturu */}
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};

export default VyuctovaniKomponenta;
