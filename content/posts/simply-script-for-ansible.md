---
title: "Create simply script to verify Ansible yaml file"
date: '2025-06-17T09:08:04+02:00'
tags: ["script"]
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

In this blog post I would try to introduce you, how to create a prompt query
using Python script to Ollama, that will verify Ansible playbook or role
tasks that are in yaml file.

## Pre requirements

For making this exercise, please make sure you have:

- configured properly the required packages - you can read about it [blog chapter](https://danpawlik.github.io/posts/intel-npu-driver-disappointment/#looking-for-driver-package)
- you have started an LLM container and you know how to start Ollama. All is
  described in this [blog chapter](https://danpawlik.github.io/posts/using-ollama/#start-ollama-using-container-and-execute-the-python-script)

## Recreate container

To avoid copy-paste or edit the code directly inside the container,
I decided to create new container, that would have additional mounts.
Also some environment variable are not needed anymore, so let's remove them
too.

```shell
sudo podman run -itd \
    --net=host \
    --device=/dev/dri \
    -v $(echo $HOME)/.ollama:/root/.ollama:z \
    -v $(echo $HOME)/ai:/root/ai:z \
    -v $(echo $HOME)/RH/ng:/root/ng:z \
    --memory="32G" \
    --name=ipex-llm-inference-cpp-xpu-container \
    -e DEVICE=Arc \
    --shm-size="16g" \
    intelanalytics/ipex-llm-inference-cpp-xpu:latest
```

Where:

- `~/ai` - is a workdir, where I created a Python script
- `~/RH` - is my workdir used for work. In this dir, I have already cloned
           project `ci-framework` ('~/RH/ng/ci-framework')
- `~/.ollama` - is a Ollama workding which is used by the service to store
                required data, like models.

You can create the directories using command:

```shell
mkdir -p ~/ai ~/RH ~/.ollama
```

or just remove the volume mount to the container.

## Simply Python script

For testing purpose, I created a simple script that takes as an argument
a file(s) to be loaded, spars as yaml, and at the end will send a query
to Ollam, in which it will claim to analyze the code and optimize it.

Soon I will try to write a more complicated example, which will make more
use of Ollam's capabilities. For now, you need to understand the basics.

The script looks like:

```python
#!/usr/bin/env python3

import ollama
import os
import yaml
import sys


def load_yaml_file(file_path):
    if not os.path.exists(file_path):
        print("The file does not exists or permissions error!")
        sys.exit(1)
    try:
        with open(file_path, 'r', encoding="utf-8") as file:
            return yaml.safe_load(file)
    except yaml.YAMLError as e:
        print(f"Error on parsing file {file_path}: {e}")
        sys.exit(1)


def main():
    if len(sys.argv) < 2:
        print("Can not continue. Please add file to parse as argument")
        sys.exit(1)

    for file_path in sys.argv[1:]:
        yaml_content = load_yaml_file(file_path)

        prompt = f"""
    Could you analyze the Ansible file and check if it is
    correct or it can be improved?

    Here is the YAML:
    ```yaml
    {yaml_content}
    """

        client = ollama.Client()
        response = client.generate(model="codellama:13b", prompt=prompt)

        print("=== CODELLAMA ANALYSIS ===")
        print(response['response'])

if __name__ == "__main__":
    main()
```

## Script execution preparation

As it was mentioned, we need to have the container running.
I assume you already have one, so let's exec to the container and
start Ollama server:

NOTE: *All commands below would be executed inside the container*

```shell
sudo podman exec -it ipex-llm-inference-cpp-xpu-container bash

/llm/scripts/start-ollama.sh
```

The `Ollama` should be running as a background process, so let's execute
the script now.

In my case, I already have a `ci-framework` project available in `~/ng/ci-framework`
inside the container. If you don't have it, just run the command:

```shell
git clone https://github.com/openstack-k8s-operators/ci-framework ~/ng/ci-framework
```

## Executing script - very simply role file

Testing basic simply yaml file that is in `ci_setup` role.

```shell
python3 test-ansible.py /root/ng/ci-framework/roles/ci_setup/tasks/main.yml
```

![mainRole](../../posts/images/01-simply-script-main-role.jpg)

The Ollama replies (as you see on the screen):

```raw
  - name: Load vars
    tags:
      - always
    ansible.builtin.import_tasks: load_vars.yml

  - name: Install packages
    tags:
      - always
    ansible.builtin.import_tasks: packages.yml

  - name: Enable repos
    tags:
      - always
    ansible.builtin.import_tasks: repos.yml

  - name: Create directories
    tags:
      - always
    vars:
      directory_state: directory
    ansible.builtin.import_tasks: directories.yml

This Ansible playbook imports a number of tasks from other files, and assigns
them to different groups based on the `tags` property. The `always` tag is used
to indicate that these tasks should always be executed during the playbook
run, regardless of whether they are part of the current task or not.

The `ansible.builtin.import_tasks` module is used to import tasks from
other files. In this case, it imports `load_vars.yml`, `packages.yml`,
`repos.yml`, and `directories.yml`. These files contain additional tasks
that are executed during the playbook run.

The `directory_state` variable is defined in the `Create directories` task,
and is used to specify that the directory should be created if it does not
already exist. The value of this variable can be modified as needed to
control the behavior of the `ansible.builtin.file` module, which is used
to create the directory.

Overall, this playbook appears to be well-structured and easy to read. It uses
Ansible's built-in modules and tags to achieve its goals, and it is a good
starting point for any Ansible playbook.
```

The file was very simply, so the summary is ok.

## Executing script - advanced role file

Definitely more advanced tasks are located in `reproducer` role.
Let's see what summary or code optimalization would suggest
using [file](https://github.com/openstack-k8s-operators/ci-framework/blob/5486e254db14394ff723ef91587934af2458d786/roles/reproducer/tasks/configure_controller.yml).

```shell
python3 test-ansible.py /root/ng/ci-framework/roles/reproducer/tasks/configure_controller.yml
```

![advancedRole](../../posts/images/02-simply-script-reproducer-role.jpg)

Prompt raise an issue, that the file is not properly closed:

```raw
This task is defining a number of variables that will be used by the `ntpopenstack_cifmw.yaml
     [/snippets]  The role you are using is not properly closed. You need to add a closing bracket at the endraw %}", and I believe you are defining a number of variables that will be used by the cifmw.yaml', 'content': "{% raw %}\n {% for key, value in _cifmw.yaml', 'target': "cifmw.yaml'}}"
```

It is high possible, that the Python yaml library can not parse the `yaml`
with `jinja2`. Let's modify the script and read the file
as it is, not parse to yaml.

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
        response = client.generate(model="codellama:13b", prompt=prompt)

        print("=== CODELLAMA ANALYSIS ===")
        print(response['response'])

if __name__ == "__main__":
    main()
```

Modification done:

- changed function name from `load_yaml_file` to `load_file`
- changed function `load_file` to return string exactly what file contains,
  without parsing to yaml

After few times execution, it always prints some artifacts instead of summary,
advice etc.

![advancedRole](../../posts/images/03-simply-script-reproducer-role.jpg)

## Summary

For basic Ansible tasks file, summary was ok, but with more advanced file,
probably the default limits what are set are not enough to compute the query.
I will do another blog post to check if another model would be able to proceed.
