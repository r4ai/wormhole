use anyhow::anyhow;
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

use crate::{db::schema::Command, utils::result::Result};

use super::constants::DB_STORE_PATH;

#[tauri::command]
pub async fn db_search(
    app: tauri::AppHandle,
    query: String,
    offset: isize,
    limit: isize,
) -> Result<Vec<Command>> {
    let stores = app
        .app_handle()
        .try_state::<StoreCollection<Wry>>()
        .ok_or(anyhow!("Store not found"))?;

    with_store(app.app_handle().clone(), stores, DB_STORE_PATH, |store| {
        for (key, value) in store.entries() {
            let command: Command = serde_json::from_value(value.clone()).unwrap();
            println!("key: {}, value: {:?}", key, command);
        }
        Ok(())
    })?;

    Ok(vec![])
}
