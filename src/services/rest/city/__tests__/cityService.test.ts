import { CityModel } from '@/model'

import { allCities, saveCity } from '../cityService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

describe('cityService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('allCities devuelve la lista de ciudades', async () => {
    const cities: CityModel[] = [
      { id: 1, name: 'Santiago', region: { id: 13, name: 'Metropolitana' } }
    ]
    mockFetch.mockResolvedValue(jsonResponse(cities))

    const result = await allCities()

    expect(result).toEqual(cities)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/city'))
  })

  it('saveCity envía un POST con la ciudad en el body', async () => {
    const newCity = { name: 'Santiago', region: { id: 13 } }
    mockFetch.mockResolvedValue(jsonResponse({ id: 10, ...newCity }))

    await saveCity(newCity)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/city'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newCity)
      })
    )
  })
})