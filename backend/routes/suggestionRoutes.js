const express = require('express');
const router = express.Router();
const axios = require('axios');
const Suggestion = require('../models/Suggestion');

// Discord notification function
const sendDiscordNotification = async (suggestion) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.log('Discord webhook URL not configured');
        return;
    }

    const embed = {
        title: `New ${suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)} Received! 📝`,
        color: suggestion.type === 'suggestion' ? 0x00ff00 : 0xff6b35, // Green for suggestions, Orange for complaints
        fields: [
            {
                name: "Type",
                value: suggestion.type === 'suggestion' ? '💡 Suggestion' : '⚠️ Complaint/Issue',
                inline: true
            },
            {
                name: "Title",
                value: suggestion.title,
                inline: false
            },
            {
                name: "Description",
                value: suggestion.description.length > 1000
                    ? suggestion.description.substring(0, 1000) + '...'
                    : suggestion.description,
                inline: false
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: "Quick-QB Feedback Portal"
        }
    };

    // Add email field if provided
    if (suggestion.userEmail) {
        embed.fields.push({
            name: "Contact Email",
            value: suggestion.userEmail,
            inline: true
        });
    }

    const payload = {
        username: "Quick-QB Bot",
        embeds: [embed]
    };

    try {
        await axios.post(webhookUrl, payload);
        console.log('Discord notification sent successfully');
    } catch (error) {
        console.error('Failed to send Discord notification:', error.message);
    }
};

// POST /suggestions - Create new suggestion/complaint
router.post('/', async (req, res) => {
    try {
        const { type, title, description, userEmail } = req.body;

        // Validate required fields
        if (!type || !title || !description) {
            return res.status(400).json({
                msg: "Type, title, and description are required fields"
            });
        }

        // Validate type
        if (!['suggestion', 'complaint'].includes(type)) {
            return res.status(400).json({
                msg: "Type must be either 'suggestion' or 'complaint'"
            });
        }

        const newSuggestion = await Suggestion.create({
            type,
            title,
            description,
            userEmail: userEmail || null
        });

        // Send Discord notification
        await sendDiscordNotification(newSuggestion);

        return res.status(201).json({
            msg: "Your feedback has been submitted successfully!",
            suggestion: newSuggestion
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: "Failed to submit feedback",
            error: error.message
        });
    }
});

// GET /suggestions - Get all suggestions/complaints (optional endpoint for admin use)
router.get('/', async (req, res) => {
    try {
        const suggestions = await Suggestion.find({}).sort({ createdAt: -1 });
        return res.status(200).json(suggestions);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
});

module.exports = router;
