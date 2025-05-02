import { Client, VoiceState } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'
import yargs from 'yargs'

function getJoinedVC(token: string, userId: string): Promise<VoiceState[]> {
  const isDev = process.env.NODE_ENV === 'development'

  return new Promise((resolve) => {
    const client = new Client({
      intents: ['Guilds', 'GuildVoiceStates'],
    })
    client.on('ready', () => {
      ;(async () => {
        const result: VoiceState[] = []
        const guilds = await client.guilds.fetch()
        for (const oauth2Guild of guilds.values()) {
          const guild = await oauth2Guild.fetch()
          const voiceState = guild.voiceStates.cache.get(userId)
          if (!voiceState) continue
          result.push(voiceState)
        }
        await client.destroy()
        resolve(result)
      })().catch((error: unknown) => {
        if (isDev) {
          console.error('Error in ready event handler', error)
        }
        resolve([])
      })
    })

    client.login(token).catch((error: unknown) => {
      if (isDev) {
        console.error('Failed to login', error)
      }
      resolve([])
    })
  })
}

;(async () => {
  const argv = yargs
    .option('userId', {
      demandOption: true,
    })
    .help()
    .parseSync()

  // eslint-disable-next-line unicorn/prefer-module
  const dirname = __dirname
  const tokens: string[] = JSON.parse(
    fs.readFileSync(path.join(dirname, '/tokens.json')).toString(),
  )
  const targetServers: string[] = JSON.parse(
    fs.readFileSync(path.join(dirname, '/targetServers.json')).toString(),
  )
  const userId = argv.userId as string

  const promises = tokens.map(async (token) => await getJoinedVC(token, userId))
  const results = await Promise.all(promises)

  const joinedVCs: VoiceState[] = []
  for (const ret of results) {
    joinedVCs.push(
      ...ret.filter(
        (vc) => !joinedVCs.some((vc2) => vc2.channelId === vc.channelId),
      ),
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
        }),
    ),
  )
})()
