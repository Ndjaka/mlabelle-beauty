<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context Familiarization
**CRITICAL RULE**: Before starting any task, you MUST read the project context skill located at `.agent/skills/project-context/SKILL.md` to understand the tech stack, constraints, architecture, and non-negotiable rules.

# Clean Code Verification
**CRITICAL RULE**: At the end of every new implementation, refactoring, or feature addition, you MUST automatically run the clean code verification step by strictly following the instructions in `.agent/skills/clean-code-verification/SKILL.md`. Do not wait for the user to ask for it.

# Testing Requirements
**CRITICAL RULE**: For every new implementation or feature, you MUST write unit tests covering the new logic (especially for features, utils, and database interactions). Ensure tests are placed alongside the code or in dedicated test folders according to the project conventions, and always verify that `npm test` passes before delivering the work.

# Planning Requirements
**CRITICAL RULE**: Before writing any code for a complex task, you MUST read the existing code and create an Implementation Plan. Wait for the user to approve the plan before executing any code changes.

# Database Management
**CRITICAL RULE**: Never modify the database schema directly via code. If a schema change is needed, you MUST generate a proper Supabase migration file in `supabase/migrations/` and ask the user to run it.

# Anti-Regression
**CRITICAL RULE**: Before modifying an existing feature, identify if it has unit tests. If it does, run them first to understand the baseline. You must ensure all existing tests pass before delivering your work.

# Skills Maintenance
**CRITICAL RULE**: If you introduce a new architectural pattern, a new core library, or a significant change to the project's structure, you MUST update the relevant skill files in `.agent/skills/` (such as `project-context/SKILL.md` or `architecture/SKILL.md`) so that future agents are aware of the new rules and patterns.
