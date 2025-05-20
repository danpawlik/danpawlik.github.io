---
date: '2025-05-20T09:38:38+02:00'
draft: true
title: 'Intel Npu Driver Disappointment'
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


### Driver installation

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
