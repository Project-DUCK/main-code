const genshin = require('genshin');
const genshindb = require('genshin-db');
const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');
const moment = require('moment');
require('moment-timezone');


module.exports = {
	name: 'genshin',
	aliases: [],
	disabled: false,
	description: '原神検索機能',
	example: 'アンバー',
	userPerms: [],
	details:
		'原神のキャラクター、武器等を検索できます。\n英語、日本語可(出力は日本語のみ)',
	cooldown: 1,
	ownerOnly: false,

	async execute(message, args, client) {
    try{
      //キャラクター
    let chara_embed = new MessageEmbed()
    await genshindb.setOptions({
    verbose: false, 
    nameonly: false,
    querylanguages: ["Japanese","English"], 
    resultlanguage: "English"
    })
    let c = await genshindb.characters(args.join(" "));
    chara_embed.setImage(c.images.portrait)
    chara_embed.setThumbnail(c.images.image)
    await genshindb.setOptions({
    verbose: false, 
    nameonly: true,
    querylanguages: ["Japanese","English"], 
    resultlanguage: "Japanese"
    })
    let chara = await genshindb.characters(c.name)
    chara_embed.setTitle(`${chara.name} | ${chara.title}`)
    .setDescription(chara.description)
    .addField("レアリティ",chara.rarity,true)
    .addField("元素",chara.element,true)
    .addField("武器",chara.weapontype,true)
    .addField("性別",chara.gender,true)
    .addField("所属",chara.affiliation,true)
    .addField("誕生日",chara.birthday,true)
    .addField("星座",chara.constellation,true)

    message.lineReply(chara_embed)

    //ここまで
    }catch(e){
      //武器
      //try{
        genshindb.setOptions({
          verbose: false, 
          nameonly: false,
          querylanguages: ["English","Japanese"], 
          resultlanguage: "English"
        })
        let weapon_embed = new MessageEmbed()
        let w = await genshindb.weapons(args[0])
        weapon_embed.setImage(w.images.image)
        console.log(w)


        message.lineReply(weapon_embed)
      //ここまで
     /* }catch(e){

      }*/



    }

	}
};
