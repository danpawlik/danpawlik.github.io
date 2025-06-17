---
title: "Check alternative code models"
date: '2025-06-17T12:00:00+02:00'
# weight: 1
tags: ["models"]
author: "Me"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "Desc Text."
canonicalURL: "https://canonical.url/to/page"
disableHLJS: true # to disable highlightjs
disableShare: false
disableHLJS: false
hideSummary: false
searchHidden: true
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
cover:
    image: "<image path/url>" # image path/url
    alt: "<alt text>" # alt text
    caption: "<text>" # display caption under cover
    relative: false # when using page bundles set this to true
    hidden: true # only hide on current single page
editPost:
    URL: "https://github.com/<path_to_repo>/content"
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link
---

## Introduction

As you know from previous blog [post](https://danpawlik.github.io/posts/simply-script-for-ansible/),
Ollama with `codellama:13b` model did not finish processing more
advanced Ansible tasks [file](https://github.com/openstack-k8s-operators/ci-framework/blob/5486e254db14394ff723ef91587934af2458d786/roles/reproducer/tasks/configure_controller.yml). In this blog article, I would
try to check, if other models would be able to proceed them.

## Pre requirements

For making this exercise, please make sure you have:

- configured properly the required packages - you can read about it [blog chapter](https://danpawlik.github.io/posts/intel-npu-driver-disappointment/#looking-for-driver-package)
- you have started an LLM container with additional volume mounts and you
  know how to start Ollama. All is described in this [blog chapter](https://danpawlik.github.io/posts/simply-script-for-ansible/#recreate-container)

## Checking alternative models

All of the models would be tested on two files that were also mentioned in
[blog post](https://danpawlik.github.io/posts/simply-script-for-ansible):

* [ci-framework/roles/ci_setup/tasks/main.yml](https://github.com/openstack-k8s-operators/ci-framework/blob/5486e254db14394ff723ef91587934af2458d786/roles/ci_setup/tasks/main.yml)
* [ci-framework/roles/reproducer/tasks/configure_controller.yml](https://github.com/openstack-k8s-operators/ci-framework/blob/5486e254db14394ff723ef91587934af2458d786/roles/reproducer/tasks/configure_controller.yml)

NOTE: SHA-1 for git commit is `5486e254db14394ff723ef91587934af2458d786`.

Hint: to remove old models, type inside the container:

```shell
$ /llm/ollama/ollama list

NAME                        ID              SIZE      MODIFIED
mistral:7b-instruct-q4_0    b17615239298    4.1 GB    2 weeks ago
codellama:13b               9f438cb9cd58    7.4 GB    2 weeks ago
```

then remove not needed, for example:

```shell
/llm/ollama/ollama rm codellama:13b
```

### codellama:13b

Model is available: https://ollama.com/library/codellama

I don't want to repeat results, but result for `ci_setup/tasks/main.yml`
was fine, where for `reproducer/tasks/configure_controller.yml` after 5 time
execution - never passed (it never generate any summary, prints artifacts, etc.).

### llama3.3:70b

Model is available: https://ollama.com/library/llama3.3

NOTE: In the script available in previous blog [post](https://danpawlik.github.io/posts/simply-script-for-ansible/#executing-script---advanced-role-file),
just replace:

```shell
response = client.generate(model="codellama:13b", prompt=prompt)
# with
response = client.generate(model="llama3.3:70b", prompt=prompt)
```

It did not pass basic task - main.yml from `ci_setup`:

![llamaFail](../../posts/images/01-alt-model-llama.jpg)

![llamaFailScript](../../posts/images/02-alt-model-llama.jpg)

### llama3:8b

Model is available: https://ollama.com/library/llama3

* [main.yml](https://github.com/openstack-k8s-operators/ci-framework/blob/5486e254db14394ff723ef91587934af2458d786/roles/ci_setup/tasks/main.yml) from `ci_setup`:

```raw
I'd be happy to help you analyze the Ansible file and provide feedback on its
correctness and potential improvements.

**Initial Observations**

The provided YAML file appears to be an Ansible playbook, which is a collection
of tasks that can be executed to automate system administration tasks. The
file consists of four main sections:

1. A license notice (Apache License 2.0)
2. Four `name` blocks, each defining a task
3. Various tags and imports

**Correctness**

The Ansible playbook appears to be syntactically correct. There are no obvious
errors in the YAML syntax or formatting.

**Improvement Suggestions**

1. **Consistent naming conventions**: The file uses both
camelCase (e.g., `directory_state`) and underscore notation (e.g., `load_vars.yml`).
Consider adopting a consistent naming convention throughout the playbook.
2. **Task names are too generic**: Each task has a name that is quite
broad ("Load vars", "Install packages", etc.). Consider using more specific,
descriptive names to help with debugging and readability.
3. **Tags are not being used effectively**: The `tags` attribute is set for
each task, but the same tag (`always`) is used for all tasks. Consider defining
separate tags for different types of tasks (e.g., `install`, `configure`, `remove`).
4. **Imports could be optimized**: Instead of importing multiple YAML files,
consider creating a single file that contains all the necessary tasks and imports.
This can help reduce the number of files to manage and improve playbook performance.
5. **Documentation is minimal**: While the license notice provides some
information, there is no additional documentation or comments in the playbook.
Consider adding brief descriptions for each task to explain their purpose and
any relevant considerations.

**Additional Feedback**

1. **Consider using modules instead of importing tasks**: Ansible has a rich
set of built-in modules that can perform specific tasks
(e.g., installing packages, creating directories). Using these modules directly
might simplify your playbook and reduce the need for imports.
2. **Error handling is crucial**: Make sure to include proper error handling
mechanisms in your playbook to prevent unexpected failures from terminating
the execution.

Overall, the provided Ansible file appears to be well-structured and syntactically
correct. However, there are opportunities for improvement by adopting
consistent naming conventions, using more specific task names, optimizing imports,
adding documentation, and considering alternative approaches (e.g., using modules).
```

So it provides common knowledge.
Speed: fast

* More advanced file [configure_controller.yml](https://github.com/openstack-k8s-operators/ci-framework/blob/5486e254db14394ff723ef91587934af2458d786/roles/reproducer/tasks/configure_controller.yml)

```raw
I'll analyze the Ansible file and provide you with my findings.

**Overall structure**: The playbook is well-organized, with each task having a
clear purpose. It's a good practice to use separate roles for specific
functionality, as seen in this case (e.g., `cifmw_ntp`).

**Correctness**: Based on the provided code, I didn't find any obvious errors
or issues that would prevent the playbook from running correctly. However,
I'd like to highlight a few areas where improvements could be made:

1. **Task names and descriptions**: Some task names are quite long and
descriptive, while others are short and cryptic
(e.g., `Inject CRC related content if needed`). It's recommended to use consistent
naming conventions and provide brief, descriptive comments for each task.
2. **Variable usage**: There are several variables defined throughout the
playbook (e.g., `_filtered_vars`, `_cifmw_libvirt_manager_layout.vms.controller.nets.1`).
While these variables are likely necessary for the playbook's functionality,
it's essential to ensure that they're properly documented and understood
by others who may need to maintain or modify the playbook.
3. **Role dependencies**: The `cifmw_ntp` role is included in the playbook,
but there's no explicit dependency declaration (e.g., `requirements: ['cifmw_ntp']`).
It's recommended to include such declarations to ensure that all required roles
are properly installed and configured.

**Suggestions for improvement**:

1. **Consistent indentation**: The playbook uses both 2-space and 4-space
indentation, which can lead to confusion. It's recommended to use a consistent
4-space or no indentation at all.
2. **Task ordering**: Some tasks (e.g., `Wait for OCP nodes to be ready`) are
conditionally executed based on the presence of specific groups. Consider
reordering these tasks to ensure that they're executed in a more logical and
predictable order.
3. **Error handling**: While there aren't any explicit error handlers defined,
it's essential to consider how errors will be handled within the playbook.
You may want to add try-catch blocks or use Ansible's built-in error
handling mechanisms.

In summary, the Ansible file is generally well-structured and easy to follow.
However, there are a few areas where improvements could be made to enhance
maintainability, readability, and overall effectiveness.
```

Similar as in previous test, it provides a common knowledge, no optimalization
or advice provided by this model.
Speed: fast

###  mistral:7b

Model is available: https://ollama.com/library/mistral

* [main.yml](https://github.com/openstack-k8s-operators/ci-framework/blob/5486e254db14394ff723ef91587934af2458d786/roles/ci_setup/tasks/main.yml) from `ci_setup`:

```raw
 Your Ansible playbook appears to be well-structured, and the use of separate
files for individual tasks is a good practice for better readability and
maintainability. However, there are a few points that could be improved
or clarified:

1. Comments: The comments at the beginning of your file contain Red Hat
copyright information and Apache License details. While it's important to
acknowledge these, it might be more appropriate to include them in a separate
LICENSE file as suggested by the license itself. This will keep your main
playbook cleaner and easier to read.

2. Task names: Although you have given task names, they are all
identical (`name:`). It would be beneficial to provide descriptive names for
each task to better understand their purpose at a glance. For example:
- `name: Load variables`
- `name: Install required packages`
   - `name: Enable necessary repositories`
   - `name: Create required directories`

3. Variables section: The `vars:` section in your last task only sets
the `directory_state`. If this variable is used within the tasks defined
in `directories.yml`, that's great; however, it might be helpful to
document why this variable is being used and where it is utilized
throughout your playbook.

4. Empty lines: There are some unnecessary empty lines in your file which
can make it harder to read. It would be better to remove them or use a
consistent indentation style for better visual flow.
```

Provides interesting information, even for basic task.
Speed: very fast


* More advanced file [configure_controller.yml](https://github.com/openstack-k8s-operators/ci-framework/blob/5486e254db14394ff723ef91587934af2458d786/roles/reproducer/tasks/configure_controller.yml)

```raw
This script appears to be a Ansible playbook used for setting up and
configuring an OpenShift cluster environment on a system running CentOS,
with additional functions such as synchronizing dependencies, configuration
of networking, NTP service setup, and possibly others.

The main flow of the playbook can be broken down as follows:

1. Set variables related to the project, paths, and required interfaces information.
2. If the OpenShift cluster (`groups.ocps`) is defined, wait for connection
   from each node in the cluster to ensure they are ready for consumption
   by the networking_mapper.
3. Generate networking definition using the networking_mapper role
   based on the previously obtained interfaces information.
4. Inject CRC ssh key if the `_use_crc` variable is set.
5. Check the status of dependency installation and retry until it's done.
6. Finally, configure the NTP service using the cifmw_ntp role.
```

Provides just information what is done in the task file.
Speed: very fast

### wizardcoder:13b

Model is available:
q
* [main.yml](https://github.com/openstack-k8s-operators/ci-framework/blob/5486e254db14394ff723ef91587934af2458d786/roles/ci_setup/tasks/main.yml) from `ci_setup`:

```raw
The given Ansible playbook consists of four tasks which are importing other
YAML files: `load_vars.yml`, `packages.yml`, `repos.yml` and `directories.yml`.

Here's a brief analysis and improvements for each task:

1. The first task 'Load vars':
   - This task has no problem or improvement needed here since it is loading
     variables from an external file. It can be improved by ensuring that the
     filename (`load_vars.yml`) is written correctly to avoid any import errors.
     In addition, tags are used here but currently there's only one tag `always`
     which means this task will always run regardless of whether other tasks
     have changed or not.

     It can be improved by ensuring that all packages are installed correctly
     and without any errors. An upgrade could be made in this task if needed.
     Also, it's currently tagged as `always` which means it will run every time.

3. The third task 'Enable repos':
   - This task enables the repositories from a file (`repos.yml`).
     It can be improved by ensuring that all repositories are enabled correctly
     and without any errors. If some repositories need to be disabled this
     could be added as an improvement too.

4. The fourth task 'Create directories':
   - This task creates the directories from a file (`directories.yml`).
     It can be improved by ensuring that all directories are created correctly
     and without any errors. If some directories need to be deleted,
     it could be added as an improvement here.

Note: In each task, tags `always` will run this task every time the playbook
runs which might not be always needed especially for tasks like 'Load vars'
or 'Enable repos'. It's recommended to use more specific tags based
on your requirement.
```

Provides interesting feedback.
Speed: slow


* More advanced file [configure_controller.yml](https://github.com/openstack-k8s-operators/ci-framework/blob/5486e254db14394ff723ef91587934af2458d786/roles/reproducer/tasks/configure_controller.yml)

```raw
The playbook that you posted is a complex setup of OpenShift clusters and
related environments, including the installation of dependencies via Ansible
roles. Here's a simplified version of what the playbook does:

1. It sets up some important paths like `ansible_user_dir` and
   `crc_priv_key['content']`, but they are not clearly defined in the code
   snippet you provided.

2. It checks if an OpenShift cluster is being used by checking the existence
   of a group named "ocps". If this exists, then it waits for every node in
   the cluster to be ready. This indicates that all nodes in the cluster are
   responsive and can receive connection requests.

3. The playbook installs some dependencies via Ansible roles using
   `ansible.builtin.import_role`. These roles might contain tasks for setting
   up networking definitions, ntp services, or anything else necessary
   for the OpenShift environment.

4. Depending on a variable named `_use_crc`, it may also import a role to set up
   CRC related content, including an ssh key.

5. Finally, it configures ntp service in case it was not configured correctly.
   NTP is a protocol for network time synchronization and it's used to keep
   clocks of computers in sync within a network.
```

Provides basic info, some improvement can be considered.
Speed: slow

### deepseek-r1:32b

Model is available: https://ollama.com/library/deepseek-r1

* [main.yml](https://github.com/openstack-k8s-operators/ci-framework/blob/5486e254db14394ff723ef91587934af2458d786/roles/ci_setup/tasks/main.yml) from `ci_setup`:

```raw
=== CODELLAMA ANALYSIS ===

<think>
Okay, I need to analyze the given Ansible YAML file and determine if it's
correct or can be improved. Let me look at each part step by step.

First, the file starts with a copyright notice and license information. That
seems fine; it's good practice to include such headers for clarity and legal purposes.

Next, there are several tasks defined using the `ansible.builtin.import_tasks` module.
Each task has a name and tags set to "always," meaning they should run every
time the playbook is executed.

The first task imports `load_vars.yml`. That makes sense because variables often
need to be loaded early in the process so other parts of the playbook can use them.

Then, it imports `packages.yml` which presumably handles package installations.
This should come after loading variables but before services are started or
configurations are applied, which is logical.

The third task is for enabling repositories using `repos.yml`. However,
I'm thinking about the order here. Usually, you might want to enable repositories
first because installing packages often depends on them being enabled.
If repos aren't set up before installing packages, some installations could fail
if required repositories are missing. So maybe this should be moved above the
packages task.

Next is creating directories with `directories.yml`. The `directory_state` variable
is set to "directory," which is a bit redundant because that's the default state
for Ansible's file module when ensuring a directory exists. It might not hurt,
but it's unnecessary unless there are specific reasons to set it explicitly.

Looking at tags, all tasks have the same tag "always." While this allows
running all tasks together using `--tags always`, it doesn't offer much flexibility
if someone wants to run only a subset of tasks. Using more specific tags could
make the playbook easier to manage and execute selectively in the future.

The YAML structure seems correct with proper indentation, but I notice some
lines have trailing spaces, which isn't harmful but is generally considered
bad practice for consistency and readability. Cleaning those up would be a
minor improvement.

Another consideration is whether each imported file (`load_vars.yml`, `packages.yml`, etc.)
contains the necessary content. Without seeing those files, it's hard to say if
there are any issues within them, so assuming they're correct based on their names.

Potential improvements I can suggest:
1. Reordering tasks to enable repositories before installing packages.
2. Removing or making the `directory_state` variable optional since it's redundant.
3. Adding more specific tags to each task for better control during execution.
4. Trimming trailing spaces in the YAML file for consistency.

I don't see any syntax errors, so the playbook should run without issues.
However, following these improvements could make the playbook cleaner and
more maintainable.
</think>

The Ansible playbook provided is syntactically correct but can be optimized
for better readability and maintainability. Here's an analysis of the existing
content along with suggestions for improvement:

### **1. Structure and Syntax**
- The file begins with a proper copyright notice and license information,
  which is excellent for legal compliance.
- Each task uses `ansible.builtin.import_tasks` to include other playbooks,
  which is appropriate for modularity.

### **2. Tags**
- All tasks are tagged as "always," ensuring they execute every time the
  playbook runs.
- Consider adding more descriptive tags (e.g., "vars", "repos", "packages") to
  allow selective execution of specific sections using Ansible's `--tags` option.

### **3. Task Ordering**
- Currently, tasks run in this order:
  1. Load variables
  2. Install packages
  3. Enable repos
  4. Create directories

**Suggested Order:**
1. Load variables (`load_vars.yml`)
2. Enable repositories (`repos.yml`) → Ensure necessary software sources are
   available before installing packages.
3. Install packages (`packages.yml`)
4. Create directories (`directories.yml`)

This change ensures that package installations can access the required
repositories, avoiding potential dependency issues.

### **4. Directory Creation Task**
- The `directory_state: directory` variable is explicitly set when importing
  the `directories.yml` file. While this isn't incorrect, it's unnecessary because
  the default state for directory creation in Ansible is "directory." Removing
  this line simplifies the task without altering functionality.

### **5. Readability and Formatting**
- YAML files benefit from proper indentation (2 spaces per level) and avoiding
  trailing whitespace.
- Although not critical, improving formatting enhances readability and
  consistency across your playbooks.

### **6. Missing or Redundant Sections**
- The playbook doesn't include tasks for user creation, permissions, or service
  management. If these are handled in separate files (e.g., `users.yml`, `services.yml`),
  ensure they're imported after directory creation to maintain logical flow.


---

## **Suggested Improvements**

### **A. Reorder Tasks**
Move the repos task above packages.

\`\`\`yaml
- name: Enable repos
  tags:
    - always
    - repos
  ansible.builtin.import_tasks: repos.yml

- name: Install packages
  tags:
    - always
    - packages
  ansible.builtin.import_tasks: packages.yml
\`\`\`

### **B. Remove Redundant Variable**
Omit `directory_state` when importing directories.

\`\`\`yaml
- name: Create directories
  tags:
    - always
    - directories
  ansible.builtin.import_tasks: directories.yml
\`\`\`

### **C. Add Descriptive Tags**
Update each task with more specific tags to improve execution control.

### **D. Clean Up Formatting**
Ensure consistent indentation and remove trailing spaces for better readability.

---

## **Final Version**

Here's the revised playbook incorporating these changes:

\`\`\`yaml
---
# Copyright Red Hat, Inc.
# All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.

- name: Load vars
  tags:
    - always
    - vars
  ansible.builtin.import_tasks: load_vars.yml

- name: Enable repos
  tags:
    - always
    - repos
  ansible.builtin.import_tasks: repos.yml

- name: Install packages
  tags:
    - always
    - packages
  ansible.builtin.import_tasks: packages.yml

- name: Create directories
  tags:
    - always
    - directories
  ansible.builtin.import_tasks: directories.yml
\`\`\`

### **Summary of Changes**
1. Moved the repos task before package installation.
2. Added more specific tags to each task for selective execution.
3. Removed redundant `directory_state` variable.
4. Improved formatting for consistency.

This revised playbook is functionally correct, more organized, and easier to
maintain or extend in the future.
```

Speed: very slow

* More advanced file [configure_controller.yml](https://github.com/openstack-k8s-operators/ci-framework/blob/5486e254db14394ff723ef91587934af2458d786/roles/reproducer/tasks/configure_controller.yml)

```
<think>
Okay, I'm trying to understand this Ansible playbook. It's a bit overwhelming
with all the tasks listed. Let me start by going through each task one by one
and see if I can figure out what it does.

The first part is about creating a directory structure. That seems straightforward—just
making sure certain directories exist. Then there are some file copies, which also make sense.
The next step involves generating some SSH keys for Zuul, the CI user.
I remember that SSH keys are used for secure logins without passwords, so this must
be setting up authentication.

After that, it looks like it's handling pull secrets and tokens related to the CI environment.
These are probably used for accessing private repositories or internal services.
Then there’s something about managing interfaces-info.yml, which I think is
collecting network interface information.

I’m a bit confused by the part where they mention waiting for OpenShift nodes to be ready.
It says that sometimes the cluster might have downtime even after it's supposed to start.
So this task ensures all OCP nodes are up and responsive before proceeding.
That makes sense because youdon’t want to proceed with setup if the nodes aren't available.

Next, there’s a networking definition generation step. They’re using some variables from
the libvirt manager layout to map out the network configuration. I'm not entirely sure
how this ties into the overall process but it seems crucial for setting up the correct network
environment for the cluster.

Then, there's handling CRC-related content if needed. CRC is probably referring to
CodeReady Containers, which are used for running OpenShift locally. So if the setup
requires CRC, it injects the necessary SSH keys and configurations here.

The playbook also ensures all dependencies are installed by checking the
async job status. This is important because some tasks might take time and you
don’t want the next steps to fail due to missing packages.

Finally, there's configuring NTP services to ensure that all nodes have synchronized time.
Time synchronization is essential for many distributed systems to function correctly.

I think overall this playbook is setting up a development environment or CI/CD pipeline
where OpenShift clusters are provisioned and configured automatically. It handles
everything from directory setup, SSH keys, secrets management, network configuration,
waiting for cluster readiness, dependency installations, and time synchronization.

Some steps I'm not entirely clear on include the exact purpose of the networking_mapper
role and how the reproducers-variables.yml is used. Also, understanding how the
pull secrets are managed and secured would be important to ensure there's no
exposure of sensitive information.

I should probably look up some of these roles like networking_mapper or cifmw_ntp
to understand their specific functionalities better. Additionally, I wonder if this
playbook is part of a larger workflow and where it fits in the overall process.
</think>

The Ansible playbook you've presented is designed for setting up and configuring
an OpenShift Container Platform (OCP) environment, likely as part of a CI/CD pipeline
or development setup. Here's a breakdown of its key components:

1. **Directory Setup**: Ensures necessary directories exist for the CI user (Zuul),
                        including configuration files and logs.

2. **SSH Key Management**: Generates SSH keys for Zuul to enable passwordless
                           authentication, crucial for automated tasks.

3. **Pull Secrets and Tokens**: Handles secrets required for accessing internal
                                repositories or services, ensuring secure access
                                without exposing credentials directly in playbooks.

4. **Network Configuration**: Collects interface information and generates network
                              definitions using the `networking_mapper` role,
                              essential for correct cluster networking setup.

5. **Cluster Readiness Check**: Waits until all OpenShift nodes are responsive
                                to prevent issues during subsequent configuration steps.

6. **CRC Integration**: Injects SSH keys if using CodeReady Containers (CRC),
                        facilitating local OpenShift deployments.

7. **Dependency Installation**: Ensures all necessary dependencies are installed
                                asynchronously, preventing task failures due to
                                missing packages.

8. **Time Synchronization**: Configures NTP services to synchronize time across nodes,
                             critical for distributed systems.

**Overall Purpose**:
This playbook automates the provisioning and configuration of an OpenShift environment,
handling everything from initial setup to dependency management and network configuration.
It's tailored for environments where reproducible, automated cluster setups are necessary,
such as in CI/CD pipelines.

To gain deeper insights, further investigation into specific roles (like `networking_mapper`)
and understanding how variables are managed would be beneficial. This ensures clarity on
network configurations and security practices related to secret management.
```

## Summary

From the all models recommended for coders, most of them where created year ago
and never updated. The most interesting, surprising model is `deepseek-r1`.
It provides most detailed output, summary, also provide feedbeck how to optimize
the code. Very interesting might be also `codellama:13b` - for short task file
it bring interesting feedback, but it does not work properly on my laptop for
bigger tasks file, so it is just guessing.
`Wizardcoder` brings definitely most interesting summary, `mistral` was the
fastes and brings basic info - perfect for getting fast result and verify,
if there is an error (ha, it might be a good blog post - check which model will
catch basic Ansible error in playbook). `llama3` just explains what was done.

Overall: `deepseek-r1` wins this battle.
