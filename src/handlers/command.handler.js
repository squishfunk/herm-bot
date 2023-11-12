const { Collection, REST } = require('discord.js')
const {	Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs')
const config = require('../../config.js')
const ascii = require('ascii-table')

const table = new ascii().setHeading("Command", "Load status")

module.exports = client => {
	client.commands = new Collection()

	const commandFiles = readdirSync(__dirname + '/../commands').filter(file => file.endsWith('.command.js'))

	let commandsToRegister = [];
	for (const filename of commandFiles){
		const command = require(__dirname + `/../commands/${filename}`)

		if(command.data){
			client.commands.set(command.data.name, command)
			table.addRow(command.data.name, '✅');
		}else{
			table.addRow(command.data.name, '❌');
			continue;
		}

		commandsToRegister.push(command.data.toJSON())
	}
	console.log(table.toString());

	/* TODO przeneś do innego handlera */
	const rest = new REST({ version: '10' }).setToken(config.token);
	const guildIds = client.guilds.cache.map(guild => guild.id);
	for (const guildId of guildIds){
		rest.put(Routes.applicationGuildCommands(config.client_id, guildId), {
			body: commandsToRegister
		})
			.then(() => console.log(`Added commands to ${guildId}`))
			.catch(console.error)
	}

	client.on('interactionCreate', (interaction) => {
		if(!interaction.isChatInputCommand() || !client.commands.has(interaction.commandName)) return;
		client.commands.get(interaction.commandName).execute({client, interaction})
	});

}