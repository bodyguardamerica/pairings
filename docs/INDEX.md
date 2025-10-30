# DOCUMENTATION INDEX - Pairings Project

**Last Updated:** October 26, 2025  
**Last Sync & Consolidation:** October 2025  
**Purpose:** Guide for navigating project documentation and delegating to other Claude instances

---

## Documentation Sync Status

**October 2025 - Major Documentation Cleanup:**
- ✅ All inconsistencies resolved across documentation
- ✅ API paths, endpoints, and counts standardized (26 endpoints)
- ✅ Terminology unified (CP/AP, SR2025 scenarios)
- ✅ Canonical auth approach established (Supabase Auth)
- ✅ Redundant status documents consolidated
- ✅ Phase 0 documents merged into PHASE_0_SUMMARY.md
- ✅ Admin features marked as planned for Phase 3

---

## Document Overview

This project has comprehensive documentation to enable effective collaboration between multiple Claude instances (e.g., Claude Web for coordination, Claude for VS Code for implementation).

### Core Documents

| Document | Purpose | Use When |
|----------|---------|----------|
| **README.md** | Project overview and quick start | First introduction to the project |
| **ARCHITECTURE.md** | System design, tech stack, modules | Understanding overall system design |
| **DATABASE.md** | Complete database schema | Working on data models or queries |
| **API.md** | API specification | Building or consuming APIs |
| **API_IMPLEMENTED.md** | All 26 implemented endpoints | Building frontend or testing backend |
| **ROADMAP.md** | Development timeline | Planning work or checking priorities |
| **DEPLOYMENT.md** | Hosting and deployment | Setting up environments |
| **PROJECT_STATUS_UPDATED.md** | Current project status | Checking what's been built |
| **PHASE_0_SUMMARY.md** | Phase 0 critical features | Reference for pre-launch features |

---

## How to Use This Documentation

### For Project Coordinator (Claude Web)

**Your Role:**
- Maintain project vision and architecture
- Review proposed changes
- Make design decisions
- Update documentation
- Delegate implementation tasks

**Key Documents:**
- ARCHITECTURE.md - Reference for all architectural decisions
- ROADMAP.md - Track progress and priorities
- This file - Guide delegation

**When Delegating Tasks:**
1. Identify which document(s) are relevant
2. Point implementer to specific sections
3. Provide additional context if needed
4. Review completed work against documentation

---

### For Implementation (Claude for VS Code)

**Your Role:**
- Implement features based on specs
- Write clean, documented code
- Follow established patterns
- Report issues or ambiguities back

**Key Documents:**
- ARCHITECTURE.md - Understand system structure
- DATABASE.md - Reference schema when working with data
- API.md - Follow endpoint specifications
- DEPLOYMENT.md - Set up local environment

**Before Starting Work:**
1. Read relevant documentation sections
2. Understand the feature's place in architecture
3. Note any dependencies
4. Ask coordinator for clarification if needed

---

## Task Delegation Templates

### Example 1: Backend Feature

**From Coordinator to Implementer:**

```
I need you to implement the Swiss pairing algorithm for Warmachine tournaments.

Reference Documents:
- ARCHITECTURE.md → "Warmachine Module Specifications" section
- DATABASE.md → Tables: tournaments, rounds, matches, tournament_entries
- API.md → POST /tournaments/:tournamentId/rounds

Key Requirements:
- First round: Random pairings
- Subsequent rounds: Pair by tournament points
- No rematches
- Handle byes for odd numbers
- Implement "pairing down" logic

The algorithm specs are detailed in ARCHITECTURE.md under 
"Warmachine Module Specifications → Tournament Structure → Pairing Algorithm"

Please:
1. Create src/modules/warmachine/pairing.js
2. Implement the algorithm according to specs
3. Write tests for edge cases
4. Document any ambiguities you find
```

---

### Example 2: Frontend Screen

**From Coordinator to Implementer:**

