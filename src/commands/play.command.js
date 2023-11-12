const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("music") /* TODO */
		.setDescription("Zagraj muzyczke z jutuba")
		.addSubcommand(subcommand =>
			subcommand
				.setName("search")
				.setDescription("Searches for a song and plays it")
				.addStringOption(option =>
					option.setName("searchterms").setDescription("search keywords").setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("skip")
				.setDescription("Przerywa aktualnie graną muzyke")
				// .addStringOption(option => option.setName("url").setDescription("the playlist's url").setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("play")
				.setDescription("Odtwarza muzyke")
				.addStringOption(option => option.setName("url").setDescription("Nazwa lub url muzyki").setRequired(true))
		),
	execute: async ({ client, interaction }) => {
		const { options, member, guild, channel } = interaction
		const VoiceChannel = member.voice.channel;

		if(!VoiceChannel)
			return interaction.reply({content: "Dołącz do kanału", ephemeral: true })

		if(guild.members.me.voice.channelId && VoiceChannel.id !== guild.members.me.voice.channelId)
			return interaction.reply({content: "Jestem już na kanale", ephemeral: true })

		try {
			const subcommand = options.getSubcommand();
			if(subcommand === 'play'){
				const results = await client.distube.search(options.getString('url'), {limit: 1});
				if(results){
					await interaction.deferReply();
					const result = results.shift();
					await client.distube.play(VoiceChannel, result.url, {textChannel: channel, member: member});
					const resultEmbed = new EmbedBuilder()
						.setColor(0x0099FF)
						.setTitle(result.name)
						.setAuthor({ name: 'Herm' })
						.setDescription('Długość: ' + result.formattedDuration)
						.setThumbnail(result.thumbnail)
						.setImage(result.thumbnail)
						.setFooter({ text: `Autor: ${result.uploader.name}` });


					return await interaction.editReply({embeds: [resultEmbed]});
				}
			}

			if(subcommand === 'skip'){
				await client.distube.stop(guild.id);

				await client.distube.skip(guild.id);
			}


		}catch (e){
			const errorEmbed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setDescription(`Alert: ${e}`);

			return interaction.reply({embeds: [errorEmbed]});
		}
	},
}