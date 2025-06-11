# Firefox Add-ons Submission Checklist

## Pre-Submission Requirements

### ✅ Extension Package
- [ ] Built production version (`npm run build`)
- [ ] Manifest v3 compatibility verified
- [ ] Firefox-specific testing completed
- [ ] All permissions minimal and justified
- [ ] Extension tested in Firefox latest version

### ✅ Store Assets
- [ ] Screenshots (1280x800 recommended, PNG/JPEG, 1-10 images)
- [ ] Extension icon (64x64 for store, plus 48x48 and 96x96)
- [ ] All images high quality and professional
- [ ] Screenshots show key functionality

### ✅ Legal Documents
- [ ] Privacy Policy completed and accessible
- [ ] Terms of Service completed
- [ ] Support documentation created
- [ ] Contact information provided

### ✅ Extension Functionality
- [ ] All features working in Firefox
- [ ] No Firefox-specific errors
- [ ] Proper WebExtensions API usage
- [ ] Performance optimized for Firefox

## Store Listing Information

### Basic Information
- **Add-on Name**: NBA CallCheck
- **Summary**: Advanced NBA referee call analysis with AI-powered insights and community voting
- **Categories**: Sports, Entertainment
- **Tags**: NBA, basketball, referee, sports, analytics, voting

### Description
- **Detailed Description**: See `store-assets/firefox-addons/description.md`
- **Homepage**: https://nbacallcheck.com
- **Support Email**: support@nbacallcheck.com
- **Support Site**: https://nbacallcheck.com/support

### Developer Information
- **Developer Name**: NBA CallCheck Team
- **Developer Email**: developer@nbacallcheck.com
- **Developer Profile**: Complete Mozilla developer profile

## Submission Steps

### 1. Mozilla Add-on Developer Hub
- [ ] Log in to addons.mozilla.org developer hub
- [ ] Complete developer profile
- [ ] Verify email address

### 2. Submit New Add-on
- [ ] Click "Submit a New Add-on"
- [ ] Upload extension XPI/ZIP file
- [ ] Choose distribution channel (Listed)
- [ ] Select compatible Firefox versions

### 3. Add-on Details
- [ ] Enter add-on name and summary
- [ ] Write detailed description
- [ ] Select categories and tags
- [ ] Upload screenshots with descriptions

### 4. Additional Information
- [ ] Add privacy policy URL
- [ ] Specify homepage and support URLs
- [ ] Add release notes
- [ ] Set license (if applicable)

### 5. Review and Submit
- [ ] Preview listing page
- [ ] Verify all information is correct
- [ ] Submit for review
- [ ] Monitor review queue

## Firefox-Specific Requirements

### Manifest Considerations
- [ ] Proper manifest.json structure
- [ ] Firefox-compatible permissions
- [ ] Background scripts properly configured
- [ ] Content scripts properly declared

### API Compatibility
- [ ] WebExtensions API usage verified
- [ ] No Chrome-specific APIs used
- [ ] Proper polyfills if needed
- [ ] Cross-browser compatibility maintained

### Performance
- [ ] Memory usage optimized
- [ ] CPU usage minimal
- [ ] Network requests efficient
- [ ] Storage usage reasonable

## Review Process

### Automated Review
- **Timeline**: Usually immediate for simple extensions
- **Checks**: Security, manifest validation, API usage
- **Status**: Monitor in developer hub

### Manual Review
- **Timeline**: 1-10 business days depending on complexity
- **Scope**: Code review, functionality testing, policy compliance
- **Communication**: Updates via email and developer hub

### Review Criteria
- [ ] Code quality and security
- [ ] User experience
- [ ] Policy compliance
- [ ] Functionality as described

## Post-Submission

### If Approved
- [ ] Verify add-on appears in store
- [ ] Test installation from AMO
- [ ] Monitor user reviews and ratings
- [ ] Respond to user feedback promptly

### If Rejected
- [ ] Review rejection reasons carefully
- [ ] Address all issues mentioned
- [ ] Update code and/or listing as needed
- [ ] Resubmit for review

### Ongoing Maintenance
- [ ] Regular updates for new Firefox versions
- [ ] Security updates as needed
- [ ] Feature improvements based on feedback
- [ ] Monitor compatibility with Firefox updates

## Quality Assurance

### Firefox Testing
- [ ] Test on Firefox Release
- [ ] Test on Firefox Beta (if applicable)
- [ ] Test on Firefox ESR (if targeting enterprise)
- [ ] Test on different operating systems

### Functionality Testing
- [ ] All features work as expected
- [ ] No JavaScript errors in console
- [ ] Proper error handling
- [ ] Graceful degradation for network issues

### User Experience
- [ ] Intuitive interface
- [ ] Responsive design
- [ ] Accessibility considerations
- [ ] Performance optimization

## Compliance

### Mozilla Add-on Policies
- [ ] Content policy compliance
- [ ] Security policy compliance
- [ ] Privacy policy compliance
- [ ] No malicious or deceptive behavior

### Technical Policies
- [ ] No obfuscated code
- [ ] Proper permission usage
- [ ] No remote code execution
- [ ] Secure coding practices

### Legal Compliance
- [ ] Copyright compliance
- [ ] Trademark compliance (NBA disclaimer)
- [ ] Privacy law compliance
- [ ] Terms of service legally sound

## Marketing and Distribution

### AMO Optimization
- [ ] SEO-friendly description
- [ ] Relevant keywords and tags
- [ ] High-quality screenshots
- [ ] Compelling summary

### User Engagement
- [ ] Clear installation instructions
- [ ] Comprehensive FAQ
- [ ] Active support channels
- [ ] Regular communication with users

## Version Management

### Release Planning
- [ ] Semantic versioning strategy
- [ ] Release notes preparation
- [ ] Backward compatibility considerations
- [ ] Migration guides for major updates

### Update Process
- [ ] Test updates thoroughly
- [ ] Gradual rollout strategy
- [ ] Monitor for issues post-update
- [ ] Quick rollback plan if needed

---

**Submission Date**: ___________
**Review Status**: ___________
**Publication Date**: ___________
**AMO URL**: ___________
**Version**: ___________