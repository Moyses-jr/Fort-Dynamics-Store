// src/shared/utils/email.ts
import { Resend } from 'resend'
import { env } from '../../config/env'
import { logger } from '../../config/logger'

const resend = new Resend(env.RESEND_API_KEY)

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  try {
    await resend.emails.send({
      from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
      to,
      subject,
      html,
    })
  } catch (error) {
    logger.error('Erro ao enviar email:', error)
    // Não lança erro — falha no email não deve derrubar o fluxo principal
  }
}

// Templates de email

export function orderConfirmationEmail(params: {
  userName: string
  orderId: string
  total: number
  items: Array<{ name: string; quantity: number; unitPrice: number }>
}): string {
  const itemsHtml = params.items
    .map(
      item => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}x</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
          R$ ${item.unitPrice.toFixed(2)}
        </td>
      </tr>
    `,
    )
    .join('')

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
      <div style="background: #000; padding: 24px; text-align: center;">
        <h1 style="color: #F5C542; margin: 0; font-size: 28px;">FD STORE</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #000;">Pedido confirmado! 🎉</h2>
        <p>Olá, <strong>${params.userName}</strong>!</p>
        <p>Seu pedido <strong>#${params.orderId.slice(0, 8).toUpperCase()}</strong> foi recebido e está sendo processado.</p>
        
        <h3 style="border-bottom: 2px solid #F5C542; padding-bottom: 8px;">Itens do pedido</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px 0; color: #666;">Produto</th>
              <th style="text-align: center; padding: 8px 0; color: #666;">Qtd</th>
              <th style="text-align: right; padding: 8px 0; color: #666;">Valor</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        
        <div style="margin-top: 16px; text-align: right;">
          <strong style="font-size: 20px; color: #F5C542;">
            Total: R$ ${params.total.toFixed(2)}
          </strong>
        </div>
        
        <p style="color: #666; margin-top: 32px;">
          Você receberá atualizações sobre o status do seu pedido por email.
        </p>
      </div>
      <div style="background: #f5f5f5; padding: 16px; text-align: center; color: #666; font-size: 12px;">
        &copy; 2025 FD Store | Fort Dynamic. Todos os direitos reservados.
      </div>
    </div>
  `
}

export function passwordResetEmail(params: { userName: string; resetUrl: string }): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #000; padding: 24px; text-align: center;">
        <h1 style="color: #F5C542; margin: 0;">FD STORE</h1>
      </div>
      <div style="padding: 32px;">
        <h2>Redefinição de senha</h2>
        <p>Olá, <strong>${params.userName}</strong>!</p>
        <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${params.resetUrl}"
             style="background: #F5C542; color: #000; padding: 14px 32px;
                    text-decoration: none; font-weight: bold; display: inline-block;">
            Redefinir senha
          </a>
        </div>
        <p style="color: #666; font-size: 13px;">
          Este link expira em 1 hora. Se você não solicitou a redefinição, ignore este email.
        </p>
      </div>
    </div>
  `
}
