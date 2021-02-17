const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'permission',
	aliases: ['p'],
	cooldown: 5,
	description: 'ロールやメンバーの権限を一括で操作できます。',
	example:
		'-channel <#channel> -member <@!member> -role <@&role> -add [...permissions] -remove [...permissions]',
	details: `第一引数で権限を編集するチャンネルを指定します。
		\n(カテゴリーチャンネルを指定すると、そのカテゴリーにある全てのテキストチャンネルの権限が編集されます)
		\n第二引数で権限を編集する対象を指定します。(メンバーかロール)
		\n第三引数で権限を追加するか削除するかを指定します。(\`-add\`か\`-remove\`)
		\n第四引数以降で編集する権限を指定します。(\`SEND_MESSAGES MANAGE_MESSAGES\`など。半角スペースで区切る)
		\n全ての権限は\`d>permission show\`で確認できます`,
	userPerms: ['ADMINISTRATOR'],
	disabled: false,
	ownerOnly: false,
	async execute(message, args, client) {
		let succses_embed = new MessageEmbed().setColor('GREEN');
		let error_embed = new MessageEmbed().setColor('RED');
		let allow_embed = new MessageEmbed().setColor('BLUE');
		let deny_embed = new MessageEmbed().setColor('ORANGE');
		//botのメンバーobjを取得
		const CLIENT_MEMBER = message.guild.members.cache.get(client.user.id);
		//管理者権限の確認(bot本体)
		if (!CLIENT_MEMBER.hasPermission('ADMINISTRATOR')) {
			return message.channel.send(`${client.user}に管理者権限がありません`);
		}
		//管理者権限の確認(コマンド使用者)
		if (!message.member.hasPermission('ADMINISTRATOR')) {
			const reply_noPermission = await message.reply(
				'このコマンドを使うには管理者権限が必要です'
			);
			return reply_noPermission.delete({
				timeout: 5000
			});
		}
		//引数の確認
		if (args.length == 0) {
			return message.reply('\n`d>help permission` で使い方を確認してください');
		}
		//ギルド指定
		const GUILD = message.guild;
		//各種宣言
		let CHANNELS = [];
		let MEMBERS = [];
		let ROLES = [];
		let amount_error = 0;
		let allow_perms_test = [];
		let deny_perms_test = [];

		//すべてのギルドメンバーを取得
		await message.guild.members.fetch();
		const [...switcharg] = message.content.split(' -');
		for (const s of switcharg) {
			if (s.startsWith('c') || s.startsWith('channel')) {
				const [switched_prefix, ...channel] = s.split(' ');
				channel.forEach(c =>
					CHANNELS.push(
						message.guild.channels.cache.get(
							c.replace('<#', '').replace('>', '')
						)
					)
				);
				for (let i = 0; i < CHANNELS.length; i++) {
					const c = CHANNELS[i];
					if (c === undefined) {
						error_embed.addField(
							'❎' + '(' + channel[i] + ')',
							'(エラー)チャンネルではありません'
						);
					} else {
						amount_error++;
						error_embed.addField(
							'✅' + '(' + channel[i] + ')',
							'チャンネルを取得できましたがエラーが発生したため実行されませんでした。[<#' +
								c.id +
								'>]'
						);
						succses_embed.addField(
							'✅' + '(' + channel[i] + ')',
							'チャンネルを取得しました[<#' + c.id + '>]'
						);
					}
				}
			} else if (s.startsWith('m') || s.startsWith('member')) {
				const [switched_prefix, ...member] = s.split(' ');
				member.forEach(m =>
					MEMBERS.push(
						message.guild.members.cache.get(
							m
								.replace('<@', '')
								.replace('<@!', '')
								.replace('>', '')
						)
					)
				);
				for (let i = 0; i < MEMBERS.length; i++) {
					const m = MEMBERS[i];
					if (m === undefined) {
						error_embed.addField(
							'❎' + '(' + member[i] + ')',
							'(エラー)メンバーではありません'
						);
					} else {
						amount_error++;
						error_embed.addField(
							'✅' + '(' + member[i] + ')',
							'メンバーを取得できましたがエラーが発生したため実行されませんでした。[<@!' +
								m.id +
								'>]'
						);
						succses_embed.addField(
							'✅' + '(' + member[i] + ')',
							'メンバーを取得しました[<@!' + m.id + '>]'
						);
					}
				}
			} else if (s.startsWith('r') || s.startsWith('role')) {
				const [switched_prefix, ...role] = s.split(' ');
				role.forEach(r =>
					ROLES.push(
						message.guild.roles.cache.get(r.replace('<@&', '').replace('>', ''))
					)
				);
				for (let i = 0; i < ROLES.length; i++) {
					const r = ROLES[i];
					if (r === undefined) {
						error_embed.addField(
							'❎' + '(' + role[i] + ')',
							'(エラー)ロールではありません'
						);
					} else {
						amount_error++;
						error_embed.addField(
							'✅' + '(' + role[i] + ')',
							'ロールを取得できましたがエラーが発生したため実行されませんでした。[<@&' +
								r.id +
								'>]'
						);
						succses_embed.addField(
							'✅' + '(' + role[i] + ')',
							'ロールを取得しました[<@&' + r.id + '>]'
						);
					}
				}
			} else if (s.startsWith('a') || s.startsWith('allow')) {
				continue;
			} else if (s.startsWith('d') || s.startsWith('deny')) {
				continue;
			} else {
				continue;
			}
		}
		if (error_embed.fields.length > amount_error) {
			return message.channel.send(error_embed);
		} else {
			succses_embed.setTitle('取得が正常に行われました');
			message.channel.send(succses_embed);
		}
		for (const s of switcharg) {
			if (s.startsWith('a') || s.startsWith('allow')) {
				const [switched_prefix, ...perms] = s.split(' ');
				allow_perms_test = perms;
				for (const c of CHANNELS) {
					MEMBERS.forEach(m =>
						c.overwritePermissions(
							[
								{
									id: m,
									allow: perms
								}
							],
							'permissionコマンドによる変更(' + message.author.tag + ')'
						)
					);
					ROLES.forEach(r =>
						c.overwritePermissions(
							[
								{
									id: r,
									allow: perms
								}
							],
							'permissionコマンドによる変更(' + message.author.tag + ')'
						)
					);
					const allow_perms = perms.map(p => '✅' + p);
					allow_embed.addField(c.name, '権限設定が変更されました');
					MEMBERS.forEach(m =>
						allow_embed.addField(`@${m.user.tag}`, allow_perms.join('\n'))
					);
					ROLES.forEach(r =>
						allow_embed.addField(`@${r.name}`, allow_perms.join('\n'))
					);
				}
				message.channel.send(allow_embed);
			} else if (s.startsWith('d') || s.startsWith('deny')) {
				const [switched_prefix, ...perms] = s.split(' ');
				deny_perms_test = perms;
				for (const c of CHANNELS) {
					MEMBERS.forEach(m =>
						c.overwritePermissions(
							[
								{
									id: m,
									deny: perms
								}
							],
							'permissionコマンドによる変更(' + message.author.tag + ')'
						)
					);
					ROLES.forEach(r =>
						c.overwritePermissions(
							[
								{
									id: r,
									allow: perms
								}
							],
							'permissionコマンドによる変更(' + message.author.tag + ')'
						)
					);
				}
				const deny_perms = perms.map(p => '❎' + p);
				MEMBERS.forEach(m =>
					deny_embed.addField(`@${m.user.tag}`, deny_perms.join('\n'))
				);
				ROLES.forEach(r =>
					deny_embed.addField((`@${r.name}`, deny_perms.join('\n')))
				);
			} else {
				continue;
			}
		}

		//<==========================================>
		/*	
		

		//チャンネルの取得
		CHANNEL = message.guild.channels.cache.get(C_ID);
		//エラー処理
		if (CHANNEL === undefined) {
			return message.reply(`チャンネルのID/メンションを第一引数に指定してください
      \n${
				client.prefix
			}permission __**<#channel>**__ <@member> -add [permissions]`);
		}
		//メンバーID
		const M_ID = args[1]
			.replace('<@', '')
			.replace('<@!', '')
			.replace('>', '');
		//メンバー取得
		MEMBER = message.guild.members.cache.get(M_ID);
		//メンバーが見つからない
		if (MEMBER === undefined) {
			//ロールとして取得
			ROLE = message.guild.roles.cache.get(M_ID.replace('&', ''));
			//ロールでもメンバーでもない場合
			if (ROLE === undefined) {
				return message.reply(`ロールかメンバーのID/メンションを第二引数に指定してください
      \n${
				client.prefix
			}permission <#channel> __**<@member>**__ -add [permissions]`);
			}
			//ロール時の処理
			if (MEMBER === undefined) {
				//ギルドオーナー除外
				if (message.author.id !== message.guild.ownerID) {
					//最高位ロールと比較
					if (ROLE.position > message.member.roles.highest.position) {
						return message.reply(
							'指定したロールはあなたの最高位ロールよりも高い位置にあるため操作できません'
						);
					}
					if (ROLE.position == message.member.roles.highest.position) {
						return message.reply(
							'指定したロールはあなたの最高位ロールなので操作できません'
						);
					}
					if (ROLE.position >= CLIENT_MEMBER.roles.highest.position) {
						return message.reply(
							'このロールは操作できません。botのロールポジションを確認してください'
						);
					}
					const [...switcharg] = args
						.join(' ')
						.slice(args[0].length + args[1].length + 1)
						.split('-');
					const [add_or_remove, ...perms] = switcharg[1].split(' ');
					const PERMS = perms.length > 1 ? perms : `${perms[0]}`;
					switch (add_or_remove) {
						case 'add':
						case 'a':
							CHANNEL.overwritePermissions(
								[
									{
										id: ROLE.id,
										allow: PERMS
									}
								],
								'overwriteCommand'
							)
								.then(c =>
									message.channel.send(c.name + 'の権限を書き換えました')
								)
								.catch(e => {
									console.log(e);
									message.channel.send(
										'エラー\n権限のスペルを確認してください'
									);
								});
							if (CHANNEL.type === 'category') {
								CHANNEL.children.forEach(c => {
									c.overwritePermissions(
										[
											{
												id: ROLE.id,
												allow: PERMS
											}
										],
										'overwriteChildren'
									);
								});
							}
							break;
						case 'remove':
						case 'r':
							CHANNEL.overwritePermissions(
								[
									{
										id: ROLE.id,
										deny: PERMS
									}
								],
								'overwriteCommand'
							)
								.then(c =>
									message.channel.send(c.name + 'の権限を書き換えました')
								)
								.catch(e => {
									console.log(e);
									message.channel.send(
										'エラー\n権限のスペルを確認してください'
									);
								});
							if (CHANNEL.type === 'category') {
								CHANNEL.children.forEach(c => {
									c.overwritePermissions(
										[
											{
												id: ROLE.id,
												deny: PERMS
											}
										],
										'overwriteChildren'
									);
								});
							}
							break;
						default:
							message.reply('`-add`か`remove`を引数に入れてください');
					}
				}
			}
			//<-------------------------仕切り-------------------------------->
		}*/
	}
};
