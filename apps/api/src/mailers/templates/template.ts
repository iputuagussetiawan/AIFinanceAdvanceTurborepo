export const verifyEmailTemplate = (url: string, brandColor: string = '#2563EB') => ({
    subject: 'Action Required: Verify your AI Finance Assistant account',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 40px 10px;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb;">
              
              <tr>
                <td style="padding: 32px 40px; text-align: center; border-bottom: 1px solid #f3f4f6;">
                  <div style="font-size: 24px; font-weight: 800; color: ${brandColor};">AI Finance Assistant</div>
                  <div style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Premium Finance Assistant</div>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px;">
                  <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px 0;">Final step to join us!</h1>
                  <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
                    Hi there,<br><br>
                    Thank you for signing up for AI Finance Assistant. To ensure your account is secure and to start applying for jobs, please confirm your email address below.
                  </p>
                  
                  <div style="text-align: center; margin-bottom: 32px;">
                    <a href="${url}" style="background-color: ${brandColor}; color: #ffffff; padding: 16px 32px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 10px; display: inline-block;">
                      Confirm My Account
                    </a>
                  </div>

                  <p style="font-size: 14px; color: #6b7280; background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 0;">
                    <strong>Why did I receive this?</strong> This is a standard security check for new members of the AI Finance Assistant community.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 32px 40px; background-color: #fafafa; text-align: center; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
                  <p style="margin: 0 0 16px 0; font-size: 14px; color: #4b5563;">
                    <a href="#" style="color: ${brandColor}; text-decoration: none;">Help Center</a> &nbsp;&bull;&nbsp; 
                    <a href="#" style="color: ${brandColor}; text-decoration: none;">Privacy Policy</a> &nbsp;&bull;&nbsp; 
                    <a href="#" style="color: ${brandColor}; text-decoration: none;">Terms of Service</a>
                  </p>
                  
                  <p style="font-size: 12px; color: #9ca3af; line-height: 1.5; margin: 0;">
                    AI Finance Assistant Inc. | 123 AG-DEV, Indonesia 018989<br>
                    If you didn't create an account, <a href="#" style="color: #9ca3af;">unsubscribe here</a>.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
})

export const passwordResetTemplate = (url: string, brandColor: string = '#2563EB') => ({
    subject: 'Reset Your Password - AI Finnace Assistant',
    // Plain text version for better deliverability and accessibility
    text: `We received a request to reset your password. Click the following link to proceed: ${url}`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 40px 10px;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;">
              
              <tr>
                <td style="padding: 32px 40px; text-align: center; border-bottom: 1px solid #f3f4f6;">
                  <div style="font-size: 24px; font-weight: 800; color: ${brandColor};">AI Finnace Assistant</div>
                  <div style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Security Services</div>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px;">
                  <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px 0;">Reset your password</h1>
                  <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
                    We received a request to reset the password for your AI Finnace Assistant account. No worries, it happens to the best of us! Click the button below to set a new one.
                  </p>
                  
                  <div style="text-align: center; margin-bottom: 32px;">
                    <a href="${url}" style="background-color: ${brandColor}; color: #ffffff; padding: 16px 32px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 10px; display: inline-block;">
                      Reset Password
                    </a>
                  </div>

                  <p style="font-size: 14px; color: #6b7280; background-color: #fef2f2; border: 1px solid #fee2e2; padding: 16px; border-radius: 8px; margin: 0;">
                    <strong>Security Note:</strong> This link will expire in 60 minutes. If you didn't request this, please ignore this email or contact support if you're concerned about your account security.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 32px 40px; background-color: #fafafa; text-align: center; border-top: 1px solid #f3f4f6;">
                  <p style="margin: 0 0 16px 0; font-size: 14px; color: #4b5563;">
                    <a href="#" style="color: ${brandColor}; text-decoration: none;">Help Center</a> &nbsp;&bull;&nbsp; 
                    <a href="#" style="color: ${brandColor}; text-decoration: none;">Security Tips</a>
                  </p>
                  <p style="font-size: 12px; color: #9ca3af; line-height: 1.5; margin: 0;">
                    AI Finnace Assistant Inc. &bull; 123 Tech Lane, SF.<br>
                    &copy; 2026 AI Finnace Assistant. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
})
