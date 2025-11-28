export interface Billing {
  id: string;

  period: {
    from: string; // "2025-01-01"
    to: string;   // "2025-09-30"
  };

  locationDate: {
    city: string; // "Praha"
    date: string; // "2025-10-12"
  };

  tenant: {
    name: string;
    address: string;
    zip: string;
  };

  owner: {
    name: string;
    email: string;
  };

  sources: string[];

  coldWater: {
    start: number;   // O 2025-01-01
    end: number;     // O 2025-10-01
    sv2025: number;  // SV 2025
  };

  hotWater: {
    start: number;   // O 2025-01-01
    end: number;     // O 2025-10-01
    sv2025: number;  // SV 2025
    zs2025: number;  // ZS 2025
    ss2025: number;  // SS 2025
  };

  heating: {
    year2025: number;
  };

  otherFees: {
    year2025: number;
  };

  deposits: {
    date: string;   // datum zálohy
    amount: number; // částka zálohy
  }[];

  customItems: {
    label: string;  // název položky, např. "Kauce"
    amount: number; // částka (kladná nebo záporná)
  }[];
}
export interface Property {
  id: string;
  name: string;
  address: string;
}

export interface BillingSection {
  id: string;
  title: string;
  done: boolean;
  items: { id: string; label: string; value: number }[];
}

export interface Billing {
  id: string;
  propertyId: string;
  tenantId?: string;
  year: number;
  createdAt: string;
  sections: BillingSection[];
  attachments: string[];
}
export interface Tenant{
    id:string;
    name:string;
    email:string;
    phone?:string;
    address?:string;
}