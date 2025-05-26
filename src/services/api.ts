// Mock API service - replace with actual API calls
import type { Recipe, User, Review } from "../types"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const apiService = {
  // User APIs
  async login(provider: string): Promise<User> {
    await delay(1000)
    return {
      id: "1",
      name: "홍길동",
      email: "hong@example.com",
      profileImage: "https://via.placeholder.com/100x100",
      bio: "맛있는 요리를 사랑하는 홈쿡입니다 🍳",
      joinDate: "2024-01-01",
      stats: {
        recipes: 12,
        followers: 156,
        following: 89,
      },
    }
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    await delay(500)
    // Return updated user data
    throw new Error("Not implemented")
  },

  // Recipe APIs
  async getRecipes(category?: string, search?: string): Promise<Recipe[]> {
    await delay(800)
    // Return mock recipes
    return []
  },

  async getRecipeById(id: number): Promise<Recipe> {
    await delay(500)
    // Return mock recipe
    throw new Error("Not implemented")
  },

  async createRecipe(recipeData: Partial<Recipe>): Promise<Recipe> {
    await delay(1000)
    // Return created recipe
    throw new Error("Not implemented")
  },

  // Review APIs
  async createReview(reviewData: Partial<Review>): Promise<Review> {
    await delay(800)
    // Return created review
    throw new Error("Not implemented")
  },

  async getReviews(recipeId: number): Promise<Review[]> {
    await delay(500)
    // Return reviews for recipe
    return []
  },

  // Image upload
  async uploadImage(imageUri: string): Promise<string> {
    await delay(1500)
    // Return uploaded image URL
    return "https://via.placeholder.com/300x200"
  },
}
