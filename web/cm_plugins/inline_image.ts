import {
  Decoration,
  EditorState,
  Range,
  syntaxTree,
  WidgetType,
} from "../deps.ts";
import { decoratorStateField } from "./util.ts";

import type { Client } from "../client.ts";
import { resolvePath } from "$sb/lib/resolve.ts";

class InlineImageWidget extends WidgetType {
  constructor(
    readonly url: string,
    readonly title: string,
    readonly client: Client,
  ) {
    super();
    // console.log("Creating widget", url);
  }

  eq(other: InlineImageWidget) {
    return other.url === this.url && other.title === this.title;
  }

  get estimatedHeight(): number {
    const cachedHeight = this.client.space.getCachedImageHeight(this.url);
    // console.log("Estimated height requested", this.url, cachedHeight);
    return cachedHeight;
  }

  toDOM() {
    const img = document.createElement("img");
    let url = this.url;
    url = resolvePath(this.client.currentPage!, url, true);
    console.log("Resolving image to", url);
    // console.log("Creating DOM", this.url);
    const cachedImageHeight = this.client.space.getCachedImageHeight(url);
    img.onload = () => {
      // console.log("Loaded", this.url, "with height", img.height);
      if (img.height !== cachedImageHeight) {
        this.client.space.setCachedImageHeight(url, img.height);
      }
    };
    img.src = url;
    img.alt = this.title;
    img.title = this.title;
    img.style.display = "block";
    img.className = "sb-inline-img";
    if (cachedImageHeight > 0) {
      img.height = cachedImageHeight;
    }

    return img;
  }
}

export function inlineImagesPlugin(client: Client) {
  return decoratorStateField((state: EditorState) => {
    const widgets: Range<Decoration>[] = [];
    const imageRegex = /!\[(?<title>[^\]]*)\]\((?<url>.+)\)/;

    syntaxTree(state).iterate({
      enter: (node) => {
        if (node.name !== "Image") {
          return;
        }

        const imageRexexResult = imageRegex.exec(
          state.sliceDoc(node.from, node.to),
        );
        if (imageRexexResult === null || !imageRexexResult.groups) {
          return;
        }

        let url = imageRexexResult.groups.url;
        const title = imageRexexResult.groups.title;
        if (url.indexOf("://") === -1) {
          url = decodeURI(url);
        }
        widgets.push(
          Decoration.widget({
            widget: new InlineImageWidget(url, title, client),
            block: true,
          }).range(node.to),
        );
      },
    });

    return Decoration.set(widgets, true);
  });
}
