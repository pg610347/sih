═══════════════════════════════════════════════════════════════════════════════
FIGMA DESIGN BRIEF — FINAL VERSION
═══════════════════════════════════════════════════════════════════════════════

PROJECT:
AI-Based Cognitive Gaming & Memory Assistance Platform for Elderly
Dementia Patients in North Eastern India

TARGET USERS:
• Elderly (60+) with dementia in NER
• Family caregivers / healthcare workers
• Neurologists / geriatricians / primary care doctors

CORE DESIGN PHILOSOPHY:
Person-centered | Dignity-first | Culturally sensitive |
Elderly-friendly | Accessible | Warm | Encouraging

The application must NEVER make the patient feel like they have failed.
There must be ZERO shame, ZERO punishment, and ZERO competitive pressure.

═══════════════════════════════════════════════════════════════════════════════

1. COLOR PALETTE
   ═══════════════════════════════════════════════════════════════════════════════

Primary:
• Teal Accent: #0F6E56
• Soft Coral: #D85A30
• Deep Purple: #534AB7
• Warm Amber: #BA7517

Neutral:
• Text Dark: #1A1A1A
• Text Muted: #5F5E5A
• Background: #FFFFFF
• Card BG: #F9F8F6
• Border: #D3D1C7

Semantic:
• Success: #639922
• Warning: #BA7517
• Error: #A32D2D
• Info: #185FA5

Minimum contrast: 4.5:1 WCAG AA.

═══════════════════════════════════════════════════════════════════════════════
2. TYPOGRAPHY
═══════════════════════════════════════════════════════════════════════════════

Font:
• Open Sans or another highly readable Unicode-compatible font

Body:
• 16px / 1.6 / Regular

Labels:
• 14px / 1.4 / Medium

Buttons:
• 16px / 1.2 / Semi-bold

H3:
• 18px / Semi-bold

H2:
• 22px / Bold

H1:
• 28px / Bold

Captions:
• Minimum 14px

⚠️ NEVER use text smaller than 14px.

Patient-facing text should preferably be 16–18px.

═══════════════════════════════════════════════════════════════════════════════
3. SPACING & TOUCH TARGETS
═══════════════════════════════════════════════════════════════════════════════

Spacing:
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px

Touch targets:
• Standard button: 56px height
• Minimum: 48×48px
• Patient controls: preferably 56px+
• Card padding: 24px
• Border radius: 12px

═══════════════════════════════════════════════════════════════════════════════
4. FIRST SCREEN — LANGUAGE SELECTION
═══════════════════════════════════════════════════════════════════════════════

IMPORTANT:
The VERY FIRST SCREEN shown to the patient must be the language selection
screen.

Do NOT ask the elderly patient to navigate through an English interface
before choosing their language.

TITLE:

"Choose your language"

SUBTITLE:

"You can change this anytime from Settings."

Display large language cards:

┌──────────────────────────────────┐
│  অসমীয়া                         │
│  Assamese                  🔊    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  বাংলা                           │
│  Bengali                   🔊    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  हिंदी                           │
│  Hindi                     🔊    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  English                   🔊    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Manipuri                  🔊    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Khasi                     🔊    │
└──────────────────────────────────┘

Support:
Assamese | Manipuri | Khasi | Bengali | English | Hindi

* additional NER languages

LANGUAGE AUDIO IDENTIFICATION:

→ Every language option has a 🔊 speaker button.
→ Tapping the speaker plays the name of the language in that language.
→ This helps elderly users who have difficulty reading.
→ Audio should be slow, clear and easy to understand.

Example:

🔊 "অসমীয়া"

LANGUAGE CARD:
• Minimum height: 64px
• Large readable text
• Large touch target
• Selected state uses border + checkmark
• Never rely on color alone

After selecting a language:

→ Immediately preview the interface in that language.
→ Do NOT require application restart.
→ Do NOT require a complicated confirmation process.

