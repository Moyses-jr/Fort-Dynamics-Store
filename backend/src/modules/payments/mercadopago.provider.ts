// src/modules/payments/mercadopago.provider.ts
import { MercadoPagoConfig, Payment as MpPayment } from 'mercadopago'
import { env } from '../../config/env'
import { PaymentError } from '../../shared/errors/AppError'

const client = new MercadoPagoConfig({
  accessToken: env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 },
})

const mpPayment = new MpPayment(client)

export interface PixResult {
  paymentId: string
  qrCode: string
  qrCodeBase64: string
  ticketUrl: string
  expiresAt: string
}

export interface CardResult {
  paymentId: string
  status: string
  statusDetail: string
}

export interface BoletoResult {
  paymentId: string
  barcodeContent: string
  ticketUrl: string
  expiresAt: string
}

export interface PayerData {
  email: string
  firstName: string
  lastName: string
  cpf?: string
}

export async function createPixPayment(params: {
  orderId: string
  amount: number
  description: string
  payer: PayerData
}): Promise<PixResult> {
  try {
    const response = await mpPayment.create({
      body: {
        transaction_amount: params.amount,
        description: params.description,
        payment_method_id: 'pix',
        notification_url: env.MP_NOTIFICATION_URL,
        external_reference: params.orderId,
        payer: {
          email: params.payer.email,
          first_name: params.payer.firstName,
          last_name: params.payer.lastName,
          identification: params.payer.cpf ? { type: 'CPF', number: params.payer.cpf } : undefined,
        },
        date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
      },
    })

    const txInfo = response.point_of_interaction?.transaction_data

    if (!txInfo?.qr_code || !txInfo.qr_code_base64) {
      throw new PaymentError('Falha ao gerar PIX')
    }

    return {
      paymentId: String(response.id),
      qrCode: txInfo.qr_code,
      qrCodeBase64: txInfo.qr_code_base64,
      ticketUrl: txInfo.ticket_url ?? '',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    }
  } catch (error) {
    if (error instanceof PaymentError) throw error
    throw new PaymentError('Erro ao criar pagamento PIX')
  }
}

export async function createCardPayment(params: {
  orderId: string
  amount: number
  description: string
  token: string
  installments: number
  paymentMethodId: string
  issuerId?: number
  payer: PayerData
}): Promise<CardResult> {
  try {
    const response = await mpPayment.create({
      body: {
        transaction_amount: params.amount,
        description: params.description,
        token: params.token,
        installments: params.installments,
        payment_method_id: params.paymentMethodId,
        issuer_id: params.issuerId,
        notification_url: env.MP_NOTIFICATION_URL,
        external_reference: params.orderId,
        payer: {
          email: params.payer.email,
          identification: params.payer.cpf ? { type: 'CPF', number: params.payer.cpf } : undefined,
        },
      },
    })

    if (response.status === 'rejected') {
      throw new PaymentError(
        `Pagamento recusado: ${response.status_detail ?? 'motivo desconhecido'}`,
      )
    }

    return {
      paymentId: String(response.id),
      status: response.status ?? 'pending',
      statusDetail: response.status_detail ?? '',
    }
  } catch (error) {
    if (error instanceof PaymentError) throw error
    throw new PaymentError('Erro ao processar cartão')
  }
}

export async function createBoletoPayment(params: {
  orderId: string
  amount: number
  description: string
  payer: PayerData & {
    address: { street: string; number: string; city: string; state: string; zipCode: string }
  }
}): Promise<BoletoResult> {
  try {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 3) // 3 dias

    const response = await mpPayment.create({
      body: {
        transaction_amount: params.amount,
        description: params.description,
        payment_method_id: 'bolbradesco',
        notification_url: env.MP_NOTIFICATION_URL,
        external_reference: params.orderId,
        date_of_expiration: expiresAt.toISOString(),
        payer: {
          email: params.payer.email,
          first_name: params.payer.firstName,
          last_name: params.payer.lastName,
          identification: params.payer.cpf ? { type: 'CPF', number: params.payer.cpf } : undefined,
          address: {
            street_name: params.payer.address.street,
            street_number: params.payer.address.number,
            city: params.payer.address.city,
            federal_unit: params.payer.address.state,
            zip_code: params.payer.address.zipCode,
          },
        },
      },
    })

    return {
      paymentId: String(response.id),
      barcodeContent: response.transaction_details?.barcode?.content ?? '',
      ticketUrl: response.transaction_details?.external_resource_url ?? '',
      expiresAt: expiresAt.toISOString(),
    }
  } catch (error) {
    if (error instanceof PaymentError) throw error
    throw new PaymentError('Erro ao gerar boleto')
  }
}
