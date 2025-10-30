const { pool } = require('../config/database');

/**
 * Email service for sending notifications
 * NOTE: This is a placeholder implementation.
 * To fully implement, you'll need to:
 * 1. Choose an email service provider (SendGrid, Mailgun, AWS SES)
 * 2. Add EMAIL_SERVICE_API_KEY to .env
 * 3. Install the provider's SDK (npm install @sendgrid/mail or similar)
 * 4. Replace the mock implementation with actual API calls
 */

/**
 * Send email via email service provider
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} htmlBody - Email HTML body
 * @param {string} textBody - Email plain text body
 */
const sendEmail = async (to, subject, htmlBody, textBody) => {
  // TODO: Implement with actual email service provider
  // Example with SendGrid:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sgMail.send({
  //   to,
  //   from: process.env.EMAIL_FROM,
  //   subject,
  //   text: textBody,
  //   html: htmlBody,
  // });

  console.log(`[Email Service] Would send email to ${to}:`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${textBody}`);

  return { success: true, message: 'Email queued (mock)' };
};

/**
 * Send new event alert to users with matching preferences
 * @param {object} tournament - Tournament object
 */
const sendNewEventAlerts = async (tournament) => {
  try {
    // Find users with matching email preferences
    const result = await pool.query(`
      SELECT DISTINCT u.email, u.username, ep.filters, ep.frequency
      FROM email_preferences ep
      JOIN users u ON ep.user_id = u.id
      WHERE ep.alert_type = 'new_event'
      AND ep.enabled = true
    `);

    const recipients = result.rows.filter(user => {
      // Check if tournament matches user's filters
      if (!user.filters) return true; // No filters = receive all

      const filters = user.filters;

      // Check game system filter
      if (filters.gameSystem && filters.gameSystem !== tournament.game_system) {
        return false;
      }

      // Check location filters (simplified - you may want more sophisticated matching)
      if (filters.location) {
        const tournamentLocation = tournament.location?.toLowerCase() || '';
        const filterLocation = filters.location.city?.toLowerCase() ||
                               filters.location.state?.toLowerCase() ||
                               filters.location.country?.toLowerCase() || '';

        if (filterLocation && !tournamentLocation.includes(filterLocation)) {
          return false;
        }
      }

      return true;
    });

    // Group by frequency
    const immediate = recipients.filter(r => r.frequency === 'immediate');
    const daily = recipients.filter(r => r.frequency === 'daily');
    const weekly = recipients.filter(r => r.frequency === 'weekly');

    // Send immediate alerts
    for (const recipient of immediate) {
      await sendNewEventEmail(recipient.email, recipient.username, tournament);
    }

    // TODO: Queue daily and weekly digests
    console.log(`[Email Service] Queued ${daily.length} daily digests`);
    console.log(`[Email Service] Queued ${weekly.length} weekly digests`);

    return {
      sent: immediate.length,
      queued: daily.length + weekly.length
    };
  } catch (error) {
    console.error('Send new event alerts error:', error);
    throw error;
  }
};

/**
 * Send new event email to a user
 */
const sendNewEventEmail = async (to, username, tournament) => {
  const subject = `New ${tournament.game_system} tournament: ${tournament.name}`;

  const htmlBody = `
    <h2>New Tournament Alert</h2>
    <p>Hi ${username},</p>
    <p>A new tournament matching your preferences has been posted!</p>
    <h3>${tournament.name}</h3>
    <ul>
      <li><strong>Game:</strong> ${tournament.game_system}</li>
      <li><strong>Format:</strong> ${tournament.format}</li>
      <li><strong>Location:</strong> ${tournament.location || 'TBD'}</li>
      <li><strong>Date:</strong> ${new Date(tournament.start_date).toLocaleDateString()}</li>
      <li><strong>Rounds:</strong> ${tournament.total_rounds}</li>
    </ul>
    <p>${tournament.description || ''}</p>
    <p><a href="${process.env.FRONTEND_URL || 'http://localhost:8081'}/tournaments/${tournament.id}">View Tournament</a></p>
    <hr>
    <p><small>You're receiving this because you subscribed to new event alerts. <a href="${process.env.FRONTEND_URL || 'http://localhost:8081'}/profile/email-preferences">Manage your preferences</a></small></p>
  `;

  const textBody = `
New Tournament Alert

Hi ${username},

A new tournament matching your preferences has been posted!

${tournament.name}
- Game: ${tournament.game_system}
- Format: ${tournament.format}
- Location: ${tournament.location || 'TBD'}
- Date: ${new Date(tournament.start_date).toLocaleDateString()}
- Rounds: ${tournament.total_rounds}

${tournament.description || ''}

View tournament: ${process.env.FRONTEND_URL || 'http://localhost:8081'}/tournaments/${tournament.id}

---
You're receiving this because you subscribed to new event alerts.
Manage your preferences: ${process.env.FRONTEND_URL || 'http://localhost:8081'}/profile/email-preferences
  `;

  return await sendEmail(to, subject, htmlBody, textBody);
};

/**
 * Send tournament reminder email
 */
const sendTournamentReminder = async (to, username, tournament, daysUntil) => {
  const subject = `Reminder: ${tournament.name} in ${daysUntil} days`;

  const htmlBody = `
    <h2>Tournament Reminder</h2>
    <p>Hi ${username},</p>
    <p>This is a reminder that <strong>${tournament.name}</strong> is coming up in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}!</p>
    <ul>
      <li><strong>Date:</strong> ${new Date(tournament.start_date).toLocaleDateString()}</li>
      <li><strong>Location:</strong> ${tournament.location || 'TBD'}</li>
      <li><strong>Format:</strong> ${tournament.format}</li>
    </ul>
    <p><a href="${process.env.FRONTEND_URL || 'http://localhost:8081'}/tournaments/${tournament.id}">View Tournament Details</a></p>
  `;

  const textBody = `
Tournament Reminder

Hi ${username},

This is a reminder that ${tournament.name} is coming up in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}!

Date: ${new Date(tournament.start_date).toLocaleDateString()}
Location: ${tournament.location || 'TBD'}
Format: ${tournament.format}

View tournament: ${process.env.FRONTEND_URL || 'http://localhost:8081'}/tournaments/${tournament.id}
  `;

  return await sendEmail(to, subject, htmlBody, textBody);
};

module.exports = {
  sendEmail,
  sendNewEventAlerts,
  sendNewEventEmail,
  sendTournamentReminder
};