Primary button:

"Continue"

═══════════════════════════════════════════════════════════════════════════════
5. DYNAMIC LANGUAGE SYSTEM
═══════════════════════════════════════════════════════════════════════════════

Once the patient selects a language, the ENTIRE patient interface must
automatically change to the selected language.

This includes:

✓ Navigation
✓ Greetings
✓ Game names
✓ Game instructions
✓ Buttons
✓ Encouragement messages
✓ Diary prompts
✓ Mood labels
✓ Streak messages
✓ Notifications
✓ Settings
✓ Help messages
✓ Confirmation messages
✓ Empty states
✓ Accessibility labels
✓ Audio instructions

Example:

English:
"Good morning, Asha!"
"What would you like to play today?"

Assamese:
Use natural Assamese translation.

Bengali:
Use natural Bengali translation.

Hindi:
Use natural Hindi translation.

Manipuri:
Use natural Manipuri translation.

Khasi:
Use natural Khasi translation.

⚠️ Do NOT use awkward word-for-word translations.

Translations must be:
• Natural
• Respectful
• Easy for elderly users
• Culturally appropriate
• Non-infantilizing

═══════════════════════════════════════════════════════════════════════════════
6. LANGUAGE SWITCHING FROM SETTINGS
═══════════════════════════════════════════════════════════════════════════════

Patient:

Settings
↓
Language
↓
Select Language
↓
Interface changes immediately

Show currently selected language with:

✓ Checkmark
✓ Visible border
✓ "Selected" indicator

The selected language must be remembered across future sessions.

No application restart required.

═══════════════════════════════════════════════════════════════════════════════
7. AUDIO LANGUAGE SUPPORT
═══════════════════════════════════════════════════════════════════════════════

The patient's selected language must also control audio instructions.

Example:

Selected language = Assamese

Visual instruction → Assamese
Audio instruction → Assamese

Every important game instruction should have:

🔊 Replay Audio

Audio should be:

• Slow
• Clear
• Warm
• Reassuring
• Optional

Never force the patient to listen to audio.

═══════════════════════════════════════════════════════════════════════════════
8. CULTURAL LOCALIZATION
═══════════════════════════════════════════════════════════════════════════════

Localization must go beyond translation.

Use culturally familiar:

• NER music
• Traditional festivals
• Regional foods
• Household objects
• Family traditions
• Traditional clothing
• Crafts
• Radio/music memories
• Village and community memories

Possible reminiscence themes:

🎵 Regional music
🍚 Familiar foods
🏡 Traditional homes
🌾 Farming
🧵 Crafts
👨‍👩‍👧 Family traditions
🎉 Festivals

Avoid stereotypes.

═══════════════════════════════════════════════════════════════════════════════
9. PATIENT HOME SCREEN
═══════════════════════════════════════════════════════════════════════════════

Header:

Patient name
Warm personalized greeting in selected language

Example:

"Hello Asha! What would you like to play today?"

Display only 2–3 large game cards.

Games:

🎵 Music Recognition
🖼️ Old Memories
🧩 Match the Objects

Cards:
• Full width
• Approximately 200px height
• Image on top
• Game name at bottom
• 18px bold title

IMPORTANT:

❌ No score
❌ No leaderboard
❌ No timer
❌ No competitive ranking

Add Memory Streak card.

═══════════════════════════════════════════════════════════════════════════════
10. MEMORY STREAK — GENTLE DAILY HABIT
═══════════════════════════════════════════════════════════════════════════════

PURPOSE:

The Memory Streak encourages regular cognitive engagement and helps the
patient build a positive daily routine.

It is NOT a competition.

It is NOT a score.

It must NEVER create pressure or anxiety.

HOME SCREEN CARD:

🔥 Your Memory Streak

"3 days"

"You've spent time with your memories for 3 days in a row."

Visual:

● ● ● ● ○ ○ ○
Mon Tue Wed Thu Fri Sat Sun

