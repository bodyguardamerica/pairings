# SMS Text Notifications Research

**Date:** October 2025  
**Status:** Planned for Phase 3+ (Post-MVP)  
**Priority:** Medium (Cost concerns - implement after revenue/monetization established)  
**Purpose:** Research options for implementing SMS (text message) notifications, with heavy focus on cost management

**⚠️ Cost Management Note:** SMS is expensive at scale. This feature should only be implemented AFTER:
- Revenue stream established (entry fees, premium features)
- Clear user demand for SMS
- Cost recovery mechanism in place
- Usage limits and controls implemented

---

## Why SMS vs Push Notifications?

### Push Notifications (Mobile App)
- ✅ Free to send (no per-message cost)
- ✅ Rich notifications (images, actions, deep links)
- ❌ Requires app to be installed
- ❌ User must opt-in (can disable easily)
- ❌ Doesn't work for web users

### SMS Notifications
- ✅ Works on any phone (no app required)
- ✅ Higher open rates (90%+ read within 3 minutes)
- ✅ Better for urgent/time-sensitive messages
- ❌ Costs money per message (~$0.005-$0.10 per SMS)
- ❌ No rich media (just text)
- ❌ More complex compliance requirements (TCPA)

**For Pairings Project:** Use BOTH:
- Push notifications for app users (general updates)
- SMS for critical/urgent notifications (round starting, pairings posted)

---

## SMS Providers Comparison

### 1. Twilio
**Pricing:**
- US/Canada: ~$0.0075 per SMS
- International: varies by country
- Pay-as-you-go, no monthly fees

**Pros:**
- Most popular, best documentation
- Excellent Node.js support
- Reliable delivery rates
- Easy to integrate
- Good trial credit ($15 free)

**Cons:**
- Can get expensive at scale
- No free tier for production

**Best For:** MVP, established apps with budget

---

### 2. Vonage (formerly Nexmo)
**Pricing:**
- US/Canada: ~$0.0059 per SMS
- Slightly cheaper than Twilio

**Pros:**
- Competitive pricing
- Good international coverage
- Unified API (SMS, voice, video)

**Cons:**
- Less popular than Twilio
- Smaller community

**Best For:** Cost-sensitive projects

---

### 3. AWS SNS (Simple Notification Service)
**Pricing:**
- US: ~$0.00645 per SMS
- First 100 SMS/month free

**Pros:**
- Integrates well with other AWS services
- Free tier for testing
- Good for AWS-based backends

**Cons:**
- More complex setup
- AWS-specific knowledge helpful

**Best For:** If already using AWS infrastructure

---

### 4. Plivo
**Pricing:**
- US/Canada: ~$0.0045 per SMS
- International rates vary

**Pros very cheap
- Best pricing for US/Canada
- Simple API

**Cons:**
- Smaller company
- Fewer features than Twilio

**Best For:** High-volume SMS needs

---

## Implementation Options for Pairings

### Option 1: Twilio (Recommended for MVP)
**Why:** Best docs, reliable, easy to use

**Setup Steps:**
1. Sign up for Twilio account
2. Get phone number ($1/month)
3. Add to .env: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
4. Install: `npm install twilio`

**Code Example:**
```javascript
// backend/src/services/smsService.js
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(to, message) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    console.log('SMS sent:', result.sid);
    return result;
  } catch (error) {
    console.error('SMS error:', error);
    throw error;
  }
}

module.exports = { sendSMS };
```

**Usage:**
```javascript
// When round is created
const { sendSMS } = require('../services/smsService');

// Get all registered players with SMS notifications enabled
const players = await getRegisteredPlayers(tournamentId);

for (const player of players) {
  if (player.phoneNumber && player.smsEnabled) {
    await sendSMS(
      player.phoneNumber,
      `Round ${roundNumber} pairings are ready! Check the app for your match.`
    );
  }
}
```

---

### Option 2: AWS SNS (If Using AWS)
**Why:** Good if you're on AWS, free tier available

