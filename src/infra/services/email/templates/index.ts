import Handlebars from 'handlebars'

export const templates = {
  // Notification e-mail for changing password recommendation
  changePasswordRecommendationNotification: Handlebars.compile(`
    <p>Olá, {{name}}!</p>
    <p>Sua conta foi criada com sucesso!</p>
    <p>Para acessar o sistema, utilize a senha temporária abaixo:</p>
    <p><strong>{{password}}</strong></p>
    <p>Recomendamos que você altere sua senha assim que possível.</p>
    <p>Atenciosamente,</p>
    <p>Equipe do {{appName}}</p>
  `),

  // Change password request e-mail
  changePasswordNotification: Handlebars.compile(`
    <p>Olá, {{name}}!</p>
    <p>Recebemos uma solicitação para alterar sua senha.</p>
    <p>Sendo assim, sua senha foi alterada para a senha abaixo:</p>
    <p><strong>{{password}}</strong></p>
    <p>Atenciosamente,</p>
    <p>Equipe do {{appName}}</p>
  `),
}

export function compileTemplate(template: string, data: Record<string, any>) {
  const compiledTemplate = templates[template]

  return compiledTemplate(data)
}
