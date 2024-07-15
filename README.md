# 🦡 Badger
Digs through your pull request description to find things to make badges out of.

Badger is a GitHub action which allows you to automatically update pull requests after they are opened. It can prefix or suffix the PR description with customisable content. It can also add custom badges to the PR based on templates set via input variables.

Badger also supports variables which can be injected into any prefixes, suffixes or badges added to the PR. Some of these variables come from GitHub, for example the branch name, or the PR number. Others can come from the PR description itself! By adding a badger section to your PR template, people can specify values which can be injected into the badges.

## Usage
To install and start using this action, create a new `.github/workflows/pull_request.yml` file in your repository. You can copy the example YAML configuration below as a template. Once the template is copied into your workflow file, you can add or remove badges as you please. Badges are specified in the following format;

> `label: message (option=value)(option=value)`

The badge options are optional and can be excluded if you are happy with the defaults.

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
      uses: StevenMilneDev/badger@v1.0.3
      env:
        TEST_DOMAIN: example.com
        TRELLO_CARD: Untitled Card
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        badge-01: 'Test Environment: {{branch}}.{{TEST_DOMAIN}} (link=https://{{branch}}.{{TEST_DOMAIN}}/)(logo=googleChrome)(logoColor=white)'
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

If no variables are required in the badger section then the minimal version can be used;

```
---
## 🦡 Badger
---
```

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

### Variables
Badger supports interpolating variables into the prefix, suffix and also the badges. To interpolate a variable into an input just type its name surrounded by double curly braces, i.e. `{{variable}}`. A few different types of variables are supported

#### Static Variables
Static variables come be resolved directly from GitHub. The following static variables are supported;

- `{{branch}}` - The name of the branch that the PR is for
- `{{pr}}` - The PR number
- `{{additions}}` - The number of lines added by the PR
- `{{deletions}}` - The number of lines deleted by the PR

#### Dynamic Variables
Dynamic variables are resolved from the badger section of the PR description. This allows the PR creator to type text into the descripition that can be pulled into a badge.

If you add a badger section to your PR template then you will be able to make use of dynamic variables. You can create a PR template by creating the file `.github/pull_request_template.md` in your repository, anything put in this file will be pre-filled into the PR descripition when opened. There is an example badger section at the top of this readme that you can copy into your own template.

To create a variable, just add a new line in the badger section that starts with the variable name followed by a colon and a space. The name can be uppercase, lowercase or a mixture of both - it can even contain spaces (but no symbols). You can reference the variable in the normal `{{variable}}` fashion in the badge configuration. If the variable name contains a space then use a full stop when referencing it. For example the variable `Trello URL: ` would be referenced like `{{trello.url}}`.

When the PR is raised, the person raising it should add a value to each variable in the badger section. That value will then be injected into the badges through the variable. If no value is given or the line is deleted then the badge won't be generated.

#### Environment Variables
Environment variables can be passed into Badger via the workflow configuration. These variables can be accessed just like the others; `{{TEST_DOMAIN}}`. 

Environment variables can also be used as a fallback value for a dynamic variable. If a dynamic variable cannot be found in the PR description, then an environment variable with a matching name will be returned. For example if the variable `trello.card` could not be found, then badger will look for an environment variable called `TRELLO_CARD`. The name is uppercased and full stops are replaced with underscores.

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

## Building
Before you can build the action, you must first install the dependencies. You must have [NodeJS](https://nodejs.org/en/) installed. To install the rest of the dependencies, run the `npm install` command.

GitHub actions require that the code to run the action is committed pre-compiled to the repository. As a result [ncc](https://github.com/vercel/ncc) is used to compile the action and all of its dependencies in `node_modules/` into a single file in `bin/`. Make sure you **compile your code before you commit** if you want to be able to run it.

To compile the action run the `npm run build` command.

### Testing
This project contains unit tests written with [Jest](https://jestjs.io/). You can run the unit tests with the `npm test` command.

#### Manual Testing
To test Badger manually, ask for an invite to the testing repository [StevenMilneDev/badger-test](https://github.com/StevenMilneDev/badger-test). Once in the repo, change the `.github/workflows/pull_request.yml` file to point to your branch;

```yml
jobs:
  pr-description:
    steps:
    - name: Add Badges
      uses: StevenMilneDev/badger@<BRANCH_NAME_HERE>
```

Use this link; [Edit pull_request.yml](https://github.com/StevenMilneDev/badger-test/edit/master/.github/workflows/pull_request.yml) to edit the file and commit directly to the main branch. Replace `<BRANCH_NAME_HERE>` with your branch name so the value looks like; `StevenMilneDev/badger@npm-package-update`.

Once the repo is pointing at your branch, create a PR by editing the `README.md` file by clicking this link; [Edit README.md](https://github.com/StevenMilneDev/badger-test/edit/master/README.md). This time instead of commiting directly to the main branch, select "Create a new branch for this commit...". Once the branch is created it will show a PR screen, raise the PR and wait for Badger to kick in.

If things go wrong and badges aren't added to your PR then you can check the [Actions tab](https://github.com/StevenMilneDev/badger-test/actions) to see the logs for the actions run.

## License
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

In jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>