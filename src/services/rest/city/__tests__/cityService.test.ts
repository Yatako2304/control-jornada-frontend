import { ApiError } from '@/helpers/API'
import { CityModel, CityRequest } from '@/model'

import {
  allCities,
  cityById,
  deleteCity,
  saveCity,
  updateCity
} from '../cityService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

const city: CityModel = {
  id: 5,
  name: 'Santiago',
  region: { id: 13, name: 'Metropolitana' }
}

const cityRequest: CityRequest = {
  name: 'Santiago',
  region: { id: 13 }
}

describe('cityService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('allCities devuelve la lista de ciudades', async () => {
    mockFetch.mockResolvedValue(jsonResponse([city]))

    const result = await allCities()

    expect(result).toEqual([city])
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/template/city')
    )
  })

  it('cityById pide la ciudad por su id', async () => {
    mockFetch.mockResolvedValue(jsonResponse(city))

    const result = await cityById(5)

    expect(result).toEqual(city)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/template/city/5')
    )
  })

  it('saveCity envía un POST con la región como objeto', async () => {
    mockFetch.mockResolvedValue(jsonResponse(city))

    await saveCity(cityRequest)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/template/city'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(cityRequest)
      })
    )
  })

  it('updateCity envía un PUT al id de la ciudad', async () => {
    mockFetch.mockResolvedValue(jsonResponse(city))

    await updateCity(5, cityRequest)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/template/city/5'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(cityRequest)
      })
    )
  })

  it('deleteCity envía un DELETE al id de la ciudad', async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 200 }))

    await deleteCity(5)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/template/city/5'),
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('cityById lanza un error 404 si la ciudad no existe', async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 404 }))

    await expect(cityById(999)).rejects.toMatchObject({ status: 404 })
    await expect(cityById(999)).rejects.toBeInstanceOf(ApiError)
  })
})
