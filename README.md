# MOTKsheets

> **Media Organization Toolkit – Google Sheets-based Variant**  
> Version: Sheets Edition v1.0  
> Mode: Spreadsheet-Integrated, Serverless, Collaborative Asset Tracker  
> Audience: AI-readable specification and design document  

---

## 0. Overview

MOTK: Sheets Edition is a variant of the core MOTK (Media Organization Toolkit) that uses **Google Sheets** as its primary data layer. It is designed for distributed, serverless environments where teams collaborate using cloud-native tools without requiring any backend infrastructure or custom database deployment. 

This edition preserves the modular, metadata-centric, and production-management-focused philosophy of MOTK while adapting its implementation to the constraints and strengths of Google Sheets.

---

## 1. Core Principles

- **Spreadsheet-native**: All primary data storage and structure are handled through Google Sheets tabs (sheets).
- **Flat row model**: Each tab uses a flat row model where one row = one entity instance.
- **Entity-focused tabs**: Each sheet/tab represents one entity type (e.g., shots, assets, tasks).
- **Human-readable and script-automatable**: Structured for both manual inspection/editing and Google Apps Script automation.
- **Cross-sheet linking via UID**: Relational logic is maintained through manually or automatically managed unique identifiers.
- **Archiving and versioning**: Managed through time-based, row-based, or state-based mechanisms with optional external exports.

---

## 2. Sheet Structure

### 2.1 Entity Tabs

Each major entity within a media production workflow is mapped to one sheet/tab. Example tabs:

- `shots`
- `tasks`
- `assets`
- `versions`
- `deliveries`
- `notes`

Each sheet uses **column headers** to define fields. Columns must remain consistent in structure. All rows under a header are considered instances of that entity.

### 2.2 Field Naming Convention

- Field names are **snake_case** or **camelCase**.
- Required core fields:
  - `uid` (unique identifier, string)
  - `name` or `title` (human-readable label)
  - `status` (e.g., Ready, In Progress, Final)
  - `created_at`, `updated_at` (ISO date)

### 2.3 UID Linking Pattern

Each entity row contains a UID. When referencing another entity, the UID is used:

- Example: a task row links to a shot via `shot_uid = SHOT_0423`
- Apps Script or filtering functions may resolve the label or link
- `=HYPERLINK("#gid=12345678&range=A42", "SHOT_0423")` optional for enhanced UX

---

## 3. Apps Script Integration

Google Apps Script is optional but recommended for:

- Data validation and column enforcement
- Archiving mechanisms (see section 6)
- Auto-calculated fields (e.g. duration, progress)
- User form integration
- JSON export for interop with other tools (e.g., MOTK: Local)

Typical trigger events:
- `onEdit()` – validate updated rows
- `onFormSubmit()` – append and normalize task data
- `dailyTrigger()` – archive stale entries or generate logs

---

## 4. Data Volume Guidelines

While Google Sheets can support large datasets, performance degrades after 10,000+ rows per tab.

Recommended:

| Tab         | Max Rows | Strategy                                  |
|--------------|----------|-------------------------------------------|
| shots        | ~750     | 1 tab only                                |
| tasks        | ~2,000   | 1–3 tabs, separated by year/project       |
| versions     | ~2,000   | Append-only, archive yearly               |
| logs/notes   | ~10,000  | Rotate tabs monthly or quarterly          |

For larger volumes:
- Use append-only archival tabs (`versions_2024`, `notes_Q2_2025`)
- Offload to BigQuery or local DB for cold storage

---

## 5. View, Filter & Sort

MOTK: Sheets relies on **filter views** for contextual displays.

Example views:
- `shots`: `status = "In Progress"`
- `tasks`: `assigned_to = "user@example.com"`
- `notes`: `linked_uid = "SHOT_0423"`

### 5.1 Conditional Formatting
Used for highlighting:
- Late tasks (due_date < today, status != Final)
- Notes marked as urgent
- Inactive shots (no tasks in past X days)

---

## 6. Archiving & Rotation

Multiple strategies can be used together:

### 6.1 By Row Count
If tab > 750–1,000 rows, auto-create new tab:
- `tasks_001`, `tasks_002`
- Apps Script handles rollover + reference continuity

### 6.2 By Date
Auto-archive rows where `updated_at < NOW() - X days` to a dated archive tab:
- `archived_tasks_2024`

### 6.3 By Manual Trigger
Manual archive via menu item (custom Apps Script UI)
- Select range → "Archive Selected to Tab"

All archives retain full row fidelity (same headers).

---

## 7. Data Integrity Policies

- Never delete UID-bearing rows unless explicitly purged
- Archived entries must include timestamp of archival
- Changes to core fields (e.g., name, link) must trigger `updated_at`
- Deleted rows are exported to `.csv` with deletion metadata if possible

---

## 8. Use Case Examples

### Example 1: Shot Tracking
| uid        | name      | status     | scene | created_at | updated_at |
|------------|-----------|------------|-------|------------|------------|
| SHOT_001   | Opening   | Final      | SC01  | 2024-10-01 | 2024-10-22 |

### Example 2: Tasks Linked to Shots
| uid        | task_type | assigned_to     | shot_uid | due_date   | status     |
|------------|-----------|------------------|----------|------------|------------|
| TASK_1023  | Compositing | artist@studio.com | SHOT_001 | 2024-10-15 | Done       |

### Example 3: Notes
| uid        | message                   | linked_uid | author     | created_at |
|------------|----------------------------|------------|------------|------------|
| NOTE_2003  | Fix matte edges on right  | TASK_1023  | lead@studio | 2024-10-14 |

---

## 9. Export & Sync Possibilities

### 9.1 JSON Export
Apps Script or Sheet2JSON publishing endpoint to export:
```json
{
  "shots": [
    {"uid": "SHOT_001", "name": "Opening", "status": "Final"},
    ...
  ]
}
```

### 9.2 Sync to MOTK: Local
- Scheduled export to `.json`
- Push to MOTK: Local API (local frontend or SQLite sync)

### 9.3 Integration Candidates
- Notion (via API + mapping)
- Blender (via CSV → scripting)
- TouchDesigner (via CSV or Google Sheets API)

---

## 10. Auth & Permissions

Use Google Sheets native sharing:

| Role        | Permission                    |
|-------------|-------------------------------|
| Viewer      | View-only                      |
| Editor      | Modify sheets, rows            |
| Script Exec | Requires Apps Script permission |

Team sharing through Drive Groups is recommended.

---

## 11. Naming Standards

| Prefix | Meaning      |
|--------|--------------|
| SHOT   | Shot entity  |
| TASK   | Task entity  |
| NOTE   | Note entity  |
| VERS   | Version      |
| ARCH   | Archive-only sheet |

---

## 12. Limitations

- No automatic version control of rows (manual UID + timestamp tracking required)
- Sheets API has quota limits (read/write frequency)
- No built-in permissions per row/entity
- Cannot handle real-time syncing between sheets without scripting

---

## 13. Recommended Extensions

- UI Layer with Glide or AppSheet for mobile UX
- Visualization dashboard with Looker Studio
- GCP BigQuery pipeline for long-term archival

---

## 14. Conclusion

MOTK: Sheets Edition offers a flexible, lightweight, and accessible way to manage media production workflows using tools already familiar to most users. It is scriptable, scalable within moderate use cases, and perfect for small-to-medium productions needing collaborative task and asset tracking without a backend.

For advanced needs, it is best combined with MOTK: Local as a hybrid pipeline.

---

**Author**: MOTK Core Team  
**Last updated**: 2025-06-17
