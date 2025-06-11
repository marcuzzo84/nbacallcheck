# Chrome Web Store Submission Checklist

## Pre-Submission Requirements

### ✅ Extension Package
- [ ] Built production version (`npm run build`)
- [ ] Manifest v3 compliance verified
- [ ] All permissions justified and minimal
- [ ] Content Security Policy properly configured
- [ ] Extension tested in Chrome latest version

### ✅ Store Assets
- [ ] Screenshots (1280x800, PNG/JPEG, 1-5 images)
- [ ] Promotional images (440x280 and 1400x560)
- [ ] Extension icon (128x128 for store)
- [ ] All images high quality and professional

### ✅ Legal Documents
- [ ] Privacy Policy completed and hosted
- [ ] Terms of Service completed and hosted
- [ ] Support/FAQ page created
- [ ] Contact information provided

### ✅ Extension Functionality
- [ ] All features working correctly
- [ ] No broken links or errors
- [ ] Proper error handling implemented
- [ ] Performance optimized
- [ ] Cross-browser compatibility tested

## Store Listing Information

### Basic Information
- **Extension Name**: NBA CallCheck
- **Category**: Sports
- **Language**: English
- **Visibility**: Public

### Description
- **Summary**: Advanced NBA referee call analysis with AI-powered insights and community voting
- **Detailed Description**: See `store-assets/chrome-web-store/description.md`
- **Key Features**: AI analysis, community voting, real-time data, analytics

### Developer Information
- **Developer Name**: NBA CallCheck Team
- **Developer Email**: developer@nbacallcheck.com
- **Developer Website**: https://nbacallcheck.com
- **Support URL**: https://nbacallcheck.com/support

### Privacy Information
- **Privacy Policy URL**: https://nbacallcheck.com/privacy
- **Permissions Justification**: 
  - `activeTab`: Access current tab for extension popup
  - `storage`: Save user preferences locally
  - Host permissions: Connect to Supabase database

## Submission Steps

### 1. Chrome Web Store Developer Console
- [ ] Log in to Chrome Web Store Developer Console
- [ ] Pay one-time $5 developer registration fee (if not already paid)
- [ ] Verify developer account

### 2. Create New Item
- [ ] Click "Add new item"
- [ ] Upload extension ZIP file
- [ ] Fill in store listing information
- [ ] Upload screenshots and promotional images

### 3. Store Listing Details
- [ ] Enter extension name and description
- [ ] Select appropriate category (Sports)
- [ ] Add relevant tags/keywords
- [ ] Set pricing (Free with in-app purchases)

### 4. Privacy Practices
- [ ] Complete privacy practices questionnaire
- [ ] Specify data collection and usage
- [ ] Provide privacy policy URL
- [ ] Justify all permissions requested

### 5. Review and Submit
- [ ] Preview store listing
- [ ] Verify all information is accurate
- [ ] Submit for review
- [ ] Monitor review status

## Post-Submission

### Review Process
- **Timeline**: 1-3 business days typically
- **Status**: Monitor in developer console
- **Communication**: Check email for updates

### If Rejected
- [ ] Review rejection reasons carefully
- [ ] Address all issues mentioned
- [ ] Update extension and/or store listing
- [ ] Resubmit for review

### If Approved
- [ ] Verify extension appears in store
- [ ] Test installation from store
- [ ] Monitor user reviews and ratings
- [ ] Respond to user feedback

## Marketing and Promotion

### Launch Preparation
- [ ] Prepare social media announcements
- [ ] Create press release
- [ ] Notify beta testers
- [ ] Update website with store links

### Ongoing Maintenance
- [ ] Monitor user reviews and respond
- [ ] Track download and usage statistics
- [ ] Plan regular updates and improvements
- [ ] Gather user feedback for future features

## Technical Considerations

### Performance
- [ ] Extension loads quickly
- [ ] Minimal memory usage
- [ ] Efficient API calls
- [ ] Proper caching implemented

### Security
- [ ] All external requests use HTTPS
- [ ] No eval() or unsafe practices
- [ ] Content Security Policy enforced
- [ ] User data properly protected

### Accessibility
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] High contrast support
- [ ] Proper ARIA labels

## Quality Assurance

### Testing Checklist
- [ ] Fresh Chrome installation test
- [ ] Multiple screen resolutions
- [ ] Different network conditions
- [ ] Error scenarios handled gracefully
- [ ] All user flows tested

### Code Quality
- [ ] No console errors or warnings
- [ ] Proper error handling
- [ ] Clean, maintainable code
- [ ] Performance optimizations applied

## Compliance

### Chrome Web Store Policies
- [ ] Content policy compliance
- [ ] User data policy compliance
- [ ] Spam and placement policy compliance
- [ ] Keyword spam avoided

### Legal Compliance
- [ ] Copyright compliance (NBA disclaimer)
- [ ] Privacy law compliance (GDPR, CCPA)
- [ ] Terms of service legally sound
- [ ] Age restrictions properly handled

---

**Submission Date**: ___________
**Review Status**: ___________
**Publication Date**: ___________
**Store URL**: ___________