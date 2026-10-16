# Simple SoundCloud player

[Demo](https://matreshka.js.org/examples/soundcloud-search/)

This application is based on [SoundCloud API](https://developers.soundcloud.com/docs/api/guide). Search query is stored at ``localStorage``.

> **The live demo no longer works.** SoundCloud's API now asks for an OAuth access token, and the public client ID the demo sends is refused with `401 Unauthorized`, so a search finds nothing. The code is kept as an example of a `Matreshka.Array` that renders and plays a list of tracks. To run it, put a server in front of the API that adds an access token, and point `loadTracks` in `js/tracks.class.js` at it.
