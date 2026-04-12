export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: number;
  title: string;
  instructions: string;
  authorName: string;
  ingredients: Ingredient[];
}