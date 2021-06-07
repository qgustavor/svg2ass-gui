# svg2ass-gui

A Web GUI for [irrwahn/svg2ass](https://github.com/irrwahn/svg2ass). Check it here: [https://qgustavor.github.io/svg2ass-gui/](https://qgustavor.github.io/svg2ass-gui/)

Compiled to WASM using [Emscripten](https://emscripten.org/). Uses [SVGO](https://github.com/svg/svgo) to improve compatibility and to compress results.

## Licenses 

This project includes code from:

* [irrwahn/svg2ass](https://github.com/irrwahn/svg2ass): [BSD 3-Clause License](https://github.com/irrwahn/svg2ass/blob/53be678a5be24d690b421bce5f1e345ae960077c/LICENSE)
* [Emscripten](https://emscripten.org/): [MIT/Expat Licence](https://github.com/emscripten-core/emsdk/blob/7e3c0461444bc2b3ad33b32fe89867d626e0f9f5/LICENSE)
* [SVGO](https://github.com/svg/svgo/): [MIT License](https://github.com/svg/svgo/blob/59876d894ba758814a224cffe26566104018130d/LICENSE)
* [Plume CSS](https://github.com/felippe-regazio/plume-css/): [GNU GENERAL PUBLIC LICENSE](https://github.com/felippe-regazio/plume-css/blob/5e34d804ca52e6dffe4a486a8442b16f9fe5022f/LICENSE)

Please open a issue or send a pull request if there is any issue regarding licensing.

## Translations

If you wish to translate this tool to your language then fork this repository, create a copy of index.html with your language code, translate messages, replace the language code in `<html lang>`, add your language to `lib\languages.html`, then finally send a pull request.

## Privacy

Data is converted in browser and is not send to any servers. Application data is fetched from GitHub servers which receive usual request info related to fetching any webpage.

If required this project can be cloned and hosted in any web server. All source-code specific to this project is meant to be safe, respect user privacy and allow to be audited. Both `lib/svg2ass.js` and `lib/svg2ass.wasm` were compiled using Emscripten, so their code are not readable, but those can be still verified by doing the same build steps:

1. Install make (if it's not already installed);
1. Install [Emscripten](https://emscripten.org/);
1. Clone [irrwahn/svg2ass](https://github.com/irrwahn/svg2ass);
1. Replace the contents of `Makefile` with those of `lib/Makefile`;
1. Run `make`.

Flags, used to identify languages, come from [catamphetamine/country-flag-icons](https://github.com/catamphetamine/country-flag-icons/) and are also loaded from GitHub servers. Those are released under [MIT License](https://github.com/catamphetamine/country-flag-icons/blob/d9bdf1180eb5c50ad5ebd6514f19c84857ba55f6/LICENSE).
