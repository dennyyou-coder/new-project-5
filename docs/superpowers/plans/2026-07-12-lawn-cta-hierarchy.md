# Lawn CTA Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen Lawn page CTA visibility without allowing editorial links to compete with inquiry actions.

**Architecture:** Extend the existing sourcing verifier with Lawn-scoped CTA style contracts, then add scoped CSS for card alignment, tertiary article buttons, hover states and keyboard focus. No component behavior or tracking data changes are required.

**Tech Stack:** Next.js 15, CSS, Node verification script

## Global Constraints

- Do not change CTA copy, URLs, Tally attributes, forms or Pool Robots.
- Scope every new rule beneath `.sourcing-lawn-page`.
- Preserve solid primary, outlined secondary and light editorial hierarchy.

---

### Task 1: Add the Lawn CTA hierarchy

**Files:**
- Modify: `scripts/verify-sourcing-seo.mjs`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: existing `.sourcing-v3-button`, secondary CTA classes and Related Intelligence card markup
- Produces: lawn-scoped editorial button, aligned card layout and shared interaction states

- [ ] Add failing assertions for the Lawn editorial CTA, card flex layout and focus-visible rule.
- [ ] Run the sourcing verifier and confirm the new checks fail.
- [ ] Add the minimal scoped CSS for aligned cards, light-blue article buttons, hover and focus-visible states.
- [ ] Run the verifier and responsive browser checks on desktop and mobile; confirm Pool isolation.
- [ ] Run the production build, commit the two implementation files, push and confirm a Ready Preview.
