let { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
let { MessageEmbed } = require("discord.js");
let { fetchGuild, prisma } = require("../../../../prisma");
let { execute } = require("../../../buttons/match_start_list");

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("start")
		.setDescription("Starts a match")
		.addStringOption((option) =>
			option
				.setName("round_acronym")
				.setDescription("The acronym of the round to start")
				.setRequired(true)
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		let guild = await fetchGuild(interaction.guildId);
		let tournament = guild.active_tournament;

		// In case there is no active tournament
		if (!tournament) {
			let embed = new MessageEmbed()
				.setDescription("**Err**: No active tournament.")
				.setColor("RED")
				.setFooter({
					text: "You can make a new tournament with /tournament create",
				});
			await interaction.editReply({ embeds: [embed] });
			return;
		}

		let round = await prisma.round.findFirst({
			where: {
				tournamentId: tournament.id,
				acronym: interaction.options
					.getString("round_acronym")
					.toUpperCase(),
			},
		});

		// In case there is no round with the given acronym
		if (!round) {
			let embed = new MessageEmbed()
				.setDescription("**Err**: No round with the given acronym.")
				.setColor("RED")
				.setFooter({
					text: "You can make a new round with /round create",
				});
			await interaction.editReply({ embeds: [embed] });
			return;
		}

		await execute(interaction, {
			options: { index: 0, round: round.acronym },
		});
	},
};