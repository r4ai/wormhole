import * as path from "@tauri-apps/api/path"
import * as fs from "@tauri-apps/plugin-fs"

export const getApplications = async () => {
  const applicationsDirs = [await path.desktopDir()]
  const applications = (
    await Promise.all(applicationsDirs.map(getApplicationsInDir))
  ).flat()
  return applications
}

const getApplicationsInDir = async (dir: string) => {
  const entries = await fs.readDir(dir)
  const applications: string[] = []
  const gettingApplications: Promise<string[]>[] = []
  for (const entry of entries) {
    const fullPath = await path.join(dir, entry.name)
    if (entry.isDirectory) {
      gettingApplications.push(getApplicationsInDir(fullPath))
      continue
    }
    if (await isApplication(fullPath)) {
      applications.push(fullPath)
    }
  }
  await Promise.all(gettingApplications).then((apps) =>
    applications.push(...apps.flat()),
  )
  return applications
}

const isApplication = async (fullPath: string) => {
  const extension = await path.extname(fullPath)
  return ["exe", "lnk", "url"].includes(extension)
}
