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

## Pre requirements

For making this exercise, please make sure you have:

- configured properly the required packages - you can read about it [blog chapter](https://danpawlik.github.io/posts/intel-npu-driver-disappointment/#looking-for-driver-package)

## Start Ollama on Fedora and create Python script

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

### Checking exception error

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
First, let's assume that the binaries should be executed on `Ubuntu` system -
maybe there is an altnernative way to run the libraries inside the container?

## Start Ollama using container and execute the Python script

The container solution might be worth to try - if Intel is saying, that it should
be working, but the all libraries are done for Ubuntu - let's try with Ubuntu.

Based on the [documentation](https://github.com/intel/ipex-llm/blob/main/docs/mddocs/DockerGuides/docker_cpp_xpu_quickstart.md).

### Creating image and container

To create image container, execute:

```shell
sudo yum install -y podman git

git clone https://github.com/intel/ipex-llm && cr ipex-llm/docker/llm/inference-cpp

# NOTE: the container would be executes with sudo, so to have that
# image as sudo, run below command as it is.
sudo podman build -t intelanalytics/ipex-llm-inference-cpp-xpu:latest .
```

When all is done, we can start the container:

```shell
mkdir -p $HOME/.ollama

sudo podman run -itd \
    --net=host \
    --device=/dev/dri \
    -v $(realpath $HOME)/.ollama:/root/.ollama:z \
    --memory="32G" \
    --name=ipex-llm-inference-cpp-xpu-container \
    -e bench_model="mistral-7b-v0.1.Q4_0.gguf" \
    -e DEVICE=Arc \
    --shm-size="16g" \
    intelanalytics/ipex-llm-inference-cpp-xpu:latest
```

The container should be up and running:

![podmanContainer](../../posts/images/08-podman-container.jpg)

Of course the benchmark finished with error - need to pull that image first :)
Let's run Ollama, then pull the image.

NOTE: all below commands are inside the container:

```shell
/llm/scripts/start-ollama.sh
```

The "server" should be running in background, so we can type command:

```shell
# skip that command :)
/llm/ollama/ollama pull mistral:7b-instruct-q4_0
```

![pullImage](../../posts/images/09-ollamaPull.jpg)

Now after pulling image, benchmark should be available. Let's try again:

```shell
ln -s ~/.ollama/models /models
bash /llm/scripts/benchmark_llama-cpp.sh
```

Still it does not work. Quick Googling and it goes to [here](https://huggingface.co/TheBloke/Mistral-7B-v0.1-GGUF)...

```shell
pip3 install huggingface-hub
cd /models
huggingface-cli download \
    TheBloke/Mistral-7B-v0.1-GGUF \
    mistral-7b-v0.1.Q4_K_M.gguf \
    --local-dir . \
    --local-dir-use-symlinks False

mv /models/mistral-7b-v0.1.Q4_K_M.gguf /models/mistral-7b-v0.1.Q4_0.gguf

bash /llm/scripts/benchmark_llama-cpp.sh
```

![benchmark](../../posts/images/10-benchmark.jpg)

Where final results:

![benchmarkResults](../../posts/images/11-benchmark-results.jpg)

To help others if someone want to compare results, I paste it as a code:

```shell
sampler seed: 4017167485
sampler params:
        repeat_last_n = 64, repeat_penalty = 1.000, frequency_penalty = 0.000, presence_penalty = 0.000
        dry_multiplier = 0.000, dry_base = 1.750, dry_allowed_length = 2, dry_penalty_last_n = 1024
        top_k = 40, top_p = 0.950, min_p = 0.050, xtc_probability = 0.000, xtc_threshold = 0.100, typical_p = 1.000, top_n_sigma = -1.000, temp = 0.000
        mirostat = 0, mirostat_lr = 0.100, mirostat_ent = 5.000
sampler chain: logits -> logit-bias -> penalties -> dry -> top-k -> typical -> top-p -> min-p -> xtc -> temp-ext -> dist
generate: n_ctx = 1024, n_batch = 4096, n_predict = 128, n_keep = 1

 It is done, and submitted. You can play 'Survival of the Tastiest' on Android, and on the web. Playing on the web works, but you have to simulate multiple touch for table moving and that can be a bit confusing. There is a lot I'd like to talk about. I will go through every topic, insted of making the typical what went right/wrong list. Concept Working over the theme was probably one of the hardest tasks which I had to face. Originally, I had an idea of what kind of game I wanted to develop, gameplay wise - something with a lot of enemies/actors, simple graphics, maybe set in space, controlled from a top-down view. I was confident that I could fit any theme around it. In the end, the problem with a theme like 'Evolution' in a game is that evolution is unassisted. It happens through several seemingly random mutations over time, with the most apt permutation surviving. This genetic car simulator is, in my opinion, a great example of actual evolution of a species facing a challenge. But is it a game? In a game, you need to control something to reach an objective. That control goes against what evolution is supposed to be like. If you allow the user to pick how to evolve something, it's not evolution anymore - it's the equivalent of intelligent design, the fable invented by creationists to combat the idea of evolution. Being agnostic and a Pastafarian, that's not something that rubbed me the right way. Hence, my biggest dillema when deciding what to create was not with what I wanted to create, but with what I did not. I didn't want to create an 'intelligent design' simulator and wrongly call it evolution. This is a problem, of course, every other contestant also had to face. And judging by the entries submitted, not many managed to work around it. I'd say the only real solution was through the use of artificial selection, somehow. So far, I haven't seen any entry using this at its core gameplay. Alas, this is just a fun competition and after a while I decided not to be as strict with the game idea, and allowed myself to pick whatever I thought would work out. My initial idea was to create something where humanity tried to evolve to a next level, but had some kind of foe trying to stop them from doing so. I kind of had this image of human souls flying in space towards a monolith or a space baby (all based in 2001: A Space Odyssey of course) but I couldn't think of compelling (read: serious) mechanics for that. Borgs were my next inspiration, as their whole hypothesis fit pretty well into the evolution theme. But how to make it work? Are you the borg, or fighting the Borg? The third and final idea came to me through my girlfriend, who somehow gave me the idea of making something about the evolution of Pasta. The more I thought about it the more it sounded like it would work, so I decided to go with it. Conversations with my inspiring co-worker Roushey (who also created the 'Mechanical Underdogs' signature logo for my intros) further matured the concept, as it involved into the idea of having individual pieces of pasta flying around and trying to evolve until they became all-powerful. A secondary idea here was that the game would work to explain how the Flying Spaghetti Monster came to exist - by evolving from a normal dinner table. So the idea evolved more or less into this: you are sitting a table. You have your own plate, with is your 'base'. There are 5 other guests at the table, each with their own plate. Your plate can spawn little pieces of pasta. You do so by 'ordering' them through a menu. Some pastas are better than others; some are faster, some are stronger. They have varying 'costs', which are debited from your credits (you start with a number of credits). Once spawned, your pastas start flying around. Their instinct is to fly to other plates, in order to conquer them (the objective of the game is having your pasta conquer all the plates on the table). But they are really autonomous, so after being spawned, you have no control over your pasta (think DotA or LoL creeps). Your pasta doesn't like other people's pasta, so if they meet, they shoot sauce at each other until one dies. You get credits for other pastas your own pasta kill. Once a pasta is in vicinity of a plate, it will try to conquer it. If it is successful, it will become the new plate owner. If it is unsuccessful, it will try to conquer the plate again. If it is unsuccessful, it will try to conquer the plate again. If it is unsuccessful, it will try to conquer the plate again. If it is unsuccessful, it will try to conquer the plate again. If it is unsuccessful, it will try to conquer the plate again. If it is unsuccessful, it will try to conquer the plate again. If it is unsuccessful, it will try to

llama_perf_sampler_print:    sampling time =       3.63 ms /  1137 runs   (    0.00 ms per token, 313309.45 tokens per second)
llama_perf_context_print:        load time =    6145.64 ms
llama_perf_context_print: prompt eval time =    2899.34 ms /  1009 tokens (    2.87 ms per token,   348.01 tokens per second)
llama_perf_context_print:        eval time =   10173.23 ms /   127 runs   (   80.10 ms per token,    12.48 tokens per second)
llama_perf_context_print:       total time =   13086.18 ms /  1136 tokens
```

The benchmark works, does the Python script work too?

### Executing Python script

The script was already mentioned on the beginning of that blog article.
I will not paste it again - you will find it.
What is worth to mention, you don't need to create that script inside the container,
or even copy it there. When you create the container, you put an argument: `--net=host`,
so exposing the `Ollama` default port was not needed (`11434`) - you can check via
netstat/ss and it should be available from your local machine (or my laptop :) )

```shell
$ ss -nltpu | grep 11434
tcp   LISTEN 0      4096       127.0.0.1:11434      0.0.0.0:*
```

Let's run the script.

```shell
python3 test.py
```

when executed, inside the container shows logs:

![ollamaLogs](../../posts/images/12-ollama-logs.jpg)

and the final code is:

![finalCode](../../posts/images/13-final-code.jpg)

```shell
num1 = input("Enter the first number: ")
num2 = input("Enter the second number: ")
result = num1 + num2
print(f"The result is {result}")

This script will ask the user to enter two numbers, and then it will add them
together using the `+` operator. The result of the addition will be printed
to the console.
```

Don't think it is a proper code, but, maybe other models would understand
my queries in better way.

## Summary

The Ollama works fine inside the container. Uff, good to have a way to run somehow
that tool. Finally it works \o/ I can make an AI exploration.

About the results - I don't know if such results are satisfying me, but... maybe they are just ok.
