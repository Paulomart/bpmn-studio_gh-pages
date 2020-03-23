const createEvent = (()=>{
    try{
        new Event('nothing');
        return (name, options) => new Event(name, options);
    }catch(e){}

    return (name, options) => {
        let event = document.createEvent('Event');
        event.initEvent(name, options.bubbles, options.cancelable);
        return event;
    };
})();

export function dispatchEvent(el, name, options = {}){
    const event = createEvent(name, options);
    return !el.dispatchEvent(event);
}
