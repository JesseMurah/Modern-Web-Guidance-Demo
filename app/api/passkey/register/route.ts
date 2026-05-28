// In-memory store — replace with a real database in production
const credentials = new Map<string, unknown>()

export async function POST(request: Request) {
  const body = await request.json()
  const { email, credential } = body

  if (!email || !credential?.id) {
    return Response.json({ error: "Missing email or credential" }, { status: 400 })
  }

  credentials.set(email, credential)

  return Response.json({ success: true })
}
