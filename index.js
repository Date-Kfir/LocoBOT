const Discord = require('discord.js');
const client = new Discord.Client();
const botconfig = require("./botconfig.json");


client.on('ready', () => {
  console.log(`LocoBOT is Ready!`);
client.user.setActivity(`😈${client.users.size} משוגעים בשרת😈`);
});

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;


  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  //welcome join
  client.on('guildMemberAdd', member => {
  client.user.setActivity(`${client.users.size} משוגעים בשרת`);
    var welcomechannel = client.channels.get('');
    if (!welcomechannel) return;
    const joinEmbed = new Discord.RichEmbed()
  .setThumbnail(member.user.avatarURL)
  .setDescription(`!ברוך הבא\n ${member}\nאתה משוגע מספר ${member.guild.memberCount}!`);
  return welcomechannel.send(joinEmbed)
  });

if(cmd === `${prefix}youtube`){
message.reply("https://www.youtube.com/channel/UC7XnvNqghwVw-VSw8qhPU2wg")
}

  if (cmd === `${prefix}help`){
  const helpembed = new Discord.RichEmbed()
    .setTitle("פקודות השרת")
    .setColor("#00f6ff")
    .setDescription("\nפקודות רגילות:\n`?helpme`\n`?report`\n`?serverinfo`");
  message.author.send(helpembed)
  message.reply("קיבלת פקודות בפרטי! <:yes:493809232064544778>")
  }

  if (cmd === `${prefix}locostaff`){
  const helpembed = new Discord.RichEmbed()
    .setTitle("פקודות לצוות השרת")
    .setColor("#00f6ff")
    .setDescription("פקודות לצוות:\n`?kick` `?ban`\n`=mute`\n`?tempmute (לא זמין כעט)`\n`?unmute`\n`?say`");
  message.author.send(helpembed)
  if(!message.member.roles.find("name", "Staff")) return message.reply("אתה לא יכול לעשות את הפקודה היא רק לחברי צוות");
  message.reply("צוות יקר הפקודות בפרטי🎓 <:yes:493809232064544778>")
  }


if(cmd === `${prefix}kick`){

  //!kick @daeshan askin for it

  let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!kUser) return message.channel.send("❌לא מצא את המשתמש");
  let kReason = args.join(" ").slice(22);
  if(!message.member.roles.find("name", "Staff")) return message.reply("!אתה לא יכול לתת לו קיק ");


  let kickEmbed = new Discord.RichEmbed()
  .setDescription("~קיק~")
  .setColor("#e56b00")
  .addField("משתמש שקיבל קיק", `${kUser} with ID ${kUser.id}`)
  .addField("קיבל קיק על ידי", `<@${message.author.id}> with ID ${message.author.id}`)
  .addField("קיבל קיק מ", message.channel)
  .addField("שעה", message.createdAt)
  .addField("סיבה", kReason);

  let kickChannel = message.guild.channels.find(`name`, "reports");
  if(!kickChannel) return message.channel.send("חדר reports לא נמצא.");

  message.guild.member(kUser).kick(kReason);
  kickChannel.send(kickEmbed);

  return;
}

if(cmd === `${prefix}mute`){
  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!tomute) return message.reply("❌לא נמצא משתמש.");
  if(!message.member.roles.find("name", "Staff")) return message.reply("Can't mute them!");
  let muterole = message.guild.roles.find(`name`, "Muted");
  //start of create role
  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "Muted",
        color: "#818386",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  //end of create role
  await(tomute.addRole(muterole.id));
  message.channel.send(`<@${tomute.id}> כרגע קיבל מיוט✔️`);

 try{
   await tomute.send(`❌היי קיבלת מיוט אם אתה סבור שחלה טעות נא לפנות לצוות השרת❌`)
 }catch(e){
   message.channel.send(`A user has been muted... but their DMs are locked.`)
 }
}

if(cmd === `${prefix}tempmute`){
let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
if(!tomute) return message.reply("לא נמצא משתמש.");
if(!message.member.roles.find("name", "Staff")) return message.reply("Can't mute them!");
let muterole = message.guild.roles.find(`name`, "Muted");
//start of create role
if(!muterole){
  try{
    muterole = await message.guild.createRole({
      name: "Muted",
      color: "#818386",
      permissions:[]
    })
    message.guild.channels.forEach(async (channel, id) => {
      await channel.overwritePermissions(muterole, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
      });
    });
  }catch(e){
    console.log(e.stack);
  }
}
//end of create role
let mutetime = args[1];
if(!mutetime) return message.reply("You didn't specify a time!");

await(tomute.addRole(muterole.id));
message.reply(`<@${tomute.id}> Muted for ${ms(ms(mutetime))}`);

setTimeout(function(){
  tomute.removeRole(muterole.id);
  message.channel.send(`<@${tomute.id}> has been unmuted!`);
}, ms(mutetime));
}

if(cmd === `${prefix}unmute`){
let unmuteError = new Discord.RichEmbed()
.setTitle("Error")
.setColor('#444444')
.addField("Command:", '?unmute  [@user]')
.addField("Missed Args:", '❌ You need `Mention a User`')
.addField("Example:", '?unmute <@473438863961096202>');

let member = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
if(!member) return message.channel.sendMessage(unmuteError);
if(!message.member.roles.find("name", "Staff")) return message.channel.send("❌ You dont have the premission to unmute")

let role = message.guild.roles.find(r => r.name === "Muted");

if(!role || !member.roles.has(role.id)) return message.channel.sendMessage("❌המשתמש הזה לא במיוט❌");

await member.removeRole(role);

message.channel.send(`✔️ **${member.user.username}#${member.user.discriminator}✔️המיוט בוטל**`);

let str = `<@!`+member.id+`>`;

let id = str.replace(/[<@!>]/g, '');

bot.fetchUser(id)
.then(user => {user.send(`קיבלת מיוט ב🔕 ${message.guild.name}`)})
}


