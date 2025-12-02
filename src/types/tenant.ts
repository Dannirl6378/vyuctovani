
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