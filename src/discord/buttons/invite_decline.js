const { MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
	data: new MessageButton()
		.setCustomId("invite_decline")
		.setLabel("Decline")
		.setStyle("PRIMARY"),
	async execute(interaction, command) {
		let embed = new MessageEmbed()
			.setTitle("✅ Invite Declined")
			.setColor("RED");
		interaction.update({ content: null, embeds: [embed], components: [] });
	},
};
