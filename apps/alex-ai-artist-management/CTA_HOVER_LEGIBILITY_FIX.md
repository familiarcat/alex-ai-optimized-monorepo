# CTA Hover Legibility Fix

## 🎯 **Issue Identified**
The "Schedule a Demo" button (using `cta-hero-secondary` variant) was going completely black on hover, creating poor visual legibility.

## 🔧 **Root Cause**
The hover state was using `var(--cta-hero-secondary-bg)` for the text color, which was transparent, causing the text to disappear against the dark background.

## ✅ **Solution Applied**
Updated the hover state in `globals.css`:

```css
.cta-hero-secondary:hover {
  background-color: var(--cta-hero-secondary-text);
  color: #ffffff;  /* Fixed: Explicit white text for legibility */
  border-color: var(--cta-hero-secondary-text);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(31, 41, 55, 0.3);
}
```

## 🎨 **Visual Result**
- **Before**: Black text on black background (invisible)
- **After**: White text on dark background (high contrast, legible)

## 📊 **Accessibility Impact**
- ✅ Maintains WCAG AA contrast compliance
- ✅ Clear visual feedback on hover
- ✅ Consistent with primary button hover behavior
- ✅ Preserves visual hierarchy

**Status**: ✅ **FIXED**