```
Create the tournament standings screen for the mobile app.

Reference Documents:
- ARCHITECTURE.md → "Core Features → Live Features"
- API.md → GET /tournaments/:tournamentId/standings
- ROADMAP.md → Phase 1.4: Match Results & Standings

Requirements:
- Display current rankings
- Show: Rank, Player Name, TP, VP, Army Destroyed, SoS, Record
- Refresh in real-time
- Sort by ranking
- Color-code players (e.g., dropped = gray)

Design should match existing screens in /frontend/src/screens.
Use the standings data structure from API.md.
```

---

### Example 3: Database Work

**From Coordinator to Implementer:**

```
Create migration for the Warmachine module tables.

Reference Documents:
- DATABASE.md → "Warmachine-Specific Tables" section

Create migration file for:
- warmachine_scenarios
- warmachine_armies  
- warmachine_match_details

Include:
- All fields from DATABASE.md
- Indexes as specified
- Foreign key constraints
- Check constraints

Also seed warmachine_scenarios with the 6 official scenarios
from ARCHITECTURE.md → "Warmachine Module Specifications → Scenarios"
```

---

## Common Delegation Patterns

### Pattern 1: "Implement X according to spec"

When specs are fully documented:

```
Implement [feature name] according to specifications in 
[DOCUMENT.md] → [Section].

Follow the API contract in API.md.
Use the database schema from DATABASE.md.
```

---

### Pattern 2: "Research and propose"

When design decisions are needed:

```
Research [topic/approach] and propose a solution for [problem].

Context is in ARCHITECTURE.md → [Section].
Consider the constraints in ROADMAP.md → [Phase].

Please propose:
1. Approach options (2-3)
2. Pros/cons of each
3. Your recommendation with rationale
```

---

### Pattern 3: "Fix and improve"

For existing code:

```
Review [component/file] and improve [aspect].

Current implementation is in [path].
Specification is in [DOCUMENT.md] → [Section].

Look for:
- Performance issues
- Code clarity
- Adherence to spec
- Edge cases
```

---

## Updating Documentation

### When to Update

**Coordinator Updates:**
- Design decisions
- Architecture changes
- New features planned
- Priorities shifted

**Implementer Reports:**
- Ambiguities found
- Specs incomplete
- Technical constraints discovered
- Better approaches identified

### How to Update

1. **Identify affected documents**
   - Architecture change → ARCHITECTURE.md
   - Database change → DATABASE.md + ARCHITECTURE.md
   - API change → API.md + ARCHITECTURE.md
   - Timeline change → ROADMAP.md

2. **Make changes clearly**
   - Update "Last Updated" date
   - Keep old information if historically relevant
   - Add comments for significant changes

3. **Cross-reference**
   - If changing affects multiple docs, update all
   - Maintain consistency across documents

---

## Documentation Principles

### 1. Single Source of Truth

Each piece of information should live in exactly one place:
- **Tech stack** → ARCHITECTURE.md
- **Database tables** → DATABASE.md
- **API endpoints** → API.md
- **Timeline** → ROADMAP.md

### 2. Hierarchical Detail

- **README.md** - High-level overview
- **ARCHITECTURE.md** - System design and key decisions
- **Specialized docs** - Deep implementation details

### 3. Explicit is Better

When delegating:
- Name specific document sections
- Quote relevant requirements
- Provide examples
- State assumptions explicitly

### 4. Living Documents

Documentation should evolve with the project:
- Update as decisions are made
- Refine based on implementation learnings
- Remove outdated information
- Add lessons learned

---

## Quick Reference

### "Where do I find...?"

**Tech stack decisions** → ARCHITECTURE.md → "Tech Stack"

**Database table structure** → DATABASE.md → Search for table name

**API endpoint specs** → API.md → Search for endpoint

**Warmachine pairing rules** → ARCHITECTURE.md → "Warmachine Module Specifications"

**What to build next** → ROADMAP.md → Current phase

**How to deploy** → DEPLOYMENT.md → Choose scenario

**User roles & permissions** → ARCHITECTURE.md → "User Roles"

**File structure** → ARCHITECTURE.md → "File Structure"

