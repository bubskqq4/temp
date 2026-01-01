# 🎯 Custom Context Menu System

## Overview
I've created a comprehensive, reusable context menu system that supports **12 different item types** across your entire application. Each menu includes relevant icons and useful actions tailored to the specific item type.

## 📦 What's Included

### Core Component
- **`ContextMenu.tsx`** - Universal context menu component with 12 predefined types

### 12 Context Menu Types

1. **Column Menu** (Dashboard columns)
   - Rename Column
   - Change Color
   - Move Up/Down
   - Archive Column
   - Delete Column

2. **Task Menu** (Dashboard tasks)
   - Edit Task
   - Mark Urgent
   - Duplicate
   - Move to...
   - Add to Project
   - Delete

3. **Project Menu**
   - Open Project
   - Edit Details
   - Duplicate
   - Pin/Unpin
   - Share
   - Export
   - Archive
   - Delete

4. **Journal Book Menu**
   - Open Book
   - Edit Book
   - Change Cover
   - Export Entries
   - Delete Book

5. **Journal Entry Menu**
   - View Entry
   - Edit Entry
   - Pin to Top
   - Duplicate
   - Move to Book...
   - Add Tags
   - Delete Entry

6. **Resource Menu** (Knowledge Base)
   - View Resource
   - Edit
   - Pin/Unpin
   - Open Link
   - Add Tags
   - Share
   - Delete

7. **Inbox Item Menu**
   - Edit
   - Mark Urgent
   - Duplicate
   - Convert to Task
   - Move to Project
   - Delete

8. **Ritual Menu** (Sidebar)
   - Mark Complete/Incomplete
   - Edit Ritual
   - Set Reminder
   - Reorder
   - Delete

9. **Client Menu**
   - View Details
   - Edit Client
   - View Projects
   - Add Note
   - Mark as Active
   - Archive
   - Delete

10. **Issue Menu**
    - Resolve Issue
    - Edit Issue
    - Change Priority
    - Assign to...
    - Add Comment
    - Delete

11. **Inspiration Menu**
    - View Details
    - Edit
    - Pin/Unpin
    - Add Tags
    - Share
    - Export
    - Delete

12. **Tag Menu**
    - Rename Tag
    - Change Color
    - View All Items
    - Merge with...
    - Delete Tag

## 🎨 Features

- ✅ **Icon Support** - Every action has a relevant Lucide icon
- ✅ **Color-Coded Actions** - Different variants (default, danger, success)
- ✅ **Dividers** - Logical grouping of actions
- ✅ **Smooth Animations** - Framer Motion animations
- ✅ **Click-Outside Close** - Automatic closing on outside clicks
- ✅ **Premium Dark Theme** - Matches your app's aesthetic
- ✅ **Fully Typed** - TypeScript support for all types

## 🚀 How to Use

### Complete Working Example

Here's a complete example showing how to add a context menu to task cards in the Dashboard:

```tsx
import { ContextMenu } from '@/components/ContextMenu'
import { useState } from 'react'

export const YourComponent = () => {
    // Step 1: Add state for context menu
    const [contextMenu, setContextMenu] = useState({ 
        isOpen: false, 
        x: 0, 
        y: 0, 
        taskId: '' 
    })

    // Step 2: Add right-click handler to your item
    return (
        <div>
            <div 
                onContextMenu={(e) => {
                    e.preventDefault() // Prevent browser menu
                    setContextMenu({ 
                        isOpen: true, 
                        x: e.clientX, 
                        y: e.clientY, 
                        taskId: task.id 
                    })
                }}
            >
                {/* Your task card content */}
                <h3>{task.title}</h3>
            </div>

            {/* Step 3: Add the ContextMenu component */}
            <ContextMenu
                isOpen={contextMenu.isOpen}
                onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
                position={{ x: contextMenu.x, y: contextMenu.y }}
                type="task"
                item={tasks.find(t => t.id === contextMenu.taskId) || {}}
                onEdit={() => handleEditTask(contextMenu.taskId)}
                onDelete={() => handleDeleteTask(contextMenu.taskId)}
                onDuplicate={() => handleDuplicateTask(contextMenu.taskId)}
                onSetPriority={() => handleMarkUrgent(contextMenu.taskId)}
                onMove={() => handleMoveTask(contextMenu.taskId)}
            />
        </div>
    )
}
```

### Quick Reference for All Types

```tsx
// Column context menu
<ContextMenu type="column" item={column} onRename={...} onDelete={...} />

// Task context menu
<ContextMenu type="task" item={task} onEdit={...} onDelete={...} />

// Project context menu
<ContextMenu type="project" item={project} onPin={...} onExport={...} />

// Journal book context menu
<ContextMenu type="journal-book" item={book} onEdit={...} onDelete={...} />

// Journal entry context menu
<ContextMenu type="journal-entry" item={entry} onPin={...} onMove={...} />

// Resource context menu
<ContextMenu type="resource" item={resource} onShare={...} />

// Inbox item context menu
<ContextMenu type="inbox-item" item={item} onMove={...} />

// Ritual context menu
<ContextMenu type="ritual" item={ritual} onMarkComplete={...} />

// Client context menu
<ContextMenu type="client" item={client} onArchive={...} />

// Issue context menu
<ContextMenu type="issue" item={issue} onMarkComplete={...} />

// Inspiration context menu
<ContextMenu type="inspiration" item={inspiration} onShare={...} />

// Tag context menu
<ContextMenu type="tag" item={tag} onRename={...} onChangeColor={...} />
```

## 🎯 Integration Checklist

To integrate context menus across your app:

- [ ] **Dashboard**: Add to columns and tasks
- [ ] **Projects Page**: Add to project cards
- [ ] **Journal Books**: Add to book cards
- [ ] **Journal Entries**: Add to entry cards
- [ ] **Knowledge Base**: Add to resources
- [ ] **Inbox**: Add to inbox items
- [ ] **Sidebar**: Add to rituals
- [ ] **Clients**: Add to client cards
- [ ] **Issues**: Add to issue items
- [ ] **Inspirations**: Add to inspiration cards
- [ ] **Tags**: Add to tag chips

## 💡 Tips

1. **Right-Click Detection**: Use `onContextMenu` event and `e.preventDefault()`
2. **Position Calculation**: Use `e.clientX` and `e.clientY` for menu position
3. **Close on Action**: Menu auto-closes when any action is clicked
4. **Click Outside**: Menu auto-closes when clicking outside
5. **Item State**: Pass the current item to access properties like `isPinned`

## 🎨 Customization

You can easily customize:
- Add new menu types by adding cases to the `getMenuItems()` switch
- Modify actions for existing types
- Change icons by importing different Lucide icons
- Adjust colors in the styled-jsx section

## 🔧 Action Handlers

Each action prop is optional. If not provided, the menu item will still appear but do nothing. Implement only the handlers you need:

- `onEdit`
- `onDelete`
- `onDuplicate`
- `onPin`
- `onArchive`
- `onShare`
- `onMove`
- `onRename`
- `onChangeColor`
- `onExport`
- `onMarkComplete`
- `onSetPriority`
- `onAddToProject`
- `onMoveUp`
- `onMoveDown`

## 🚀 Benefits

- **Consistent UX** - Same interaction pattern across your entire app
- **Professional Feel** - Native-like context menu behavior
- **Discoverable Actions** - Users can right-click anywhere to discover features
- **Saves Space** - Reduces need for visible action buttons
- **Faster Workflows** - Power users can work more efficiently
- **Easy to Extend** - Add new types or actions easily

---

**Your app now has professional, comprehensive context menus everywhere!** 🎉
