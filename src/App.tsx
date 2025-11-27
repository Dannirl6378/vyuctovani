import React, { useState } from "react";
import { Button, Container, Input, Typography } from "@mui/material";
import { fetchData } from "./backendData/fetchData";
import ControlledAccordions from "./components/acordion";

type DataProps = any;

export default function App() {
	const [name, setName] = useState<string | undefined>(undefined);
	const [data, setData] = useState<DataProps | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	//handle submit ošetření o errory a  odeslání formuláře
	const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
		event?.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const res = await fetchData(name ?? "");
			setData(res);
		} catch (err: any) {
			setError(err?.message ?? "Chyba při načítání");
			setData(null);
		} finally {
			setLoading(false);
		}
	};
//zobrazovaní komponenty App
	return (
		<Container style={{ padding: 20 }}>
			<Typography variant='h4' gutterBottom>
				Filmy z IMDb
			</Typography>
			<form onSubmit={handleSubmit} style={{ display: "inline" }}>
				<Input
					placeholder='Jméno'
					value={name ?? ""}
					onChange={(e) => setName(e.target.value)}
					// Enter v inputu odesílá formulář
				/>
				<Button
					variant='contained'
					style={{ marginLeft: 10 }}
					type='submit'
					disabled={loading}
				>
					{loading ? "Načítám…" : "Hledat"}
				</Button>
			</form>

			{error && (
				<Typography color='error' style={{ marginTop: 12 }}>
					{error}
				</Typography>
			)}

			<ControlledAccordions data={data?.description || data?.results || []} />
		</Container>
	);
}
