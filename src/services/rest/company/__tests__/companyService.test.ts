import { ApiError } from '@/helpers/API'
import { CompanyModel, CompanyRequest } from '@/model'

import {
  allCompanies,
  companyById,
  deleteCompany,
  saveCompany,
  updateCompany
} from '../companyService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

const company: CompanyModel = {
  id: 3,
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

const companyRequest: CompanyRequest = {
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

describe('companyService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('allCompanies devuelve la lista de empresas', async () => {
    mockFetch.mockResolvedValue(jsonResponse([company]))

    const result = await allCompanies()

    expect(result).toEqual([company])
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/template/company')
    )
  })

  it('companyById pide la empresa por su id', async () => {
    mockFetch.mockResolvedValue(jsonResponse(company))

    const result = await companyById(3)

    expect(result).toEqual(company)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/template/company/3')
    )
  })

  it('saveCompany envía un POST con la comuna como objeto', async () => {
    mockFetch.mockResolvedValue(jsonResponse(company))

    await saveCompany(companyRequest)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/template/company'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(companyRequest)
      })
    )
  })

  it('updateCompany envía un PUT al id de la empresa', async () => {
    mockFetch.mockResolvedValue(jsonResponse(company))

    await updateCompany(3, companyRequest)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/template/company/3'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(companyRequest)
      })
    )
  })

  it('deleteCompany envía un DELETE al id de la empresa', async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 200 }))

    await deleteCompany(3)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/template/company/3'),
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('companyById lanza un error 404 si la empresa no existe', async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 404 }))

    await expect(companyById(999)).rejects.toMatchObject({ status: 404 })
    await expect(companyById(999)).rejects.toBeInstanceOf(ApiError)
  })
})
