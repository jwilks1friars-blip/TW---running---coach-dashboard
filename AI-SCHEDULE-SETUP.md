# AI-Powered Schedule Generation Setup Guide

## Overview

This guide will help you set up and use the AI-powered schedule generation feature in your Coach Dashboard. This feature uses Claude AI to automatically generate personalized weekly training schedules for your clients based on their training history, Strava data, race goals, injuries, and current status.

---

## Prerequisites

1. **Anthropic API Key** - You'll need a Claude API key from Anthropic
2. **Node.js and npm** - Already installed if your dashboard is working
3. **Running Coach Dashboard** - Your existing Next.js application

---

## Setup Steps

### Step 1: Get Your Anthropic API Key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy the API key (starts with `sk-ant-`)

**Important:** Keep this key secret! Never commit it to version control.

### Step 2: Configure Environment Variables

1. Open the Coach Dashboard directory:
   ```bash
   cd "/Users/tyler.wilks/Cursor - TW running schedule/Coach dashboard"
   ```

2. Open the `.env.local` file (already created for you)

3. Replace `your_api_key_here` with your actual Anthropic API key:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
   ```

4. Save the file

### Step 3: Start the Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

---

## How to Use AI Schedule Generation

### Basic Workflow

1. **Navigate to Schedules Page**
   - Click "Edit Schedules" in the sidebar

2. **Select a Client**
   - Choose the client you want to generate a schedule for

3. **Navigate to the Desired Week**
   - Use the "Previous" and "Next" buttons to select the week

4. **Click "AI Generate" Button**
   - You'll see a blue/purple gradient button in the Quick Actions section

5. **Fill Out the Weekly Check-In Form**
   - **Body Feeling** (1-5): How is the athlete feeling physically?
     - 1 = Terrible, 5 = Excellent
   - **Sleep Quality** (1-5): How well are they sleeping?
     - 1 = Very Poor, 5 = Excellent
   - **Stress Level** (1-5): How stressed are they?
     - 1 = Very Low, 5 = Very High
   - **Athlete Notes** (optional): Any additional context
     - Example: "Feeling tired from work stress"
     - Example: "Slight knee discomfort"
   - **Coach Notes**: Your specific guidance for the AI
     - Example: "Focus on tempo work this week"
     - Example: "Coming off illness - keep it light"
     - Example: "Race in 2 weeks - begin taper"

6. **Click "Generate Schedule"**
   - The AI will analyze:
     - Last 4 weeks of training history from your dashboard
     - Strava data (if connected)
     - Race goals
     - Injury status
     - Current weekly check-in data
   - This takes 10-15 seconds

7. **Review the Generated Schedule**
   - The 7-day grid will auto-fill with AI recommendations
   - You'll see a blue banner at the top indicating it's AI-generated
   - Each workout includes:
     - Distance (miles)
     - Pace (min/mile)
     - Detailed notes

8. **Edit as Needed**
   - You can modify any workout before saving
   - Change distances, paces, or notes
   - You're in complete control

9. **Save the Schedule**
   - Click "Save Schedule" in the blue banner or the regular save button
   - The schedule is stored in localStorage as usual

---

## What the AI Considers

### Training Principles

The AI is trained on expert running coach principles:

- **80/20 Rule**: 80% easy running, 20% hard
- **Progressive Overload**: Max 10% mileage increase per week
- **Recovery**: At least one rest day per week
- **Hard/Easy Pattern**: No consecutive hard days
- **Long Run**: 20-30% of weekly mileage
- **Race Taper**: Reduces volume 2-3 weeks before races

### Data Inputs

1. **Training History** (last 4 weeks)
   - Total weekly mileage
   - Number of workouts
   - Progression trends

2. **Strava Data** (if connected)
   - Actual completed workouts
   - Completion rates
   - Pace data

3. **Race Goals**
   - Race date and type (5K, 10K, Half, Marathon)
   - Time until race (for taper planning)
   - Target time

4. **Injuries**
   - Active injuries
   - Recovering injuries
   - Affected body areas

5. **Current Status**
   - Body feeling (1-5)
   - Sleep quality (1-5)
   - Stress level (1-5)
   - Any notes

6. **Coach Notes**
   - Your specific guidance
   - Special considerations

---

## Example Use Cases

### Example 1: Marathon Training - Base Building Phase

**Client:** Sarah (Marathon in 12 weeks)
**Recent History:** 30-32 miles/week for past 3 weeks
**Check-In:**
- Body Feeling: 4/5
- Sleep: 4/5
- Stress: 2/5

**Coach Notes:** "Continue building aerobic base, keep it easy"

**AI Output:**
- Monday: 5 miles easy (9:00 pace)
- Tuesday: 6 miles with tempo (2 easy, 3 threshold @ 7:45, 1 cooldown)
- Wednesday: Rest
- Thursday: 5 miles easy (9:00 pace)
- Friday: 4 miles easy (9:15 pace)
- Saturday: 12 miles long run (9:30 pace)
- Sunday: 3 miles recovery (10:00 pace)
- **Total: 35 miles** (10% increase from 32)

---

### Example 2: 5K Training - Injury Recovery

**Client:** Mike (5K in 6 weeks, coming off knee injury)
**Recent History:** 0 miles (recovering)
**Check-In:**
- Body Feeling: 3/5
- Sleep: 5/5
- Stress: 3/5

**Coach Notes:** "Knee recovering well, ease back into running, no speed work yet"

**AI Output:**
- Monday: Rest
- Tuesday: 2 miles easy (10:00 pace) - test knee
- Wednesday: Rest or cross-train
- Thursday: 3 miles easy (9:45 pace)
- Friday: Rest
- Saturday: 4 miles easy (9:30 pace)
- Sunday: Rest or easy walk
- **Total: 9 miles** (conservative return)

---

### Example 3: Marathon Taper - 2 Weeks Out

**Client:** Jessica (Marathon in 2 weeks)
**Recent History:** 50, 52, 48 miles (last 3 weeks)
**Check-In:**
- Body Feeling: 4/5
- Sleep: 3/5 (pre-race nerves)
- Stress: 4/5

**Coach Notes:** "Begin taper, maintain some intensity"

**AI Output:**
- Monday: 4 miles easy (9:00 pace)
- Tuesday: 6 miles with 3x1 mile @ race pace
- Wednesday: Rest
- Thursday: 5 miles easy (9:00 pace)
- Friday: 4 miles easy (9:15 pace)
- Saturday: 10 miles easy (9:30 pace)
- Sunday: Rest
- **Total: 29 miles** (~60% of peak volume)

---

## Troubleshooting

### Error: "Missing required fields"
- Make sure you selected a client
- Check that the week is selected

### Error: "ANTHROPIC_API_KEY is not set"
- Verify `.env.local` file exists in Coach dashboard directory
- Ensure the API key is correctly set
- Restart the development server after adding the key

### Error: "Failed to generate schedule"
- Check your internet connection
- Verify your Anthropic API key is valid
- Check the browser console for detailed error messages

### Schedule seems unreasonable
- Review the coach notes - be more specific
- Check the training history - the AI builds on what you've logged
- Manually edit the schedule as needed

### AI doesn't consider Strava data
- Strava integration is optional (future feature)
- For now, the AI uses your logged schedules from the dashboard
- You can manually input completion notes in coach notes

---

## Best Practices

### 1. Be Specific in Coach Notes
- ✅ "Focus on tempo work, building threshold fitness for marathon"
- ❌ "Make it good"

### 2. Keep Training History Updated
- The AI learns from your past 4 weeks of logged schedules
- Consistent logging = better recommendations

### 3. Update Race Goals
- Add race goals in the client profile (future feature)
- Mention upcoming races in coach notes for now

### 4. Track Injuries
- Log injuries in client notes
- Mention status in coach notes

### 5. Review and Edit
- AI is a tool, not a replacement
- Always review recommendations
- Edit as needed based on your coaching expertise

---

## Cost Information

**Anthropic API Pricing** (as of February 2025):
- Claude Sonnet 4.5: ~$3 per million input tokens, $15 per million output tokens
- Each schedule generation uses approximately:
  - Input: ~2,000 tokens (~$0.006)
  - Output: ~500 tokens (~$0.0075)
- **Cost per schedule: ~$0.01 - $0.02**
- **For 50 clients/week: ~$0.50 - $1.00/week**

Very affordable for the time saved!

---

## Future Enhancements

Planned features:
- ✅ AI schedule generation (current)
- ⏳ Strava integration (partially built)
- ⏳ Multi-week planning (generate 4-week blocks)
- ⏳ Race goal management UI
- ⏳ Injury tracking UI
- ⏳ Batch generation (all clients at once)
- ⏳ Email notifications to clients
- ⏳ Performance analytics

---

## Support

If you encounter issues:
1. Check this guide first
2. Look in browser console for error messages
3. Verify environment variables are set correctly
4. Restart the development server

---

## Security Notes

- **Never commit `.env.local`** - it's already in `.gitignore`
- **Never share your API key** publicly
- **Rotate your API key** if you suspect it's been exposed
- API keys in the Anthropic console can be deleted/regenerated anytime

---

## Keyboard Shortcuts

While on the Schedules page:
- **AI Generate**: No shortcut yet (use mouse to click)
- **Save**: Still use the Save button
- **Navigate weeks**: Use Previous/Next buttons

---

## Example Coach Workflow

**Monday Morning:**
1. Open Coach Dashboard
2. Go to Schedules page
3. For each client:
   - Select client
   - Go to next week
   - Click "AI Generate"
   - Fill in 3 sliders + coach notes (30 seconds)
   - Review AI recommendations (15 seconds)
   - Make minor tweaks if needed
   - Click Save
4. **10 clients = 10 minutes** (vs 60+ minutes manually)

**Time saved:** 50+ minutes per week!

---

## Version History

- **v1.0** (Feb 2025): Initial AI schedule generation
  - Claude Sonnet 4.5 integration
  - Weekly check-in form
  - Training history analysis
  - Race goal awareness
  - Injury consideration
