const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

// Subcommand Handler
let data = new SlashCommandBuilder()
	.setName("round")
	.setDescription("Let's users view round information");
let subcommands = {};

const subcommandFiles = fs
	.readdirSync("./src/discord/commands/round")
	.filter((file) => file.endsWith(".js"));

for (const file of subcommandFiles) {
	const subcommand = require(`./round/${file}`);
	data.addSubcommand(subcommand.data);
	subcommands[subcommand.data.name] = subcommand;
}

module.exports = {
	data,
	async execute(interaction) {
		let subcommand = interaction.options.getSubcommand();
		let file = subcommands[subcommand];
		await file.execute(interaction);
	},
};
