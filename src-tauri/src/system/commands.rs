use crate::utils::result::{Error, Result};
use anyhow::anyhow;
use indoc::formatdoc;
use ini::Ini;
use lnk::ShellLink;
use powershell_script::PsScriptBuilder;
use std::{
    fs,
    path::{Path, PathBuf},
};
use tauri_plugin_shell::ShellExt;

#[tauri::command]
pub async fn system_open(app: tauri::AppHandle, path: String) -> Result<()> {
    log::info!("Opening path: {}", &path);
    app.shell().open(&path, None)?;
    log::info!("Opened path: {}", &path);
    Ok(())
}

#[tauri::command]
pub async fn system_extract_icon_from_executable(src: String, dest: String) -> Result<String> {
    log::info!("Extracting icon from executable: {}", src);

    let src = PathBuf::from(src);
    let dest = PathBuf::from(dest);
    let dest = if dest.is_dir() {
        dest.join(format!(
            "{}.jpeg",
            src.file_stem()
                .ok_or(anyhow!("failed to get file stem"))?
                .to_str()
                .unwrap()
        ))
    } else {
        dest
    };

    let src_extension = src
        .extension()
        .ok_or(anyhow!("failed to get file extension"))?
        .to_str()
        .ok_or(anyhow!("failed to convert OsStr to str"))?;
    match src_extension {
        "exe" => {
            let icon_path = extract_icon_from_exe(&src, &dest)?;
            Ok(icon_path.to_str().unwrap().to_string())
        }
        "lnk" => {
            let icon_path = get_icon_path_from_lnk(&src)?;
            let icon_path_extension = icon_path
                .extension()
                .ok_or(anyhow!("failed to get file extension"))?
                .to_str()
                .ok_or(anyhow!("failed to convert OsStr to str"))?;
            log::debug!("Icon path: {}", icon_path.display());
            match icon_path_extension {
                "exe" => {
                    let icon_path = extract_icon_from_exe(&icon_path, &dest)?;
                    Ok(icon_path.to_str().unwrap().to_string())
                }
                _ => {
                    fs::copy(&icon_path, &dest)?;
                    log::info!("Icon extracted to: {}", dest.display());
                    Ok(dest.to_str().unwrap().to_string())
                }
            }
        }
        "url" => {
            let icon_path = get_icon_path_from_url(&src)?;
            let icon_path_extension = icon_path
                .extension()
                .ok_or(anyhow!("failed to get file extension"))?
                .to_str()
                .ok_or(anyhow!("failed to convert OsStr to str"))?;
            log::debug!("Icon path: {}", icon_path.display());
            match icon_path_extension {
                "exe" => {
                    let icon_path = extract_icon_from_exe(&icon_path, &dest)?;
                    Ok(icon_path.to_str().unwrap().to_string())
                }
                _ => {
                    fs::copy(&icon_path, &dest)?;
                    log::info!("Icon extracted to: {}", dest.display());
                    Ok(dest.to_str().unwrap().to_string())
                }
            }
        }
        _ => {
            log::error!(
                "Failed to extract icon because of unsupported file extension: {}",
                src_extension
            );
            Err(Error::Anyhow(anyhow!(
                "Unsupported file extension: {}",
                src_extension
            )))
        }
    }
}

fn parse_lnk(file_path: &Path) -> Result<ShellLink> {
    let shortcut = ShellLink::open(file_path).expect("failed to open lnk file");
    log::trace!("Parsed .lnk file: {:#?}", shortcut);
    Ok(shortcut)
}

fn parse_url(file_path: &Path) -> Result<Ini> {
    let config = Ini::load_from_file_noescape(file_path)?;
    log::trace!("Parsed .url file: {:#?}", config);
    Ok(config)
}

fn get_icon_path_from_lnk(file_path: &Path) -> Result<PathBuf> {
    let shortcut = parse_lnk(file_path)?;
    let icon_path = &shortcut.icon_location().as_ref();
    match icon_path {
        Some(path) => Ok(PathBuf::from(path)),
        None => Ok(fs::canonicalize(
            file_path.join(
                shortcut
                    .relative_path()
                    .clone()
                    .expect("failed to get relative path"),
            ),
        )?),
    }
}

fn get_icon_path_from_url(file_path: &Path) -> Result<PathBuf> {
    let config = parse_url(file_path)?;
    let internet_shortcut = config
        .section(Some("InternetShortcut"))
        .ok_or(anyhow!("failed to get InternetShortcut section"))?;
    if let Some(icon_path) = internet_shortcut.get("IconFile") {
        log::debug!("get_icon_path_from_url/icon_path: {}", icon_path);
        Ok(PathBuf::from(icon_path))
    } else if let Some(url) = internet_shortcut.get("URL") {
        Ok(PathBuf::from(url))
    } else {
        Err(Error::Anyhow(anyhow!("failed to get icon path")))
    }
}

fn extract_icon_from_exe(src: &Path, dest: &Path) -> Result<PathBuf> {
    log::info!("Extracting icon from .exe file: {}", src.display());

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

    log::info!("Icon extracted to: {}", dest.display());
    Ok(dest.to_path_buf())
}
