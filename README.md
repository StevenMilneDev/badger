# 🦡 Badger
A GitHub action to add customised badges to pull requests.

## Usage

### Example Workflow
Below is an example workflow which runs badger when PRs are opened. It adds two badges linking to environments based on the branch name, it also optionally adds a third badge. The third badge uses custom variables which must be provided in the PR description. If the variables are not provided in the description then the badge will not be generated.

```yml
on: 
  pull_request:
    types: [opened]

jobs:
  add-badges:
    runs-on: ubuntu-latest
    name: Adds badges to the PR description
    steps:
    - name: Add badges
      id: badger
      uses: StevenMilneDev/badger@v1.0.0
      with:
        badge-01: 'Website: {{branchname}}.gleanweb.sonocent.com (link=https://{{branchname}}.gleanweb.sonocent.com)(icon=google_chrome)'
        badge-02: 'Strapi: strapi.{{branchname}}.gleanweb.sonocent.com (link=https://strapi.{{branchname}}.gleanweb.sonocent.com)(icon=strapi)'
        badge-03: 'Trello: {{trello.card}} (link={{trello.url}})(icon=trello)'
```

## Example PR Description Template
The template below contains the badger configuration section. The section contains fields for the variables `trello.card` and `trello.url`.

```
---
## 🦡 Badger
This section will be removed and replaced with generated badges. Add your description below this section. Optionally fill in the fields below to have badges generated. ***Note: It may take a few minutes after saving before this section is replaced.***

Trello Card: 
Trello URL: 

---
```
