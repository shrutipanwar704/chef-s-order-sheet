export interface RequirementItem {
  id: string;
  item: string;
  qty: number;
  unit: string;
  price: number;
}

export interface RequirementForm {
  date: string;
  chefName: string;
  mealType: string;
  numberOfPax: number;
}

export interface RequirementData extends RequirementForm {
  items: RequirementItem[];
  grandTotal: number;
}
