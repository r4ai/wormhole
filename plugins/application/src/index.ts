import { convertFileSrc } from "@tauri-apps/api/core"
import * as path from "@tauri-apps/api/path"
import * as fs from "@tauri-apps/plugin-fs"
import * as db from "@wormhole/api/db"
import { extractIconFromExecutable, open } from "@wormhole/api/system"
import { getApplications } from "./apps"

export const launch = async (appPath: string) => {
  await open(appPath)
}

export const onEnable = async () => {
  const pluginDir = await path.join(
    await path.appDataDir(),
    "plugins",
    "wormhole.application",
  )
  const assetsDir = await path.join(pluginDir, "assets")
  if (!(await fs.exists(assetsDir))) {
    await fs.mkdir(assetsDir, { recursive: true })
  }

  const apps = await getApplications()
  for (const appPath of apps) {
    const appName = (await path.basename(appPath)).replace(/\.[^.]+$/, "")
    const iconPath =
      (await extractIconFromExecutable(
        appPath,
        await path.join(assetsDir, `${appName}.jpeg`),
      ).catch((e) => {
        console.error(e)
        return undefined
      })) ?? ""
    await db.insert("@wormhole/application", {
      kind: "application",
      pluginId: "@wormhole/application",
      id: appPath,
      name: appName,
      icon: convertFileSrc(iconPath),
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
