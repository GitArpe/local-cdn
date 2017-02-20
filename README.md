### Local CDN

 > WebExtension implementation of Decentraleyes project: Local emulation of Content Delivery Networks

This project aims to bring [Decentraleyes](https://github.com/Synzvato/decentraleyes) to Chromium.

Note that many libraries of this project is deliberately copied from Decentraleyes project to keep up with this project. If you would like a new library to be added to the CDN list, please file a bug at https://github.com/Synzvato/decentraleyes/issues. Once the library is merged, you can ping me to update "Local CDN" project as well.

This fork aims to improve performance, through using event pages and [declarativeWebRequest](https://developer.chrome.com/extensions/declarativeWebRequest), which is only available in the Chrome Beta / Dev Channel.