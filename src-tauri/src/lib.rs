mod db;
mod settings;
mod system;
mod utils;

use anyhow::anyhow;
use db::{commands::db_search, constants::DB_STORE_PATH};
use settings::store::init_settings;
use system::commands::{system_extract_icon_from_executable, system_open};
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(debug_assertions)]
    let builder = tauri::Builder::default().plugin(tauri_plugin_devtools::init());
    #[cfg(not(debug_assertions))]
    let builder = tauri::Builder::default().plugin(tauri_plugin_log::Builder::new().build());

    builder
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            greet,
            db_search,
            system_open,
            system_extract_icon_from_executable
        ])
        .setup(|app| {
            // Clear the DB store on startup
            let stores = app
                .app_handle()
                .try_state::<StoreCollection<Wry>>()
                .ok_or(anyhow!("Store not found"))?;
            with_store(app.app_handle().clone(), stores, DB_STORE_PATH, |store| {
                store.clear()?;
                Ok(())
            })?;

            init_settings(app.app_handle().clone())?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
