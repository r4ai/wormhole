use std::fs;

use anyhow::anyhow;
use serde_json::json;
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

use crate::{
    db::schema::Plugin, settings::constants::SHORTCUTS_TOGGLE_WINDOW_KEY, utils::result::Result,
};

use super::constants::{PLUGINS_KEY, SETTINGS_STORE_PATH};

pub fn init_settings(app: tauri::AppHandle) -> Result<()> {
    log::info!("Initializing settings");
    init_default_settings(app.clone())?;
    update_loaded_plugins(app.clone())?;
    log::info!("Initialized settings");
    Ok(())
}

fn update_loaded_plugins(app: tauri::AppHandle) -> Result<()> {
    log::info!("Updating loaded plugins");
    let app_data_dir = app.path().app_data_dir()?;
    let plugins_path = app_data_dir.join("plugins");
    let plugins = fs::read_dir(plugins_path)?;
    for plugin_dir in plugins {
        let plugin_dir = plugin_dir?;
        if !plugin_dir.metadata()?.is_dir() {
            continue;
        }
        let plugin_metadata_path = plugin_dir.path().join("wormhole.json");
        if !plugin_metadata_path.exists() {
            continue;
        }
        let plugin_metadata_str = fs::read_to_string(plugin_metadata_path)?;
        let plugin_metadata = serde_json::from_str::<Plugin>(&plugin_metadata_str)?;

        // load the plugin
        let stores = app
            .app_handle()
            .try_state::<StoreCollection<Wry>>()
            .ok_or(anyhow!("Store not found"))?;
        with_store(
            app.app_handle().clone(),
            stores,
            SETTINGS_STORE_PATH,
            |store| {
                let mut loaded_plugins: Vec<Plugin> =
                    serde_json::from_value(store.get(PLUGINS_KEY).unwrap_or(&json!([])).clone())?;
                let to_load_plugin_pos = loaded_plugins
                    .iter()
                    .position(|p| p.id == plugin_metadata.id);
                if let Some(pos) = to_load_plugin_pos {
                    loaded_plugins[pos] = plugin_metadata.clone();
                } else {
                    loaded_plugins.push(plugin_metadata.clone());
                }
                store.insert(PLUGINS_KEY.to_string(), json!(loaded_plugins))?;
                println!("loaded plugin: {:?}", &plugin_metadata);
                Ok(())
            },
        )?;
    }
    log::info!("Updated loaded plugins");
    Ok(())
}

fn init_default_settings(app: tauri::AppHandle) -> Result<()> {
    log::info!("Initializing default settings");
    let stores = app
        .app_handle()
        .try_state::<StoreCollection<Wry>>()
        .ok_or(anyhow!("Store not found"))?;
    with_store(app.clone(), stores, SETTINGS_STORE_PATH, |store| {
        if !store.has(SHORTCUTS_TOGGLE_WINDOW_KEY) {
            store.insert(
                SHORTCUTS_TOGGLE_WINDOW_KEY.to_string(),
                json!(["CommandOrControl+Space"]),
            )?;
        }
        Ok(())
    })?;
    log::info!("Initialized default settings");
    Ok(())
}