Use a gentle flame, leaf, flower, or growing plant visual.

Do NOT make the streak visually aggressive.

───────────────────────────────────────────────────────────────────────────────
HOW THE STREAK WORKS
───────────────────────────────────────────────────────────────────────────────

A day counts when the patient completes ONE meaningful activity.

Examples:

✓ Completes a cognitive game
✓ Music Recognition
✓ Reminiscence
✓ Object Matching
✓ Records a Dear Diary entry

No score requirement.

No accuracy requirement.

No minimum number of games.

Simply participating counts.

Maximum one streak increment per calendar day.

───────────────────────────────────────────────────────────────────────────────
GENTLE RETURN AFTER A MISSED DAY
───────────────────────────────────────────────────────────────────────────────

NEVER show:

❌ "Streak Lost"
❌ "You failed"
❌ "You missed your goal"
❌ "Bad performance"

Instead:

🌷 "Welcome back!"

"Ready for another memory moment?"

Previous achievements should remain visible.

Optional concept:

"Memory Pause"

"Everyone needs a day to rest.
Your memory journey continues whenever you're ready."

───────────────────────────────────────────────────────────────────────────────
STREAK MILESTONES
───────────────────────────────────────────────────────────────────────────────

3 Days:
🌱 "You're building a lovely routine!"

7 Days:
🌿 "One week of memory moments!"

14 Days:
🌳 "Wonderful consistency!"

30 Days:
🌸 "A month of memory moments!"

60 Days:
⭐ "What a wonderful journey!"

Milestones should trigger:

• Gentle animation
• Optional soft sound
• Optional haptic feedback
• Encouraging message

Avoid:
❌ Loud effects
❌ Flashing
❌ Countdown
❌ Competitive graphics

═══════════════════════════════════════════════════════════════════════════════
11. GAME SCREEN
═══════════════════════════════════════════════════════════════════════════════

Top-left:
← Back button, minimum 48px

Center:
Game title

Instruction:
14–18px in selected language

Example:

"Listen to the song.
Do you remember this tune?"

Content area:
• Approximately 60% of screen

Music:
• Large 60px play button

Objects:
• 3 large visual choices

Reminiscence:
• Full-width vintage photograph

Response buttons:

"Yes, I remember"
"Not sure"
"Tell me more"

All translated according to selected language.

Feedback:

CORRECT:
"Wonderful! You remembered!"

IF UNCERTAIN:
"Here's a clue..."

NEVER display:

❌ WRONG
❌ Failed
❌ Score: 0

Next:

"Continue"
or
"Play another?"

═══════════════════════════════════════════════════════════════════════════════
12. DEAR DIARY / MEMORY JOURNAL
═══════════════════════════════════════════════════════════════════════════════

Header:

📔 Your Memory Journal

Subtitle:

"Share your thoughts. No one hears until you say it's okay."

Both translated into selected language.

Optional prompts:

"Tell me about your day."

"What's on your mind?"

Large central recording button:

🔴 RECORD

96px diameter

When recording:

• Gentle pulsing animation
• Waveform
• Duration
• STOP button

After recording:

• Play/pause
• Progress bar
• Duration

Mood:

"How do you feel about this memory?"

😊 Happy
😔 Sad
😌 Peaceful
😤 Frustrated

Save:

"Save Memory"

Confirmation:

"Your memory was saved!"

A diary entry can also count toward the Memory Streak.

═══════════════════════════════════════════════════════════════════════════════
13. CAREGIVER DASHBOARD
═══════════════════════════════════════════════════════════════════════════════

Header:
Patient name
Last activity

Bottom navigation:

Dashboard | Games | Health | Chat | Settings

Metrics:

🎮 Games This Week
💊 Medication Adherence
😊 Mood Trend
🥗 Nutrition
💬 Chat Unread

Add:

🔥 Memory Engagement

Example:

"Memory Streak: 5 days"
"Active today"
"Last activity: Music Recognition"

