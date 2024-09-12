use crate::utils::result::{Error, Result};
use anyhow::anyhow;
use indoc::formatdoc;
use lnk::ShellLink;
use powershell_script::PsScriptBuilder;
use std::{
    fs,
    path::{Path, PathBuf},
};
use tauri_plugin_shell::ShellExt;

#[tauri::command]
pub async fn system_open(app: tauri::AppHandle, path: String) -> Result<()> {
    app.shell().open(path, None)?;
    Ok(())
}

#[tauri::command]
pub async fn system_extract_icon_from_executable(
    app: tauri::AppHandle,
    src: String,
    dest: String,
) -> Result<String> {
    let src = PathBuf::from(src);
    let dest = PathBuf::from(dest);
    let dest = if dest.is_dir() {
        dest.join(format!(
            "{}.jpeg",
            src.file_stem()
                .expect("failed to get file stem")
                .to_str()
                .unwrap()
        ))
    } else {
        dest
    };

    let src_extension = src
        .extension()
        .expect("failed to get file extension")
        .to_str()
        .unwrap();
    match src_extension {
        "exe" => {
            let icon_path = extract_icon_from_exe(&src, &dest)?;
            Ok(icon_path.to_str().unwrap().to_string())
        }
        "lnk" => {
            let shortcut = parse_lnk(&src)?;
            let icon_path = shortcut
                .icon_location()
                .as_ref()
                .expect("failed to get icon location")
                .clone();
            fs::copy(&icon_path, &dest)?;
            Ok(dest.to_str().unwrap().to_string())
        }
        _ => Err(Error::Anyhow(anyhow!(
            "Unsupported file extension: {}",
            src_extension
        ))),
    }
}

pub fn parse_lnk(file_path: &Path) -> Result<ShellLink> {
    let shortcut = ShellLink::open(file_path).expect("failed to open lnk file");
    Ok(shortcut)
}

fn extract_icon_from_exe(src: &Path, dest: &Path) -> Result<PathBuf> {
    // powershell script to extract icon from exe
    let script = formatdoc! {
        r#"
        Add-Type -AssemblyName System.Drawing
        $icon = [System.Drawing.Icon]::ExtractAssociatedIcon("{}")
        $icon.ToBitmap().Save("{}")
        "#,
        src.display(),
        dest.display()
    };

    // run the powershell script
    let powershell = PsScriptBuilder::new()
        .no_profile(true)
        .non_interactive(true)
        .hidden(true)
        .print_commands(false)
        .build();
    let _ = powershell.run(script.as_str())?;

    Ok(dest.to_path_buf())
}
