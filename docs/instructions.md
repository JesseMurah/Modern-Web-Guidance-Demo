author: Jesse Murah

## Overview

If you ask a standard AI coding assistant to build a dropdown menu or a modal, it will write code like it's 2020.

At **Google I/O 2026**, Philip Walton demonstrated this perfectly:

- **Unguided AI:** Built a simple dropdown using **172 KB** of JavaScript (minified and gzipped).
- **Guided AI:** Built the exact same dropdown using **less than 3 KB** and **zero JavaScript**.

AI models are trained on the entire history of the web — millions of outdated StackOverflow answers and legacy tutorials. When prompted, they default to heavy JavaScript solutions instead of modern HTML/CSS APIs.

**Modern Web Guidance** is an "upgrade patch" for your AI's brain. It is an evergreen, expert-vetted set of skills that intercepts your prompts and forces the AI to use native, high-performance web standards.

**What you'll demo:**

All three live demos run against our actual Next.js dashboard — the same `SectionCards`, `DataTable`, `ChartAreaInteractive`, and `NavUser` components we built in this session.

**Prerequisites:**

- Basic knowledge of HTML/CSS/JavaScript
- Node.js installed
- A modern browser (Chrome recommended)

Duration: 17 minutes

---

## Act 1: Install Modern Web Guidance (3 mins)

*Goal: Show how easy it is to install and lock in cross-browser safety.*

### Step 1: Clone the demo project

```sh
git clone https://github.com/JesseMurah/Modern-Web-Guidance-Demo.git
cd Modern-Web-Guidance-Demo
```

### Step 2: Install Modern Web Guidance

```sh
npx modern-web-guidance@latest install
```

This creates an `AGENTS.md` file in the project root. Open it — you'll see skills covering layout, performance, and modern APIs.

### Step 3: Set the Baseline target

Add the following to `AGENTS.md`:

```markdown
# Project Constraints
- Baseline target: Baseline Widely Available
```

**Talking Point:** "Our dashboard runs on Chrome, Firefox, and Safari. By setting Baseline Widely Available, any API the AI suggests is guaranteed to work across all three — without us having to think about it. If we ask for a bleeding-edge API, the AI automatically writes expert-vetted fallback code."

---

## Act 2: Zero-JS Tooltips on SectionCards (7 mins)

*Goal: Demonstrate how modern CSS eliminates JavaScript state management in a component we actually built.*

**Scenario:** Our `SectionCards` component shows four stat cards — Total Revenue, New Customers, Active Accounts, and Growth Rate. Each card has a trend `Badge` with a `TrendingUp` or `TrendingDown` icon. Product wants a tooltip on each badge explaining what the percentage means in plain English.

### Step 1: The prompt

Type this into your AI agent:

```
In our dashboard's SectionCards component, the trend badges show
percentages like "+12.5%" with TrendingUp/TrendingDown icons from lucide-react.

Add a tooltip to each trend badge that explains the change in plain English —
for example, the Total Revenue badge should say "Up 12.5% compared to last month".

Requirements:
- Tooltip appears on hover and focus of the badge
- Stays anchored directly above the badge during scroll
- Uses zero JavaScript for positioning or z-index management
- Works with our existing shadcn Badge and Card components
```

### Step 2: The Reveal — without Modern Web Guidance

An unguided AI reaches for a tooltip library (Radix `Tooltip`, Floating UI, or Tippy.js) — adding ~40 KB of JS just to position an element.

### Step 3: The Reveal — with Modern Web Guidance

The guided AI uses two native browser APIs. **Zero JavaScript. Zero new dependencies.**

**Popover API** — automatic z-index and light dismiss, no state needed:

```html
<Badge
  variant="outline"
  popovertarget="revenue-tooltip"
>
  <TrendingUpIcon /> +12.5%
</Badge>

<div id="revenue-tooltip" popover>
  Up 12.5% compared to last month
</div>
```

**CSS Anchor Positioning** — glues the tooltip to the badge through scroll and layout shifts:

