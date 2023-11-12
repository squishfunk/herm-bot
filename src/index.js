const { Client, IntentsBitField } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { token } = require('../config.js');
const commandHandler = require('./handlers/command.handler')
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildVoiceStates,
	]
});



client.on('ready', () => {
	console.log(`Zalogowano jako ${client.user.tag}`);
	commandHandler(client);


	client.distube = new DisTube(client, {
		leaveOnStop: false,
		emitNewSongOnly: true,
		emitAddSongWhenCreatingQueue: false,
		emitAddListWhenCreatingQueue: false,
		plugins: [
			// new SpotifyPlugin({
			// 	emitEventsAfterFetching: true
			// }),
			// new SoundCloudPlugin(),
			new YtDlpPlugin()
		]
	})

})

client.login(token);