// var eventCallbacks = {};
// require('fs').appendFileSync(__dirname + "/state.txt", "test\n");

// function registerEvent(event, callback) {
//     if (!eventCallbacks[event]) eventCallbacks[event] = [];
//     eventCallbacks[event] = callback;
//     console.log("Registered a new event: " + event);
//     require('fs').writeFileSync(__dirname + "/event.txt", `${callback}, ${Object.keys(eventCallbacks).length}, ${eventCallbacks}: ${JSON.stringify(eventCallbacks)}`);
// }

// function emitEvent(event, data) {
//     console.log("emitEvent: " + event, data);

//     require('fs').writeFileSync(__dirname + '/callback.txt', 
//         `${eventCallbacks[event] ? true : false}, ${event}, ${data}, ${ Object.keys(eventCallbacks).length}`
//     );

//     // for (let i = 0; i < Object.keys(eventCallbacks).length; i++) {
//     //     let key = Object.keys(eventCallbacks)[i];
//     //     require('fs').appendFileSync(__dirname + '/callback.txt', `\n${key}, ${eventCallbacks[key] ? true : false}, ${eventCallbacks[key] ? eventCallbacks[key].toString() : null}`);    
//     // }

//     if (eventCallbacks[event]) {
//         eventCallbacks[event](data);
//     }
//     return true;
// }

// setInterval(() => {
//     console.log(Events.CallBacks);
// }, 1000);

const Events = {
    /**
     * @type {Object.<string, Function>}
     */
    CallBacks: {},

    /**
     * Registers a new event callback
     * 
     * @param {string} keybind 
     * @param {Function} callback 
     */
    Register(keybind, callback) {
        console.log("Registering a new event");
        this.CallBacks[keybind] = undefined;
        this.CallBacks[keybind] = callback;

        console.log(this.CallBacks);
    },

    /**
     * Emits an event
     * 
     * @param {string} keybind 
     * @param {any} data 
     * @returns {boolean}
     */
    Emit(keybind, data) {
        console.log("Emitting an event");
        if (this?.CallBacks[keybind]) {
            Function.call(this.CallBacks[keybind], data);
            return true;
        }
        return false;
    }
}

// export the emitter
module.exports = { Events };