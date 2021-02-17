const chalk = require("chalk");
const { Collection } = require("discord.js");
const { MessageEmbed } = require('discord.js');
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const xpSetting = require('./../../../Models/xpSetting');
const memberModel = require('./../../../Models/guildMember');


module.exports = async (message) => {
    if(message.author.bot) return;
    if(!message.guild) return;
    let IsNewGuild = await xpSetting.findOne({
      guildId:guild.id
    })
    if(!IsNewGuild){
      let NewSetting = new xpSetting({
        guildId: guild.id,
        isOn:false,
      })
     await NewSetting.save();
    }
    if(IsNewGuild.isOn){
      var MessageMember = await memberModel.findOne({
        guildId: message.guild.id,
        memberId: message.author.id,
      })
      if(!MessageMember){
        let NewMember = new memberModel({
          guildId: message.guild.id,
          memberId: message.author.id,
          xp: 0,
          level: 0,
          items: [],
        })
        await NewMember.save();
        MessageMember = NewMember;
      }
      MessageMember.xp += 1;
      await MessageMember.save();
      if(MessageMember.xp > MessageMember.level * MessageMember.level * MessageMember.level + 5){
        MessageMember.level += 1;
      }
      await MessageMember.save();
    }
    
    const client = message.client;
    const ref = await message.client.db.ref(`prefix_${message.guild.id}`)
    const postDoc = await ref.get()
    let prefix;
    try{
    prefix = postDoc.node_.children_.root_.value.value_;
    }catch(e){
      const pref = client.db.ref(`prefix_${message.guild.id}`);
    pref.update({
      prefix:process.env.BOT_PREFIX
    })
    prefix = process.env.BOT_PREFIX;
    }
    const prefixRegex = new RegExp(`^(<@!?${message.client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if(!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const [commandPrefix,...args] = message.content.slice(matchedPrefix.length).split(/[\s]+/gm);
    const commandName = commandPrefix;
    message.guild.prefix = prefix;
    
    const command =
        client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    
    if(!command) return;
    
    if(command.disabled) return;
    
    if(command.ownerOnly){
        if(!message.client.owners.includes(message.author.id)) return;
    }
    
    if(!cooldowns.has(command.name)){
        cooldowns.set(command.name, new Collection());
    }
  
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;
    if(timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if(now < expirationTime){
            const timeLeft = (expirationTime - now) / 1000;
            message.reply(
                new MessageEmbed()
                .setColor("RED")
                .setTitle("COOLDOWN")
                .setDescription(`\`${command.name}\`を使用するには、あと ${timeLeft.toFixed(1)} 秒待ってください`)
                .setTimestamp()
            );
            client.channels.cache.get(client.spamLog).send(
                new MessageEmbed()      
                .setColor("RED")
                .setTitle("spamming log")
                .setDescription(`\`${command.name}\`コマンドの連投`)
                .addField("コマンド使用者:",`user name: ${message.author.tag}\nuid: ${message.author.id}`)
                .addField("コマンド使用場所:",`${message.channel}(${message.channel.id})`)
                .setTimestamp()).catch(console.error);
            return;
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try{
        command.execute(message, args, client);
    }catch(error){
        console.error(error);
        message.reply(
            new MessageEmbed()      
            .setColor("RED")
            .setTitle("ERROR:warning:")
            .setDescription(`\`${command.name}\`コマンド実行時にエラーが発生しました`)
            .setTimestamp()).catch(console.error);
    }
};