import * as React from "react";
import { useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import VyuctovaniKomponenta from "./BillingDetail";
import { loadFile } from "../backendData/fetchData";
import { parseUcToJSON } from "../components/parseUcToJSON";
import PdfPreview from "../components/ShowPdf";
import { useBillingsStore } from "../store/billings";
import { Billing } from "../types/billing";
import BillingEditor from "../components/BillingEditor";
import { normalizeBilling } from "../components/normalizeBilling";
import { data } from "react-router-dom";

export default function Home() {
	const [dataText, setDataText] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [billing, setBilling] = useState<Billing | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const text = await loadFile(); // Načti .uc soubor
				setDataText(text);
			} catch (e) {
				if (e instanceof Error) setError(e.message);
				else setError("Neznámá chyba při načítání dat.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// Převedení textu na JSON pro další zobrazení
	const dataJson = dataText ? parseUcToJSON(dataText) : null;
	useEffect(() => {
		if (dataJson) {
			useBillingsStore.getState().addBilling(dataJson as Billing);

			const raw = dataJson as any;
			const normalized = normalizeBilling(raw);

			setBilling(normalized);
		}
	}, [dataText]);
	console.log("Parsed JSON data:", dataJson);

	return (
		<Box sx={{ height: "100vh", p: 2 }}>
			<Typography variant='h4' gutterBottom>
				Vítejte v aplikaci pro vyúčtování služeb
			</Typography>

			{loading && <div>Načítám soubor...</div>}
			{error && <div>Chyba: {error}</div>}

			{!loading && !error && (
				<Box sx={{ display: "flex", height: "calc(100% - 64px)", gap: 2 }}>
					{/* Levý panel – seznam nemovitostí/nájemníků */}

					{/* Pravý panel – vyúčtování a PDF vedle sebe */}
					<Box sx={{ flex: 1, display: "flex", gap: 2 }}>
						{/* PDF */}
						<Box sx={{ flex: 1, border: "1px solid #ccc", overflow: "auto" }}>
							<PdfPreview />
						</Box>

						{/* Vyúčtování */}
						<Box
							sx={{
								flex: 1,
								border: "1px solid #ccc",
								overflow: "auto",
								padding: 2,
							}}
						>
							<Button
								variant='contained'
								onClick={() => setEditMode(!editMode)}
							>
								{editMode ? "upravit" : "Ulož a Konec"}
							</Button>
							{!editMode ? (
								billing ? (
									<BillingEditor billing={billing} />
								) : (
									<div>Načítám data…</div>
								)
							) : (
								<VyuctovaniKomponenta />
							)}
						</Box>
					</Box>
				</Box>
			)}
		</Box>
	);
}
