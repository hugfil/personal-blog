---
title: "I tested my own blog (and it failed) 🧪"
description: "A tester's website with no tests? I added links, accessibility, SEO and Lighthouse checks before every deploy, with an AI pair. Here's what broke."
pubDate: 2026-11-21
tags: [Blog, AI, Testing, Playwright, Accessibility, SEO]
draft: false
---

There's an old saying about the shoemaker's children going barefoot. 👞 Mine goes like this: the tester's blog had zero tests.

Time to fix that. It's also the first real experiment of the "AI joins the test team" series: I built the safety net with an AI assistant as my pair. Ground rules as promised: AI assists, I decide. 🤝

## 🛡️ The safety net

Before every deploy, four checks now run on GitHub Actions. If any of them fails, nothing goes live:

- 🔗 **Links:** every internal link, image, stylesheet and script on every page must load.
- ♿ **Accessibility:** [axe-core](https://github.com/dequelabs/axe-core) checks each page against WCAG 2.1 A/AA, in **light and dark mode**.
- 🔍 **SEO guards:** title, description, canonical URL, preview image and exactly one `<h1>` per page.
- 🚦 **Lighthouse:** accessibility and SEO must score at least 95, or the build fails.

The page list comes straight from the sitemap, so every new post gets tested without me touching a thing.

## 🧪 SITE-001: Run the tests on my own blog

| Field | Value |
|---|---|
| **Expected result** | All green. It's a small blog, how bad can it be? 😇 |
| **Actual result** | 🔴 4 failures |
| **Bugs found** | About and Resume had no `<h1>` · grey text on the Resume cards had a 4.35:1 contrast ratio in light mode (WCAG asks for 4.5:1) |
| **Status** | ✅ **Fixed:** proper headings, and a slightly darker grey (now 5.2:1) |

Nobody would have reported these. Screen readers and search engines would just have struggled with them. That's exactly the kind of bug automation is good at. 🎯

## 🎢 Plot twists

**1. The test that tested nothing.** The first link checker came back green: *"Successfully scanned 0 links."* ✅ Zero links. On a whole website. A green test that checks nothing is worse than a red one, because it lies with confidence. I replaced it with a Playwright test that **fails if it doesn't find any links**.

**2. The test that broke itself.** The 404 page sends you home after 5 seconds. To keep the test still, my AI pair froze *all* the page's timers. axe-core uses timers too, so it froze with them. 🥶 The fix was to cancel only the redirect. AI-written tests still need a human reading the failures.

**3. Flaky ≠ broken.** Locally, a different set of tests crashed on every run. When the failures keep moving, suspect the environment, not the code. The culprit: too many browsers in parallel for a work laptop. Capping it at two made the noise go away.

**4. The 404 that's supposed to be there.** The "Full CV" button points to a 404 on purpose (no PDF yet). The test knows that, and the code says when to remove the exception. Tests are documentation too. 📝

## 💡 What I'm taking away

- ✅ **Check your checks:** a pass with zero assertions is a fail.
- 🌗 **Test both themes:** a colour that passes in one mode can fail in the other. Mine failed in light mode, the one I'd have bet on.
- 🤖 **AI is a fast pair, not an oracle:** it wrote most of the setup in minutes, and one of the bugs too. Reviewing still matters.
- 🚧 **Quality as a gate:** if a broken link can't be deployed, it won't be.

The blog now refuses to publish itself if it's broken. I wish more software had that attitude. 😄

Got a check you'd add to the safety net? I'd love to hear it.

*Hugo* ✨