**Setup Steps:**
1. Create AWS account
2. Set up IAM user with SNS permissions
3. Add to .env: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
4. Install: `npm install @aws-sdk/client-sns`

**Code Example:**
```javascript
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const snsClient = new SNSClient({ region: 'us-east-1' });

async function sendSMS(to, message) {
  try {
    const params = {
      PhoneNumber: to,
      Message: message
    };
    
    const command = new PublishCommand(params);
    const result = await snsClient.send(command);
    return result;
  } catch (error) {
    console.error('SMS error:', error);
    throw error;
  }
}
```

---

### Option 3: Plivo (Cheapest)
**Why:** Most cost-effective for high volume

**Setup Steps:**
1. Sign up for Plivo
2. Get phone number
3. Add to .env: `PLIVO_AUTH_ID`, `PLIVO_AUTH_TOKEN`, `PLIVO_PHONE_NUMBER`
4. Install: `npm install plivo`

---

## Database Changes Needed

### Add Phone Number Field
```sql
-- Add to users table
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN sms_notifications_enabled BOOLEAN DEFAULT false;
```

### Add SMS Preferences to email_preferences
```sql
-- Extend email_preferences or create sms_preferences
CREATE TABLE sms_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, alert_type)
);
```

---

## Frontend Changes Needed

### 1. Phone Number Collection (Optional)
- Add phone number field to registration/profile
- Add phone verification (send code, verify)

### 2. SMS Preferences UI
- Toggle SMS notifications in profile
- Choose which alerts to receive via SMS
- "Verify Phone" button if not verified

