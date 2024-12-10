import { MAINNET_API_URL } from './constants'
import { ClientError, ServerError } from './utils/error'

export class API {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || MAINNET_API_URL
  }

  public getBaseUrl(): string {
    return this.baseUrl
  }

  async post(urlPath: string, payload: any = {}): Promise<any> {
    const url = `${this.baseUrl}${urlPath}`
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        API.handleException(response) // Updated to call static method
      }

      return await response.json()
    } catch (error) {
      console.error('Network or server error:', error)
      throw new Error('An unexpected error occurred.')
    }
  }

  private static async handleException(response: Response): Promise<void> {
    const statusCode = response.status
    const errorText = await response.text()

    if (statusCode >= 400 && statusCode < 500) {
      let errData: { code?: string; msg?: string; data?: any } | null = null
      try {
        errData = JSON.parse(errorText)
      } catch {
        // If JSON parsing fails, keep errData as null
      }

      throw new ClientError(
        statusCode,
        errData?.code || null,
        errData?.msg || 'Client error occurred',
        response.headers as any,
        errData?.data,
      )
    }

    throw new ServerError(statusCode, errorText || 'Server error occurred')
  }
}
