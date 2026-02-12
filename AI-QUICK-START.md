# AI Schedule Generation - Quick Start

## Setup (One-Time)

1. Get API key: https://console.anthropic.com/
2. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
3. Restart server: `npm run dev`

## Usage (Every Week)

1. **Navigate**: Schedules → Select Client → Pick Week
2. **Click**: "AI Generate" button (blue/purple)
3. **Fill Form**:
   - Body Feeling (1-5 slider)
   - Sleep Quality (1-5 slider)
   - Stress Level (1-5 slider)
   - Coach Notes (text)
4. **Generate**: Click "Generate Schedule"
5. **Review**: Check the 7-day grid
6. **Edit**: Modify any workouts as needed
7. **Save**: Click "Save Schedule"

## What AI Considers

- ✅ Last 4 weeks training history
- ✅ Race goals (from your notes)
- ✅ Injuries (from your notes)
- ✅ Current body status (from form)
- ✅ Coach guidance (from notes field)
- ✅ Expert training principles

## Pro Tips

✨ **Be specific in coach notes:**
- "Focus on tempo work"
- "Begin race taper"
- "Recovering from illness - easy week"

✨ **Always review before saving** - You're the coach!

✨ **Cost:** ~$0.01 per schedule (~$0.50/week for 50 clients)

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "API Key not set" | Add to `.env.local` and restart |
| Schedule too hard/easy | Edit coach notes, be more specific |
| Generation fails | Check internet, verify API key |

## Time Saved

- **Manual:** 5-10 min per client
- **With AI:** 30-60 sec per client
- **For 10 clients:** Save 45-90 minutes per week!

---

Full documentation: See `AI-SCHEDULE-SETUP.md`
