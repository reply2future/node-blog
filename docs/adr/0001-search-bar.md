# 1. Search bar

Date: 2022-04-21

## Status

2022-04-21 proposed

## Context

It could search `content` or `title` easily.

## Decision

1. It will hover the post-selected search result below the search bar when the user inputs the word and waits for 0.5 second.
2. It can fuzzy search by [fuse.js](https://fusejs.io)
3. It can remove the base64 formated image from the content
4. It will go to the article page after clicking the search result.
5. The data structure of fuzzy search results: fuse.js results.

Using the bootstrap search bar.

## Consequences

Consequences here...