```css
[popovertarget] {
  anchor-name: --trend-badge;
}

[popover] {
  position-anchor: --trend-badge;
  top: anchor(top);
  left: anchor(center);
  translate: -50% -110%;
}
```

**What to point out:**
1. `popover` replaces `useState(isOpen)`, `onMouseEnter`, `onMouseLeave`, and `useEffect` for outside-click detection — all gone.
2. `anchor()` replaces `getBoundingClientRect()` loops and `ResizeObserver` listeners — the tooltip stays pinned to the badge even when the sidebar collapses or the page scrolls.

---

## Act 3: Fixing INP in the DataTable (5 mins)

*Goal: Show how the AI handles advanced main-thread optimization in a component we actually built.*

**Scenario:** Our `DataTable` initializes `@dnd-kit` drag-and-drop sortable for all 68 document rows on mount. Users report the dashboard tab feels unresponsive for a beat after navigating to it — clicking the **Outline / Past Performance / Key Personnel / Focus Documents** tabs registers late. That's an INP problem.

### Step 1: The prompt

Type this into your AI agent:

```
Our DataTable component initializes @dnd-kit drag-and-drop sortable
for 68 document rows on mount using DndContext and SortableContext
from @dnd-kit/sortable.

Users report that clicking the Outline / Past Performance / Key Personnel /
Focus Documents tabs feels sluggish right after the table loads.
That's an Interaction to Next Paint regression.

Write a utility function that processes the initial row data in chunks
and yields control back to the browser between chunks so user interactions
are never blocked.
```

### Step 2: The Reveal — without Modern Web Guidance

An unguided AI writes a `setTimeout(fn, 0)` hack — which defers work but still blocks the main thread between macro-tasks once the browser picks it back up.

### Step 3: The Reveal — with Modern Web Guidance

The guided AI uses **`scheduler.yield()`** — the modern [Prioritized Task Scheduling API](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield):

```ts
async function initializeSortableRows(
  rows: typeof data,
  onChunk: (chunk: typeof data) => void
) {
  const CHUNK_SIZE = 10;

  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE);
    onChunk(chunk);

    // Hand control back to the browser.
    // If the user clicked a tab, the browser handles it NOW —
    // then returns here to process the next chunk.
    await scheduler.yield();
  }
}
```

**Talking Point:** "The loop processes 10 rows, then calls `await scheduler.yield()`. The browser looks at its task queue — if the user clicked the 'Past Performance' tab, it handles that click immediately, then returns to register the next 10 drag handles. Our INP score goes from 'needs improvement' to 'good' without touching a single business logic line."

---

## Act 4: The Bundle Size Reveal (2 mins)

*Goal: Drop the mic.*

### Open Chrome DevTools → Network Tab

Filter by **JS** and compare what we'd ship with each approach:

| Approach | What the AI reached for | JS added |
|---|---|---|
| Unguided — tooltip | Floating UI + Radix Tooltip | ~42 KB |
| Unguided — INP fix | `setTimeout` + custom scheduler | ~8 KB |
| **Guided — both** | Popover API + `scheduler.yield()` | **0 KB** |

**Talking Point:** "We built anchored tooltips for all four stat cards and fixed a real INP regression in our drag-and-drop table — and our JavaScript bundle didn't grow by a single byte. That's what shipping with the browser's native engine looks like."

---

## Bonus: Native Passkeys in NavUser

Our `NavUser` component in the sidebar footer already shows an **Account** menu item. Product wants biometric login.

### The prompt

```
Our NavUser component renders a dropdown with Account, Billing,
Notifications, and Log out options. The user object has name and email fields.

Add passkey registration to the Account menu item so users can secure
their dashboard with biometric authentication. Use the user's email as
the WebAuthn username. Return the credential payload ready to POST
to our /api/passkey/register endpoint.
```

### What the guided AI produces

The AI enforces two things an unguided AI typically misses:

1. **The cryptographic challenge must come from the server** — never generated client-side (prevents spoofing)
2. **`ArrayBuffer` must be serialized to Base64URL** before JSON serialization — unguided AI omits this and the backend JSON parser crashes

```ts
async function registerPasskey(user: { name: string; email: string }) {
  // Step 1: Get challenge from server — NEVER generate this client-side
  const { challenge, userId } = await fetch('/api/passkey/register-options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user.email }),
  }).then(r => r.json());

  // Step 2: Create the credential
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: base64urlToBuffer(challenge),
      rp: { name: 'Documents Dashboard' },
      user: {
        id: base64urlToBuffer(userId),
        name: user.email,
        displayName: user.name,
      },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
      authenticatorSelection: { userVerification: 'required' },
    },
  });

  // Step 3: Serialize ArrayBuffers to Base64URL for JSON transport
  return {
    id: credential.id,
    rawId: bufferToBase64url((credential as PublicKeyCredential).rawId),
    response: {
      clientDataJSON: bufferToBase64url(
        (credential.response as AuthenticatorAttestationResponse).clientDataJSON
      ),
      attestationObject: bufferToBase64url(
        (credential.response as AuthenticatorAttestationResponse).attestationObject
      ),
    },
  };
}
```

---

## Bonus: Network Priority for Dashboard Data

Our dashboard mounts three data-dependent components simultaneously: `SectionCards`, `ChartAreaInteractive`, and `DataTable`. A background analytics beacon is competing with the chart's time-series fetch on constrained networks.

### The prompt

```
Our dashboard loads three data sources on mount: the SectionCards metrics,
the ChartAreaInteractive 90-day time-series, and the DataTable document records.

A background analytics event fetch is competing with these and slowing down
our Largest Contentful Paint.

Use the Fetch API's built-in priority hint to deprioritize the analytics
call without changing any other fetch logic.
```

### What the guided AI produces

```ts
// Critical — user is waiting for these
const [metrics, chartData, documents] = await Promise.all([
  fetch('/api/metrics'),
  fetch('/api/chart/time-series'),
  fetch('/api/documents'),
]);

// Background telemetry — browser holds this until critical fetches clear
await fetch('/api/analytics/event', {
  method: 'POST',
  priority: 'low',
  body: JSON.stringify({ event: 'dashboard_viewed' }),
});
```

**Why it matters:** `priority: 'low'` tells the browser's network scheduler to yield bandwidth to the card metrics and chart data first. The analytics event is sent — just not at the expense of LCP.

---

## Congratulations!

**What you covered:**

- ✅ Installed Modern Web Guidance and set a Baseline target
- ✅ Added anchored zero-JS tooltips to `SectionCards` trend badges
- ✅ Fixed INP in `DataTable`'s @dnd-kit initialization using `scheduler.yield()`
- ✅ Measured the bundle impact: 0 KB added for both features
- ✅ Wired native passkeys into `NavUser`
- ✅ Deprioritized analytics fetches to unblock dashboard LCP

**Next Steps:**

- Try the Agentic Web skill (WebMCP) for exposing structured dashboard tools to AI agents
- Set `Baseline: Widely Available 2024` to unlock newer APIs with built-in fallbacks
- Apply `scheduler.yield()` to the DataTable's tab-switch render for a second INP win

---

## Resources & Connect

### 📚 Resources

- **GitHub Repository**: [Modern-Web-Guidance-Demo](https://github.com/JesseMurah/Modern-Web-Guidance-Demo)
- **Popover API**: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- **CSS Anchor Positioning**: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning)
- **scheduler.yield()**: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield)
- **Fetch Priority**: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/fetch#priority)

### 🤝 Connect

**Jesse Murah**

- 💼 LinkedIn: [Jesse Murah](https://linkedin.com/in/JesseMurah)
- 🐙 GitHub: [@JesseMurah](https://github.com/JesseMurah)

---

**Credit to Unstacked Labs.**

Have Fun! 🚀
