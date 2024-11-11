import * as React from "react"

interface EmailTemplateProps {
  name: string
  email: string
  message: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ name, email, message }) => (
  <div>
    <h1>New Contact Form Submission</h1>
    <div>
      <p>
        <strong>Name:</strong> {name}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Message:</strong>
      </p>
      <p style={{ whiteSpace: "pre-wrap" }}>{message}</p>
    </div>
  </div>
)
