import { ValidationError } from 'yup'

import { CompanySchema } from '../company'

const validCompany = {
  communeId: 7,
  code: '76000001-1',
  name: 'Bennu SA',
  address: 'Av. Siempre Viva 123'
}

const validationErrors = async (values: object) => {
  try {
    await CompanySchema.validate(values, { abortEarly: false })
    return []
  } catch (error) {
    return (error as ValidationError).errors
  }
}

describe('CompanySchema', () => {
  it('acepta una empresa solo con los campos obligatorios', async () => {
    expect(await validationErrors(validCompany)).toEqual([])
  })

  it('exige comuna, código, nombre y dirección', async () => {
    const errors = await validationErrors({ code: '', name: '', address: '' })

    expect(errors).toContain('Selecciona una comuna')
    expect(errors).toContain('El código es obligatorio')
    expect(errors).toContain('El nombre es obligatorio')
    expect(errors).toContain('La dirección es obligatoria')
  })

  it('no acepta un correo inválido', async () => {
    expect(
      await validationErrors({ ...validCompany, email: 'correo-malo' })
    ).toContain('El correo no es válido')
  })

  it('no acepta un código de más de 20 caracteres', async () => {
    expect(
      await validationErrors({ ...validCompany, code: '1'.repeat(21) })
    ).toContain('Máximo 20 caracteres')
  })

  it('deja los opcionales vacíos y los switches en false por defecto', async () => {
    const company = await CompanySchema.validate(validCompany)

    expect(company).toMatchObject({
      phone: '',
      alias: '',
      giro: '',
      email: '',
      geolocation: false,
      selfie: false,
      lag: false
    })
  })
})