Never label a patient as "poor" because of a low streak.

If there is no recent activity:

"No recent activity"
"A gentle check-in may be helpful."

═══════════════════════════════════════════════════════════════════════════════
14. CAREGIVER GAME PROGRESS
═══════════════════════════════════════════════════════════════════════════════

Filters:

7 days | 30 days | All time

Show:

• Games played
• Time played
• Difficulty
• Mood
• Current Memory Streak
• Active days

Charts:

• Bar chart
• Engagement trend
• Favorite games

Use supportive language:

"Engagement is growing."

"The patient has been engaging consistently."

Avoid judgmental language.

═══════════════════════════════════════════════════════════════════════════════
15. MEDICATION TRACKER
═══════════════════════════════════════════════════════════════════════════════

Today's medications:

☐ Medication
Time
Dose

Tap checkbox to mark as taken.

Optional calendar:

• Daily adherence
• Color + text indicators

Notes:

"Any side effects or concerns?"

═══════════════════════════════════════════════════════════════════════════════
16. DIET LOG
═══════════════════════════════════════════════════════════════════════════════

Date picker:

Today | < >

Meals:

Breakfast
Lunch
Dinner
Snacks

Expandable cards.

Nutrition summary:

Vitamin B12
Vitamin D
Protein
Calories

Add Meal:

* FAB, 56px, teal

═══════════════════════════════════════════════════════════════════════════════
17. CHAT WITH DOCTOR
═══════════════════════════════════════════════════════════════════════════════

Header:

Doctor name
Online status

Messages:

Caregiver:
Teal bubble, right aligned

Doctor:
#F9F8F6 bubble, left aligned

Input:

Message field
Send button

Language preference of caregiver and doctor can be independent from the
patient's language.

═══════════════════════════════════════════════════════════════════════════════
18. DOCTOR PATIENT LIST
═══════════════════════════════════════════════════════════════════════════════

Search:

"Search by name or ID"

Sort:

Engagement | Alert | Name

Patient cards:

• Avatar
• Name
• Age
• Dementia type
• Engagement
• Last activity
• Alert status
• Memory Streak

Alert indicators:

🔴 Critical
🟡 Warning
🟢 Good

Always combine color with text/icon.

═══════════════════════════════════════════════════════════════════════════════
19. DOCTOR PATIENT DETAIL
═══════════════════════════════════════════════════════════════════════════════

Tabs:

Overview | Games | Mood | Medication | Nutrition | Chat

Overview:

Engagement
Medication adherence
Mood
Nutrition
Memory Engagement

Memory Engagement:

Current Streak: 12 days
Active Days: 18 / 30
Last Activity: Today
Preferred Activity: Music Recognition

Important:

The streak is an engagement indicator only.

It must NOT be treated as a medical diagnosis.

Doctors should be able to identify changes in engagement over time.

Example:

"Engagement has remained consistent over the past 2 weeks."

"Engagement has decreased compared with the previous 2 weeks."

═══════════════════════════════════════════════════════════════════════════════
20. DOCTOR GAMES TAB
═══════════════════════════════════════════════════════════════════════════════

30-day engagement line graph.

Game breakdown:

Music Recognition
Reminiscence
Matching
Other

Difficulty progression:

Game | Level 1 | Level 2 | Level 3

Include engagement consistency.

═══════════════════════════════════════════════════════════════════════════════
21. DOCTOR MOOD TAB
═══════════════════════════════════════════════════════════════════════════════

30-day mood graph.

Mood:

😊 Happy
😔 Sad
😌 Peaceful
😤 Frustrated

Sentiment analysis.

Example:

"60% positive entries"
"20% neutral"
"20% negative"

Any automated sentiment analysis must be presented as supportive information,
not as a diagnosis.

═══════════════════════════════════════════════════════════════════════════════
22. DOCTOR MEDICATION & NUTRITION
═══════════════════════════════════════════════════════════════════════════════

