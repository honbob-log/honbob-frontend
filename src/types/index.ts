export interface User {
  id: string
  name: string
  email: string
  profileImage?: string
  bio?: string
  joinDate: string
  stats: {
    recipes: number
    followers: number
    following: number
  }
}

export interface Recipe {
  id: number
  title: string
  description: string
  image: string
  time: string
  difficulty: "easy" | "medium" | "hard"
  servings: string
  rating: number
  reviews: number
  author: {
    name: string
    profileImage: string
    followers: string
  }
  tags: string[]
  ingredients: Ingredient[]
  steps: CookingStep[]
  nutrition: Nutrition
  isFavorite?: boolean
}

export interface Ingredient {
  name: string
  amount: string
  unit: string
}

export interface CookingStep {
  step: number
  description: string
  image?: string
}

export interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Review {
  id: number
  userId: string
  recipeId: number
  rating: number
  text: string
  images?: string[]
  createdAt: string
}

export interface PantryItem {
  id: number
  name: string
  category: string
  quantity: string
  expiryDate: string
  status: "fresh" | "expiring" | "expired"
}

export interface ShoppingItem {
  id: number
  name: string
  category: string
  isCompleted: boolean
}
