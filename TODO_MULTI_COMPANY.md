# Multi-Company Implementation TODO

## High Priority - Data Context
1. Update `loadData()` in useDataContext.ts to:
   - Load companies first
   - Set first company as currentCompany
   - Filter all queries by currentCompany.id
   
2. Update `addUser()` to require and set company_id
3. Update `addProject()` to require and set company_id  
4. Add `addCompany()` function
5. Update all data operations to be company-scoped

## Medium Priority - UI Components
6. Create `CompanySwitcher.tsx` component
7. Create `AddCompanyModal.tsx` component
8. Add company selection to user creation flow
9. Add company badge/display in navigation

## Low Priority - Authentication
10. Integrate with Supabase Auth
11. Link users to companies via auth metadata
12. Implement role-based access (admin, worker, etc.)

## Current Workaround
The app currently shows ALL data regardless of company. This is acceptable for initial testing but **not for production**.

See `hooks/useDataContext.ts` for the main file needing updates.

