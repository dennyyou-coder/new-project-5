# Home Appliance Brand Batch 6 Implementation Plan

- [x] Add a failing release test for Rowenta, Gorenje, and SUPOR covering entity type, official source URLs, exact category memberships, dedicated assets, 1600 by 1000 heroes, no article tagging, and the 73-profile release count.
- [x] Confirm the test fails only because the three profiles and release count are not yet implemented.
- [x] Create each brand JSON as a draft with current official company, investor, product, channel, warranty, logo, and image evidence.
- [x] Add official logo and hero assets plus two evidence-bound explanatory visuals per brand, then update category mappings.
- [x] Run the complete brand test suite, correct evidence or data failures, and switch only fully complete profiles to published.
- [x] Run the production build and verify generated routes, sitemap, image files, desktop layout, 390-pixel layout, and browser console output.
- [x] Review the final diff for entity separation, source scope, and accidental article changes.
- [ ] Commit and push the isolated feature branch, validate the Vercel Preview, merge the reviewed pull request to GitHub main, wait for the Git-triggered production deployment, and verify the three live pages.
