import { precacheAndRoute } from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const origin = self.location.origin
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: 'window' })
      const existing = clients.find(c => c.url.startsWith(origin))
      if (existing) {
        await existing.focus()
      } else {
        await self.clients.openWindow('/')
      }
    })()
  )
})
