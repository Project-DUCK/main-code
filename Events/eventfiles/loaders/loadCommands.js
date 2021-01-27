const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

module.exports = (client) => {
    fs.readdirSync("./Commands")
        .map((filename) => filename.split(".").slice(0, -1).join("."))
        .forEach((filenameWithoutExtension) => {
            const command = require(`./../../../Commands/${filenameWithoutExtension}`)
            client.commands.set(command.name, command);
            //const UNAVAILABLE = client.commands.map(c=>c.disabled ? c.name : null )
            //console.log(client.logger.yellow(`[COMMAND | AVAILABLE]:${client.logger.green(AVAILABLE)}`))
            console.log(client.logger.red(`[COMMAND | AVAILABLE]:${client.logger.green(client.commands.keyArray())}`))        });
};