Medication:

Current medications
Dosage
Frequency
Adherence
30-day chart

Nutrition:

Vitamin B12
Vitamin D
Folate
Protein

Recommendations should be clearly labeled as recommendations for
professional review, not automatic medical decisions.

═══════════════════════════════════════════════════════════════════════════════
23. COMPONENT LIBRARY
═══════════════════════════════════════════════════════════════════════════════

BUTTONS:

Primary:
#0F6E56 / white / 56px

Secondary:
Teal outline

Danger:
#D85A30

Ghost:
Teal text

States:

Default
Hover
Active
Disabled

INPUTS:

Height: 48px
Border: 2px
Radius: 8px
Padding: 12px
Focus: visible teal border

CARDS:

Background:
#F9F8F6 / white

Border:
#D3D1C7

Padding:
24px

Radius:
12px

MOOD SELECTOR:

56×56px buttons

MESSAGE BUBBLES:

Caregiver → Teal
Doctor → #F9F8F6

TABS:

Height: 48px
Active → Teal bottom border

NAVIGATION:

Patient:
Home | Games | Diary | Settings

Caregiver:
Dashboard | Games | Health | Chat | Settings

═══════════════════════════════════════════════════════════════════════════════
24. ACCESSIBILITY
═══════════════════════════════════════════════════════════════════════════════

✓ Minimum font size: 14px
✓ Patient text preferably 16–18px
✓ Minimum touch target: 48px
✓ High contrast
✓ WCAG AA
✓ No time limits
✓ Clear language
✓ Visual + audio feedback
✓ Alt text
✓ Visible focus indicators
✓ Keyboard navigation
✓ Screen reader support
✓ ARIA labels
✓ Reduced-motion support
✓ Mobile responsive

Language accessibility:

✓ Language selection on FIRST SCREEN
✓ Speaker button for every language
✓ Audio instructions
✓ Natural translations
✓ No text truncation
✓ Unicode-compatible fonts
✓ Responsive text containers

═══════════════════════════════════════════════════════════════════════════════
25. RESPONSIVE DESIGN
═══════════════════════════════════════════════════════════════════════════════

Mobile:
320–640px

Tablet:
641–1024px

Desktop:
1025px+

Mobile:
1-column layout

Tablet:
2-column layout

Desktop:
3+ columns where appropriate

Patient interface should prioritize mobile/tablet touch interaction.

═══════════════════════════════════════════════════════════════════════════════
26. KEY PATIENT INTERACTIONS
═══════════════════════════════════════════════════════════════════════════════

✓ Large touch targets
✓ No time limits
✓ No failure states
✓ Gentle haptic feedback
✓ Audio cues
✓ Left/right swipe only
✓ No complex gestures
✓ Celebration for accomplishments
✓ Memory Streak
✓ Gentle return after missed days
✓ Language available from first screen
✓ Entire interface changes with language
✓ Audio changes with language

═══════════════════════════════════════════════════════════════════════════════
27. FIGMA FILE STRUCTURE
═══════════════════════════════════════════════════════════════════════════════

PROJECT:

"Dementia Care Platform - NER"

PAGES:

🎨 Design System
• Colors
• Typography
• Spacing
• Buttons
• Cards
• Inputs
• Mood Selector
• Streak Components
• Language Components
• Navigation
• Accessibility

🌐 Language & Onboarding
• First Screen Language Selection
• Language Audio Selection
• Language Confirmation
• Language Switching
• Localization Examples

👴 Patient Interface
• Language Selection
• Home
• Game Selection
• Music Recognition
• Reminiscence
• Match Objects
• Dear Diary
• Memory Streak
• Milestone Celebration
• Settings

🏥 Caregiver Interface
• Dashboard
• Game Progress
• Memory Engagement
• Medication
• Diet
• Chat
• Settings