**Tiebreaker logic** → ARCHITECTURE.md → "Warmachine Module → Scoring System"

**How matches are recorded** → DATABASE.md → "matches" table

**How standings are calculated** → DATABASE.md → "Views" + Functions

---

## Handling Ambiguities

### If Specs Are Unclear

1. **Check all relevant documents** - Answer might be elsewhere
2. **Look for similar features** - Patterns may be established
3. **Ask coordinator** - Better to clarify than guess
4. **Document the question** - Others may have same issue

### If Specs Conflict

1. **Flag the conflict immediately**
2. **Note which documents conflict**
3. **Propose resolution**
4. **Wait for coordinator decision**
5. **Update all affected documents**

### If Specs Are Missing

1. **Document what's missing**
2. **Propose reasonable approach**
3. **Implement with clear comments**
4. **Suggest spec addition**

---

## Communication Protocol

### Implementer → Coordinator

**Report Format:**
```
Task: [Task description]
Status: [In Progress / Blocked / Complete]
Documents Referenced: [List]
Issues Found: [Any problems or ambiguities]
Questions: [Specific questions]
```

**Example:**
```
Task: Implement Swiss pairing algorithm
Status: Complete
Documents Referenced: ARCHITECTURE.md, DATABASE.md
Issues Found: 
  - Pairing down not specified for multiple odd brackets
  - Bye priority unclear when multiple players at 0 TP
Questions:
  - Should byes be awarded randomly or by registration order?
```

---

### Coordinator → Implementer

**Task Assignment Format:**
```
Task: [Clear task description]
Priority: [High / Medium / Low]
References: [Specific document sections]
Context: [Why this task matters]
Definition of Done: [Clear completion criteria]
```

---

## Version Control Notes

**When committing code:**
- Reference issue/task number
- Mention relevant doc sections
- Link to specifications

**Example commit:**
```
git commit -m "Implement Swiss pairing (ARCHITECTURE.md → Warmachine Module)

- Random first round
- Tournament point pairing
- No rematch checking
- Bye assignment

Refs #12"
```

---

## Document Maintenance Schedule

### Weekly
- [ ] Check ROADMAP.md progress
- [ ] Update task statuses
- [ ] Note any blockers

### After Each Phase
- [ ] Update ARCHITECTURE.md with decisions made
- [ ] Refine DATABASE.md if schema changed
- [ ] Update API.md with new endpoints
- [ ] Review ROADMAP.md timeline

### Before Major Milestones
- [ ] Full documentation review
- [ ] Consistency check across docs
- [ ] Remove outdated information
- [ ] Update all "Last Updated" dates

---

## Tips for Effective Collaboration

### For Coordinators
1. Be specific when delegating
2. Point to exact document sections
3. Provide context, not just tasks
4. Review work against specs
5. Keep docs updated

### For Implementers
1. Read relevant docs before starting
2. Ask questions early
3. Follow established patterns
4. Report ambiguities
5. Suggest improvements

### For Both
1. Assume good faith
2. Over-communicate rather than under
3. Document decisions
4. Keep it DRY (Don't Repeat Yourself)
5. Think about future readers

---

## Success Metrics

**Good Documentation:**
- ✅ New contributor can start in < 1 hour
- ✅ Clear answers to "why" questions
- ✅ Specs match implementation
- ✅ Minimal back-and-forth for clarification
- ✅ Easy to find information

**Poor Documentation:**
- ❌ Unclear what to build
- ❌ Conflicting information
- ❌ Out of date
- ❌ Missing key details
- ❌ Difficult to navigate

---

## Next Steps

1. **Coordinator:** Review all documents, familiarize with structure
2. **Implementers:** Read ARCHITECTURE.md and DEPLOYMENT.md
3. **Everyone:** Reference this index when unsure where to look
4. **Everyone:** Keep documentation updated as project evolves

---

**Remember:** Good documentation is an investment. Taking time to document properly saves time debugging, reduces rework, and enables parallel development.

---

**Document Version:** 1.0  
**Last Updated:** October 22, 2025  
**Next Review:** After Phase 0 completion