if(cmd === `${prefix}ban`){
  let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!bUser) return message.channel.send("לא מצא את המשתמש");
  let bReason = args.join(" ").slice(22);
if(!message.member.roles.find("name", "Staff")) return message.reply("!אתה לא יכול לתת באן");

  let banEmbed = new Discord.RichEmbed()
  .setDescription("~באן~")
  .setColor("#bc0000")
  .addField("משתמש שקיבל באן", `${bUser} with ID ${bUser.id}`)
  .addField("קיבל באן על ידי", `<@${message.author.id}> with ID ${message.author.id}`)
  .addField("קיבל באן מ", message.channel)
  .addField("שעה", message.createdAt)
  .addField("סיבה", bReason);

  let incidentchannel = message.guild.channels.find(`name`, "reports");
  if(!incidentchannel) return message.channel.send("חדר reports לא נמצא.");

  message.guild.member(bUser).ban(bReason);
  incidentchannel.send(banEmbed);


  return;
}

if(cmd === `${prefix}warn`){

  //!warn @user this is the reason
  let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!rUser) return message.channel.send("?warn [user] [reason]");
  let rreason = args.join(" ").slice(22);
  if(!message.member.roles.find("name", "Staff")) return message.channel.send("You cant to use this command!")
  if(rUser.roles.find("name", "Staff")) return message.channel.send("Cant warn him!");

  message.channel.send(`האזהרה התקבלה בהצלחה.`);

  let reportEmbed = new Discord.RichEmbed()
  .setDescription("דיווחים")
  .setColor("#1b8fbd")
  .addField("User", `${rUser}`)
  .addField("Staff", `${message.author}`)
  .addField("Reason", rreason);


  let reportschannel = message.guild.channels.find(`name`, "reports");
  if(!reportschannel) return message.channel.send("reports לא נמצא.");


  reportschannel.send(reportEmbed);

  return;
}

if(cmd === `${prefix}helpme`){
  let member = message.author.id
  message.channel.send(`<@&497901117968089090>, <@${member}> צריך עזרה!`)
}

if(cmd === `${prefix}report`){

  //!report @ned this is the reason

  let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!rUser) return message.channel.send("Couldn't find user.");
  let rreason = args.join(" ").slice(22);

  let reportEmbed = new Discord.RichEmbed()
  .setDescription("🔱דיווחים")
  .setColor("#15f153")
  .addField("📡המשתמש שעליו דווחו", `${rUser} with ID: ${rUser.id}`)
  .addField("📝דווח על ידי", `${message.author} with ID: ${message.author.id}`)
  .addField("📫חדר", message.channel)
  .addField("🕐שעה", message.createdAt)
  .addField("⛔️סיבת הדוווח", rreason);

  let reportschannel = message.guild.channels.find(`name`, "reports");
  if(!reportschannel) return message.channel.send("לא מצא את החדר reports.");


  message.delete().catch(O_o=>{});
  reportschannel.send(reportEmbed);

  return;
}




if(message.content.startsWith(prefix + 'serverinfo')) {
const vlevel = ['None', 'Low (Must have verified email)', 'Medium (Must be register for 5 mineuts)', 'High (Need to wait 10 minutes)', 'Very High (Need verified phone on account)']
const members = await message.guild.members.filter(m=> m.presence.status === 'online').size + message.guild.members.filter(m=> m.presence.status === 'idle').size + message.guild.members.filter(m=> m.presence.status === 'dnd').size
message.channel.send(new Discord.RichEmbed()
.setAuthor(`${message.guild.name} [Server Icon URL]`, message.guild.iconURL)
.setURL(message.guild.iconURL)
.addField('🆔 מזהה שרת', message.guild.id, true)
.addField('👑 מנהל השרת', message.guild.owner, true)
.addField('🗺 אזור', message.guild.region, true)
.addField(`👥 אנשים [${message.guild.memberCount}]`, `${members} online` ,true)
.addField(`💬 חדרים`, `**${message.guild.channels.filter(c => c.type === 'category').size}** Categories | **${message.guild.channels.filter(c=> c.type === 'text').size}** Text | **${message.guild.channels.filter(c=> c.type === 'voice').size}** Voice` ,true)
.addField(`💠 רמת אימות`, vlevel[message.guild.verificationLevel] ,true)
.addField(`👔 רולים/תפקדי השרת`, message.guild.roles.size ,true)
.addField(`📆 נפתח ב`, message.guild.createdAt ,true)
)
}

if (cmd === `${prefix}say`){
 		message.delete()
         const embed = new Discord.RichEmbed()
 		.setColor(0xff0000)
 		.setDescription(args.join(" "));
 		message.channel.send({embed})
}

if(cmd === `${prefix}botinfo`){

  let bicon = bot.user.displayAvatarURL;
  let botembed = new Discord.RichEmbed()
  .setDescription("מידע על בוט")
  .setColor("#15f153")
  .setThumbnail(bicon)
  .addField("שם הבוט", bot.user.username)
  .addField("נוצר ב", bot.user.createdAt);

  return message.channel.send(botembed);
}


});

client.login(botconfig.token)
