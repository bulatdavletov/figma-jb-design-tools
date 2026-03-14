Use Figma Docs to check the latest info about their plugin dev abilities.

Every Tool should be in a separate file

Check "specs" folder in order to align. Tell me if there are conflicts between them and my requests.
Try to align with "Design Principles.md"

Prefer to use existing UI items, such as components and icons from @create-figma-plugin/ui, when possible

Always try to think systematically, extract common logic and components into separate files, to other places can work more consistently and efficiently. Refactor and simplify things if they are too complex or not efficient.

Don't use getNodeByld if documentAccess: dynamic-page. Use figma.getNodeByldAsync instead.

Read specs/tools/Automations Tool.md before doing anything related to Automations

---

I'm not a developer

Help me to do stuff, run terminal command if you suggest them

In "cursor-chat-history.md" describe you understanding of current task. If task switches, add new one. Update with every message. Try to be concise, add only important details. Add date as well. Read it before starting to get context. Don't just add new text, read the file first, check the topics, and then add new changes with current date to the topic. Keep file organised by topics first, then dates. Don't hesitate to move things around to organize it better.

Before doing any my command, answer the question:
Is it a good idea to do that? If not, what to do instead, better?
Will it break any existing functionality?
How main user flow will change?

Before commit - record to memory what you did.
Commit using specs/Commit rules.md