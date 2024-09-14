#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error(transparent)]
    Tauri(#[from] tauri::Error),

    #[error(transparent)]
    TauriPluginStore(#[from] tauri_plugin_store::Error),

    #[error(transparent)]
    TauriPluginShell(#[from] tauri_plugin_shell::Error),

    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error(transparent)]
    Anyhow(#[from] anyhow::Error),

    #[error(transparent)]
    SerdeJson(#[from] serde_json::Error),

    #[error(transparent)]
    Powershell(#[from] powershell_script::PsError),

    #[error(transparent)]
    Ini(#[from] ini::Error),
}

/// See https://v2.tauri.app/develop/calling-rust/#error-handling
impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub type Result<T, E = Error> = anyhow::Result<T, E>;
