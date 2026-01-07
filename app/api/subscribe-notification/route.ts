import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ujhobnzcpqlzbszpmuzg.supabase.co"
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqaG9ibnpjcHFsemJzenBtdXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk2MTcyMzUsImV4cCI6MjA0NTE5MzIzNX0.s_aVwRsYBEBuG2b7r3t9fJkL2M1nP4qR5sT6uV7wX8Y"

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json()

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Validate type (events or merch)
    if (!["events", "merch"].includes(type)) {
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if email already subscribed
    const { data: existing } = await supabase
      .from("event_notifications")
      .select("email")
      .eq("email", email)
      .eq("notification_type", type)
      .single()

    if (existing) {
      return NextResponse.json(
        { message: "Email already subscribed to notifications", alreadySubscribed: true },
        { status: 200 }
      )
    }

    // Insert notification subscription
    const { error: insertError } = await supabase.from("event_notifications").insert([
      {
        email,
        notification_type: type,
        is_confirmed: true, // Auto-confirm for now, can add email verification later
      },
    ])

    if (insertError) {
      console.error("Database error:", insertError)
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      )
    }

    // Send confirmation email
    try {
      const { error: emailError } = await supabase.auth.admin.sendRawEmail({
        to: email,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00ff88;">Notification Subscribed!</h2>
            <p>Thank you for subscribing to ${type} notifications from the Robotics Club!</p>
            <p>You will receive updates about upcoming ${type === "events" ? "events, workshops, competitions, and hackathons" : "merchandise and products"} directly to your email.</p>
            <hr style="border: 1px solid #333; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px;">Robotics Club of Heritage Institute of Technology, Kolkata</p>
          </div>
        `,
        subject: `Welcome to ${type === "events" ? "Events" : "Merch"} Notifications - Robotics Club`,
      })

      if (emailError) {
        console.warn("Email sending warning:", emailError)
        // Don't fail the whole request if email fails
      }
    } catch (emailErr) {
      console.warn("Email sending error:", emailErr)
      // Continue anyway - subscription was successful even if email failed
    }

    return NextResponse.json(
      { message: `Successfully subscribed to ${type} notifications!` },
      { status: 200 }
    )
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
