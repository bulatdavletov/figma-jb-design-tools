Gather together all my figma plugins into one nice plugin.

**Existing plugins:**
- ../figma-icon-libraries-swap - this one helps to swap old icons to new ones.
- ../variables-rename-helper - this one helps to rename variables.
- ../Print Color Usages - this one helps to print color usages.
- ../ds-colors-cursor - this one finds color matches
- ../Variables helper - I don't remember what this one does.
- ../Nicely detach color variable - this one should be able to detach top layer of variable, but i'm not sure that it works.

**Copies of useful external plugins:**
- Many Paster

I'm not sure which one to include, yet, this is just list of my plugins

**Ideas:**
- Swap not only icons, but also components and their overrides
- Ability to view and manage all tokens in the chain
- Guides checker: check texts and other things from our guides.
- Usage checker and replacer: check usage of variables and replace them with other variables. How many times variable used in the project. How many times variable reused as value for other variables in the UI Kit.

I might also add some utilities, but I'm not sure if they will fit here. 
They might be not only about variables.

Is it good idea to gather all utilites into one single plugin?
What are the risks? How to explain use cases for each utility?
How to test utilities and plugin itself, so i don't break something when i update the plugin?

Plugin should use nice UI Framework, such as https://yuanqing.github.io/create-figma-plugin/ (some plugins already use it)

We will use it inteernally, inside our design team.

Idea: would be nice to have one plugin, that might run something like Indexing in the background, because everyone will have it open.

Good idea would be to check for each utility:
Personas: Who is the user? What is the user's goal?
Use Cases: What are the main use cases for the utility?

Personas:

**Product designer**
wants quick fixes (swap icons/components, clean up colors). (everyone in the team)

**Design system maintainer**
manages tokens/variables, migrations, and consistency. (me + few people in the team)

**Plugin owner**
cares about reliability, rollback, and repeatable processes. (me)

Cases:
- Migration from old UI Kit to new one. Icons, colors to variables, components.

How to:
Discover utilities and what they do
Quickly run utilities that you already know

Variables manager:
Set of utilities to manage variables. It's possible mamange them only in UI Kit project. Relevant for Design system maintainer persona only.