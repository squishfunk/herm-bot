const config = require('../../config.js');
const {	Routes } = require('discord-api-types/v9');
const { REST } = require('discord.js');

module.exports = (commandsToRegister, guildIds) => {
	const rest = new REST({ version: '10' }).setToken(config.token);
	for (const guildId of guildIds){
		rest.put(Routes.applicationGuildCommands(config.client_id, guildId), {
			body: commandsToRegister
		})
			.then(() => console.log(`Added commands to ${guildId}`))
			.catch(console.error)
	}
}