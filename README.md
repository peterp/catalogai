# Catalogai

An open-source tool for cataloging box contents. Upload photos of items in a box, and the tool generates a text-based inventory for easy tracking and printing—perfect for organizing during moves or asset management.

## Motivation

The Redwood Experiments: Volume 1.

The goals of this project are technical. The first is to explore writing code with an LLM+Agents, and the second is to restrict this to React Server Components. This will be contrased by another app which will exploring building software using local first principles.

## Usage

The homepage displays a list of collections. Each collection contains photos that are automatically converted into a text-based inventory. Users can download a PDF of the inventory along with a QR code to label the box. Scanning the QR code allows users to access and edit the collection.

## Technical details

The technical stack is:

- Vite
- Prisma + SQLite
- React Server Components
- Tailwind
- fal.ai


The technical limitations:

- We will not bundle or build for production.
- We will not use S3.
- No user accounts

