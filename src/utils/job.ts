import cron from 'node-cron'
import ticketsService from '~/services/tickets.services'

export const startDailyResetJob = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      await ticketsService.updateDailyQuota()
    } catch (error) {
      console.log('Error running daily reset job:', error)
    }
  })
}
