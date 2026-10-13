# Share Controls Assets

`x.svg`, `reddit.svg`, `facebook.svg`, `wechat.svg`, and `weibo.svg` are
vendored from [Simple Icons 16.35.0](https://github.com/simple-icons/simple-icons/tree/16.35.0)
under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
The full upstream license is included in `simple-icons-LICENSE.md`.
The only asset change is a consistent `#9b9ca6` fill. Brand marks remain
subject to their respective trademark policies.

`wechat-qr.png` is generated locally with `qrcode@1.5.4`. It encodes
`https://godcin.com/`, has a white four-module quiet zone, and uses H error
correction. The generator verifies the PNG with `jsqr@1.4.0` and
`pngjs@7.0.0`.

Run from the repository root to reproduce the assets:

```sh
npm install --prefix /tmp/ns-share-tools --no-audit --no-fund qrcode@1.5.4 simple-icons@16.35.0 pngjs@7.0.0 jsqr@1.4.0
NORTHSTAR_SHARE_TOOLS_ROOT=/tmp/ns-share-tools node website/scripts/generate-share-controls.cjs
```

Individual module locations can instead be provided with
`NORTHSTAR_QRCODE_MODULE`, `NORTHSTAR_SIMPLE_ICONS_MODULE`,
`NORTHSTAR_PNGJS_MODULE`, and `NORTHSTAR_JSQR_MODULE`.
