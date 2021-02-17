const { MessageEmbed } = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const Util = require("./../Util/canvas")
const { inspect } = require('util');

module.exports = {
	name: 'clear',
	aliases: [],
	disabled: false,
	cooldown: 0,
	userPerms:[],
	ownerOnly: true,

	async execute(message, args, client) {
	  			const base = await loadImage(path.join(__dirname, '..', 'web', 'public', 'logo.jpg'));
	  			const canvas = createCanvas(base.width, base.height);
			    const ctx = canvas.getContext('2d');
			    ctx.drawImage(base, 0, 0);
			    Util.transparent(ctx, 0, 0, base.width, base.height);
			    return message.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'logo.jpg' }] });
	}
};
