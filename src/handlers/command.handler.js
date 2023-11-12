const { Collection } = require('discord.js')
const { readdirSync } = require('fs')
const ascii = require('ascii-table')
const registerCommands = require('register-commands.handler');

const table = new ascii().setHeading("Command", "Load status")

module.exports = client => {
	client.commands = new Collection()

	const commandFiles = readdirSync(__dirname + '/../commands').filter(file => file.endsWith('.command.js'))

	let commandsToRegister = [];
	for (const filename of commandFiles){
		const command = require(__dirname + `/../commands/${filename}`)

		if(command.data){
			client.commands.set(command.data.name, command)
			table.addRow(command.data.name, 'Loaded');
		}else{
			table.addRow(command.data.name, 'Failed');
			continue;
		}

		commandsToRegister.push(command.data.toJSON())
	}
	console.log(table.toString());

	registerCommands(commandsToRegister);

	client.on('interactionCreate', (interaction) => {
		if(!interaction.isChatInputCommand() || !client.commands.has(interaction.commandName)) return;
		client.commands.get(interaction.commandName).execute({client, interaction})
	});

}