---
title: "Using Ollama"
date: '2025-06-02T11:01:10+02:00'
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

In this blog post, I would try to introduce you, how simply use the Ollama.

# Using Python script

The `Ollama` tool can be called using many programming languages. In my example,
I would be using Python language for making queries for `codellama:13b` model.

First, let's serve the Ollama

![serveOllama](../../posts/images/01-serve-ollama.jpg)

Ensure, that the model is available:

![pullModel](../../posts/images/02-pull-model.jpg)

Install the ollama package using command:

```shell
pip3 install ollama
```

Then create a simply script, for example:

```shell
cat << EOF > test.py
#!/usr/bin/env python3

import ollama

response = ollama.generate(
    model="codellama:13b",
    prompt="Create script in python that will ask for two numbers then it would add"
)

print(response['response'])
```

Then execute it. In my case, it finished with ERROR:

![pythonError](../../posts/images/03-python-error.jpg)

Where Ollama console shows:

![queryProcessing](../../posts/images/04-query-processing.jpg)

![queryProcessingContinuation](../../posts/images/05-query-processing-continuation.jpg)

![gdbDebug](../../posts/images/06-query-processing-gdb.jpg)

![gdbDebugContinuation](../../posts/images/06-query-processing-gdb-continuation.jpg)

The exception does not say anything interesting.

# Checking exception error

After quick googling, it seems that if error is related to `ggml-cpu.c:13612: fatal error:`
it can be:

* it is normal error from Ollama ggml library and
* it is a problem on model execution - not enough memory, inproper hardware or
  library issue

I have enough memory (in the logs, I can see that 51G is free), so issue needs to
be somewhere else. Another suggestion were:

* no enough VRAM for GPU (NPU)
* no GPU acceleration - `flash_attn = 0` (no Flash Attention) and `llama_kv_cache_init: offload = 1`
  suggest, that the model uses CPU so if I have GPU, it might be unproperly configured
* ollama version is too new (buggy)
* version is focused on Ubuntu, might not be work properly on other system

From the all suggestions, I think error might be related to all of them.
I would start by checking, if the GPU is properly configured, but it would be done
in next blog post.
