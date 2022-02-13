import { Client, Intents, VoiceState } from 'discord.js'
import * as fs from 'fs'
import path from 'path'
import * as yargs from 'yargs'

function getJoinedVC(token: string, userId: string): Promise<VoiceState[]> {
  return new Promise((resolve, reject) => {
    const client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
    })
    client.on('ready', () => {
      const result: VoiceState[] = []
      for (const guild of client.guilds.cache.values()) {
        const temp = guild.voiceStates.cache.get(userId)
        if (!temp) continue
        result.push(temp)
      }
      client.destroy()
      resolve(result)
    })

    client.login(token).catch(reject)
  })
}

;(async () => {
  const argv = yargs
    .option('userId', {
      demandOption: true,
    })
    .help()
    .parseSync()

  const tokens: string[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, '/tokens.json')).toString()
  )
  const targetServers = JSON.parse(
    fs.readFileSync(path.join(__dirname, '/targetServers.json')).toString()
  )
  const userId = argv.userId as string

  const promises = await Promise.all(
    tokens.map((token) => getJoinedVC(token, userId))
  )

  const joinedVCs: VoiceState[] = []
  for (const ret of promises) {
    joinedVCs.push(
      ...ret.filter(
        (vc) => !joinedVCs.some((vc2) => vc2.channelId === vc.channelId)
      )
    )
  }
  process.stdout.write(
    JSON.stringify(
      joinedVCs
        .filter((vc) => targetServers.includes(vc.guild.id))
        .map((vc) => {
          return {
            channelName: vc.channel?.name,
            channelId: vc.channelId,
            guildName: vc.guild.name,
            guildId: vc.guild.id,
          }
        })
    )
  )
})()
