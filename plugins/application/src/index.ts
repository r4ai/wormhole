import * as path from "@tauri-apps/api/path"
import { open } from "@tauri-apps/plugin-shell"
import { getApplications } from "./apps"
import * as db from "./db"

export const launch = async (appPath: string) => {
  await open(appPath)
}

export const onEnable = async () => {
  const apps = await getApplications()
  for (const appPath of apps) {
    const appName = (await path.basename(appPath)).replace(/\.[^.]+$/, "")
    await db.insert({
      kind: "application",
      id: appPath,
      name: appName,
      action: {
        lang: "javascript",
        scriptFilePath: "index.js",
        functionName: "launch",
        args: [appPath],
      },
    })
  }
  await db.save()
}
