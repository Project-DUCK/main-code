const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');
const { ReactionController } = require('discord.js-reaction-controller')

module.exports = {
	name: 'help',
	aliases: [],
	disabled: false,
	description: 'このbotのコマンド一覧を表示します。',
	example: '[command名]',
	userPerms: [],
	details:
		'helpを表示します\n例: `{{p}}help`(コマンド一覧を表示)\n`{{p}}help [コマンド名]`(コマンドの詳細を表示)',
	cooldown: 1,
	ownerOnly: false,

	async execute(message, args, client) {
	 

		if (args[0]) {//コマンド名が指定されていた場合、検索
			const COMMAND = client.commands.find(c => c.name === args[0]);
			if(!COMMAND){//見つからない場合
			  return message.reply("`"+args[0]+"`というコマンドはありません");
			}
			if (COMMAND.ownerOnly === true) {//オーナー用の場合除外
				return message.reply("`"+args[0]+"`というコマンドはありません");
			}
		  let PERMS = [];
			if (COMMAND.userPerms.length > 0) {//必要な権限の表示
				COMMAND.userPerms.forEach(p =>
					PERMS.push(message.member.hasPermission(p) ? `✅${p}` : `❎${p}`)
				);
			} else {//それ以外
				PERMS = ['誰でも使用可能'];
			}
			let detail_embed = new MessageEmbed()
				.setTitle(`${COMMAND.name} | HELP`)
				.setAuthor(message.author.tag, message.author.displayAvatarURL())
				.addField(
					`${message.guild.prefix}${COMMAND.name} ${COMMAND.example.replace(/{{p}}/gm,message.guild.prefix)}`,
					`${COMMAND.details.replace(/{{p}}/gm,message.guild.prefix)
					}`
				)
				.addField(`必要な権限`, PERMS);
			message.channel.send(detail_embed);
		} else {//全列挙
		let long_embed = new ReactionController(client);//コントローラー生成
		const COMMANDS = client.commands.array();/* Collection<name,command> */
				
    function* getPage(pageSize = 1, list) {
    let output = [];
    let index = 0;
  	let outputIndex = 0;
    while (index < list.length) {
        output = [];
        for (let i = index; i < index + pageSize; i++) {
            if (list[i]) {
                output.push(list[i]);
            }
        }
      index += pageSize;
      outputIndex++;
        yield [outputIndex,output];
      }
    }
    
    var page = getPage(10, COMMANDS);/* Generator { } */
		
		for(const value of page){ /* Object{ value: Array[ index, Array[value] ], done: Boolean }*/
		  	let help_embed = new MessageEmbed()
				.setTitle(`${client.user.username} | HELP `)
				.setAuthor(message.author.tag, message.author.displayAvatarURL())
				.setDescription(
					`\`${
						message.guild.prefix
					}help [コマンド名]\`で、コマンドの詳しい使い方を表示できます`
				);

			value[1].forEach(
				c =>
					c.ownerOnly
						? null
						: help_embed.addField(
								`**${message.guild.prefix}${c.name} ${
									c.aliases == [] ? `(${c.aliases})` : ''
								}**`,
								`${c.description}\n(${
									c.disabled == true ?  'メンテナンス中' :'使用可能'
								})`,
								true
						  )
			);
			help_embed.setTimestamp();
			help_embed.setFooter(`(${value[0]}/${Math.ceil(COMMANDS.length/10)})`)
			long_embed.addPages([help_embed]);
		}
		long_embed.sendTo(message.channel,message.author);
		  }
		}
	};