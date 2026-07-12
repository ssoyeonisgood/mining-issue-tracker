export const SITES = [
  { id: 1, name: 'Site A', location: 'Welshpool, WA' },
  { id: 2, name: 'Site B', location: 'Karratha, WA' },
] as const

export const EQUIPMENT = [
  { id: 1, name: 'Crusher #3', type: 'Crusher', siteId: 1 },
  { id: 2, name: 'Conveyor Belt #1', type: 'Conveyor', siteId: 1 },
  { id: 3, name: 'Drill Rig #2', type: 'Drill', siteId: 2 },
] as const

export const CATEGORIES = [
  'Equipment Failure',
  'Safety',
  'Maintenance',
  'Operations',
] as const
