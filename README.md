![Logo](https://github.com/BlackBlazent/BlackVideo/blob/blackvideo-master/.github/repo_assets/BlackVideoBanner.png?raw=true)

# **Appname:** *BlackVideo*  
## **Codename:** *zephyra*  
 
 <h5>🎯 <i>A next-gen video player with advanced playback tools and a modular extension system—enabling intelligent utilities for a fully customizable viewing experience.</i></h5>

 ![Status](https://img.shields.io/badge/status-in%20development-blue)
![License](https://img.shields.io/badge/license-proprietary-red)
![Codename](https://img.shields.io/badge/codename-Zephyra-purple)
![Version](https://img.shields.io/badge/version-1.1.01.001.0001-informational)
![ID](https://img.shields.io/badge/appID-com.blackblazent.blackvideo--zephyra.app-lightgrey)

## Date created
12/23/2023 at 8:55 AM


## Date published
DD/MM/YYYY

## Documentation

[Documentation](./__docs__/BlackVideo.Zephyra.Documentation.md)

## 📥 Download  
Download **BlackVideo** only from the source provided below. For your safety, avoid downloading from untrusted websites.

Available on:  
---

| Platforms | Mirrors 1 | Mirror 2 |
|-----------|-----------|----------|
| <img style="width: 70px; height: 70px;" src="https://github.com/LoneStamp99/Vvdo/assets/93658802/16780aaa-10e5-4b63-87ac-0edfe30c0053"/> | [Unavailable](#) | [Unavailable](#) |  
| <img style="width: 70px; height: 70px;" src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png?20200704175319"/> | [Unavailable](#) | [Unavailable](#) |  
| <img style="width: 70px; height: 70px;" src="https://github.com/LoneStamp99/Vvdo/assets/93658802/aaad78d0-6e4f-4dec-9586-207b86a4a6ff"/> | [Unavailable](#) | [Unavailable](#) |  
| <img style="width: 70px; height: 70px;" src="https://github.com/LoneStamp99/Vvdo/assets/93658802/4bda63de-cd31-4d34-8afc-00f445fe66b6"/> | [Unavailable](#) | [Unavailable](#) |  
| <img style="width: 70px; height: 70px;" src="https://github.com/LoneStamp99/Vvdo/assets/93658802/a7cbc065-4ef7-4bf7-a633-1e8e631717ff"/> | [Unavailable](#) | [Unavailable](#) |
<!--https://github.com/LoneStamp99/Vvdo/assets/93658802/2c26d1c7-b2dc-4e42-a3d7-f2ab25e88b45-->

App Version History

| Icon | Version | Details on the Version Features Include                                                                                                                                                             | 🔗 Direct Link for Version Access                                           |
| ------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| <img style="width:40px; height:40px;" src="https://github.com/BlackBlazent/BlackVideo/blob/blackvideo-master/.github/repo_assets/BlackVideo.png" />      | v1.1.01.001.0001 | - Initial release <br>- Functional: | [v1.1.01.001.0001](https://example.com/downloads/v1.1.01.001.0001) |


## Diagram (Current)

```mermaid
graph TD

    base.cv::user["**User**<br>[External]"]
    base.cv::firebase_functions["**Firebase Functions**<br>functions/package.json `firebase-functions`, functions/src/index.ts `setGlobalOptions`"]
    base.cv::tauri_app["**Tauri Desktop Application**<br>src-tauri/Cargo.toml `[package]`, src-tauri/src/main.rs `tauri::Builder::default()`"]
    base.cv::data_connect_service["**Data Connect Service**<br>dataconnect/dataconnect.yaml `specVersion: "v1"`, dataconnect/schema/schema.gql `type User @table`"]
    base.cv::supabase["**Supabase**<br>package.json `@supabase/supabase-js`"]
    base.cv::firebase_platform["**Firebase Platform**<br>package.json `firebase`"]
    base.cv::genkit_framework["**Genkit Framework**<br>functions/package.json `genkit`, functions/package.json `genkit-cli`"]
    base.cv::postgresql_db["**PostgreSQL Database**<br>dataconnect/dataconnect.yaml `postgresql`, dataconnect/dataconnect.yaml `cloudSql`"]
    subgraph base.cv::frontend_app["**Frontend Web Application**<br>[External]"]
        base.cv::spa["**Single Page Application**<br>src/main.tsx `ReactDOM.createRoot`, src/App.tsx `function App()`"]
    end
    %% Edges at this level (grouped by source)
    base.cv::user["**User**<br>[External]"] -->|"Uses"| base.cv::spa["**Single Page Application**<br>src/main.tsx `ReactDOM.createRoot`, src/App.tsx `function App()`"]
    base.cv::user["**User**<br>[External]"] -->|"Uses"| base.cv::tauri_app["**Tauri Desktop Application**<br>src-tauri/Cargo.toml `[package]`, src-tauri/src/main.rs `tauri::Builder::default()`"]
    base.cv::spa["**Single Page Application**<br>src/main.tsx `ReactDOM.createRoot`, src/App.tsx `function App()`"] -->|"Invokes"| base.cv::firebase_functions["**Firebase Functions**<br>functions/package.json `firebase-functions`, functions/src/index.ts `setGlobalOptions`"]
    base.cv::spa["**Single Page Application**<br>src/main.tsx `ReactDOM.createRoot`, src/App.tsx `function App()`"] -->|"Uses"| base.cv::supabase["**Supabase**<br>package.json `@supabase/supabase-js`"]
    base.cv::spa["**Single Page Application**<br>src/main.tsx `ReactDOM.createRoot`, src/App.tsx `function App()`"] -->|"Accesses data via"| base.cv::data_connect_service["**Data Connect Service**<br>dataconnect/dataconnect.yaml `specVersion: "v1"`, dataconnect/schema/schema.gql `type User @table`"]
    base.cv::tauri_app["**Tauri Desktop Application**<br>src-tauri/Cargo.toml `[package]`, src-tauri/src/main.rs `tauri::Builder::default()`"] -->|"Invokes"| base.cv::firebase_functions["**Firebase Functions**<br>functions/package.json `firebase-functions`, functions/src/index.ts `setGlobalOptions`"]
    base.cv::tauri_app["**Tauri Desktop Application**<br>src-tauri/Cargo.toml `[package]`, src-tauri/src/main.rs `tauri::Builder::default()`"] -->|"Uses"| base.cv::supabase["**Supabase**<br>package.json `@supabase/supabase-js`"]
    base.cv::tauri_app["**Tauri Desktop Application**<br>src-tauri/Cargo.toml `[package]`, src-tauri/src/main.rs `tauri::Builder::default()`"] -->|"Accesses data via"| base.cv::data_connect_service["**Data Connect Service**<br>dataconnect/dataconnect.yaml `specVersion: "v1"`, dataconnect/schema/schema.gql `type User @table`"]
    base.cv::firebase_functions["**Firebase Functions**<br>functions/package.json `firebase-functions`, functions/src/index.ts `setGlobalOptions`"] -->|"Uses services of"| base.cv::firebase_platform["**Firebase Platform**<br>package.json `firebase`"]
    base.cv::firebase_functions["**Firebase Functions**<br>functions/package.json `firebase-functions`, functions/src/index.ts `setGlobalOptions`"] -->|"Uses"| base.cv::genkit_framework["**Genkit Framework**<br>functions/package.json `genkit`, functions/package.json `genkit-cli`"]
    base.cv::data_connect_service["**Data Connect Service**<br>dataconnect/dataconnect.yaml `specVersion: "v1"`, dataconnect/schema/schema.gql `type User @table`"] -->|"Manages and stores data in"| base.cv::postgresql_db["**PostgreSQL Database**<br>dataconnect/dataconnect.yaml `postgresql`, dataconnect/dataconnect.yaml `cloudSql`"]
```

## License

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/LoneStamp/BlackVideo">BlackVideo</a><a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://github.com/LoneStamp"></a> is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-ND 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nd.svg?ref=chooser-v1" alt=""></a></p> 

## Contributing

Contributions are always welcome!

See [CONTRIBUTING.md](./CONTRIBUTING.md) for ways to get started.

Please adhere to this project's [CODE_OF_CONDUCT](./CODE_OF_CONDUCT.md).

## Support

For support, email blackblazent.techsupport@gmail.com or join our [Discord](https://discord.gg/tKFBwYuS) channel.


## Privacy Policy and Terms of Service
To learn more about how we collect, store, and use user data, please read our [Privacy Policy](#). Our Terms of Service govern the use of BlackVivido or Vvdo and can be found at [Link to Terms of Service]. By using our app, you agree to these terms.

## Copyright
© 2026 BlackBlazent. All right reserved.
