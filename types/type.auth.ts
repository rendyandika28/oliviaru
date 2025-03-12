export interface GoogleAuthResponse {
  provider: string
  type: string
  providerAccountId: string
  access_token: string
  expires_at: number
  scope: string
  token_type: string
  id_token: string
}
