import type { Meta, StoryObj } from "storybook-solidjs"

import type { Command } from "@wormhole/api/schema"
import Fuse from "fuse.js"
import * as Table from "."
import { DatabaseProvider } from "../../contexts/database-context"

const genCommand = (
  pluginId: string,
  name: string,
  kind = "Command",
): Command => ({
  pluginId,
  id: name.toLowerCase().replaceAll(" ", "-"),
  kind,
  name,
  action: {
    lang: "javascript",
    scriptFilePath: "index.js",
    functionName: "default",
    args: [name],
  },
})

const commands: Command[] = [
  genCommand("@wormhole/application", "Spotify", "Application"),
  genCommand("@wormhole/application", "Visual Studio Code", "Application"),
  genCommand("@wormhole/application", "Google Chrome", "Application"),
  genCommand("@wormhole/application", "Slack", "Application"),
  genCommand("@wormhole/application", "Discord", "Application"),
  genCommand("@wormhole/application", "NeoVim", "Application"),
  genCommand("@wormhole/application", "Terminal", "Application"),
  genCommand("@wormhole/application", "Firefox", "Application"),
  genCommand("@wormhole/application", "Safari", "Application"),
  genCommand("@wormhole/application", "Edge", "Application"),
  genCommand("@wormhole/spotify", "Play"),
  genCommand("@wormhole/spotify", "Pause"),
  genCommand("@wormhole/spotify", "Next"),
  genCommand("@wormhole/spotify", "Previous"),
  genCommand("@wormhole/spotify", "Shuffle"),
  genCommand("@wormhole/spotify", "Repeat"),
  genCommand("@wormhole/spotify", "Volume Up"),
  genCommand("@wormhole/spotify", "Volume Down"),
  genCommand("@wormhole/spotify", "Mute"),
  genCommand("@wormhole/spotify", "Unmute"),
  genCommand("@wormhole/calendar", "Create Event"),
  genCommand("@wormhole/calendar", "Delete Event"),
  genCommand("@wormhole/calendar", "Update Event"),
  genCommand("@wormhole/calendar", "Show Event"),
  genCommand("@wormhole/calculator", "Calculate"),
  genCommand("@wormhole/calculator", "Calculation History"),
]

const fuse = new Fuse(commands, { includeScore: true, keys: ["name"] })

const meta = {
  title: "Internal/Database",
  component: (props: Table.TableProps) => (
    <DatabaseProvider
      set={async (pluginId, command) => {
        const index = commands.findIndex(
          (c) => c.id === command.id && c.pluginId === pluginId,
        )
        if (index === -1) {
          commands.push(command)
        } else {
          commands[index] = command
        }
      }}
      remove={async (pluginId, commandId) => {
        const index = commands.findIndex(
          (c) => c.id === commandId && c.pluginId === pluginId,
        )
        if (index !== -1) {
          commands.splice(index, 1)
        }
      }}
      values={async () => commands}
      search={async (query) =>
        fuse
          .search(query.query, { limit: query.limit })
          .map((result) => result.item)
      }
    >
      <Table.Root>
        <Table.Controller />
        <Table.Table {...props} />
      </Table.Root>
    </DatabaseProvider>
  ),
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<Table.TableProps>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
