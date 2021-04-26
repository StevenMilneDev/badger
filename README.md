# 🦡 Badger
A GitHub action to add customised badges to pull requests.

## Usage
To install and start using this action, create a new `.github/workflows/pull_request.yml` file in your repository. You can copy the example YAML configuration below as a template. Once the template is copied into your workflow file, you can add or remove badges as you please. Badges are specified in the following format;

> `label: message (option=value)(option=value)`

The badge options are optional and can be excluded if you are happy with the defaults.

### Supported Workflow Variables
The following input variables are supported;

| Name     | Required | Description                                                         |
|----------|----------|---------------------------------------------------------------------|
| token    | yes      | Authentication token for granting access to update PR descriptions. |
| prefix   | no       | Text to be prefixed to the start of the PR description.             |
| suffix   | no       | Text to be appended to the end of the PR description.               |
| badge-01 | yes      | Configuration for the first badge.                                  |
| badge-02 | no       | Configuration for the second badge.                                 |
| badge-03 | no       | Configuration for the third badge.                                  |
| badge-04 | no       | Configuration for the fourth badge.                                 |
| badge-05 | no       | Configuration for the fifth badge.                                  |
| badge-06 | no       | Configuration for the sixth badge.                                  |
| badge-07 | no       | Configuration for the seventh badge.                                |
| badge-08 | no       | Configuration for the eighth badge.                                 |
| badge-09 | no       | Configuration for the nineth badge.                                 |
| badge-10 | no       | Configuration for the tenth badge.                                  |

Badger does not support any output variables.

### Example Workflow
Below is an example workflow which runs badger when PRs are opened. It adds two badges linking to environments based on the branch name, it also optionally adds a third badge. The third badge uses custom variables which must be provided in the PR description. If the variables are not provided in the description then the badge will not be generated.

```yml
on: 
  pull_request:
    types: [opened]

jobs:
  pr-description:
    runs-on: ubuntu-latest
    name: Update PR Description
    steps:
    - name: Add Badges
      id: badger
      uses: StevenMilneDev/badger@v1.0.0
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        badge-01: 'Website: {{branchname}}.gleanweb.sonocent.com (link=https://{{branchname}}.gleanweb.sonocent.com)(icon=google_chrome)'
        badge-02: 'Strapi: strapi.{{branchname}}.gleanweb.sonocent.com (link=https://strapi.{{branchname}}.gleanweb.sonocent.com)(icon=strapi)'
        badge-03: 'Trello: {{trello.card}} (link={{trello.url}})(icon=trello)'
```

### Example PR Description Template
The template below contains the badger configuration section. The section contains fields for the variables `trello.card` and `trello.url`.

```
---
## 🦡 Badger
This section will be removed and replaced with generated badges after you save. The fields
below are required by some of the badges, fill them in if you would like the badges to be
added. ***Note: It may take a few minutes after saving before this section is replaced.***

Trello Card: 
Trello URL: 

---
```

## License
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

In jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>