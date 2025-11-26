# Design Guidelines: AI-Powered Fitness Application

## Design Approach
**System Selected**: Material Design  
**Rationale**: Information-dense fitness tracking requires clear data hierarchy, strong visual feedback for user actions, and familiar patterns for forms and dashboards. Material Design excels at organizing complex data while maintaining clarity and usability.

## Typography System
- **Primary Font**: Roboto (Google Fonts CDN)
- **Headings**: Roboto Medium (500) - Dashboard titles (text-2xl), Section headers (text-xl), Card titles (text-lg)
- **Body Text**: Roboto Regular (400) - Forms, descriptions, data labels (text-base)
- **Metrics/Numbers**: Roboto Medium (500) - BMI scores, calorie counts, statistics (text-3xl for primary metrics, text-xl for secondary)
- **Captions**: Roboto Regular (400) - Timestamps, helper text (text-sm)

## Spacing System
**Tailwind Units**: Consistently use 4, 6, 8, 12, 16 for all spacing
- Component padding: p-6 or p-8
- Section spacing: mb-8 or mb-12
- Card gaps: gap-6
- Form field spacing: space-y-4
- Page margins: px-4 md:px-8

## Layout Structure

### Dashboard (Primary View)
- **Container**: max-w-7xl mx-auto px-4
- **Grid Layout**: 3-column on desktop (lg:grid-cols-3), 2-column on tablet (md:grid-cols-2), single column on mobile
- **Stat Cards Row**: 3 cards showing BMI Status, Weekly Calories, Exercise Completion
- **Main Content Area**: 2-column split (Activity Feed + Quick Actions)

### BMI Calculator Page
- **Centered Form**: max-w-2xl mx-auto
- **Form Layout**: Single column with clear field grouping
- **Results Display**: Large metric card with visual indicator (gauge/progress ring)
- **Recommendation Panel**: AI-generated insights below results

### Exercise Recommendations
- **Filter Sidebar**: Fixed left sidebar (w-64) on desktop, collapsible on mobile
- **Exercise Grid**: 2-column on desktop (lg:grid-cols-2), single column on mobile
- **Card Structure**: Exercise image/icon, title, duration, difficulty badge, AI reasoning snippet

### Food Calorie Tracker
- **Input Section**: Prominent text area for meal description with "Analyze" button
- **Results Card**: Calorie count (large), macronutrient breakdown (horizontal bars), AI analysis
- **History List**: Reverse chronological with date headers, meal summaries, calorie totals

## Component Library

### Cards
- Elevated cards with subtle shadow (shadow-md)
- Rounded corners (rounded-lg)
- Consistent internal padding (p-6)
- Header with icon + title + action button layout

### Forms
- Full-width inputs with labels above
- Input fields with border (border-gray-300), rounded corners (rounded-md), padding (px-4 py-3)
- Focus states with ring (focus:ring-2)
- Helper text below fields (text-sm)
- Submit buttons full-width on mobile, inline on desktop

### Buttons
- Primary: Solid fill, rounded-md, px-6 py-3, font-medium
- Secondary: Outlined, same sizing
- Icon buttons: Square (w-10 h-10), centered icon
- Floating Action Button: Fixed bottom-right for quick meal/exercise logging

### Data Visualization
- Progress bars: Horizontal, rounded-full, height h-3, with percentage label
- Stat badges: Pill-shaped (rounded-full), px-3 py-1, text-sm
- Charts: Use Chart.js for calorie trends and exercise frequency

### Navigation
- Top app bar: Fixed, full-width, h-16, with logo left, nav center, profile right
- Mobile: Hamburger menu transitioning to bottom navigation
- Active state: Border-bottom or background highlight

## Images

### Hero Section (Landing/Welcome)
**Image Description**: Athletic person using smartphone in modern gym environment, bright natural lighting, motivational atmosphere
**Placement**: Full-width hero (h-96), content overlaid with gradient overlay (bottom-to-top dark gradient)
**Content Over Image**: Headline (text-4xl font-bold), subtitle, dual CTAs with blurred background buttons

### Dashboard
**No hero image** - prioritize immediate data visibility

### Exercise Recommendation Cards
**Placeholder**: Icon-based illustrations from Heroicons (academic-cap for strength, heart for cardio, etc.)

## Animation Guidelines
**Minimal Use**:
- Card hover: Subtle lift (translateY(-2px)) with shadow increase
- Button press: Scale feedback (scale-95)
- Loading states: Spinner for AI processing only
- Page transitions: None - instant navigation for efficiency

## Accessibility Standards
- Form inputs: Always paired with visible labels
- Color contrast: Minimum 4.5:1 for all text
- Focus indicators: Visible ring on all interactive elements
- ARIA labels: All icon-only buttons
- Keyboard navigation: Full support for forms and navigation

## Mobile Optimization
- Touch targets: Minimum 44px height for all interactive elements
- Bottom sheet pattern: For filters and secondary actions
- Sticky headers: Keep context visible during scroll
- Single column layouts: Stack all multi-column content on mobile