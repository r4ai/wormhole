use anyhow::anyhow;
use serde_json::json;
use tauri::{Emitter, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

use crate::{db::schema::Plugin, utils::result::Result};

use super::constants::{PLUGINS_KEY, SETTINGS_STORE_PATH};

pub fn init_settings(app: tauri::AppHandle) -> Result<()> {
    let stores = app
        .app_handle()
        .try_state::<StoreCollection<Wry>>()
        .ok_or(anyhow!("Store not found"))?;

    with_store(
        app.app_handle().clone(),
        stores,
        SETTINGS_STORE_PATH,
        |store| {
            // initialize the plugins
            if let Some(value) = store.get(PLUGINS_KEY) {
                let plugins: Vec<Plugin> = serde_json::from_value(value.clone())?;
                app.emit("wormhole://init-plugins", &plugins)?;
            } else {
                store.insert(PLUGINS_KEY.to_string(), json!([]))?;
            }

            Ok(())
        },
    )?;

    Ok(())
}
