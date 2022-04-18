const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");
const fs = require("fs");

// Subcommand Handler
let data = new SlashCommandBuilder()
	.setName("matches")
	.setDescription("Create a matchup between two teams");
let subcommands = {};

const subcommandFiles = fs
	.readdirSync("./discord/commands/matches")
	.filter((file) => file.endsWith(".js"));

for (const file of subcommandFiles) {
	const subcommand = require(`./matches/${file}`);
	data.addSubcommand(subcommand.data);
	subcommands[subcommand.data.name] = subcommand;
}

module.exports = {
	data,
	async execute(interaction) {
		if (
			interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
		) {
			let subcommand = interaction.options.getSubcommand();
			let file = subcommands[subcommand];
			await file.execute(interaction);
		} else {
			let embed = new MessageEmbed()
				.setDescription("**Err**: Missing Permissions")
				.setColor("#FF6666");
			await interaction.editReply({
				embeds: [embed],
			});
		}
	},
	ephemeral: true,
	defer: true,
};