import { bufferToBase64url } from "@/lib/passkey"

export async function POST(request: Request) {
  const { email } = await request.json()

  // Challenge must be generated server-side — never client-side
  const challenge = crypto.getRandomValues(new Uint8Array(32))

  // Stable user ID derived from email for demo purposes
  const encoder = new TextEncoder()
  const userId = encoder.encode(email)

  return Response.json({
    challenge: bufferToBase64url(challenge.buffer as ArrayBuffer),
    userId: bufferToBase64url(userId.buffer as ArrayBuffer),
  })
}
