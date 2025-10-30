# Documentation and API Inconsistencies

**Status:** All resolved as of October 2025  
**Purpose:** Historical record of inconsistencies that were fixed across documentation.

Note: Line numbers reference the pre-consolidation repository snapshot as of Oct 2025.

---

## 1) Backend status vs readiness [DONE]
- Updated `backend/README.md` to reflect implemented backend and reference `README_COMPLETE.md`.
- Adjusted `README.md` status sections to reflect backend complete; frontend in progress.

## 2) API response envelope and endpoint counts differ [DONE]
- Unified response format to flat in `docs/API.md`.
- Reconciled counts to 26 in `docs/API_IMPLEMENTED.md` and `README.md`.

## 3) Auth mechanism discrepancy (Supabase Auth vs local bcrypt) [DONE]
- Canonicalized Supabase Auth across docs; removed bcrypt emphasis in `README.md` and updated `PROJECT_STATUS_UPDATED.md` wording.

## 4) Auth profile endpoint path mismatch [DONE]
- Standardized on `GET /auth/profile`; updated `docs/API.md` and confirmed `frontend/README.md` matches.

## 5) Player statistics endpoint path mismatch [DONE]
- Standardized on `GET /tournaments/players/:playerId/statistics`; updated `docs/API.md` references.

## 6) Match result submission endpoint path mismatch [DONE]
- Standardized on `/tournaments/matches/:matchId/result`; updated `docs/API.md` and confirmed in `FRONTEND_REQUIREMENTS.md`.

## 7) Round and pairings endpoints mismatch [DONE]
- Removed standalone pairings endpoint from `docs/API.md`; use round resource endpoints consistently.

## 8) Admin features referenced but not cross-validated [DONE]
- `README.md` now marks admin features as "Planned for Phase 3". Admin features are future work.

## 9) Frontend feature status vs root status [DONE]
- `README.md` status updated to reflect frontend in progress; `frontend/README.md` TODOs retained.

## 10) Root README “Project Structure” doc pointers inaccurate [DONE]
- Corrected `README.md` project structure doc pointers.

## 11) Database source of truth vs implemented migrations [DONE]
- Clarified in `PROJECT_STATUS_UPDATED.md` that only core migrations are complete and referenced `docs/DATABASE.md` for planned objects.

## 12) Base URLs and prefixes [DONE]
- Normalized to Base URL `http://localhost:3000/api` in `docs/API.md`; consistent examples.

## 13) Scenario names (Warmachine) inconsistent lists [DONE]
- Updated `FRONTEND_REQUIREMENTS.md` and `docs/API_IMPLEMENTED.md` examples to SR2025 names.

## 14) Standings tiebreaker naming differences [DONE]
- Updated `docs/ARCHITECTURE.md` to CP/AP terminology; aligned examples in `docs/API.md`.

## 15) Roadmap/status conflicts [DONE]
- `README.md` status aligned with backend complete, frontend in progress; `PROJECT_STATUS_UPDATED.md` unchanged as canonical status snapshot.

## 16) Frontend API path examples vs API docs [DONE]
- `frontend/README.md` endpoint list aligned with `docs/API_IMPLEMENTED.md` and Base URL guidance retained.

## 17) Project structure diagram inaccuracies [DONE]
- Adjusted `README.md` structure section to match actual filesystem and removed misleading ticks for status.

---

## Implementation order (recommended)

1) Decide canonical auth (Supabase vs bcrypt) and update `ARCHITECTURE.md`, `README.md`, `PROJECT_STATUS_UPDATED.md` accordingly.
2) Normalize API base and response envelope; reconcile endpoint paths and counts. Update `docs/API.md`, `docs/API_IMPLEMENTED.md`, `frontend/README.md`, `FRONTEND_REQUIREMENTS.md`.
3) Fix scenario lists and tiebreaker terminology across `ARCHITECTURE.md`, `FRONTEND_REQUIREMENTS.md`, and `docs/API_IMPLEMENTED.md`.
4) Correct project structure and cross-file references in `README.md` and status docs.
5) Ensure admin feature references match implemented endpoints (either document or mark as future).
