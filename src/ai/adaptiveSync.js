import { PersonalizationModel, persistPersonalizationModel } from "./personalizationModel";
import { getAdaptiveDifficulty } from "./adaptiveDifficulty";
import { apiRequest, hasSession } from "../utils/api.js";
import { validCategories } from "./categories";

const hasLearned = () =>
  PersonalizationModel.completionRate > 0 || Object.keys(PersonalizationModel.preferredCategories || {}).length > 0;

// Saves what the device has learned to the account so the backend AI and other devices can use it.
export async function pushAdaptiveProfile() {
  if (!hasSession("user") || !hasLearned()) return;
  const { completionRate, avgIntensity, avgDurationAccuracy, preferredCategories, preferredTimes } = PersonalizationModel;
  try {
    await apiRequest("/ai/profile", {
      method: "PUT",
      body: { completionRate, avgIntensity, avgDurationAccuracy, preferredCategories: validCategories(preferredCategories), preferredTimes, difficulty: getAdaptiveDifficulty() }
    });
  } catch {
    // Local learning keeps working offline; the next save retries.
  }
}

// Pulls the saved profile onto a device that has not learned anything yet; otherwise pushes this device's profile.
export async function syncAdaptiveProfile() {
  if (!hasSession("user")) return;
  if (hasLearned()) {
    await pushAdaptiveProfile();
    return;
  }
  try {
    const { profile } = await apiRequest("/ai/profile");
    if (!profile) return;
    const model = { ...profile };
    delete model.difficulty;
    model.preferredCategories = validCategories(model.preferredCategories);
    Object.assign(PersonalizationModel, model);
    persistPersonalizationModel();
  } catch {
    return;
  }
}
