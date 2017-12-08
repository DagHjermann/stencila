---
title: Stencila Enhancement Proposals
author:
  - Nokome Bentley
type: Process
status: Draft
---

# Introduction

A Stencila Enhancement Proposal (StEP) is a proposal for a enhancement to Stencila. Each StEP is a design document for a process, feature or fix with a concise specification of it's rationale and specification. StEPs often also provide auxiliary files with guidance on implementation approaches.

StEPs are inspired by PEPs (Python Enhancement Proposals). Rather than reinvent the wheel, StEPs borrow many concepts (and name!) from PEPs and this document draws much from [PEP 1](https://www.python.org/dev/peps/pep-0001/).

# Creating a StEP

StEPs are usually created for larger features or fixes. If you have a feature idea it worthwhile to discuss it on the [community forum](https://community.stenci.la/) before submitting. For smaller bugs please use [Github issues ](https://github.com/stencila/stencila/issues).

## Format

StEPs are written in Markdown. Markdown is used because of it's wide use amongst developers (and increasingly researchers), because it is rendered nicely by default on Github and easily integrated with documentation tools.

## Header

Each StEP should begin with a YAML header:

```yaml
---
title: <pep title>
author:
  - <first author>
  - <second author>
  - <third author>
type: <Process | Feature | Fix>
status: <Draft | Active | Accepted | Deferred | Rejected | Withdrawn | Final | Superseded>
---
```

## File name

StEPs should have a file name with the pattern `step-XXXX-SLUG.md`, where `XXXX` is the StEP number and `SLUG` is a human readable shortened title (e.g. `cell-editor`).

## Auxiliary files

StEPs may include auxiliary files such as diagrams, code samples, or Markdown files. Such files must start with the filename of the StEP (e.g. `0001-cell-editor-auxiliary-file.md`).

## Submitting

Just send a pull request to https://github.com/stencila/stencila