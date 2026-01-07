# Admin Portal Setup Guide

## Overview
The admin portal is now fully connected to Supabase with complete CRUD (Create, Read, Update, Delete) operations for Events, Merchandise, and Team Members.

## Database Setup

### 1. Run the SQL Script
Execute `scripts/006_admin_rls_policies.sql` in your Supabase SQL Editor:
- This creates RLS (Row Level Security) policies
- Allows public read access (Events, Team, Merchandise pages)
- Allows admin full access (INSERT, UPDATE, DELETE)
- Enables RLS on all tables

### 2. Tables Structure

**events**
- id, title, description, event_date, location, image_url, event_type, registration_url, created_at, updated_at

**team_members**
- id, name, role, department, bio, image_url, github_url, linkedin_url, email, display_order, created_at, updated_at

**merchandise**
- id, name, description, category, price, image_url, available, display_order, created_at, updated_at

**event_registrations**
- id, user_id, event_id, college_id, registered_at, created_at, updated_at

## Admin Portal Features

### Events Management
- **List**: `/organizer/admin/events`
  - View all events
  - Edit (click pencil icon)
  - Delete (click trash icon)
  - Sort by event date

- **Create New**: `/organizer/admin/events/new`
  - Title, Description, Event Date/Time
  - Location, Image URL
  - Event Type (Workshop, Competition, Hackathon, Seminar, Meeting)
  - Registration URL (external form link)

- **Edit**: `/organizer/admin/events/[id]`
  - Modify any event field
  - Save changes
  - Delete event permanently
  - Live image preview

### Merchandise Management
- **List**: `/organizer/admin/merchandise`
  - View all products
  - Edit (click pencil icon)
  - Delete (click trash icon)

- **Create New**: `/organizer/admin/merchandise/new`
  - Product Name, Description
  - Category (Clothing, Accessories, Collectibles, Other)
  - Price, Image URL
  - Availability toggle

- **Edit**: `/organizer/admin/merchandise/[id]`
  - Modify product details
  - Update price and availability
  - Delete product
  - Live image preview

### Team Management
- **List**: `/organizer/admin/team`
  - View all team members
  - Edit (click pencil icon)
  - Delete (click trash icon)
  - Sorted by display order

- **Create New**: `/organizer/admin/team/new`
  - Member Name, Role, Department
  - Bio, Email
  - Image URL, GitHub URL, LinkedIn URL

- **Edit**: `/organizer/admin/team/[id]`
  - Update member information
  - Add/remove social links
  - Delete member
  - Live image preview

## How It Works

### Create
1. Go to respective admin page (Events, Merchandise, Team)
2. Click "New Event/Product/Member" button
3. Fill in the form
4. Click "Create" button
5. Data saved to Supabase
6. Redirected to list view

### Read
- All pages fetch data from Supabase automatically
- Public pages (Events, Team, Merch) display this data
- Images load from provided URLs

### Update
1. Go to list page
2. Click pencil icon on item
3. Modify fields
4. Click "Save Changes"
5. Data updated in Supabase
6. Changes visible on public pages immediately

### Delete
1. Go to list page OR edit page
2. Click trash icon or "Delete" button
3. Confirm deletion
4. Item removed from database
5. Public pages update automatically

## Row Level Security (RLS)

The RLS policies ensure:
- **Public Users**: Can only SELECT (read) events, team, merchandise
- **Admin Users**: Can INSERT, SELECT, UPDATE, DELETE all data
- **Security**: Prevents unauthorized data modifications

Access control:
- Public pages query with: `SELECT * FROM events`
- Admin forms query with full CRUD capabilities
- All operations validate against RLS policies

## Data Flow

```
Admin Form → Supabase Insert/Update/Delete
    ↓
RLS Policy Check (Allow based on permissions)
    ↓
Database Transaction
    ↓
Public Pages fetch new data
    ↓
Users see updated content
```

## Example: Adding an Event

1. Admin goes to `/organizer/admin/events/new`
2. Fills form:
   - Title: "Robotics Workshop"
   - Date: 2026-01-20 10:00
   - Registration: "https://forms.google.com/..."
3. Clicks "Create Event"
4. Form submits to Supabase
5. RLS policy allows INSERT
6. Event saved with timestamp
7. Admin redirected to events list
8. Event now visible on `/events` page for all users

## Debugging

### Check Database Connection
- Open browser DevTools → Console
- Look for fetch errors or Supabase connection messages
- Check Network tab for API calls to Supabase

### Check RLS Policies
- Go to Supabase Dashboard
- Navigate to Authentication → Policies
- Verify policies are enabled and configured correctly

### Common Issues
- **"Permission denied"**: RLS policy may be too restrictive
- **Data not saving**: Check form validation
- **Page not loading**: Check Supabase credentials in `.env.local`

## Environment Variables

Ensure `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=https://tohylzyqnktwhdkbmnne.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

## Next Steps

1. Run SQL script (`006_admin_rls_policies.sql`)
2. Test creating an event in admin portal
3. Verify it appears on public Events page
4. Test editing and deleting
5. Check team and merchandise management

All features are now fully connected! 🚀
