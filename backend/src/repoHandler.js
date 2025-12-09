import simpleGit from "simple-git";
import fs from "fs-extra";
import path from "path";

export async function cloneRepo(repoUrl) {
  const repoName = path.basename(repoUrl, ".git");
  const targetDir = path.join(process.cwd(), "repos", repoName);

  if (fs.existsSync(targetDir)) {
    console.log(`⚠️ Repo already cloned: ${targetDir}`);
    return targetDir;
  }

  await simpleGit().clone(repoUrl, targetDir);
  console.log(`📂 Repo cloned at: ${targetDir}`);
  return targetDir;
}
