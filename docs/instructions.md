author: Jesse Murah

## Overview

If you ask a standard AI coding assistant to build a dropdown menu or a modal, it will write code like it's 2020.

At **Google I/O 2026**, Philip Walton demonstrated this perfectly:

- **Unguided AI:** Built a simple dropdown using **172 KB** of JavaScript (minified and gzipped).
- **Guided AI:** Built the exact same dropdown using **less than 3 KB** and **zero JavaScript**.

AI models are trained on the entire history of the web — millions of outdated StackOverflow answers and legacy tutorials. When prompted, they default to heavy JavaScript solutions and NPM packages instead of modern HTML/CSS APIs.

**Modern Web Guidance** is an "upgrade patch" for your AI's brain. It is an evergreen, expert-vetted set of skills that intercepts your prompts and forces the AI to use native, high-performance web standards.

**What you'll learn:**

- Install Modern Web Guidance and lock in a Baseline target for cross-browser safety.
- Use the **Popover API** and **CSS Anchor Positioning** to build a zero-JS tooltip.
- Use **`scheduler.yield()`** to fix Interaction to Next Paint (INP) on a heavy data task.
- Measure the bundle-size impact in Chrome DevTools.

**What you'll build:**

Three live AI coding demos that showcase the difference between legacy AI output and guidance-augmented AI output.

**Prerequisites:**

- Basic knowledge of HTML/CSS/JavaScript
- Node.js installed
- A modern browser (Chrome recommended)

Duration: 17 minutes

---

## Act 1: Install Modern Web Guidance (3 mins)

*Goal: Show how easy it is to install and secure cross-browser compatibility.*

### Step 1: Open a terminal in your project

Clone or open the demo project:

```sh
git clone https://github.com/JesseMurah/Modern-Web-Guidance-Demo.git
cd Modern-Web-Guidance-Demo
```

### Step 2: Install Modern Web Guidance

```sh
npx modern-web-guidance@latest install
```

This creates an `AGENTS.md` (or `.agents/` config) file in your project root. Open it.

### Step 3: Set your Baseline target

Add the following to your `AGENTS.md`:

```markdown
# Project Constraints
- Baseline target: Baseline Widely Available
```

**Talking Point:** "By defining our Baseline, we guarantee the AI won't break the application for users on older mobile devices or edge networks. If we ask for bleeding-edge features, the AI will automatically handle the fallbacks."

---

## Act 2: Zero-JS Tooltips (7 mins)

*Goal: Demonstrate how modern CSS eliminates complex UI state management.*

**Scenario:** We need a tooltip for a transaction fee icon on a B2B payment ledger.

### Step 1: Prompt your AI agent

```
Create an interest-triggered-tooltip for a transaction fee button.
The tooltip should appear when hovering or focusing the button,
and it must stay perfectly anchored to the top of the button
without using any custom JavaScript math for positioning.
```

### Step 2: Observe the output — The Reveal

With Modern Web Guidance active, the AI produces **zero JavaScript** and uses two native browser APIs:

**Popover API** — handles automatic z-index layering and light dismiss:

```html
<button popovertarget="fee-tooltip">
  Transaction Fee ⓘ
</button>

<div id="fee-tooltip" popover>
  A 1.5% processing fee applies to all international transfers.
</div>
```

**CSS Anchor Positioning** — glues the tooltip to the button during scroll:

```css
[popovertarget] {
  anchor-name: --fee-btn;
}

#fee-tooltip {
  position-anchor: --fee-btn;
  top: anchor(top);
  left: anchor(center);
  translate: -50% -110%;
}
```

**Point out two things:**
1. `popover` gives automatic z-index management and click-outside dismiss — no JavaScript needed.
2. `anchor()` replaces `getBoundingClientRect()` loops and `resize` listeners — the tooltip stays anchored during scroll with **0 lines of JavaScript**.

---

## Act 3: Fixing INP with scheduler.yield() (5 mins)

*Goal: Show how the AI handles advanced main-thread optimization.*

**Scenario:** A heavy data-processing function parsing a massive JSON payload of transactions freezes the UI. If a user clicks while this runs, the dashboard freezes — ruining the Interaction to Next Paint (INP) score.

### Step 1: Prompt your AI agent

```
I have a massive array of 50,000 transaction records that I need
to process and render. Write a function to break-up-long-tasks
so it doesn't freeze the main thread and ruin our
Interaction to Next Paint (INP) score.
```

### Step 2: Observe the output — The Reveal

Without guidance, the AI would write a `setTimeout` hack. With Modern Web Guidance, the AI uses the modern **`scheduler.yield()`** API:

