---
tags: template
type: query
description: generic task template that supports updating the status back in the origin page
order: 1
---
* [{{state}}] {{replaceRegexp name "#[^#\d\s\[\]]+\w+" ""}} **DUE:** {{deadline}}