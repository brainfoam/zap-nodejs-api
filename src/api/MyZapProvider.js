
class MyZapProvider {

    constructor(dispatch) {
        this.dispatch = dispatch;
    }

    static parseIncomingEvent(event) {
        if (!event.returnValues) throw new Error('Must be event object!');
        if (event.event !== 'Incoming') throw new Error('Wrong event for parsing. Event name = ' + event.event + ', must be Incoming');

        let incomingEvent = Object();
        incomingEvent.id = event.returnValues.id;
        incomingEvent.provider = event.returnValues.provider;
        incomingEvent.subscriber = event.returnValues.subscriber;
        incomingEvent.query = event.returnValues.query;
        incomingEvent.endpoint = event.returnValues.endpoint;
        incomingEvent.endpointParams = event.returnValues.endpointParams;
        return incomingEvent;
    }

    listenSubscriptions(callback) {

    }

    initQueryRespond({id, provider, subscriber}, handler, from) {
        if (!this.dispatch || !this.dispatch.isZapDispatch) throw new Error('ZapDispatch class must be specified!');

        return this.dispatch.contract.events.Incoming({filter: {id, provider, subscriber}, fromBlock: 0}, (error, result) => {
            if (error) {
                console.log(error);
            } else {
                try {
                    const respondParams = handler(MyZapProvider.parseIncomingEvent(result));
                    this.dispatch.respond(result.returnValues.id, respondParams, from);
                } catch (e) {
                   console.log(e);
                }
            }
        });
    }
}

module.exports = MyZapProvider;