```js
async function processTransactions(records) {
  const CHUNK_SIZE = 500;

  for (let i = 0; i < records.length; i += CHUNK_SIZE) {
    const chunk = records.slice(i, i + CHUNK_SIZE);
    renderChunk(chunk);

    // Yield to the browser between chunks
    await scheduler.yield();
  }
}
```

**Talking Point:** "The AI wrote a loop that processes a chunk of transactions, calls `await scheduler.yield()`, and tells the browser: *'If the user clicked anything, handle it now, then come back and finish parsing.'* It instantly fixes your INP score."

Note: `scheduler.yield()` is part of the [Prioritized Task Scheduling API](https://developer.mozilla.org/en-US/docs/Web/API/Prioritized_Task_Scheduling_API), shipping in all modern browsers.

---

## Act 4: The Bundle Size Reveal (2 mins)

*Goal: Drop the mic.*

### Step 1: Open Chrome DevTools → Network Tab

Filter by **JS** and compare the two approaches side by side:

| Approach | JS Bundle |
|---|---|
| Unguided AI (tooltip + task scheduler) | ~172 KB |
| Guided AI (Popover API + scheduler.yield()) | < 3 KB |

**Talking Point:** "We just built complex UI physics and advanced main-thread task scheduling. Because we used the browser's native engine instead of third-party libraries, our JavaScript bundle size is basically zero. This is how you ship lean, performant web apps."

---

## Bonus: Native Passkeys (WebAuthn)

Passwords are a liability for financial platforms. Modern Web Guidance makes implementing biometric passkeys simple.

### Prompt

```
Create a client-side JavaScript function to register a new user
using a passkey. Return the credential payload to send to my backend.
```

### What the guided AI produces

The AI automatically:
1. Expects the cryptographic challenge to come from the **server** (preventing client-side spoofing)
2. Provides a utility to serialize the raw `ArrayBuffer` data into **Base64URL** so the backend JSON parser doesn't crash

```js
async function registerPasskey(username) {
  // Challenge must come from server — never generate client-side
  const { challenge, userId } = await fetch('/api/passkey/register-options', {
    method: 'POST',
    body: JSON.stringify({ username }),
  }).then(r => r.json());

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: base64urlToBuffer(challenge),
      rp: { name: 'My App' },
      user: {
        id: base64urlToBuffer(userId),
        name: username,
        displayName: username,
      },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
      authenticatorSelection: { userVerification: 'required' },
    },
  });

  return {
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    response: {
      clientDataJSON: bufferToBase64url(credential.response.clientDataJSON),
      attestationObject: bufferToBase64url(credential.response.attestationObject),
    },
  };
}
```

---

## Bonus: Network Priority

When loading a dashboard on a constrained network, background analytics can block critical data.

### Prompt

```
Deprioritize background data fetches made with the Fetch API
to prevent network contention with user-initiated requests.
```

### What the guided AI produces

```js
// Critical user-initiated fetch — default priority
const dashboardData = await fetch('/api/dashboard');

// Background telemetry — explicitly deprioritized
const analytics = await fetch('/api/analytics', {
  priority: 'low',
});
```

**Why it matters:** The `priority: 'low'` hint instructs the browser to hold off on background telemetry until core structural payloads are downloaded, significantly improving **Largest Contentful Paint (LCP)**.

---

## Congratulations!

You've seen how Modern Web Guidance transforms AI coding output from legacy bloat to native, high-performance web standards.

**What you covered:**

- ✅ Installed Modern Web Guidance and set a Baseline target
- ✅ Built a zero-JS tooltip using the Popover API + CSS Anchor Positioning
- ✅ Fixed INP using `scheduler.yield()` instead of `setTimeout` hacks
- ✅ Measured the bundle-size impact: 172 KB → < 3 KB
- ✅ Explored native passkeys and network priority as bonus patterns

**Next Steps:**

- Try the Agentic Web skill (WebMCP) for exposing structured app tools to AI agents
- Explore the full Modern Web Guidance skill library
- Set `Baseline: Widely Available 2024` to unlock more recent APIs with confidence

---

## Resources & Connect

### 📚 Resources

- **GitHub Repository**: [Modern-Web-Guidance-Demo](https://github.com/JesseMurah/Modern-Web-Guidance-Demo)
- **Modern Web Guidance Docs**: [developer.chrome.com](https://developer.chrome.com)
- **Popover API**: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- **CSS Anchor Positioning**: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning)
- **scheduler.yield()**: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield)

### 🤝 Connect

**Jesse Murah**

- 💼 LinkedIn: [Jesse Murah](https://linkedin.com/in/JesseMurah)
- 🐙 GitHub: [@JesseMurah](https://github.com/JesseMurah)

---

**Credit to Unstacked Labs.**

Have Fun! 🚀
