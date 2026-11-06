import { CompanyModel } from '@/model'

import { allCompanies, saveCompany } from '../companyService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

describe('companyService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('allCompanies devuelve la lista de empresas', async () => {
    const companies: CompanyModel[] = [
      {
        id: 1,
        commune: { id: 7, name: 'El Bosque' },
        code: '76000001-1',
        name: 'Bennu SA',
        address: 'Av. Siempre Viva 123',
        phone: null,
        alias: null,
        giro: null,
        email: null,
        geolocation: true,
        selfie: false,
        lag: true
      }
    ]
    mockFetch.mockResolvedValue(jsonResponse(companies))

    const result = await allCompanies()

    expect(result).toEqual(companies)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/company'))
  })

  it('saveCompany envía un POST con la empresa en el body', async () => {
    const newCompany = {
      commune: { id: 7 },
      code: '76000001-1',
      name: 'Bennu SA',
      address: 'Av. Siempre Viva 123',
      phone: null,
      alias: null,
      giro: null,
      email: null,
      geolocation: true,
      selfie: false,
      lag: true
    }
    mockFetch.mockResolvedValue(jsonResponse({ id: 10, ...newCompany }))

    await saveCompany(newCompany)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/company'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newCompany)
      })
    )
  })
})