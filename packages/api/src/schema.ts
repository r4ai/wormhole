export type Plugin = {
  /**
   * The id of the plugin.
   * This must be unique. It is used to identify the plugin in internal code.
   *
   * The id must be in the format `@{author}/{name}`.
   *
   * - The `{author}` must be a valid GitHub username.
   * - The `{name}` is the name of the plugin. It must be unique within the author's plugins.
   *
   * @example "@hoge/plugin-name"
   */
  id: `@${string}/${string}`

  /**
   * The name of the plugin.
   * This is displayed to the user.
   *
   * @example "Spotify Controller"
   * @example "Application Launcher"
   */
  name: string

  /**
   * The description of the plugin.
   */
  description: string

  /**
   * The version of the plugin.
   *
   * @example "1.0.0"
   */
  version: string

  /**
   * The commands provided by the plugin.
   */
  commands?: Command[]

  /**
   * The hooks provided by the plugin.
   * These are called by the application at specific times.
   */
  hooks?: Hooks
}

export type Hooks = {
  /**
   * The function to call when the plugin is enabled.
   *
   * This is called when the following conditions are met:
   *
   * - The plugin is enabled in the settings.
   * - The plugin is loaded by the application (e.g., when the application starts).
   */
  onEnable?: JavaScriptAction

  /**
   * The function to call when the plugin is disabled.
   *
   * This is called when the following conditions are met:
   *
   * - The plugin is disabled in the settings.
   * - The plugin is unloaded by the application (e.g., when the application is closed).
   */
  onDisable?: JavaScriptAction
}

export type Command = {
  /**
   * The kind of the command.
   *
   * @default "command"
   *
   * @example "application"
   * @example "shortcut"
   * @example "window"
   */
  kind?: string

  /**
   * The id of the command.
   * This must be unique within the plugin.
   * It is used to identify the command in internal code.
   *
   * @example "play-music"
   * @example "launch-spotify"
   */
  id: string

  /**
   * The name of the command.
   *
   * This is displayed to the user and used as the search term.
   * It should be unique within the plugin, but it does not have to be.
   *
   * @example "Play Music"
   * @example "Launch Spotify"
   */
  name: string

  /**
   * The aliases of the command.
   *
   * These are used as additional search terms.
   * They should be unique within the plugin, but they do not have to be.
   *
   * @example ["Music Player"]
   */
  aliases?: string[]

  /**
   * The action to perform when the command is executed.
   *
   * By default, the action is executed when:
   *
   * - The command is clicked in the search window.
   * - The command is selected and pressed the `Enter` key.
   * - The command is selected and pressed the hotkeys given in the `action.hotkey` field.
   * - Pressed the global hotkeys given in the `action.globalHotKeys` field.
   */
  action: Action

  /**
   * The sub-actions to perform when the command is executed.
   *
   * These are displayed as additional actions.
   * You can see them by clicking the button in bottom right corner of the search window.
   *
   * If you want to place separates between sub-actions, you can use nested array.
   *
   * - The sub-actions in the same array are displayed in the same group.
   * - The separates are displayed between the groups.
   *
   * @example
   * // - Copy the text "Spotify" to the clipboard when `Shift+Enter` is pressed.
   * // - Open the folder "Spotify" in the file explorer when `Ctrl+Enter` is pressed.
   * [
   *   {
   *     lang: "javascript",
   *     hotkey: ["Shift+Enter"],
   *     globalHotKeys: [],
   *     scriptFilePath: "index.js",
   *     functionName: "copyToClipboard",
   *     args: ["Spotify"]
   *   },
   *   {
   *     lang: "javascript",
   *     hotkey: ["Ctrl+Enter"],
   *     globalHotKeys: [],
   *     scriptFilePath: "index.js",
   *     functionName: "openInExplorer",
   *     args: ["Spotify"]
   *   }
   * ]
   */
  subActions?: Action[] | Action[][]
}

export type Action = JavaScriptAction

export type JavaScriptAction = {
  lang: "javascript"

  /**
   * The hotkeys to trigger the action.
   *
   * The hotkeys are only active when the search window is focused and the command is selected.
   *
   * @example ["Enter"]
   * @example ["Shift+Enter"]
   */
  hotkeys?: string[]

  /**
   * The global hotkeys to trigger the action.
   *
   * The global hotkeys are active at all times, even when the search window is not focused.
   *
   * @example ["Ctrl+Shift+C"]
   */
  globalHotKeys?: string[]

  /**
   * The path to the script file.
   * This is relative to the plugin directory.
   *
   * @example "index.js"
   */
  scriptFilePath: string

  /**
   * The name of the function to call.
   * This function must be exported from the script file.
   *
   * @example "launchApplication"
   * @example "default" // default exported function
   */
  functionName: string

  /**
   * The arguments to pass to the function.
   *
   * @example ["Spotify"]
   */
  args?: unknown[]
}
