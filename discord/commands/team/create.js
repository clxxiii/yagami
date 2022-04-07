let firebase = require("../../../firebase");
let {
	CommandInteraction,
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
} = require("discord.js");
let { stripIndents } = require("common-tags");

module.exports = {
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId("select")
				.setPlaceholder("Nothing selected")
				.setMinValues(2)
				.setMaxValues(3)
				.addOptions([
					{
						label: "Select me",
						description: "This is a description",
						value: "first_option",
					},
					{
						label: "You can select me too",
						description: "This is also a description",
						value: "second_option",
					},
					{
						label: "I am also an option",
						description: "This is a description as well",
						value: "third_option",
					},
				])
		);
		await interaction.editReply({ content: "hi", components: [row] });
	},
};
