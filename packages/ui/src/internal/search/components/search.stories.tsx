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

const genAppCommand = (name: string): Command => ({
  pluginId: "@wormhole/application",
  kind: "Application",
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
  genAppCommand("Spotify"),
  genAppCommand("Visual Studio Code"),
  genAppCommand("Google Chrome"),
  genAppCommand("Slack"),
  genAppCommand("Discord"),
  genAppCommand("NeoVim"),
  genAppCommand("Terminal"),
  genAppCommand("Firefox"),
  genAppCommand("Safari"),
  genAppCommand("Edge"),
  genAppCommand("Brave"),
  genAppCommand("Vivaldi"),
  genAppCommand("Steam"),
  genAppCommand("Epic Games Launcher"),
  genAppCommand("Origin"),
  genAppCommand("Battle.net"),
  genAppCommand("Notion"),
  genAppCommand("Obsidian"),
  genAppCommand("Microsoft Word"),
  genAppCommand("Microsoft Excel"),
  genAppCommand("Microsoft PowerPoint"),
  genAppCommand("Microsoft Outlook"),
  genAppCommand("Microsoft Teams"),
  genAppCommand("Microsoft OneNote"),
  genAppCommand("JetBrains IntelliJ IDEA"),
  genAppCommand("JetBrains WebStorm"),
  genAppCommand("JetBrains PyCharm"),
  genAppCommand("JetBrains Rider"),
  genAppCommand("JetBrains DataGrip"),
  genAppCommand("JetBrains AppCode"),
  genAppCommand("JetBrains CLion"),
  genAppCommand("JetBrains GoLand"),
  genAppCommand("JetBrains RubyMine"),
  genAppCommand("JetBrains PHPStorm"),
  genAppCommand("JetBrains Android Studio"),
  genAppCommand("Overwatch"),
  genAppCommand("Valorant"),
  genAppCommand("League of Legends"),
  genAppCommand("Dota 2"),
  genAppCommand("Counter-Strike: Global Offensive"),
  genAppCommand("Apex Legends"),
  genAppCommand("Fortnite"),
  genAppCommand("Minecraft"),
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
