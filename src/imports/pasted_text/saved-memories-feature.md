Add a new **“Saved Memories” feature** to the existing Patient Interface.

The purpose of this feature is to give patients an easy, visible place where they can access and listen to all the memories they have previously recorded through **Dear Diary**.

This should be a completely new section that integrates with the existing Dear Diary experience.

### SAVED MEMORIES SECTION

Add a new **“Saved Memories”** option that the patient can open whenever they want.

The section should contain all previously saved audio recordings from Dear Diary, displayed in a simple, warm, elderly-friendly layout.

Suggested navigation:

**Patient Home → Saved Memories**

or

**Patient Home → Diary → Saved Memories**

Make **Saved Memories** clearly visible and easy to find.

### SAVED MEMORIES SCREEN

Header:

📖 **Saved Memories**

Subtitle:

*"Your memories are safe here. Listen whenever you'd like."*

Display saved recordings as large, easy-to-understand memory cards.

Each memory card should contain:

* 🎙️ Audio/microphone icon
* Memory title
* Date recorded
* Duration
* Mood emoji selected when the memory was recorded
* Large **Play ▶** button
* Optional "More" button

Example:

**🌸 A memory from my childhood**
September 5, 2026 • 01:24
😊 Happy

▶ **Play Memory**

---

### MEMORY CARD INTERACTION

When the patient taps **Play**:

* Play the saved recording
* Show a large play/pause button
* Display a simple progress bar
* Show elapsed time and total duration
* Allow the patient to pause and resume easily

Example:

**🌸 A memory from my childhood**

▶️ ━━━━━●━━━━ 01:24 / 02:10

[ Pause ]

Keep playback controls large and simple.

### MEMORY DETAILS

When a memory is opened, show:

* Date and time recorded
* Recording duration
* Mood selected
* Audio playback
* Optional memory title
* Optional text/transcription if available

Include a simple **Back** button at the top-left.

### SAVING A NEW MEMORY

After the patient finishes recording in Dear Diary:

**Stop Recording → Playback → Mood Selection → Save Memory**

After tapping **Save Memory**, show:

✅ **"Your memory was saved!"**

Then provide two options:

**Listen Now**
**View Saved Memories**

If the patient chooses "View Saved Memories", take them directly to the Saved Memories screen.

### EMPTY STATE

If the patient has not recorded any memories yet, show a warm and encouraging empty state.

Example:

📖

**Your memories will appear here**

*"Record a memory in Dear Diary, and you can come back to listen to it anytime."*

Include a large:

**Record a Memory**

button.

Do NOT make the empty state feel like an error or failure.

### ORGANIZATION

If the patient has many memories:

Allow simple sorting/filtering such as:

**Recent | Oldest | Mood**

Keep this extremely simple and avoid complicated filtering.

Memories should be displayed chronologically by default, with the newest memory at the top.

### MEMORY PRIVACY

Clearly communicate that these are the patient's private memories.

Display a small privacy indicator:

🔒 **Private Memory**

The patient should understand that their recordings are stored privately and are accessible from this section.

Do not display unnecessary technical privacy information.

### OPTIONAL DELETE FUNCTION

Each memory may have a **Delete Memory** option.

Before deletion, show a simple confirmation:

**"Delete this memory?"**

Buttons:

**Keep Memory**
**Delete**

Avoid accidental deletion by requiring confirmation.

### ACCESSIBILITY

Design the feature specifically for elderly users.

* Minimum 48×48px touch targets
* Large Play/Pause button
* Minimum 14px text
* Clear labels instead of icons alone
* High contrast
* Simple language
* Minimal interactions
* No complicated menus
* Audio controls should be visually obvious
* Support the patient's selected language
* Respect reduced-motion settings

### FIGMA COMPONENTS

Create reusable components for:

1. **Saved Memory Card**

   * Default
   * Playing
   * Paused

2. **Audio Player**

   * Play
   * Pause
   * Progress

3. **Memory Details**

   * Audio
   * Date
   * Duration
   * Mood

4. **Empty State**

5. **Save Confirmation**

6. **Delete Confirmation**

### PROTOTYPE FLOW

Create this prototype:

**Dear Diary**
↓
**Record Memory**
↓
**Stop**
↓
**Playback**
↓
**Select Mood**
↓
**Save Memory**
↓
✅ **"Your memory was saved!"**
↓
**View Saved Memories**
↓
**Saved Memories List**
↓
**Select Memory**
↓
**Memory Details**
↓
▶️ **Listen to Recording**

Also create:

**Home**
↓
**Saved Memories**
↓
**Select Previous Recording**
↓
▶️ **Play Memory**

### DESIGN TONE

The Saved Memories section should feel:

❤️ Personal
🌷 Warm
🔒 Safe
😊 Comforting
📖 Familiar
✨ Meaningful

It should feel like the patient has their own **private little memory library**, not like a clinical database.

Integrate this feature with the existing Dear Diary functionality while keeping the existing design system, colors, typography, accessibility standards, and elderly-friendly interaction principles unchanged.