👨‍⚕️ Doctor Interface
• Patient List
• Patient Overview
• Games
• Mood
• Medication
• Nutrition
• Chat

🔄 Prototypes
• Language → Patient Home
• Home → Game → Streak
• Home → Diary → Streak
• Caregiver Dashboard → Medication
• Caregiver → Chat
• Doctor → Patient → Detail

📦 Assets
• Game icons
• Mood icons
• Streak illustrations
• NER cultural imagery
• Reminiscence photographs
• Audio icons
• Accessibility icons

═══════════════════════════════════════════════════════════════════════════════
28. DESIGN PRINCIPLES
═══════════════════════════════════════════════════════════════════════════════

1. DIGNITY FIRST

• No failure states
• No shame
• No infantilization
• Celebrate participation
• Respect privacy

2. SIMPLICITY

• Maximum 3–4 major interactive elements per screen
• One primary CTA
• Clear hierarchy
• Minimal cognitive load

3. CULTURAL RESPECT

• NER imagery
• NER languages
• Familiar memories
• Family-oriented context
• Respect traditions

4. ACCESSIBILITY

• Large text
• Large controls
• High contrast
• Audio support
• Simple language

5. WARMTH

• Teal
• Coral
• Soft illustrations
• Friendly language
• Familiar imagery

6. ENCOURAGEMENT

The system should always communicate:

"Every little step counts."

"Welcome back."

"Wonderful! You remembered."

"Let's continue your memory journey."

═══════════════════════════════════════════════════════════════════════════════
29. IMPORTANT THINGS TO AVOID
═══════════════════════════════════════════════════════════════════════════════

DO NOT USE:

❌ Leaderboards
❌ Competitive rankings
❌ Aggressive streak countdowns
❌ "Streak Lost"
❌ "You Failed"
❌ "Wrong!"
❌ Timed challenges
❌ Flashing animations
❌ Tiny text
❌ Complex menus
❌ Excessive information
❌ Childish visuals
❌ Infantilizing language
❌ Medical diagnosis based solely on game performance
❌ Color as the only status indicator

═══════════════════════════════════════════════════════════════════════════════
30. SUCCESS CRITERIA
═══════════════════════════════════════════════════════════════════════════════

The design is successful if:

✓ Patient can select language before interacting with the application
✓ Patient can identify languages through audio
✓ Entire interface changes after language selection
✓ Patient can change language easily from Settings
✓ Patient completes a game in <5 taps
✓ Patient understands what to do without assistance
✓ Caregiver checks medication in <10 seconds
✓ Doctor gets patient summary in <30 seconds
✓ Elderly users with tremors can navigate comfortably
✓ Vision-impaired users can read the interface
✓ Memory Streak encourages regular engagement
✓ Missing a day does not create shame
✓ Interface feels warm rather than clinical
✓ Cultural content feels familiar and respectful
✓ Supports multiple NER languages
✓ Works responsively from 320px to 1440px+
✓ No confusing error states
✓ Every accomplishment receives positive reinforcement

═══════════════════════════════════════════════════════════════════════════════
FINAL DESIGN GOAL
═══════════════════════════════════════════════════════════════════════════════

Create a dementia-care platform that feels like a WARM MEMORY COMPANION,
not a medical test or competitive game.

The patient should feel:

"This application understands me."

"I can use it in my own language."

"I can take my time."

"I don't have to be perfect."

"Every day I participate is meaningful."

"I can always come back."

The overall experience should combine:

🧠 Cognitive stimulation
❤️ Emotional comfort
🌏 Cultural familiarity
🌐 Native-language accessibility
🔥 Gentle consistency through Memory Streaks
👨‍👩‍👧 Caregiver support
👨‍⚕️ Professional monitoring
♿ Accessibility
🔒 Privacy and dignity

Design the complete Figma system with reusable components, responsive
layouts, accessible interactions, multilingual states, and clickable
prototypes for all three user types.

═══════════════════════════════════════════════════════════════════════════════
