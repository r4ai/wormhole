use tauri_plugin_shell::ShellExt;

use crate::utils::result::Result;

#[tauri::command]
pub async fn system_open(app: tauri::AppHandle, path: String) -> Result<()> {
    app.shell().open(path, None)?;
    Ok(())
}
