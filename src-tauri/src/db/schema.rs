use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Plugin {
    pub id: String,
    pub name: String,
    pub description: String,
    pub version: String,
    #[serde(default)]
    pub commands: Vec<Command>,
    #[serde(default)]
    pub hooks: Hooks,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Hooks {
    pub on_enable: Option<Action>,
    pub on_disable: Option<Action>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Command {
    #[serde(default)]
    pub kind: String,
    pub id: String,
    pub plugin_id: String,
    pub name: String,
    #[serde(default)]
    pub aliases: Vec<String>,
    pub action: Action,
    #[serde(default)]
    pub sub_actions: Vec<Action>,
}

impl Default for Command {
    fn default() -> Self {
        Command {
            kind: "command".to_string(),
            id: String::default(),
            plugin_id: String::default(),
            name: String::default(),
            aliases: Vec::default(),
            action: Action::default(),
            sub_actions: Vec::default(),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "lang")]
pub enum Action {
    #[serde(rename = "javascript")]
    JavaScript(JavaScriptAction),
}

impl Default for Action {
    fn default() -> Self {
        Self::JavaScript(JavaScriptAction::default())
    }
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
#[serde(rename_all = "camelCase")]
pub struct JavaScriptAction {
    #[serde(default)]
    pub hotkeys: Vec<String>,
    #[serde(default)]
    pub global_hotkeys: Vec<String>,
    pub script_file_path: String,
    pub function_name: String,
    #[serde(default)]
    pub args: Vec<Value>,
}
