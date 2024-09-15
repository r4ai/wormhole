use super::constants::DB_STORE_PATH;
use crate::{db::schema::Command, utils::result::Result};
use anyhow::anyhow;
use fuzzy_matcher::{skim::SkimMatcherV2, FuzzyMatcher};
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

struct SearchResult {
    command: Command,
    score: i64,
}

#[tauri::command]
pub async fn db_search(
    app: tauri::AppHandle,
    query: String,
    offset: usize,
    limit: usize,
) -> Result<Vec<Command>> {
    log::info!("Searching for query: {}", &query);
    let min_score: i64 = 1;

    let stores = app
        .app_handle()
        .try_state::<StoreCollection<Wry>>()
        .ok_or(anyhow!("Store not found"))?;
    let matcher = SkimMatcherV2::default();

    let results = with_store(app.app_handle().clone(), stores, DB_STORE_PATH, |store| {
        let mut results: Vec<SearchResult> = Vec::with_capacity(store.len());
        for (_, value) in store.entries() {
            let command: Command = serde_json::from_value(value.clone()).unwrap();
            let score = matcher.fuzzy_match(&command.name, &query).unwrap_or(0);
            if score > min_score {
                results.push(SearchResult { command, score });
            }
        }
        results.shrink_to_fit();
        results.sort_by(|a, b| b.score.cmp(&a.score));

        Ok(results
            .into_iter()
            .skip(offset)
            .take(limit)
            .map(|r| r.command)
            .collect::<Vec<Command>>())
    })?;

    log::info!("Found {} results for query: {}", results.len(), &query);
    log::trace!("Search results for query \"{}\": {:#?}", &query, &results);
    Ok(results)
}
