import { ValidationError } from 'yup'

import { CitySchema } from '../city'

const validationErrors = async (values: object) => {
  try {
    await CitySchema.validate(values, { abortEarly: false })
    return []
  } catch (error) {
    return (error as ValidationError).errors
  }
}

describe('CitySchema', () => {
  it('acepta una ciudad con nombre y región', async () => {
    expect(await validationErrors({ name: 'Santiago', regionId: 13 })).toEqual(
      []
    )
  })

  it('exige el nombre y la región', async () => {
    const errors = await validationErrors({ name: '' })

    expect(errors).toContain('El nombre es obligatorio')
    expect(errors).toContain('Selecciona una región')
  })

  it('no acepta un nombre con solo espacios', async () => {
    expect(await validationErrors({ name: '   ', regionId: 13 })).toContain(
      'El nombre es obligatorio'
    )
  })

  it('no acepta un nombre de más de 200 caracteres', async () => {
    expect(
      await validationErrors({ name: 'a'.repeat(201), regionId: 13 })
    ).toContain('Máximo 200 caracteres')
  })
})
