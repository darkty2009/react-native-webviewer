function Event(type) {
    this.type = type;
}

export default {
    create:function(type, data) {
        var event = new Event(type || 'bridge');
        event.nativeEvent = {
            data:data
        };

        return event;
    }
}
