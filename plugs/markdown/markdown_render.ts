import {
  addParentPointers,
  collectNodesOfType,
  findNodeOfType,
  ParseTree,
  removeParentPointers,
  renderToText,
  traverseTree,
} from "$sb/lib/tree.ts";
import { Fragment, renderHtml, Tag } from "./html_render.ts";

export type MarkdownRenderOptions = {
  failOnUnknown?: true;
  smartHardBreak?: true;
  annotationPositions?: true;
  attachmentUrlPrefix?: string;
  preserveAttributes?: true;
  // When defined, use to inline images as data: urls
  translateUrls?: (url: string) => string;
};

function cleanTags(values: (Tag | null)[], cleanWhitespace = false): Tag[] {
  const result: Tag[] = [];
  for (const value of values) {
    if (cleanWhitespace && typeof value === "string" && value.match(/^\s+$/)) {
      continue;
    }
    if (value) {
      result.push(value);
    }
  }
  return result;
}

function preprocess(t: ParseTree, options: MarkdownRenderOptions = {}) {
  addParentPointers(t);
  traverseTree(t, (node) => {
    if (!node.type) {
      if (node.text?.startsWith("\n")) {
        const prevNodeIdx = node.parent!.children!.indexOf(node) - 1;
        if (node.parent!.children![prevNodeIdx]?.type !== "Paragraph") {
          node.text = node.text.slice(1);
        }
      }
    }
    return false;
  });
}

function posPreservingRender(
  t: ParseTree,
  options: MarkdownRenderOptions = {},
): Tag | null {
  const tag = render(t, options);
  if (!options.annotationPositions) {
    return tag;
  }
  if (!tag) {
    return null;
  }
  if (typeof tag === "string") {
    return tag;
  }
  if (t.from) {
    if (!tag.attrs) {
      tag.attrs = {};
    }
    tag.attrs["data-pos"] = "" + t.from;
  }
  return tag;
}

