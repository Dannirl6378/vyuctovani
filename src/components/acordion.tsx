import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type Props = { data?: any[] };
/*zde je zobrazovní dat pomoci mui knihovny  */
export default function ControlledAccordions({ data = [] }: Props) {
	const [expanded, setExpanded] = React.useState<string | false>(false);

	const handleChange =
		(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	return (
		<div>
			{/*tady je přiřazovaní konkretních dat do konstant pro zobrazování */}
			{data.map((item: any, index: number) => {
				const title =
					item.Title ?? item["#TITLE"] ?? item.title ?? item["#AKA"] ?? "—";
				const year = item.year ?? item["#YEAR"] ?? "";
				const actors = item.Actors ?? item["#ACTORS"] ?? item.actors ?? "";
				const imdbUrl = item.IMDB_URL ?? item["#IMDB_URL"];
				const poster =
					item.IMG_POSTER ?? item["#IMG_POSTER"] ?? item.poster ?? item.image;

				return (
					// toto je už tělo komponenty akordeonu 
					<Accordion
						key={index}
						expanded={expanded === `panel${index}`}
						onChange={handleChange(`panel${index}`)}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls={`panel${index}bh-content`}
							id={`panel${index}bh-header`}
						>
							<Typography component='span' sx={{ width: "60%", flexShrink: 0 }}>
								{title}
							</Typography>
							<Typography component='span' sx={{ color: "text.secondary" }}>
								{year}
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<div
								style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
							>
								{poster && (
									<img
										src={poster}
										alt={String(title)}
										style={{ width: 120, height: "auto", objectFit: "cover" }}
									/>
								)}
								<div>
									{actors && (
										<Typography variant='body2' sx={{ marginBottom: 1 }}>
											<strong>Herci:</strong> {actors}
										</Typography>
									)}
									{imdbUrl && (
										<Typography variant='body2'>
											<a
												href={imdbUrl}
												target='_blank'
												rel='noopener noreferrer'
											>
												Otevřít na IMDb
											</a>
										</Typography>
									)}
								</div>
							</div>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</div>
	);
}
