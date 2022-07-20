const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, Colors } = require("discord.js");
const { fetchGuild, prisma } = require("../../../../prisma");

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("deluser")
		.setDescription("Remove a user from a team")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("A user to add to the team")
				.setRequired(true)
		),
	/**
	 *
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		let guild = await fetchGuild(interaction.guildId);
		let tournament = guild.active_tournament;

		let team = await prisma.team.findFirst({
			where: {
				Members: {
					some: {
						discordId: interaction.options.getUser("user").id,
					},
				},
				tournamentId: tournament.id,
			},
		});

		if (!team) {
			let embed = new EmbedBuilder()
				.setDescription(`**Err**: That user is not in a team.`)
				.setColor(Colors.Red);
			await interaction.editReply({ embeds: [embed] });
			return;
		}

		await prisma.userInTeam.delete({
			where: {
				discordId_teamId: {
					teamId: team.id,
					discordId: interaction.options.getUser("user").id,
				},
			},
		});

		let teamMembers = await prisma.userInTeam.findMany({
			where: {
				teamId: team.id,
			},
		});

		if (teamMembers.length === 0) {
			await prisma.team.delete({
				where: {
					id: team.id,
				},
			});

			let embed = new EmbedBuilder()
				.setTitle("Team deleted")
				.setDescription(`**${team.name}** has been deleted.`)
				.setColor(tournament.color)
				.setThumbnail(team.icon_url);

			await interaction.editReply({ embeds: [embed] });
			return;
		}

		let embed = new EmbedBuilder()
			.setTitle("Roster Changed")
			.setDescription(`**${team.name}**`)
			.setColor(team.color || "#F88000")
			.setThumbnail(team.icon_url);

		let members = await prisma.user.findMany({
			where: {
				InTeams: {
					some: {
						teamId: team.id,
					},
				},
			},
		});
		let teamString = "";
		for (let i = 0; i < members.length; i++) {
			let member = members[i];
			let rank = member.osu_pp_rank;
			if (rank == null) {
				rank = "Unranked";
			} else {
				rank = `${rank.toLocaleString()}`;
			}

			teamString += `
			:flag_${member.osu_country_code.toLowerCase()}: ${
				member.osu_username
			} (#${rank})`;
			if (i == 0) {
				teamString += " **(c)**";
			}
		}
		embed.addFields({ name: "Roster", value: teamString });

		await interaction.editReply({
			content: null,
			embeds: [embed],
			components: [],
		});
	},
};