function render(
  t: ParseTree,
  options: MarkdownRenderOptions = {},
): Tag | null {
  if (t.type?.endsWith("Mark") || t.type?.endsWith("Delimiter")) {
    return null;
  }
  switch (t.type) {
    case "Document":
      return {
        name: Fragment,
        body: cleanTags(mapRender(t.children!)),
      };
    case "FrontMatter":
      return null;
    case "CommentBlock":
      // Remove, for now
      return null;
    case "ATXHeading1":
      return {
        name: "h1",
        body: cleanTags(mapRender(t.children!)),
      };
    case "ATXHeading2":
      return {
        name: "h2",
        body: cleanTags(mapRender(t.children!)),
      };
    case "ATXHeading3":
      return {
        name: "h3",
        body: cleanTags(mapRender(t.children!)),
      };
    case "ATXHeading4":
      return {
        name: "h4",
        body: cleanTags(mapRender(t.children!)),
      };
    case "ATXHeading5":
      return {
        name: "h5",
        body: cleanTags(mapRender(t.children!)),
      };
    case "Paragraph":
      return {
        name: "span",
        attrs: {
          class: "p",
        },
        body: cleanTags(mapRender(t.children!)),
      };
    // Code blocks
    case "FencedCode":
    case "CodeBlock": {
      // Clear out top-level indent blocks
      const lang = findNodeOfType(t, "CodeInfo");
      t.children = t.children!.filter((c) => c.type);
      return {
        name: "pre",
        attrs: {
          "data-lang": lang ? lang.children![0].text : undefined,
        },
        body: cleanTags(mapRender(t.children!)),
      };
    }
    case "CodeInfo":
      return null;
    case "CodeText":
      return t.children![0].text!;
    case "Blockquote":
      return {
        name: "blockquote",
        body: cleanTags(mapRender(t.children!)),
      };
    case "HardBreak":
      return {
        name: "br",
        body: "",
      };
    // Basic styling
    case "Emphasis":
      return {
        name: "em",
        body: cleanTags(mapRender(t.children!)),
      };
    case "Highlight":
      return {
        name: "span",
        attrs: {
          class: "highlight",
        },
        body: cleanTags(mapRender(t.children!)),
      };
    case "Strikethrough":
      return {
        name: "del",
        body: cleanTags(mapRender(t.children!)),
      };
    case "InlineCode":
      return {
        name: "tt",
        body: cleanTags(mapRender(t.children!)),
      };
    case "BulletList":
      return {
        name: "ul",
        body: cleanTags(mapRender(t.children!), true),
      };
    case "OrderedList":
      return {
        name: "ol",
        body: cleanTags(mapRender(t.children!), true),
      };
    case "ListItem":
      return {
        name: "li",
        body: cleanTags(mapRender(t.children!), true),
      };
    case "StrongEmphasis":
      return {
        name: "strong",
        body: cleanTags(mapRender(t.children!)),
      };
    case "HorizontalRule":
      return {
        name: "hr",
        body: "",
      };
    case "Link": {
      const linkText = t.children![1].text!;
      const urlNode = findNodeOfType(t, "URL");
      if (!urlNode) {
        return renderToText(t);
      }
      let url = urlNode.children![0].text!;
      if (url.indexOf("://") === -1) {
        url = `${options.attachmentUrlPrefix || ""}${url}`;
      }
      return {
        name: "a",
        attrs: {
          href: url,
        },
        body: linkText,
      };
    }
    case "Image": {
      const altText = t.children![1].text!;
      const urlNode = findNodeOfType(t, "URL");
      if (!urlNode) {
        return renderToText(t);
      }
      let url = urlNode!.children![0].text!;
      if (url.indexOf("://") === -1) {
        url = `${options.attachmentUrlPrefix || ""}${url}`;
      }
      return {
        name: "img",
        attrs: {
          src: url,
          alt: altText,
        },
        body: "",
      };
    }

    // Custom stuff
    case "WikiLink": {
      // console.log("WikiLink", JSON.stringify(t, null, 2));
      const ref = findNodeOfType(t, "WikiLinkPage")!.children![0].text!;
      let linkText = ref.split("/").pop()!;
      const aliasNode = findNodeOfType(t, "WikiLinkAlias");
      if (aliasNode) {
        linkText = aliasNode.children![0].text!;
      }
      return {
        name: "a",
        attrs: {
          href: `/${ref.replace("@", "#")}`,
          class: "wiki-link",
          "data-ref": ref,
        },
        body: linkText,
      };
    }
    case "NakedURL": {
      const url = t.children![0].text!;
      return {
        name: "a",
        attrs: {
          href: url,
        },
        body: url,
      };
    }
    case "Hashtag":
      return {
        name: "strong",
        body: t.children![0].text!,
      };

    case "Task": {
      let externalTaskRef = "";
      collectNodesOfType(t, "WikiLinkPage").forEach((wikilink) => {
        const ref = wikilink.children![0].text!;
        if (!externalTaskRef && (ref.includes("@") || ref.includes("$"))) {
          externalTaskRef = ref;
        }
      });

      return {
        name: "span",
        attrs: externalTaskRef
          ? {
            "data-external-task-ref": externalTaskRef,
          }
          : {},
        body: cleanTags(mapRender(t.children!)),
      };
    }
    case "TaskState": {
      // child[0] = marker, child[1] = state, child[2] = marker
      const stateText = t.children![1].text!;
      if ([" ", "x", "X"].includes(stateText)) {
        return {
          name: "input",
          attrs: {
            type: "checkbox",
            checked: stateText !== " " ? "checked" : undefined,
            "data-state": stateText,
          },
          body: "",
        };
      } else {
        return {
          name: "span",
          attrs: {
            class: "task-state",
          },
          body: stateText,
        };
      }
    }
    case "NamedAnchor":
      return {
        name: "a",
        attrs: {
          name: t.children![0].text?.substring(1),
        },
        body: "",
      };
    case "CommandLink": {
      // Child 0 is CommandLinkMark, child 1 is CommandLinkPage
      const commandText = t.children![1].children![0].text!;

      return {
        name: "button",
        attrs: {
          "data-onclick": JSON.stringify(["command", commandText]),
        },
        body: commandText,
      };
    }

    case "DeadlineDate":
      return {
        name: "span",
        attrs: {
          class: "task-deadline",
        },
        body: renderToText(t),
      };

    // Tables
    case "Table":
      return {
        name: "table",
        body: cleanTags(mapRender(t.children!)),
      };
    case "TableHeader":
      return {
        name: "thead",
        body: [
          {
            name: "tr",
            body: cleanTags(mapRender(t.children!)),
          },
        ],
      };
    case "TableCell":
      return {
        name: "td",
        body: cleanTags(mapRender(t.children!)),
      };
    case "TableRow": {
      const children = t.children!;
      const newChildren: ParseTree[] = [];
      // Ensure there is TableCell in between every delimiter
      let lookingForCell = false;
      for (const child of children) {
        if (child.type === "TableDelimiter" && lookingForCell) {
          // We were looking for a cell, but didn't fine one: empty cell!
          // Let's inject an empty one
          newChildren.push({
            type: "TableCell",
            children: [],
          });
        }
        if (child.type === "TableDelimiter") {
          lookingForCell = true;
        }
        if (child.type === "TableCell") {
          lookingForCell = false;
        }
        newChildren.push(child);
      }
      return {
        name: "tr",
        body: cleanTags(mapRender(newChildren)),
      };
    }
    case "Directive": {
      const body = findNodeOfType(t, "DirectiveBody")!;
      return posPreservingRender(body.children![0], options);
    }
    case "Attribute":
      if (options.preserveAttributes) {
        return {
          name: "span",
          attrs: {
            class: "attribute",
          },
          body: renderToText(t),
        };
      }
      return null;
    case "Escape": {
      return {
        name: "span",
        attrs: {
          class: "escape",
        },
        body: t.children![0].text!.slice(1),
      };
    }
    case "Entity":
      return t.children![0].text!;

    // Text
    case undefined:
      return t.text!;
    default:
      if (options.failOnUnknown) {
        removeParentPointers(t);
        console.error("Not handling", JSON.stringify(t, null, 2));
        throw new Error(`Unknown markdown node type ${t.type}`);
      } else {
        // Falling back to rendering verbatim
        removeParentPointers(t);
        console.warn("Not handling", JSON.stringify(t, null, 2));
        return renderToText(t);
      }
  }

  function mapRender(children: ParseTree[]) {
    return children.map((t) => posPreservingRender(t, options));
  }
}

function traverseTag(
  t: Tag,
  fn: (t: Tag) => void,
) {
  fn(t);
  if (typeof t === "string") {
    return;
  }
  if (t.body) {
    for (const child of t.body) {
      traverseTag(child, fn);
    }
  }
}

export function renderMarkdownToHtml(
  t: ParseTree,
  options: MarkdownRenderOptions = {},
) {
  preprocess(t, options);
  const htmlTree = posPreservingRender(t, options);
  if (htmlTree && options.translateUrls) {
    traverseTag(htmlTree, (t) => {
      if (typeof t === "string") {
        return;
      }
      if (t.name === "img") {
        t.attrs!.src = options.translateUrls!(t.attrs!.src!);
      }

      if (t.name === "a" && t.attrs!.href) {
        t.attrs!.href = options.translateUrls!(t.attrs!.href);
      }
    });
  }
  return renderHtml(htmlTree);
}
