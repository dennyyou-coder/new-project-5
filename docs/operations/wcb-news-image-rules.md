# WCB news image rules

Agreed with Denny on 2026-11-14. Every news story has a picture, and the picture belongs to that story.

## Order of choice

Use the first one that exists:

1. **The story's own official image.** A product or event photo published with this announcement in the company's press release or newsroom.
2. **Product library image of the same model.** Only when the story is about that exact model (`image_product`).
3. **Key-figure picture.** Results, deals and policy stories with key figures use the WCB number card in the list.
4. **WCB topic card.** When none of the above exists (rules, markets, policy): a designed WCB card with the topic and key facts (country, date, rule name). It is clearly a design, not a photo.

## Not allowed

- Photos from other media or agencies (Reuters, AP, Getty and similar).
- Portraits unrelated to the story. Use a person's photo only when the story is about that person (appointment, interview, speech).
- Another article's cover or the generic industry picture.
- An older or different model shown as the one in the story.
- Generated images that look like real products or real events.

## How

- Every image carries a visible source line, e.g. "Official image: Husqvarna press release, Nov 6, 2026".
- Image files enter the site only through `npm run prepare:article-images`. 16:9 in lists; product shots on white with `fit: "contain"`, never cropped.
- New stories: each daily news candidate comes with its proposed image; Denny confirms the text and the image together.
- Older stories: backfill from newest to oldest, about 24 stories per preview PR, merged only after Denny says "可以，合并". Scope for now: the last three months. Older stories keep their current pictures until decided otherwise.
