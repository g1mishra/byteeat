import { Resend } from "resend"

import { EmailTemplate } from "@/components/email-template"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    const { error } = await resend.emails.send({
      from: "ByteEat <onboarding@resend.dev>",
      to: "byteeat.in@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      react: EmailTemplate({ name, email, message }),
      replyTo: email,
    })

    if (error) {
      return Response.json({ error }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Failed to send email" }, { status: 500 })
  }
}
