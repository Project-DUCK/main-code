const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');
const { fetchData } = require('./../Util/util');
const moment = require('moment');
require('moment-timezone');

module.exports = {
	name: 'litemint',
	aliases: [],
	disabled: false,
	description: 'litemintのカード表示。',
	example: '[card名]',
	userPerms: [],
	details:
		'ステータスを表示します\nオプションはありません。',
	cooldown: 1,
	ownerOnly: false,

	async execute(message, args, client) {
	  if(!args[0]){
	    return message.reply('カード名を指定してください')
	  }else{
	    let lite_embed = new MessageEmbed();
	    let DataArray = [];
	    const Data = await fetchData('https://api.litemint.com:9088/library/');
	    for(const d in Data){
	      if(Data[d].name.toLowerCase().startsWith(args.join(' ')) || Data[d].name.toLowerCase().startsWith(args.join(' '))){
	        DataArray.push(Data[d]);
	      }
	    }
	    /*if(DataArray.length > 1){
	      
	    }else */if(DataArray.length == 0){
	      return message.channel.send('一致する名前のカードがありませんでした');
	    }else{
	      lite_embed.setTitle(DataArray[0].name)
	      DataArray[0].desc === undefined ? null : lite_embed.setDescription(DataArray[0].desc);
	      lite_embed.addField('damage',DataArray[0].points[1],true)
	      .addField('health',DataArray[0].points[2],true)
	      .addField('energy',DataArray[0].points[0],true)
	      .addField('armor',DataArray[0].points[3],true)
	      
	      message.channel.send(lite_embed)
	    }
	    
	    
	  }
	}
};