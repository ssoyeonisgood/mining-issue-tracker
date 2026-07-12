import api from './client'
import type { Equipment, Site } from '../types/issue'

export async function getSites(): Promise<Site[]> {
  const { data } = await api.get<Site[]>('/api/sites')
  return data
}

export async function getEquipment(siteId?: number): Promise<Equipment[]> {
  const { data } = await api.get<Equipment[]>('/api/equipment', {
    params: siteId === undefined ? undefined : { siteId },
  })
  return data
}
