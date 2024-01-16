---
pageName: "notes-1200/"
tags: template
type: page
---
#cs1200LN
|  |  |  |  |
|----------|----------|----------|----------|
| [[CS1200|Home]] | [[CS1200-Calendar|Calendar]] | [[course syllabus|Syllabus]] | [[course lec notes|Lecture Notes]] |

|^|
## Reminders

```query
cs1200task
where done = false
render [[template/task]]
```

## Objectives

```query
task
where page = "CS1200-Calendar" and done = false
limit 3
render [[template/task]]
```
---
