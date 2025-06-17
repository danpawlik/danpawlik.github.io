---
date: '2025-06-17T16:49:57+02:00'
title: 'Check Models With Broken Code'
tags: ["llm"]
author: "Me"
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

Previously I was checking how LLMs will read the Ansible role, analyze and
give summary or maybe hint, how the code can be optimized.
This time, I will give broken Ansible playbook and I would like to
see, if the models will detect broken code.
NOTE: I will not use all available models present in previous [blog post](https://danpawlik.github.io/posts/check-alternative-code-models/), just few.

## Pre requirements

For making this exercise, please make sure you have:

- configured properly the required packages - you can read about it [blog chapter](https://danpawlik.github.io/posts/intel-npu-driver-disappointment/#looking-for-driver-package)
- you have started an LLM container with additional volume mounts and you
  know how to start Ollama. All is described in this [blog chapter](https://danpawlik.github.io/posts/simply-script-for-ansible/#recreate-container)

## Broken Ansible playbook

This playbook will be broken in few places:

- using 'password' in module `ansible.builtin.user`, which
  on Linux it require encrypted hash or a plain text on macOS,
- using `ansible.builtin.dnf` would try to install package without
  giving `become` parameter,
- using `ansible.builtin.file` module, create a directory in `/tmp` and
  set the `mode` parameter as a integer, not string (just warning :) )

Example playbook looks like:

```yaml
---
- name: Testing LLMs with this playbook
  hosts: localhost
  tasks:
    - name: Create temporary user
      become: true
      vars:
        password: nodepool
      ansible.builtin.user:
        name: nodepool
        state: present
        password: "{{ password }}"
        update_password: always

    - name: Install htop package
      ansible.builtin.dnf:
        name: htop
        state: present

    - name: Create fake directory
      ansible.builtin.file:
        path: /tmp/testdir
        state: directory
        mode: 0750
```

Example script:

```python
#!/usr/bin/env python3

import ollama
import os
import sys


def load_file(file_path):
    if not os.path.exists(file_path):
        print("The file does not exists or permissions error!")
        sys.exit(1)
    try:
        with open(file_path, 'r', encoding="utf-8") as file:
            return file.read()
    except Exception as e:
        print(f"Error on parsing file {file_path}: {e}")
        sys.exit(1)


def main():
    if len(sys.argv) < 2:
        print("Can not continue. Please add file to parse as argument")
        sys.exit(1)

    for file_path in sys.argv[1:]:
        yaml_content = load_file(file_path)

        prompt = f"""
    Could you analyze the Ansible file and check if it is
    correct or it can be improved?

    Here is the YAML:
    ```yaml
    {yaml_content}
    """

        client = ollama.Client()
        response = client.generate(model="deepseek-r1:32b", prompt=prompt)

        print("=== CODELLAMA ANALYSIS ===")
        print(response['response'])

if __name__ == "__main__":
    main()
```

The playbook is broken in few places, even locally it does not work if I will not
provide `--ask-become-pass` or the user is not in `sudoers`.

### Using deepseek-r1:32b

```raw
<think>
Okay, I'm trying to help someone analyze their Ansible playbook. Let me start by
understanding what they have here.

The playbook is named "Testing LLMs with this playbook" and targets localhost.
It has three tasks. The first task creates a user named nodepool with the
password "nodepool". They're using become: true, which makes sense because
creating a user typically requires root privileges. I notice that the password
is defined in vars right before the module, but usually, it's better to keep
variables separate for organization and security.

Next, they install the htop package using dnf. That seems straightforward, but
maybe adding a loop could make it more scalable if they ever need to add more
packages later on.

The third task creates a directory in /tmp with specific permissions. They set mode
to 0750, which is correct for directory permissions. However, the indentation here
looks off—it's indented one space too many compared to other tasks, which could
cause syntax issues.

I should check for best practices: variable management, idempotency, proper
error handling, security considerations, and code readability. The user might not
have considered these aspects deeply.

For variables, they're defined inline, but it's better to use a vars section or
an external file. That makes the playbook cleaner and more secure if sensitive
data is involved.

In terms of idempotency, Ansible modules are usually idempotent, so that's good.
But maybe adding checks for package installation could help, though dnf handles
that internally.

Error handling isn't present here. Adding notify or handlers to restart services
or alert on errors would be a good improvement.

Security-wise, storing passwords inline is risky. Using Ansible Vault or
environment variables would be better practices.

Code readability can be enhanced by consistent indentation and perhaps using
loops for multiple packages or directories if needed in the future.

So, my analysis should cover these points: variable management, idempotency,
error handling, security, code structure, and possible improvements like
adding a handler for service restarts or using vault for secrets.
</think>

### Analysis of the Ansible Playbook

Here is an analysis of your Ansible playbook with suggestions for improvement:

#### **1. Variable Management**

**Current Implementation:**
\`\`\`yaml
vars:
  password: nodepool
\`\`\`

- The variable `password` is defined inline within the task, which can make
  the playbook harder to maintain if variables are reused across multiple tasks
  or playbooks.

**Suggestion:**
Move variables to a dedicated section at the top of the playbook or into an
external variable file (e.g., `vars/main.yml`) for better organization
and reusability.

\`\`\`yaml
---
- name: Testing LLMs with this playbook
  hosts: localhost

  vars:
    user_name: nodepool
    user_password: nodepool

  tasks:
    - name: Create temporary user
      become: true
      ansible.builtin.user:
        name: "{{ user_name }}"
        state: present
        password: "{{ user_password }}"
        update_password: always
\`\`\`

#### **2. Idempotency**

**Current Implementation:**
All tasks are idempotent because they check for the current state and only
make changes if necessary (e.g., `state: present`).

**Suggestion:** No changes needed. The playbook is designed to run multiple
times without causing issues.

#### **3. Error Handling**

**Current Implementation:**
The playbook does not include error handling or notifications.

**Suggestion:**
Add error handling using the `ignore_errors` keyword or a handler for notifications.

\`\`\`yaml
- name: Install htop package
  ansible.builtin.dnf:
    name: htop
    state: present
  ignore_errors: yes

- name: Notify on failure
  notify: "Installation failed"
  when: installation_result is failed

handlers:
  - name: "Installation failed"
    debug:
      msg: "Failed to install package(s)"
\`\`\`

#### **4. Security Considerations**

**Current Implementation:**
The password is defined inline, which can be a security risk if the playbook
is committed to version control.

**Suggestion:** Use Ansible Vault or environment variables for sensitive
data like passwords.

\`\`\`bash
# Encrypt variables using Ansible Vault
ansible-vault create vars/vault.yml

# In vault.yml:
user_password: securepassword123

# Reference in playbook:
vars_files:
  - vars/vault.yml
\`\`\`

#### **5. Code Structure and Readability**

**Current Implementation:**
The tasks are simple but could benefit from better formatting and structure.

**Suggestion:** Indent consistently, use comments for clarity, and group
related tasks together.

\`\`\`yaml
---
- name: Testing LLMs with this playbook
  hosts: localhost

  vars:
    user_name: nodepool
    user_password: nodepool

  tasks:

    - name: Create temporary user
      become: true
      ansible.builtin.user:
        name: "{{ user_name }}"
        state: present
        password: "{{ user_password }}"
        update_password: always
      # This task creates a new system user with the specified password.

    - name: Install htop package
      become: true
      ansible.builtin.dnf:
        name: htop
        state: present

    - name: Create fake directory
      become: true
      ansible.builtin.file:
        path: /tmp/testdir
        state: directory
        mode: 0750
\`\`\`

#### **6. Possible Improvements**

- **Looping:** If you need to create multiple users or install multiple packages,
               consider using loops.

\`\`\`yaml
- name: Install multiple packages
  become: true
  ansible.builtin.dnf:
    name: "{{ item }}"
    state: present
  loop:
    - htop
    - tree
    - curl

- name: Create multiple directories
  become: true
  ansible.builtin.file:
    path: "{{ item }}"
    state: directory
    mode: 0750
  loop:
    - /tmp/testdir1
    - /tmp/testdir2
\`\`\`

- **Handlers:** Use handlers for actions that should only run once, such as
                restarting a service.

\`\`\`yaml
handlers:
  - name: restart apache
    ansible.builtin.service:
      name: apache2
      state: restarted

# In tasks:

- name: Install and configure apache
  become: true
  ansible.builtin.dnf:
    name: httpd
    state: present
  notify: restart apache
\`\`\`

#### **7. Tags**

**Suggestion:** Add tags to your tasks for easier execution of specific
                parts of the playbook.

\`\`\`yaml
- name: Create temporary user
  become: true
  ansible.builtin.user:
    name: "{{ user_name }}"
    state: present
    password: "{{ user_password }}"
    update_password: always
  tags:
    - user-management

- name: Install htop package
  become: true
  ansible.builtin.dnf:
    name: htop
    state: present
  tags:
    - packages

# Run playbook with a specific tag:
ansible-playbook playbook.yml --tags "user-management,packages"
\`\`\`

#### **8. Version Control**

**Suggestion:** Add comments or version numbers to track changes in the playbook.

\`\`\`yaml
---
- name: Testing LLMs with this playbook (Version 1.0)
  hosts: localhost

  # Author: John Doe
  # Date: 2023-09-27
  # Description: Creates a test user, installs htop, and creates a directory.
\`\`\`

### **Final Thoughts**

The playbook is functional but can be improved in terms of organization, security,
and maintainability. By moving variables to external files, adding error handling,
and improving readability, you can make the playbook more robust and easier to manage.

Would you like me to provide an optimized version of your playbook incorporating these suggestions?
```

#### Summary:

It analyze correct the code what is doing, give suggestions sometimes improper
like install packages in a loop, where the name of the packages is a list (would
be just faster to provide whole list of required packages instead of using loop).
It also spotted security issue, where the variable store the password and
there is `no_log` set and suggest to use ansible vault for storing password.
Suggest to move the variable "higher" for better maintenance. This model also
give strange suggestion like use hanrder when install packages - that suggestion
would be ok, when the package would have a service. Htop does not have a service,
but for the LLM model might be difficult to handle and "remember" all available
services. Let's assume that the strange advice is not soo strange anymore ;)
Interesting is also that he suggest to add tags, where it makes sense,
and keep all the playbook in some version control comments. Nice!

In the end, it suggest to render modified version with all suggestions mentioned
in the output. Pretty cool!

### codellama:13b

```raw
This Ansible playbook seems to be intended for testing LLMs (Large Language Models)
with this playbook. Here's a breakdown of the tasks in the playbook:

1. `Create temporary user`: This task creates a new user on the local machine,
   named "nodepool". The `become` option is set to `true`, which means that
   Ansible will run the command with root privileges. The `vars` section defines
   a variable called `password` and sets its value to `nodepool`.
2. `Install htop package`: This task installs the `htop` package on the local machine
   using the `ansible.builtin.dnf` module.
3. `Create fake directory`: This task creates a new directory called `/tmp/testdir`
   with permissions set to 0750 (user has read, write and execute permissions;
   group has read and execute permissions; other users have no permissions).

Overall, this playbook seems to be intended for testing LLMs on a local machine.
However, it's important to note that the `Create temporary user` task is creating
a new user with root privileges, which may not be desirable in all cases.
Additionally, the `Install htop package` task assumes that the `dnf` package manager
is being used, which may not always be the case.
```

### Summary

Codellama understand the code, gives some advices, but comparing to `deepseek-r1:32b`,
it is far far away.
