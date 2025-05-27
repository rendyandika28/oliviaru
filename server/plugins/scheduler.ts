import { useScheduler } from '#scheduler'
import { updateExpiredAccesses } from '~/lib/update-expired-access'

export default defineNitroPlugin(() => {
  // Prevent scheduler from running during build
  if (process.env.APP_ENV === 'build') {
    console.log('[scheduler] Skipping scheduler during build')
    return
  }

  const scheduler = useScheduler()

  scheduler.run(async () => {
    console.log('[scheduler] Running expireUserAccesses job...')
    await updateExpiredAccesses()
  }).cron('0 0 * * *') // Runs every day at midnight
})
