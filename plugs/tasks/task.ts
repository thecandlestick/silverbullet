import type { ClickEvent } from "../../webapp/app_event";
import { IndexEvent } from "../../webapp/app_event";
import { syscall } from "../lib/syscall";

import { whiteOutQueries } from "../core/materialized_queries";

const allTasksPageName = "ALL TASKS";
const taskRe = /[\-\*]\s*\[([ Xx])\]\s*(.*)/g;
const taskFullRe =
  /(?<prefix>[\t ]*)[\-\*]\s*\[([ Xx])\]\s*([^\n]+)(\n\k<prefix>\s+[\-\*][^\n]+)*/g;
const extractPageLink = /[\-\*]\s*\[[ Xx]\]\s\[\[([^\]]+)@(\d+)\]\]\s*(.*)/;

type Task = {
  task: string;
  complete: boolean;
  pos?: number;
  children?: string[];
};

export async function indexTasks({ name, text }: IndexEvent) {
  if (name === allTasksPageName) {
    return;
  }

  console.log("Indexing tasks");
  let tasks: { key: string; value: Task }[] = [];
  text = whiteOutQueries(text);
  for (let match of text.matchAll(taskFullRe)) {
    let entire = match[0];
    let complete = match[2] !== " ";
    let task = match[3];
    let pos = match.index!;
    let lines = entire.split("\n");

    let value: Task = {
      task,
      complete,
    };
    if (lines.length > 1) {
      value.children = lines.slice(1);
    }
    tasks.push({
      key: `task:${pos}`,
      value,
    });
  }
  console.log("Found", tasks.length, "task(s)");
  await syscall("indexer.batchSet", name, tasks);
}

export async function updateTaskPage() {
  let allTasks = await syscall("indexer.scanPrefixGlobal", "task:");
  let pageTasks = new Map<string, Task[]>();
  for (let {
    key,
    page,
    value: { task, complete },
  } of allTasks) {
    if (complete) {
      continue;
    }
    let [, pos] = key.split(":");
    let tasks = pageTasks.get(page) || [];
    tasks.push({ task, complete, pos });
    pageTasks.set(page, tasks);
  }

  let mdPieces = [];
  for (let pageName of [...pageTasks.keys()].sort()) {
    mdPieces.push(`\n## ${pageName}\n`);
    for (let task of pageTasks.get(pageName)!) {
      mdPieces.push(
        `* [${task.complete ? "x" : " "}] [[${pageName}@${task.pos}]] ${
          task.task
        }`
      );
    }
  }

  let taskMd = mdPieces.join("\n");
  await syscall("space.writePage", allTasksPageName, taskMd);
}

export async function taskToggle(event: ClickEvent) {
  let syntaxNode = await syscall("editor.getSyntaxNodeAtPos", event.pos);
  if (syntaxNode && syntaxNode.name === "TaskMarker") {
    let changeTo = "[x]";
    if (syntaxNode.text === "[x]" || syntaxNode.text === "[X]") {
      changeTo = "[ ]";
    }
    await syscall("editor.dispatch", {
      changes: {
        from: syntaxNode.from,
        to: syntaxNode.to,
        insert: changeTo,
      },
      selection: {
        anchor: event.pos,
      },
    });
    if (event.page === allTasksPageName) {
      // Propagate back to the page in question
      let line = (await syscall("editor.getLineUnderCursor")) as string;
      let match = line.match(extractPageLink);
      if (match) {
        let [, page, posS] = match;
        let pos = +posS;
        let pageData = await syscall("space.readPage", page);
        let text = pageData.text;

        // Apply the toggle
        text =
          text.substring(0, pos) +
          text.substring(pos).replace(/^([\-\*]\s*)\[[ xX]\]/, "$1" + changeTo);

        await syscall("space.writePage", page, text);
      }
    }
  }
}