import type { Meta, StoryObj } from "storybook-solidjs"

import type { SearchQuery } from "@wormhole/api/db"
import type { Action, Command } from "@wormhole/api/schema"
import Fuse from "fuse.js"
import { useSearch } from "../contexts"
import { Search, type SearchProps } from "./search"

const meta = {
  title: "Internal/Search",
  component: Search,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Search>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    searchResultsProps: {
      search: async (query: SearchQuery): Promise<Command[]> =>
        fuse
          .search(query.query, { limit: query.limit })
          .map((result) => result.item),
      searchResultProps: (command, index) => ({
        getActionFn: async (pluginId: string, action: Action) => async () =>
          alert(
            `Invoke plugin ${pluginId}/${action.scriptFilePath} action ${action.functionName} with args ${action.args}`,
          ),
      }),
    },
  } satisfies SearchProps,
}

const genAppCommand = (name: string, icon = ""): Command => ({
  pluginId: "@wormhole/application",
  kind: "Application",
  icon,
  id: name,
  name,
  action: {
    lang: "javascript",
    scriptFilePath: "index.js",
    functionName: "default",
    args: [name],
  },
})

const commands: Command[] = [
  genAppCommand(
    "Spotify",
    "https://api.iconify.design/simple-icons:spotify.svg?color=%23888888",
  ),
  genAppCommand(
    "Visual Studio Code",
    "https://api.iconify.design/simple-icons:visualstudiocode.svg?color=%23888888",
  ),
  genAppCommand(
    "Google Chrome",
    "https://api.iconify.design/simple-icons:googlechrome.svg?color=%23888888",
  ),
  genAppCommand(
    "Slack",
    "https://api.iconify.design/simple-icons:slack.svg?color=%23888888",
  ),
  genAppCommand(
    "Discord",
    "https://api.iconify.design/simple-icons:discord.svg?color=%23888888",
  ),
  genAppCommand(
    "NeoVim",
    "https://api.iconify.design/simple-icons:neovim.svg?color=%23888888",
  ),
  genAppCommand(
    "Terminal",
    "https://api.iconify.design/simple-icons:windowsterminal.svg?color=%23888888",
  ),
  genAppCommand(
    "Firefox",
    "https://api.iconify.design/simple-icons:firefoxbrowser.svg?color=%23888888",
  ),
  genAppCommand(
    "Safari",
    "https://api.iconify.design/simple-icons:safari.svg?color=%23888888",
  ),
  genAppCommand(
    "Edge",
    "https://api.iconify.design/simple-icons:microsoftedge.svg?color=%23888888",
  ),
  genAppCommand(
    "Brave",
    "https://api.iconify.design/simple-icons:brave.svg?color=%23888888",
  ),
  genAppCommand(
    "Vivaldi",
    "https://api.iconify.design/simple-icons:vivaldi.svg?color=%23888888",
  ),
  genAppCommand(
    "Steam",
    "https://api.iconify.design/simple-icons:steam.svg?color=%23888888",
  ),
  genAppCommand(
    "Epic Games Launcher",
    "https://api.iconify.design/simple-icons:epicgames.svg?color=%23888888",
  ),
  genAppCommand(
    "Origin",
    "https://api.iconify.design/simple-icons:origin.svg?color=%23888888",
  ),
  genAppCommand(
    "Battle.net",
    "https://api.iconify.design/simple-icons:battledotnet.svg?color=%23888888",
  ),
  genAppCommand(
    "Notion",
    "https://api.iconify.design/simple-icons:notion.svg?color=%23888888",
  ),
  genAppCommand(
    "Obsidian",
    "https://api.iconify.design/simple-icons:obsidian.svg?color=%23888888",
  ),
  genAppCommand(
    "Microsoft Word",
    "https://api.iconify.design/simple-icons:microsoftword.svg?color=%23888888",
  ),
  genAppCommand(
    "Microsoft Excel",
    "https://api.iconify.design/simple-icons:microsoftexcel.svg?color=%23888888",
  ),
  genAppCommand(
    "Microsoft PowerPoint",
    "https://api.iconify.design/simple-icons:microsoftpowerpoint.svg?color=%23888888",
  ),
  genAppCommand(
    "Microsoft Outlook",
    "https://api.iconify.design/simple-icons:microsoftoutlook.svg?color=%23888888",
  ),
  genAppCommand(
    "Microsoft Teams",
    "https://api.iconify.design/simple-icons:microsoftteams.svg?color=%23888888",
  ),
  genAppCommand(
    "Microsoft OneNote",
    "https://api.iconify.design/simple-icons:microsoftonenote.svg?color=%23888888",
  ),
  genAppCommand(
    "JetBrains IntelliJ IDEA",
    "https://api.iconify.design/simple-icons:jetbrains.svg?color=%23888888",
  ),
  genAppCommand(
    "JetBrains WebStorm",
    "https://api.iconify.design/simple-icons:jetbrains.svg?color=%23888888",
  ),
  genAppCommand(
    "JetBrains PyCharm",
    "https://api.iconify.design/simple-icons:jetbrains.svg?color=%23888888",
  ),
  genAppCommand(
    "JetBrains Rider",
    "https://api.iconify.design/simple-icons:jetbrains.svg?color=%23888888",
  ),
  genAppCommand(
    "JetBrains DataGrip",
    "https://api.iconify.design/simple-icons:jetbrains.svg?color=%23888888",
  ),
  genAppCommand(
    "JetBrains AppCode",
    "https://api.iconify.design/simple-icons:jetbrains.svg?color=%23888888",
  ),
  genAppCommand(
    "JetBrains CLion",
    "https://api.iconify.design/simple-icons:jetbrains.svg?color=%23888888",
  ),
  genAppCommand(
    "JetBrains GoLand",
    "https://api.iconify.design/simple-icons:jetbrains.svg?color=%23888888",
  ),
  genAppCommand(
    "JetBrains RubyMine",
    "https://api.iconify.design/simple-icons:jetbrains.svg?color=%23888888",
  ),
  genAppCommand(
    "JetBrains PHPStorm",
    "https://api.iconify.design/simple-icons:jetbrains.svg?color=%23888888",
  ),
  genAppCommand(
    "JetBrains Android Studio",
    "https://api.iconify.design/simple-icons:jetbrains.svg?color=%23888888",
  ),
  genAppCommand("Overwatch"),
  genAppCommand(
    "Valorant",
    "https://api.iconify.design/simple-icons:valorant.svg?color=%23888888",
  ),
  genAppCommand(
    "League of Legends",
    "https://api.iconify.design/simple-icons:leagueoflegends.svg?color=%23888888",
  ),
  genAppCommand(
    "Dota 2",
    "https://api.iconify.design/simple-icons:dota2.svg?color=%23888888",
  ),
  genAppCommand(
    "Counter-Strike: Global Offensive",
    "https://api.iconify.design/simple-icons:counterstrike.svg?color=%23888888",
  ),
  genAppCommand("Apex Legends"),
  genAppCommand("Fortnite"),
  genAppCommand(
    "Minecraft",
    "https://api.iconify.design/simple-icons:minecraft.svg?color=%23888888",
  ),
  genAppCommand("Terraria"),
  genAppCommand("Stardew Valley"),
  genAppCommand("Among Us"),
  genAppCommand("Genshin Impact"),
  genAppCommand("Hades"),
  genAppCommand("The Witcher 3: Wild Hunt"),
  genAppCommand("Cyberpunk 2077"),
  genAppCommand("Red Dead Redemption 2"),
  genAppCommand("Grand Theft Auto V"),
  genAppCommand("The Elder Scrolls V: Skyrim"),
  genAppCommand("Fallout 4"),
  genAppCommand("Dark Souls III"),
  genAppCommand("Sekiro: Shadows Die Twice"),
  genAppCommand("Bloodborne"),
]

const fuse = new Fuse(commands, { includeScore: true, keys: ["name"] })
