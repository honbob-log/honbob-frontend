export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Favorites: { id: number } | undefined;
  Pantry: undefined;
  Profile: undefined;
  RecipeDetail: { recipeId: number };
  Onboarding: undefined;
  Search: undefined;
  CreateRecipe: undefined;
  Main: undefined;
  Review: { recipeId: number };
}; 