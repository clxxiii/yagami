let { MessageEmbed } = require("discord.js");
const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { prisma } = require("../../../../prisma");
module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("activate")
		.setDescription("Changes which tournament the other commands apply to")
		.addStringOption((option) =>
			option
				.setName("acronym")
				.setDescription("The acronym of the tournament")
				.setRequired(true)
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		let acro = interaction.options.getString("acronym").toUpperCase();

		let tournament = await prisma.tournament.findFirst({
			where: {
				acronym: acro,
				Guild_id: interaction.guildId,
			},
		});

		if (!tournament) {
			let embed = new MessageEmbed()
				.setDescription(
					`**Err**: No tournament with the acronym \`${acro}\` found.`
				)
				.setColor("RED");
			await interaction.editReply({ embeds: [embed] });
			return;
		}

		await prisma.guild.update({
			where: { guild_id: interaction.guildId },
			data: { active_tournament: tournament.id },
		});

		let embed = new MessageEmbed()
			.setTitle("Active Tournament Updated!")
			.setDescription(
				`Active tournament switched to \`${tournament.name}\``
			)
			.setColor("GREEN");

		await interaction.editReply({ embeds: [embed] });
	},
};