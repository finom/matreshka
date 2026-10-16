/* global marked */
class Application extends Matreshka {
    constructor() {
        super();
        this.set('source', localStorage.mdSource || '# Hey')
            .bindNode({
                source: '.source',
                result: {
                    node: '.result',
                    binder: Matreshka.binders.html()
                }
            })
            .calc('result', 'source', (source) => marked.parse(source), { debounceCalcDelay: 300 })
            .on('change:result', () => {
                localStorage.mdSource = this.source;
            });
    }
}

window.app = new Application();
