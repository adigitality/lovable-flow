

# Kanban Board with AI Task Assistant

## Overview
A beautiful, interactive Kanban board with two columns (To-Do, In Progress), rich task cards, user authentication, and an AI-powered task management assistant — styled after the reference designs with a clean sidebar, card shadows, and a purple/indigo accent palette.

## Design & Layout
- **Sidebar** (left): Navigation with icons, user avatar, settings, dark mode toggle, and logout — inspired by the reference images
- **Main area** (center): Kanban board with two columns (To-Do, In Progress), each with a count badge and "+" button to add tasks
- **AI Chat panel** (right): Collapsible chat drawer/panel for the AI assistant
- **Color palette**: Purple/indigo accents, soft card shadows, clean white backgrounds with dark mode support
- **Responsive**: Stacked columns on mobile, collapsible sidebar

## Task Cards (Full Detail)
Each card displays:
- Title and category tag (color-coded badge)
- Subtask progress bar with count (e.g., "2/5")
- Assigned user avatars (stacked)
- Due date indicator
- Attachment and comment count icons
- Drag handle for reordering (visual only — move via dropdown/button between columns)

## Features

### Authentication
- Email/password login and signup using Supabase Auth
- User profiles with display name and avatar
- Protected routes — redirect to login if not authenticated

### Database (Supabase)
- **profiles** table: user display name, avatar
- **tasks** table: title, description, status (todo/in_progress), category, due_date, user_id
- **subtasks** table: linked to tasks, title, completed boolean
- Row-Level Security so each user only sees their own tasks

### AI Chat Assistant (Lovable AI)
- Collapsible side panel with chat interface
- Task-aware: can see and reference user's current tasks
- Can create, edit, and organize tasks via conversation
- Provides insights like prioritization suggestions
- Streaming responses with markdown rendering

### Interactions
- Add new tasks via modal form (title, description, category, due date, subtasks)
- Edit tasks inline or via modal
- Move tasks between columns via dropdown menu on each card
- Delete tasks with confirmation
- Mark subtasks complete/incomplete

