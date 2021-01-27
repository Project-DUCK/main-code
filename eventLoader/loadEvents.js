const getExtensionsHandler = require("./getEvents");

const ExtensionHandlersRun = (handlers, ...events) =>
    handlers.forEach((h) => h(...events));

module.exports = (client) => {
    const { ready, ...ExtensionHandlerMap } = getExtensionsHandler();

    process.on("unhandledRejection", console.warn);
    client.once("ready", () => ExtensionHandlersRun(ready, client));

    Object.keys(ExtensionHandlerMap).forEach((h) =>
        client.on(h, (...events) =>
            ExtensionHandlersRun(ExtensionHandlerMap[h], ...events,client)
        )
    );
};