import { ensureGemInstalled, sendToGem } from "./geminiIntegration.js";
import { cloneRepo } from "./repoHandler.js";

async function main() {
  const repoUrl = process.argv[2]; // repo from CLI arg
  if (!repoUrl) {
    console.error("❌ Please provide a GitHub repository URL");
    process.exit(1);
  }

  console.log("🔹 Cloning repo...");
  const repoPath = await cloneRepo(repoUrl);

  console.log("🔹 Checking Gemini Gem...");
  await ensureGemInstalled();

  console.log("🔹 Sending repo contents to Gemini...");
  await sendToGem(repoPath);

  console.log("✅ Done!");
}

main();
