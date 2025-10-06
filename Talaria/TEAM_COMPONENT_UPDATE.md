# Team Component Update

## Changes Made

Updated the team component (`src/components/team.tsx`) to display **only 2 team members** with a modern, professional design.

### New Team Members

1. **Meet Bhagdev**
   - Role: Lead Developer - Project Manager
   - Avatar: https://ui.shadcn.com/avatars/01.png

2. **Harsh Patel**
   - Role: Hardware Engineer - System Designer
   - Avatar: https://ui.shadcn.com/avatars/02.png

### Design Features

#### Visual Effects
- **Grayscale images** that turn to color on hover
- **Smooth animations**: Images expand slightly when hovered
- **Slide-up animations**: Role and profile link appear on hover
- **Tracking effect**: Name text expands on hover

#### Layout
- **2-column grid** on desktop (sm:grid-cols-2)
- **Responsive design** that adapts to mobile, tablet, and desktop
- **Top border** with "Team" label
- **Split header**: Title on left, description on right

#### Content Structure
- **Section title**: "Our dream team"
- **Description**: Brief explanation of team expertise
- **Member cards**: Each showing:
  - Large image (h-96) that expands on hover
  - Name with tracking animation
  - Index number (_01, _02)
  - Role (appears on hover)
  - Profile link (appears on hover)

### Technical Implementation

```typescript
const members = [
    {
        name: 'Meet Bhagdev',
        role: 'Lead Developer - Project Manager',
        avatar: 'https://ui.shadcn.com/avatars/01.png',
        link: '#',
    },
    {
        name: 'Harsh Patel',
        role: 'Hardware Engineer - System Designer',
        avatar: 'https://ui.shadcn.com/avatars/02.png',
        link: '#',
    },
]
```

### Styling Details

- **Background**: Transparent to blend with wave background
- **Text colors**: Slate-900 for headings, slate-700/600 for body text
- **Transitions**: All animations use 300-500ms duration
- **Hover states**: Multiple coordinated animations
- **Border**: Top border with floating label

### Usage

The component is already integrated into the team page:
- Navigate to `/team` to see the updated design
- Works with the existing wave background
- Maintains responsive design across all screen sizes

### Customization

To customize team members, edit the `members` array in `src/components/team.tsx`:
- Change `name` and `role` fields
- Update `avatar` URLs (can use custom images or placeholder services)
- Modify `link` to point to team member profiles/social media

### Animation Timeline

1. **Default state**: Grayscale image, name and index visible
2. **On hover**:
   - Image transitions to color (500ms)
   - Image height increases slightly (500ms)
   - Border radius increases (500ms)
   - Name tracking expands (500ms)
   - Role slides up and fades in (300ms)
   - Profile link slides up and fades in (500ms)

## View the Changes

Visit **http://localhost:3001/team** to see the updated team component with 2 members!
