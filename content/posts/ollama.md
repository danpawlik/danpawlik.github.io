---
title: "Running Ollama on Intel Arc"
date: '2025-04-29T16:54:04+02:00'
# weight: 1
# aliases: ["/first"]
tags: ["first"]
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
# Introduction

The Ollama framework is used for running and managing large languagel models (LLMs)
on local computer such as laptop.
As a company employee (Red Hat), I recently received a new company laptop - Lenovo ThinkPad P1G7:
which have NPU (Neural Processing Unit), but no graphic card with CUDA,
so it raises some complications to start working on Ollama.
Let's see if the framework can be running on my laptop and let' try to make
some exploration with available models.

## System details

As I mentioned, my working laptop is: Lenovo P1 G7. Below screen shoot from
fastfetch (neofetch is not developed anymore :( )

![fastfetch](../../images/01-fastfetch.jpg)

## Is possible to run Ollama without Intel fork? Let's see

On the beginning of that adventure, I installed the ollama using the
most common installation script available on theirs [page](https://ollama.com/download).
Before that, let' see what the script is [doing](https://ollama.com/install.sh)

Note: I was not aware about the main requirements for the Ollama, which is: CUDA.

![ollama-install](../../images/02-ollama-install.jpg)

And after executing script...

![ollama-install](../../images/03-oolama-fail.jpg)

```shell
~ ❯ curl -fsSL https://ollama.com/install.sh | sh                                                                                                     ✘ 0|INT 14s 15:37:49
>>> Cleaning up old version at /usr/local/lib/ollama
>>> Installing ollama to /usr/local
>>> Downloading Linux amd64 bundle
######################################################################## 100.0%
>>> Creating ollama user...
>>> Adding ollama user to render group...
>>> Adding ollama user to video group...
>>> Adding current user to ollama group...
>>> Creating ollama systemd service...
>>> Enabling and starting ollama service...
Created symlink '/etc/systemd/system/default.target.wants/ollama.service' → '/etc/systemd/system/ollama.service'.
>>> The Ollama API is now available at 127.0.0.1:11434.
>>> Install complete. Run "ollama" from the command line.
WARNING: No NVIDIA/AMD GPU detected. Ollama will run in CPU-only mode.
```

Eh, what's now?
For sure I need to uninstall what has been done using the [guide](https://github.com/ollama/ollama/blob/main/docs/linux.md#uninstall)
and let's search for another solution.

## Intel Ipex llm

After quick Googling, I spotted some project on Github that might be interesting
and can "fit" my requirement - it was Intel Ipex llm available [here](https://github.com/intel/ipex-llm).
Of course there are many projects in Google, that are possitioned higher than
this one - right now AI is very hot topic.

### Installation

There is no rpm package available (I'm using Fedora 41), so I will run
the binary directly after unpacking the archive.

Download the archive from Github project release [page](https://github.com/ipex-llm/ipex-llm/releases/) - Ipex LLM:

```shell
curl -LO https://github.com/ipex-llm/ipex-llm/releases/download/v2.3.0-nightly/ollama-ipex-llm-2.3.0b20250415-ubuntu.tgz
```

After download, unpack:

```shell
tar xaf ollama-ipex-llm-2.3.0b20250415-ubuntu.tgz
```

Then go to the directly and start the `Ollama server` by executing:

```shell
./ollama serve
```

![ollama-serve](../../images/04-oolama-serve.jpg)

For making simply test for some programming question, I will use a `codellama:13b` model
available [here](https://ollama.com/library/codellama:13b).
More models with the description are available in the catalog [page](https://ollama.com/library?sort=popular).

![ollama-codellama](../../images/05-oolama-codellama.jpg)

That's all for that blog post. In next post I will try to show how the codellama works
with simply queries.
