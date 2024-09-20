use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, Runtime, WebviewWindow,
};

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let open_settings_item =
        MenuItem::with_id(app, "open-settings", "Open Settings", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&quit_item, &open_settings_item])?;

    let _ = TrayIconBuilder::with_id("tray")
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .menu_on_left_click(false)
        .on_menu_event(move |app, event| match event.id.as_ref() {
            "quit" => {
                app.exit(0);
            }
            "open-settings" => {
                let settings_window = app.get_webview_window("settings");
                if let Some(window) = settings_window {
                    toggle_window(window);
                } else {
                    log::error!("failed to get settings window");
                }
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("search") {
                    toggle_window(window);
                }
            }
        })
        .build(app);

    Ok(())
}

fn toggle_window<R: Runtime>(window: WebviewWindow<R>) {
    let is_visible = window.is_visible().unwrap_or(false);
    if is_visible {
        let _ = window.hide();
    } else {
        let _ = window.show();
        let _ = window.set_focus();
    }
}
