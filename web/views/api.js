

module.exports = (client) =>{
  //API root
  client.app.get('/api', (req,res)=>{
    res.json({ botStats:client.user})
  })
  
  //COMMAND
  client.app.get('/api/commands', (req,res)=>{
    const COMMANDS = client.commands.array();
    let command_array = []
    COMMANDS.forEach(c => {
      command_array.push({
      name:c.name,
      aliases:c.aliases,
      description:`${c.description}`.replace(/{{p}}/gm,process.env.BOT_PREFIX),
      example:`${process.env.BOT_PREFIX}${c.name} ${c.example}`,
      details:`${c.details}`.replace(/{{p}}/gm,process.env.BOT_PREFIX),
      ownerOnly:c.ownerOnly,
      disabled:c.disabled,
      userPermission:c.userPerms,
      cooldown:c.cooldown
      })
    })
    res.json({ commands:command_array})
  })
  
  
}