### 3. SMS Opt-In Requirement
- Required checkbox: "I agree to receive SMS notifications"
- Clear messaging about costs (they don't pay, you do)
- Easy opt-out mechanism

---

## When to Send SMS vs Push

### Send SMS For (Urgent):
- ✅ Round pairings posted (NOW)
- ✅ Tournament starting in 15 minutes
- ✅ Your match is next
- ✅ Result deadline approaching
- ✅ Tournament results published

### Use Push For (Informational):
- ✅ New tournament created in your area
- ✅ Tournament registration closing soon
- ✅ Player registered for your tournament
- ✅ Weekly digest/updates
- ✅ Social notifications

---

## Cost Analysis & Management (CRITICAL)

### Cost Estimates

**Scenario 1: Small Tournament (20 players)**
- 5 rounds × 20 players = 100 SMS
- Cost: 100 × $0.0075 = **$0.75 per tournament**

**Scenario 2: Larger Tournament (50 players)**
- 5 rounds × 50 players = 250 SMS  
- Cost: 250 × $0.0075 = **$1.88 per tournament**

**Scenario 3: High Volume (100 tournaments/month, 30 players avg)**
- 100 × 30 × 5 = 15,000 SMS
- Cost: 15,000 × $0.0075 = **$112.50/month**

**Scenario 4: Aggressive Growth (500 tournaments/month, 40 players avg)**
- 500 × 40 × 5 = 100,000 SMS
- Cost: 100,000 × $0.0075 = **$750/month** ⚠️

**Scenario 5: Full Adoption (2000 tournaments/month)**
- 2,000 × 30 × 5 = 300,000 SMS
- Cost: 300,000 × $0.0075 = **$2,250/month** ⚠️⚠️

### ⚠️ Cost Management Strategies (REQUIRED)

#### 1. User Pays Model (Recommended)
- **Charge per SMS notification:** $0.01 per SMS (small markup covers costs)
- **Or:** Add "SMS notifications" as premium feature ($2/month)
- **Or:** Include SMS cost in tournament entry fee ($0.50 add-on)

#### 2. Usage Limits
- **Free tier:** 10 SMS/month per user
- **Premium tier:** Unlimited SMS
- **TOs only:** SMS only available for tournament organizers (paid feature)

#### 3. Smart Throttling
- Only send SMS for truly urgent events
- Default to push notifications
- Make SMS opt-in (not default)
- Cap at 1 SMS per round per tournament

#### 4. Cost Controls
```javascript
// Daily SMS budget limit
const DAILY_SMS_BUDGET = 1000; // Max 1000 SMS/day
let dailySMSCount = await getDailySMSCount();

if (dailySMSCount >= DAILY_SMS_BUDGET) {
  // Fall back to push notifications only
  sendPushNotification(users, message);
  return;
}
```

#### 5. Revenue Threshold Rule
**DO NOT implement SMS until:**
- Platform has revenue stream (entry fees working)
- Can recover SMS costs (markup, premium features)
- User base justifies cost (>1000 active users)
- Clear user demand (feature requests, surveys)

### Cost Recovery Options

**Option 1: Tournament Entry Fee Markup**
- Add $0.50 "SMS notification fee" option
- TO can choose to enable/disable
- Players see clear cost breakdown

**Option 2: Premium Subscription**
- Free: Push + Email only
- Premium ($5/month): Includes SMS
- Only premium users get SMS notifications

**Option 3: Pay Per Use**
- Users buy SMS credits ($10 = 1,000 SMS)
- Credits deducted per message
- Unused credits roll over

**Option 4: Tournament Organizer Feature**
- SMS only available to TOs
- Add to TO subscription ($10/month)
- TO can send SMS to all registered players

### Recommended Approach for Pairings

**Phase 1 (Now):** Use Push + Email only (free)
**Phase 2 (After Entry Fees):** Consider premium feature  
**Phase 3 (After Revenue Stable):** Add SMS as premium/add-on
**Phase 4 (Scale):** Offer SMS if demand justifies costs

### Red Flags - DO NOT IMPLEMENT IF:
- ❌ No revenue stream established
- ❌ < 500 active users
- ❌ Monthly costs would exceed $50
- ❌ No clear cost recovery mechanism
- ❌ Users not requesting SMS feature

---

## Compliance Requirements

### TCPA (US)
- ✅ Must get explicit consent
- ✅ Must provide easy opt-out (text STOP)
- ✅ Cannot send to numbers on Do Not Call list
- ✅ Must identify sender

### GDPR (EU)
- ✅ Must get explicit opt-in
- ✅ Must allow opt-out
- ✅ Cannot send without consent
- ✅ Privacy policy must mention SMS

### Implementation:
```javascript
// Store consent
await pool.query(
  `UPDATE users 
   SET sms_notifications_enabled = true, 
       sms_consent_date = NOW(),
       sms_consent_ip = $1
   WHERE id = $2`,
  [req.ip, user.id]
);

// Opt-out handling
router.post('/sms/opt-out', async (req, res) => {
  const phone = req.body.phoneNumber;
  await pool.query(
    'UPDATE users SET sms_notifications_enabled = false WHERE phone_number = $1',
    [phone]
  );
  res.json({ message: 'Unsubscribed from SMS notifications' });
});
```

---

## Alternative: SMS via iMessage/WhatsApp APIs

### iMessage Business Chat
- ✅ Free to use
- ✅ Rich messaging features
- ❌ Only works on iOS
- ❌ Requires Apple approval

### WhatsApp Business API
- ✅ Very low cost (~$0.005 per message)
- ✅ Works on all phones
- ✅ Rich features
- ❌ Setup complexity
- ❌ Requires WhatsApp Business verification

**For MVP:** Stick with SMS (Twilio). Consider WhatsApp later if volume justifies.

---

## Implementation Priority

### Phase 1: Get It Working
- Set up Twilio account
- Add SMS sending to backend
- Send SMS when round created
- Test with your phone number

### Phase 2: User Management
- Add phone number to user profile
- Add SMS preferences table
- Create UI for SMS preferences
- Implement opt-out mechanism

### Phase 3: Smart Notifications
- Only send if user enabled SMS
- Only send urgent notifications
- Respect rate limits
- Track delivery status

### Phase 4: Cost Management
- Monitor SMS costs
- Add cost tracking dashboard
- Consider premium features for TOs
- Implement usage limits

---

## Recommended Implementation Plan

### ⚠️ CRITICAL: Cost-First Approach

**DO NOT implement SMS until:**
1. ✅ Entry fees/payment processing working
2. ✅ At least 500 active monthly users
3. ✅ Clear revenue stream established
4. ✅ User demand validated (surveys, requests)
5. ✅ Cost recovery mechanism planned

### Implementation Phases:

#### Phase 1 (Now - MVP): Free Notifications Only
- ✅ Push notifications (free)
- ✅ Email notifications (SendGrid free tier)
- ✅ In-app notifications
- ❌ NO SMS (too expensive without revenue)

#### Phase 2 (After Entry Fees Working): Premium Trial
- Add SMS as premium feature ($5/month)
- Limited to premium subscribers
- Monitor usage and costs
- Validate user demand

#### Phase 3 (After Revenue Stable): Full SMS
- SMS available to all users
- Cost recovery via:
  - Premium subscription
  - Tournament SMS fee ($0.50/tournament)
  - Or pay-per-use credits
- Daily/monthly usage limits
- Cost monitoring dashboard

### Cost Controls (Must Have):
1. **Daily budget limit** (e.g., 1000 SMS/day max)
2. **Per-user limits** (e.g., 10 SMS/month free tier)
3. **Automatic fallback** to push if budget exceeded
4. **Cost tracking** dashboard for admins
5. **Usage alerts** when approaching budget

### Notification Priority (Cost-Optimized):
1. **Push notifications** - Always free, use for everything
2. **Email** - Free tier, use for summaries/digests
3. **SMS** - Premium only, urgent only, limited quantity

---

## Resources

### Documentation:
- [Twilio SMS Node.js Guide](https://www.twilio.com/docs/sms/quickstart/node)
- [Twilio Pricing](https://www.twilio.com/pricing)
- [TCPA Compliance Guide](https://www.twilio.com/docs/glossary/tcpa)

### Free Credits:
- Twilio: $15 free credit (trial)
- AWS SNS: 100 SMS/month free
- Plivo: Varies by plan

### Tools:
- Twilio Console: Monitor usage, costs
- SMS testing: Use your own number for free
- Delivery tracking: Twilio provides webhooks

---

## Implementation Checklist (When Ready)

**Prerequisites (Must Complete First):**
- [ ] Entry fees/payments implemented and working
- [ ] 500+ active monthly users
- [ ] Revenue stream established
- [ ] User surveys show SMS demand
- [ ] Cost recovery model chosen

**Technical Setup:**
- [ ] Sign up for Twilio account
- [ ] Get phone number ($1/month)
- [ ] Add SMS service to backend
- [ ] Implement cost tracking
- [ ] Add daily budget limits
- [ ] Create cost monitoring dashboard

**User Management:**
- [ ] Add phone number to user profile
- [ ] Add SMS preferences (opt-in)
- [ ] Implement premium tier (if applicable)
- [ ] Add phone verification
- [ ] Create opt-out mechanism

**Cost Controls:**
- [ ] Set daily SMS budget limit
- [ ] Implement usage throttling
- [ ] Add automatic fallback to push
- [ ] Create cost alerts
- [ ] Monitor monthly costs

---

## Summary: Cost-First Approach

**Key Takeaway:** SMS is powerful but expensive. For Pairings:
1. **Start with FREE notifications** (push + email)
2. **Only add SMS after revenue established**
3. **Always require cost recovery** (premium, fees, or limits)
4. **Monitor and limit usage** aggressively
5. **Make SMS premium/optional**, never default

**Timeline Recommendation:**
- **Phase 2:** Push + Email notifications (free)
- **Phase 3:** Premium features (including SMS if demand)
- **Phase 4+:** Full SMS rollout if costs justified

**Last Updated:** October 2025  
**Status:** Research complete, implementation deferred until revenue stream established

