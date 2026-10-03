Kada

കട

0

[Kada](#top)

[How it works](#how)[Features](#features)[Dashboard](#dashboard)

[Get early access](#start)

പറഞ്ഞാൽ മതി.

# Speak. Kada does the rest.

Send a voice note in Malayalam. Your shop books customers, reads bills and answers WhatsApp, day and night.

Booking a fitting for tomorrow, 10:00

[Start free setup](#start)[Watch how it works](#how)

WhatsAppMalayalam + EnglishGST bills24/7

**✓**Booking confirmed

**₹**Bill read: 4,820

**!**New lead alert

How it works

## An agent, not a chatbot.

Watch one booking move through Kada. Each step runs, gets checked, and is logged for you.

Kada workflowRunning

Sample booking, shown for illustration.

Everything in one place

## One assistant for every routine job.

From the first voice note to the final reply, Kada covers the daily work that eats a shop owner's time.

### Voice and text in Malayalam

Send a voice note or type, in Malayalam or English. Speech becomes text, and text becomes a structured action your shop can use.

MalayalamEnglishVoice notes

### Autonomous task agent

Runs multi-step jobs on its own and reports back when they are done.

Inventory checksAppointment confirmationsPrice validation

### Self-correcting loop

Every result is drafted, run, reviewed and refined before it reaches a customer.

### Bill and invoice reader

Vision AI turns messy receipts and tax documents into clean, standard data.

### WhatsApp inbox

All customer messages in one place, with instant replies to routine questions.

### High-value lead alerts

You are pinged the moment a big enquiry arrives, even if Kada is handling the rest.

### Live dashboard and logs

See what the agent did in plain words, with clear success badges and no raw data.

### Manual override

Pause the agent or take over any chat with one tap.

Bill reader

## From a crumpled bill to clean data.

Take a photo of a supplier receipt. Kada reads it and saves tidy records, ready for your books. Sample shown.

#### SREE LAKSHMI TRADERS

Alappuzha · 02-10-2026

Rice 50 kg2400

Sugar 25 kg1100

Oil 10 L1320

TOTAL4820

→

```
{
  "supplier": "Sree Lakshmi Traders",
  "date": "2026-10-02",
  "items": [
    { "name": "Rice", "qty": "50 kg", "amount": 2400 },
    { "name": "Sugar", "qty": "25 kg", "amount": 1100 },
    { "name": "Oil", "qty": "10 L", "amount": 1320 }
  ],
  "total": 4820,
  "total_matches_items": true
}
```

Dashboard

## Your day, at a glance.

A live feed of what Kada is doing, built for one hand on a phone. Try the switch to take control.

- Real-time agent status and activity logs
- Clear badges: done, or needs you
- Pause or take over with one tap
- Thumb-friendly controls at the bottom of the screen

**Today**Anitha's Tailoring · sample data

Kada is handling messagesYou are in control. New messages wait for you.

**12**Bookings

**5**Bills read

**38**Chats

**2**Needs you

✓Booked fitting for 2, tomorrow 10:00*Done*

✓Read bill from Sree Lakshmi, 4820*Done*

!Bulk order enquiry from Rahul*Needs you*

✓Replied to a price question*Done*

---

# Kada Merchant App: Dashboard & Operations Screens

The complete mobile screen architecture and text specifications for the Kada merchant application.

### Persistent App Shell & Navigation
[Kada](#home) [Home](#home) [Inbox](#inbox) [Bills](#bills) [Activity](#activity) [Setup](#setup)

[A] **Anitha's Tailoring** · Sample shop  
[Kada](#home) · [A](#setup)

---

### Screen 1: Home Cockpit (`#home`)

നമസ്കാരം, അനിത

# Good morning, Anitha

Here is what Kada handled for you today.

**Kada is handling messages**  
*Switch off to take control yourself.* (Toggle: Autonomous Active / Manual Override)

#### Daily Metrics
- **12** Bookings
- **5** Bills read
- **38** Chats handled
- **2** Need you

#### Needs you (High-Priority Triage)
- [! **Bulk order from Rahul** · 40 uniforms by the 15th · 10:42](#inbox)
- [! **Rice stock is low** · 20 kg left, reorder drafted · 09:05](#activity)

#### Today's Bookings
- **10:30** **Suresh, 2 people** · Fitting, moved to 10:30 · `Booked`
- **4:00 pm** **Meera** · Blouse fitting, 4:00 pm · `Booked`

*Sample data for illustration.*

---

### Screen 2: WhatsApp Inbox (`#inbox`)

WhatsApp

# Inbox

Every customer message in one place.

Select a chat to see the conversation.

- **Rahul (Uniform Enquiry)** · `10:42` · *Need 40 sets school uniform by 15th* · `! Needs you`
- **Meera** · `10:20` · *Blouse stitching pricing sent* · `✓ Auto-replied`
- **Suresh** · `09:50` · *Fitting confirmed for 2 people at 10:30* · `✓ Booked`

---

### Screen 3: Bill Reader (`#bills`)

Bill reader

# Bills

Photograph a bill. Kada saves tidy records.

- **Capture Bill**: Tap camera button to photograph a paper invoice.
- **Latest Record**:
  - **Sree Lakshmi Traders**, Alappuzha · `02-10-2026`
  - Rice 50 kg: ₹2,400 | Sugar 25 kg: ₹1,100 | Oil 10 L: ₹1,320
  - Total: ₹4,820 · `✓ Balanced`

---

### Screen 4: Autonomous Activity Log (`#activity`)

Agent log

# Activity

What Kada did, in plain words.

- ! **Bulk order enquiry from Rahul** · Lead alert sent to you · `10:42`
- ✓ **Replied to a price question** · Meera, blouse stitching · `10:20`
- ✓ **Booked fitting for 2** · Tap to see the checks · `09:50`
  - *Draft the booking*
  - *Check free slots*
  - *Review: clash found at 10:00*
  - *Fix: moved to 10:30*
- ✓ **Read a supplier bill** · Sree Lakshmi Traders, 4,820 · `09:30`
- ! **Rice stock is low** · Reorder drafted, waiting for you · `09:05`

---

### Screen 5: Getting Started Wizard (`#setup`)

Getting started

# Live in 2 minutes

Step 1 of 4

### Name your shop
Business name: *Anitha's Tailoring*

### Set your hours
Opening time · Closing time: *9:00 AM – 8:00 PM*

### Add your first service
Name · Price (rupees): *Blouse Stitching · ₹350*

### Send a voice note
Tap and say something in Malayalam: *(🎙️) "നാളെ 10 മണിക്ക് മീരയുടെ ബ്ലൗസ് ഫിറ്റിംഗ്"*  
`✓ Verified`

### You are live
Kada is ready to take your customers.

[Go to home](#home)

---

### Screen 6: Live Voice Assistant Overlay (`#listening`)

### Listening

Live vernacular speech recognition and instant intent resolution:
- Spoken: *"നാളെ വൈകുന്നേരം നാലുമണിക്ക് മീരയ്ക്ക് ബ്ലൗസ് ഫിറ്റിംഗ് ബുക്ക് ചെയ്യുക"*
- Action: **Booking saved: Meera, tomorrow 4:00 pm ✓**

---

### Mobile Bottom Dock
[Home](#home) [Inbox](#inbox) [Bills](#bills) [Activity](#activity)

Getting started

## Live in 2 minutes.

1. **1**

   ### Name your shop

   Add your business name and logo.
2. **2**

   ### Set your hours

   So Kada knows when to book customers.
3. **3**

   ### Add your first product

   Or a service, with its price.
4. **4**

   ### Send a voice note

   Say it in Malayalam. You are live.

Under the hood

## Built to run every day.

NestJSMySQL + PrismaRedis queuesNext.js + TailwindWhisper speech-to-textOpenAI / AnthropicDocker on AWS ECSWhatsApp Business API

## Set up your shop in 2 minutes.

Add your business name, opening hours and first product. Then send your first voice note.

[Start free setup](#top)

Kada. Made for the small businesses of Kerala.

[Start free setup](#start)