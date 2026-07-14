// src/shared/utils/cep.ts
import { AppError } from '../errors/AppError'

interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export interface CepResult {
  zipCode: string
  street: string
  neighborhood: string
  city: string
  state: string
}

export async function fetchCep(cep: string): Promise<CepResult> {
  const cleanCep = cep.replace(/\D/g, '')

  if (cleanCep.length !== 8) {
    throw new AppError('CEP inválido', 400, 'INVALID_CEP')
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)

  if (!response.ok) {
    throw new AppError('Erro ao consultar CEP', 502, 'CEP_SERVICE_ERROR')
  }

  const data = (await response.json()) as ViaCepResponse

  if (data.erro) {
    throw new AppError('CEP não encontrado', 404, 'CEP_NOT_FOUND')
  }

  return {
    zipCode: data.cep,
    street: data.logradouro,
    neighborhood: data.bairro,
    city: data.localidade,
    state: data.uf,
  }
}
