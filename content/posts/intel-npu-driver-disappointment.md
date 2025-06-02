---
title: "Intel Npu Driver Disappointment"
date: '2025-05-20T09:38:38+02:00'
# weight: 1
# aliases: ["/first"]
# tags: ["first"]
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
# About Intel NPU driver

According to the main project [page](https://github.com/intel/linux-npu-driver) on Github,

```raw

Intel® NPU device is an AI inference accelerator integrated with Intel client CPUs,
starting from Intel® Core™ Ultra generation of CPUs (formerly known as Meteor Lake).
It enables energy-efficient execution of artificial neural network tasks."
```

## Updating drivers

The first thought that came to my mind was that you need to have NPU drivers
installed on your system, or at least see if they are updated. This is where
I was disappointed - the official [release](https://github.com/intel/linux-npu-driver/releases) is made only for Ubuntu 22.04 and Ubuntu 24.04,
while nothing is mentioned regarding Red Hat or SuSe family systems, etc.

Nothing lost, probably need to make an issue and in the near future, the project
will give support. Here I until amazed - the issue [already exists](https://github.com/intel/linux-npu-driver/issues/91),
and the project owners themselves said that they do not plan to provide support
for other systems in the near future.
So, the mystery of "why Intel's sales are falling more and more" has been
solved - people buy/choose laptops hoping for developments in AI,
and they get the answer: "well not now, or change the system :)".

## Looking for driver package

After Googling, I spotted that there is a [project](https://copr.fedorainfracloud.org/coprs/xanderlent/intel-npu-driver/) available on Fedora COPR,
which have the rpm packages. The packages are outdated, but not so much -
last released version is 1.17.0, where last on COPR is 1.16.0.

Let's install those drivers and check how they work... Or maybe let's try to
update it to newer version?

### Driver installation - COPR way from xanderlent

If the COPR repository contains packages for your system release (in my case
it is Fedora 42), that's easy to configure, just:

```shell
sudo dnf copr enable xanderlent/intel-npu-driver
```

Or by executing command:

```shell
cat << EOF | sudo tee /etc/yum.repos.d/_copr:copr.fedorainfracloud.org:xanderlent:intel-npu-driver
[copr:copr.fedorainfracloud.org:xanderlent:intel-npu-driver]
name=Copr repo for intel-npu-driver owned by xanderlent
baseurl=https://download.copr.fedorainfracloud.org/results/xanderlent/intel-npu-driver/fedora-$releasever-$basearch/
type=rpm-md
skip_if_unavailable=True
gpgcheck=1
gpgkey=https://download.copr.fedorainfracloud.org/results/xanderlent/intel-npu-driver/pubkey.gpg
repo_gpgcheck=0
enabled=1
enabled_metadata=1
EOF
```

After that:

```shell
sudo yum install intel-npu-firmware intel-npu-level-zero
```

Then reboot your machine.

### Verifying driver installation

According to the [release](https://github.com/intel/linux-npu-driver/releases) page,
if everything works, we should see `/dev/accel/accel0` device.
That's interesting, because... on Fedora 42, that device was available
before installing the `intel-npu-drivers`. Does it mean that the
driver was already installed? I don't think so, but something was providing
necessary driver that enable `accel0`. The `dmesg` before installing the
drivers did not show anything related to `intel_vpu`.

Just in case, I leave currently installed packages related to "intel":

```shell
$ rpm -qa |grep -i intel | sort
intel-audio-firmware-20250509-1.fc42.noarch
intel-gmmlib-22.7.2-1.fc42.x86_64
intel-gpu-firmware-20250509-1.fc42.noarch
intel-mediasdk-23.2.2-7.fc42.x86_64
intel-vpl-gpu-rt-25.1.3-1.fc42.x86_64
intel-vsc-firmware-20250509-1.fc42.noarch
libva-intel-media-driver-25.1.4-1.fc42.x86_64
```

Also by calling `dmesg` should be an information:

```shell
[    2.507891] intel_vpu 0000:00:0b.0: enabling device (0000 -> 0002)
[    2.520155] intel_vpu 0000:00:0b.0: [drm] Firmware: intel/vpu/vpu_37xx_v0.0.bin, version: 20250306*MTL_CLIENT_SILICON-release*1130*ci_tag_ud202512_vpu_rc_20250306_1130*5064b5debc3
[    2.520157] intel_vpu 0000:00:0b.0: [drm] Scheduler mode: OS
[    2.609394] [drm] Initialized intel_vpu 1.0.0 for 0000:00:0b.0 on minor 0
```

## Updating driver to newer version - COPR way with my fork (not working)

The COPR tool is very useful and many things are available public, even those
if someone would like to create a "fork" of the repository.
I create a new project in py COPR repository, with same name: `intel-npu-driver`,
based on `xanderlent` repo and set `active releases`. In my case,
I also enable Fedora Rawhide, CentOS 10 and RHEL - just for testing.
Then create a package `intel-npu-level-zero`, where "Clone url" was poiting
to my Github [fork](https://github.com/danpawlik/intel-npu-driver-rpm)
of [xanderlent](https://github.com/xanderlent/intel-npu-driver-rpm).

![copr](../../posts/images/01-intel-npu-driver.jpg)

After all was configured, I triggered building package - right now without any
modification. I want to see how the builds would be working for RHEL and Rawhide.
Of course because of the dependencies, it fails for CentOS 9, RHEL 8 and RHEL 9,
but what surprised me - it pass on CentOS 10 \o/.

![buildfailed](../../posts/images/02-intel-npu-driver.jpg)

Now let's try to update the driver version to newer release and in the same time,
we should update related components, to avoid unexpected issues.

I have done as following on the screen shoot:

![gitudpate](../../posts/images/03-intel-npu-driver.jpg)

Repo [updated](https://github.com/xanderlent/intel-npu-driver-rpm/commit/beaef4e6c875308d6f2bf71fcf9721a1bb052eff),
now triggering rebuild:

![triggerbuild](../../posts/images/04-intel-npu-driver.jpg)

Result of that can be predictable - of course it requires additional work to do
to make new package. If that would be so simple, people would fork official project
and attach own packages into the release or create a Github Action, that would
create it by them.

Maybe I will create another blog post entry, where I would solve the building
issue. I can't promise that!

![allfails](../../posts/images/05-intel-npu-driver.jpg)

## Updating driver to newer version - using Alien (not working)

Another approach to get the package for Red Hat familly system might be...
convert the `.deb` packages into `.rpm` using `alien` tool - doing that
inside the container:

```shell
podman run --name alien -it fedora:42 bash

# inside the container
yum install -y wget git vim alien

# Copy commands from release page to dowload package
wget https://github.com/intel/linux-npu-driver/releases/download/v1.17.0/intel-driver-compiler-npu_1.17.0.20250508-14912879441_ubuntu24.04_amd64.deb
wget https://github.com/intel/linux-npu-driver/releases/download/v1.17.0/intel-fw-npu_1.17.0.20250508-14912879441_ubuntu24.04_amd64.deb
wget https://github.com/intel/linux-npu-driver/releases/download/v1.17.0/intel-level-zero-npu_1.17.0.20250508-14912879441_ubuntu24.04_amd64.deb

# Convert
alien -r intel-driver-compiler-npu_1.17.0.20250508-14912879441_ubuntu24.04_amd64.deb
alien -r intel-fw-npu_1.17.0.20250508-14912879441_ubuntu24.04_amd64.deb
alien -r intel-level-zero-npu_1.17.0.20250508-14912879441_ubuntu24.04_amd64.deb

# create dir and move files
mkdir -p new-rpms
mv *rpm new-rpms/
```

All goes smoth - it is too easy.
I forget to mount some directory into the container, so now I need to copy the
generated packages to the system:

```shell
podman cp a8:/root/new-rpms .
```

All packages pushed to the Github [project](https://github.com/danpawlik/intel-npu-driver-rpm/releases/tag/v1.17.0) and marked as `pre-release`, due
I did not test it yet.

Making a test...

```shell
~/ai ❯ sudo yum install rpms/*

Updating and loading repositories:
Repositories loaded.
Package                                                   Arch          Version                                                   Repository                           Size
Installing:
 intel-driver-compiler-npu                                x86_64        1.17.0.20250508-14912879442                               @commandline                    133.2 MiB
 intel-fw-npu                                             x86_64        1.17.0.20250508-14912879442                               @commandline                      4.2 MiB
 intel-level-zero-npu                                     x86_64        1.17.0.20250508-14912879442                               @commandline                      1.6 MiB

Transaction Summary:
 Installing:         3 packages

Total size of inbound packages is 30 MiB. Need to download 0 B.
After this operation, 139 MiB extra will be used (install 139 MiB, remove 0 B).
Is this ok [y/N]: y
Running transaction
Transaction failed: Rpm transaction failed.
Warning: skipped OpenPGP checks for 3 packages from repository: @commandline
  - file /usr/lib from install of intel-level-zero-npu-1.17.0.20250508-14912879442.x86_64 conflicts with file from package filesystem-3.18-42.fc42.x86_64
  - file /lib from install of intel-fw-npu-1.17.0.20250508-14912879442.x86_64 conflicts with file from package filesystem-3.18-42.fc42.x86_64
  - file /lib/firmware/updates/intel/vpu/vpu_37xx_v0.0.bin from install of intel-fw-npu-1.17.0.20250508-14912879442.x86_64 conflicts with file from package intel-npu-firmware-upstream-1.16.0-2.fc42.noarch
  - file /lib/firmware/updates/intel/vpu/vpu_40xx_v0.0.bin from install of intel-fw-npu-1.17.0.20250508-14912879442.x86_64 conflicts with file from package intel-npu-firmware-upstream-1.16.0-2.fc42.noarch
  - file /usr/lib from install of intel-driver-compiler-npu-1.17.0.20250508-14912879442.x86_64 conflicts with file from package filesystem-3.18-42.fc42.x86_64
```

Of course it can not be so simply :)
Checking how to solve the error: `file /usr/lib conclicts with file from package`.
Someone already has such [issue](https://www.electricmonk.nl/log/2017/02/23/how-to-solve-rpms-created-by-alien-having-file-conflicts/),
after applying that... It raises new issuse - building the rpm package
requires some work, so it would be presented in other blog post entry.

## Summary

If you want to install the Intel NPU drivers, use COPR repository
