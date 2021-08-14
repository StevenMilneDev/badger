# 🦡 Badger
Digs through your pull request description to find things to make badges out of.

Badger is a GitHub action which allows you to automatically update pull requests after they are opened. It can prefix or suffix the PR description with customisable content. It can also add custom badges to the PR based on templates set via input variables.

Badger also supports variables which can be injected into any prefixes, suffixes or badges added to the PR. Some of these variables come from GitHub, for example the branch name, or the PR number. Others can come from the PR description itself! By adding a badger section to your PR template, people can specify values which can be injected into the badges.

## Usage
To install and start using this action, create a new `.github/workflows/pull_request.yml` file in your repository. You can copy the example YAML configuration below as a template. Once the template is copied into your workflow file, you can add or remove badges as you please. Badges are specified in the following format;

> `label: message (option=value)(option=value)`

The badge options are optional and can be excluded if you are happy with the defaults.

### Supported Workflow Variables
The following input variables are supported;

| Name       | Required | Description                                                         |
|------------|----------|---------------------------------------------------------------------|
| `token`    | yes      | Authentication token for granting access to update PR descriptions. |
| `prefix`   |          | Text to be prefixed to the start of the PR description.             |
| `suffix`   |          | Text to be appended to the end of the PR description.               |
| `badge-01` | yes      | Configuration for the first badge.                                  |
| `badge-02` |          | Configuration for the second badge.                                 |
| `badge-03` |          | Configuration for the third badge.                                  |
| `badge-04` |          | Configuration for the fourth badge.                                 |
| `badge-05` |          | Configuration for the fifth badge.                                  |
| `badge-06` |          | Configuration for the sixth badge.                                  |
| `badge-07` |          | Configuration for the seventh badge.                                |
| `badge-08` |          | Configuration for the eighth badge.                                 |
| `badge-09` |          | Configuration for the nineth badge.                                 |
| `badge-10` |          | Configuration for the tenth badge.                                  |

Badger does not support any output variables.

### Variable Interpolation
Badger supports interpolating variables into the prefix, suffix and also the badges. To interpolate a variable into an input just type its name surrounded by double curly braces, i.e. `{{variable}}`.

The following variables are supported by default;

- `{{branch}}` - The name of the branch that the PR is for
- `{{pr}}` - The PR number
- `{{additions}}` - The number of lines added by the PR
- `{{deletions}}` - The number of lines deleted by the PR

If you add a badger section to your PR template then you will be able to access more variables from the description itself. This can be used to get variables from developers raising the PR. You can create a PR template by creating the file `.github/pull_request_template.md` in your repository, anything put in this file will be pre-filled into the PR descripition when opened. There is an example badger section at the bottom of this readme that you can copy into your own template.

To create a variable, just add a new line in the badger section that starts with the variable name followed by a colon and a space. The name can be uppercase, lowercase or a mixture of both - it can even contain spaces (but no symbols). You can reference the variable in the normal `{{variable}}` fashion in the badge configuration. If the variable name contains a space then use a full stop when referencing it. For example the variable `Trello URL: ` would be referenced like `{{trello.url}}`.

When the PR is raised, the person raising it should add a value to each variable in the badger section. That value will then be injected into the badges through the variable. If no value is given or the line is deleted then the badge won't be generated.

### Badge Options
The following options are supported by the generated badges;

| Name         | Description                                                                                                   |
|--------------|---------------------------------------------------------------------------------------------------------------|
| `link`       | A URL to link to when the badge is clicked                                                                    |
| `logo`       | The name of a [simple-icons](https://simpleicons.org/) logo, lower cased and with spaces replaced with dashes |
| `logoColor`  | The colour of the logo                                                                                        |
| `color`      | The colour of the right part of the badge                                                                     |
| `labelColor` | The colour of the left part of the badge                                                                      |
| `style`      | A style of badge, one of `plastic`, `flat`, `flat-square`, `for-the-badge` and `social`                       |

All colours can be specified in hex, rgb, rgba, hsl, hsla and css name formats

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
        badge-01: 'Test Environment: {{branch}}.example.dev (link=https://{{branch}}.example.dev/)(logo=googleChrome)(logoColor=white)'
        badge-02: 'Trello: {{trello.card}} (link={{trello.url}})(logo=trello)'
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

## Building
Before you can build the action, you must first install the dependencies. You must have [NodeJS](https://nodejs.org/en/) installed. To install the rest of the dependencies, run the `npm install` command.

GitHub actions require that the code to run the action is committed pre-compiled to the repository. As a result [ncc](https://github.com/vercel/ncc) is used to compile the action and all of its dependencies in `node_modules/` into a single file in `bin/`. Make sure you **compile your code before you commit** if you want to be able to run it.

To compile the action run the `npm run build` command.

### Testing
This project contains unit tests written with [Jest](https://jestjs.io/). You can run the unit tests with the `npm test` command.

## License
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

In jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>