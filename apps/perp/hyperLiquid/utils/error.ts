export class Error extends globalThis.Error {
  constructor(message?: string) {
    super(message)
    this.name = 'Error'
  }
}

export class ClientError extends Error {
  statusCode: number

  errorCode: string | null

  errorMessage: string

  header: Record<string, string>

  errorData?: any

  constructor(
    statusCode: number,
    errorCode: string | null,
    errorMessage: string,
    header: Record<string, string>,
    errorData?: any,
  ) {
    super(errorMessage)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.errorMessage = errorMessage
    this.header = header
    this.errorData = errorData
  }
}

export class ServerError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}
