const Discord = require('discord.js-selfbot-v13');
const cron = require('node-cron');
const { Webhook } = require("dis-logs")
require('dotenv').config();

const log = new Webhook(process.env.WEBHOOK);

const client = new Discord.Client({
	checkUpdate: false,
	interactionModalCreate: true,
	syncStatus: true,
});

let timeLeft = 0; // Countdown for the next cron job in seconds

client.on('ready', async () => {
	log.console(`Bot ready logged as: ${client.user.username}(${client.user.id})!`);
});

cron.schedule('*/9 * * * *', async () => {
	timeLeft = 9; // Reset the countdown

	executeInteraction();
});

client.on('interactionModalCreate', async (modal) => {
	if (modal.title !== 'Twitch Followers') return;
	log.console(`Step 3 | Modal recived.`);
	modal.reply({
		data: [
			{
				customId: modal.components[0].components[0].customId,
				value: process.env.TARGET_ACCOUNT,
			},
			{
				customId: modal.components[1].components[0].customId,
				value: '1000',
			},
		],
	});
	log.console(`Step 4 | Modal replied with the data.`);

	client.user.setActivity(await new Discord.CustomStatus().setState(''));
	log.console(`Step 5 | Cleared user status.`);
});

const executeInteraction = async function () {
	log.console(`Step 0 | Starting execution!`);
	await client.user.setStatus('online');
	 await client.user.setActivity(await new Discord.CustomStatus().setState('discord.gg/zoom'));
	log.console(`Step 1 | Changed user status`);

	setTimeout(() => { }, 3000)

	const channel = await client.channels.cache.get('1123745575771312198');
	if (!channel)
		log.error("Could not fetch the channel, i might have been banned or channel id changed.")

	const messages = await channel.messages.fetch(); // fetch("channelid")
	let message = messages.filter((message) => { return message.content.includes('Twitch'); });
	message = message.first()

	if (message)
		log.error("Could not fetch message id")

	await message.clickButton();
	log.console(`Step 2 | Interaction Created with the button.`);
};

// Countdown interval
setInterval(() => {
	timeLeft--;
	if (timeLeft >= 0) {
		log.console(`Cooldown | Next cron job in ${timeLeft} minutes`)
	}
}, 1000 * 60);

client.login(process.env.DISCORD_TOKEN);
