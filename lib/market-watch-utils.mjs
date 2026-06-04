export const MARKET_WATCH_STALE_HOURS = 24

export function isMarketWatchStale(updated, now = new Date(), staleHours = MARKET_WATCH_STALE_HOURS) {
  const updatedDate = new Date(updated)
  const nowDate = now instanceof Date ? now : new Date(now)
  if (Number.isNaN(updatedDate.getTime()) || Number.isNaN(nowDate.getTime())) return true
  return nowDate.getTime() - updatedDate.getTime() > staleHours * 60 * 60 * 1000
}
