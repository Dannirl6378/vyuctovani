import { Box, Paper, TextField, Typography, Checkbox } from "@mui/material";
import { useState } from "react";
import { Billing } from "../types/billing";

interface RowFlags {
  [key: string]: boolean;
}

interface Props {
  billing: Billing;
}

const emptyBilling: Billing = {
  id: "",
  period: { from: "", to: "" },
  locationDate: { city: "", date: "" },
  tenant: { name: "", address: "", zip: "" },
  owner: { name: "", email: "" },
  sources: [],
  coldWater: { start: 0, end: 0, sv2025: 0 },
  hotWater: { start: 0, end: 0, sv2025: 0, zs2025: 0, ss2025: 0 },
  heating: { year2025: 0 },
  otherFees: { year2025: 0 },
  deposits: [],
  customItems: []
};
interface RawDeposit {
  [key: string]: number;
}


export default function BillingEditor({ billing }: Props) {
  const [formData, setFormData] = useState<Billing>({
    ...emptyBilling,
    ...billing,
    period: { ...emptyBilling.period, ...billing.period },
    locationDate: { ...emptyBilling.locationDate, ...billing.locationDate },
    tenant: { ...emptyBilling.tenant, ...billing.tenant },
    owner: { ...emptyBilling.owner, ...billing.owner },
    coldWater: { ...emptyBilling.coldWater, ...billing.coldWater },
    hotWater: { ...emptyBilling.hotWater, ...billing.hotWater },
    heating: { ...emptyBilling.heating, ...billing.heating },
    otherFees: { ...emptyBilling.otherFees, ...billing.otherFees },
    deposits: billing.deposits,
  });

  const [rowFlags, setRowFlags] = useState<RowFlags>({});
  const originalData = billing; // původní hodnoty


  const handleChange = (path: string, value: any) => {
    setFormData(prev => {
      const copy: any = { ...prev };
      const keys = path.split(".");
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const toggleFlag = (key: string) => {
    setRowFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderRow = (label: string, path: string, value: any) => {
    const flagged = rowFlags[path] || false;

    const getOriginalValue = (obj: any, path: string) => {
      return path.split(".").reduce((o, key) => (o ? o[key] : undefined), obj);
    };

    const originalValue = getOriginalValue(originalData, path);
    const changed = value !== originalValue;

    return (
      <Paper
        key={path}
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 1.5,
          marginBottom: 1,
          backgroundColor: flagged
            ? "rgba(0,255,0,0.15)"
            : changed
            ? "rgba(0,0,255,0.06)"
            : "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ width: 200 }}>{label}</Typography>

          <TextField
            value={value}
            onChange={e => handleChange(path, e.target.value)}
            size="small"
            sx={{
              flexGrow: 1,
              marginRight: 2,
            }}
          />

          <Checkbox checked={flagged} onChange={() => toggleFlag(path)} />
        </Box>

        {changed && (
          <Typography variant="caption" sx={{ color: "gray", marginLeft: "200px" }}>
            původní: {String(originalValue)}
          </Typography>
        )}
      </Paper>
    );
  };

  // 🚀 TADY JE TEN CHYBĚJÍCÍ RETURN
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Editor vyúčtování
      </Typography>

      {/* Období */}
      {renderRow("Období od", "period.from", formData.period.from)}
      {renderRow("Období do", "period.to", formData.period.to)}

      {/* Místo a datum */}
      {renderRow("Město", "locationDate.city", formData.locationDate.city)}
      {renderRow("Datum", "locationDate.date", formData.locationDate.date)}

      {/* Nájemník */}
      {renderRow("Nájemník jméno", "tenant.name", formData.tenant.name)}
      {renderRow("Adresa", "tenant.address", formData.tenant.address)}
      {renderRow("PSČ", "tenant.zip", formData.tenant.zip)}

      {/* Majitel */}
      {renderRow("Majitel jméno", "owner.name", formData.owner.name)}
      {renderRow("Email", "owner.email", formData.owner.email)}

      {/* Studená voda */}
      {renderRow("Studená voda - začátek", "coldWater.start", formData.coldWater.start)}
      {renderRow("Studená voda - konec", "coldWater.end", formData.coldWater.end)}
      {renderRow("Studená voda 2025", "coldWater.sv2025", formData.coldWater.sv2025)}

      {/* Teplá voda */}
      {renderRow("Teplá voda - začátek", "hotWater.start", formData.hotWater.start)}
      {renderRow("Teplá voda - konec", "hotWater.end", formData.hotWater.end)}
      {renderRow("Teplá voda SV 2025", "hotWater.sv2025", formData.hotWater.sv2025)}
      {renderRow("Teplá voda ZS 2025", "hotWater.zs2025", formData.hotWater.zs2025)}
      {renderRow("Teplá voda SS 2025", "hotWater.ss2025", formData.hotWater.ss2025)}

      {/* Topení */}
      {renderRow("Topení 2025", "heating.year2025", formData.heating.year2025)}

      {/* Ostatní poplatky */}
      {renderRow("Ostatní poplatky 2025", "otherFees.year2025", formData.otherFees.year2025)}

      <Typography variant="h6" sx={{ mt: 3 }}>
        Přijaté zálohy
      </Typography>
      {formData.deposits.map((d, i) => (
        <Box key={i} sx={{ mb: 2 }}>
          {renderRow(`Datum zálohy`, `deposits.${i}.date`, d.date)}
          {renderRow(`Částka zálohy`, `deposits.${i}.amount`, d.amount)}
        </Box>
      ))}
  
    </Box>
  );
}
