class Track extends Matreshka.Object {
    constructor(data, parent) {
        super({
            title: data.title,
            artwork_url: data.artwork_url || data.user.avatar_url,
            stream: `${data.stream_url}?client_id=${parent.soundCloudClientID}`
        });
    }

    onRender() {
        this
            .bindNode({
                artwork_url: ':sandbox .artwork',
                stream: ':sandbox audio'
            }, Matreshka.binders.prop('src'))
            .bindNode('title', ':sandbox .title', Matreshka.binders.html());
    }

    play() {
        this.nodes.stream.play();
    }

    stop() {
        this.nodes.stream.pause();
        this.nodes.stream.currentTime = 0;
    }
}
