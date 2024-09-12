// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { repeat } from "./_utils.ts";
export class Mark {
    name;
    buffer;
    position;
    line;
    column;
    constructor(name, buffer, position, line, column){
        this.name = name;
        this.buffer = buffer;
        this.position = position;
        this.line = line;
        this.column = column;
    }
    getSnippet(indent = 4, maxLength = 75) {
        if (!this.buffer) return null;
        let head = "";
        let start = this.position;
        while(start > 0 && "\x00\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(start - 1)) === -1){
            start -= 1;
            if (this.position - start > maxLength / 2 - 1) {
                head = " ... ";
                start += 5;
                break;
            }
        }
        let tail = "";
        let end = this.position;
        while(end < this.buffer.length && "\x00\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(end)) === -1){
            end += 1;
            if (end - this.position > maxLength / 2 - 1) {
                tail = " ... ";
                end -= 5;
                break;
            }
        }
        const snippet = this.buffer.slice(start, end);
        return `${repeat(" ", indent)}${head}${snippet}${tail}\n${repeat(" ", indent + this.position - start + head.length)}^`;
    }
    toString(compact) {
        let snippet, where = "";
        if (this.name) {
            where += `in "${this.name}" `;
        }
        where += `at line ${this.line + 1}, column ${this.column + 1}`;
        if (!compact) {
            snippet = this.getSnippet();
            if (snippet) {
                where += `:\n${snippet}`;
            }
        }
        return where;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvX21hcmsudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gUG9ydGVkIGZyb20ganMteWFtbCB2My4xMy4xOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVjYS9qcy15YW1sL2NvbW1pdC82NjVhYWRkYTQyMzQ5ZGNhZTg2OWYxMjA0MGQ5YjEwZWYxOGQxMmRhXG4vLyBDb3B5cmlnaHQgMjAxMS0yMDE1IGJ5IFZpdGFseSBQdXpyaW4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gQ29weXJpZ2h0IDIwMTgtMjAyMyB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cblxuaW1wb3J0IHsgcmVwZWF0IH0gZnJvbSBcIi4vX3V0aWxzLnRzXCI7XG5cbmV4cG9ydCBjbGFzcyBNYXJrIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIG5hbWU6IHN0cmluZyxcbiAgICBwdWJsaWMgYnVmZmVyOiBzdHJpbmcsXG4gICAgcHVibGljIHBvc2l0aW9uOiBudW1iZXIsXG4gICAgcHVibGljIGxpbmU6IG51bWJlcixcbiAgICBwdWJsaWMgY29sdW1uOiBudW1iZXIsXG4gICkge31cblxuICBwdWJsaWMgZ2V0U25pcHBldChpbmRlbnQgPSA0LCBtYXhMZW5ndGggPSA3NSk6IHN0cmluZyB8IG51bGwge1xuICAgIGlmICghdGhpcy5idWZmZXIpIHJldHVybiBudWxsO1xuXG4gICAgbGV0IGhlYWQgPSBcIlwiO1xuICAgIGxldCBzdGFydCA9IHRoaXMucG9zaXRpb247XG5cbiAgICB3aGlsZSAoXG4gICAgICBzdGFydCA+IDAgJiZcbiAgICAgIFwiXFx4MDBcXHJcXG5cXHg4NVxcdTIwMjhcXHUyMDI5XCIuaW5kZXhPZih0aGlzLmJ1ZmZlci5jaGFyQXQoc3RhcnQgLSAxKSkgPT09IC0xXG4gICAgKSB7XG4gICAgICBzdGFydCAtPSAxO1xuICAgICAgaWYgKHRoaXMucG9zaXRpb24gLSBzdGFydCA+IG1heExlbmd0aCAvIDIgLSAxKSB7XG4gICAgICAgIGhlYWQgPSBcIiAuLi4gXCI7XG4gICAgICAgIHN0YXJ0ICs9IDU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCB0YWlsID0gXCJcIjtcbiAgICBsZXQgZW5kID0gdGhpcy5wb3NpdGlvbjtcblxuICAgIHdoaWxlIChcbiAgICAgIGVuZCA8IHRoaXMuYnVmZmVyLmxlbmd0aCAmJlxuICAgICAgXCJcXHgwMFxcclxcblxceDg1XFx1MjAyOFxcdTIwMjlcIi5pbmRleE9mKHRoaXMuYnVmZmVyLmNoYXJBdChlbmQpKSA9PT0gLTFcbiAgICApIHtcbiAgICAgIGVuZCArPSAxO1xuICAgICAgaWYgKGVuZCAtIHRoaXMucG9zaXRpb24gPiBtYXhMZW5ndGggLyAyIC0gMSkge1xuICAgICAgICB0YWlsID0gXCIgLi4uIFwiO1xuICAgICAgICBlbmQgLT0gNTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc25pcHBldCA9IHRoaXMuYnVmZmVyLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIHJldHVybiBgJHtyZXBlYXQoXCIgXCIsIGluZGVudCl9JHtoZWFkfSR7c25pcHBldH0ke3RhaWx9XFxuJHtcbiAgICAgIHJlcGVhdChcbiAgICAgICAgXCIgXCIsXG4gICAgICAgIGluZGVudCArIHRoaXMucG9zaXRpb24gLSBzdGFydCArIGhlYWQubGVuZ3RoLFxuICAgICAgKVxuICAgIH1eYDtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZyhjb21wYWN0PzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgbGV0IHNuaXBwZXQsXG4gICAgICB3aGVyZSA9IFwiXCI7XG5cbiAgICBpZiAodGhpcy5uYW1lKSB7XG4gICAgICB3aGVyZSArPSBgaW4gXCIke3RoaXMubmFtZX1cIiBgO1xuICAgIH1cblxuICAgIHdoZXJlICs9IGBhdCBsaW5lICR7dGhpcy5saW5lICsgMX0sIGNvbHVtbiAke3RoaXMuY29sdW1uICsgMX1gO1xuXG4gICAgaWYgKCFjb21wYWN0KSB7XG4gICAgICBzbmlwcGV0ID0gdGhpcy5nZXRTbmlwcGV0KCk7XG5cbiAgICAgIGlmIChzbmlwcGV0KSB7XG4gICAgICAgIHdoZXJlICs9IGA6XFxuJHtzbmlwcGV0fWA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHdoZXJlO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLG9GQUFvRjtBQUNwRiwwRUFBMEU7QUFDMUUsMEVBQTBFO0FBRTFFLFNBQVMsTUFBTSxRQUFRLGNBQWM7QUFFckMsT0FBTyxNQUFNO0lBRUY7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUxULFlBQ1MsTUFDQSxRQUNBLFVBQ0EsTUFDQSxPQUNQO29CQUxPO3NCQUNBO3dCQUNBO29CQUNBO3NCQUNBO0lBQ047SUFFSSxXQUFXLFNBQVMsQ0FBQyxFQUFFLFlBQVksRUFBRSxFQUFpQjtRQUMzRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLElBQUk7UUFFN0IsSUFBSSxPQUFPO1FBQ1gsSUFBSSxRQUFRLElBQUksQ0FBQyxRQUFRO1FBRXpCLE1BQ0UsUUFBUSxLQUNSLDJCQUEyQixPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxRQUFRLENBQUMsRUFDdkU7WUFDQSxTQUFTO1lBQ1QsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsWUFBWSxJQUFJLEdBQUc7Z0JBQzdDLE9BQU87Z0JBQ1AsU0FBUztnQkFDVCxLQUFNO1lBQ1IsQ0FBQztRQUNIO1FBRUEsSUFBSSxPQUFPO1FBQ1gsSUFBSSxNQUFNLElBQUksQ0FBQyxRQUFRO1FBRXZCLE1BQ0UsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFDeEIsMkJBQTJCLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFDakU7WUFDQSxPQUFPO1lBQ1AsSUFBSSxNQUFNLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxJQUFJLEdBQUc7Z0JBQzNDLE9BQU87Z0JBQ1AsT0FBTztnQkFDUCxLQUFNO1lBQ1IsQ0FBQztRQUNIO1FBRUEsTUFBTSxVQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU87UUFDekMsT0FBTyxDQUFDLEVBQUUsT0FBTyxLQUFLLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxFQUN0RCxPQUNFLEtBQ0EsU0FBUyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsS0FBSyxNQUFNLEVBRS9DLENBQUMsQ0FBQztJQUNMO0lBRU8sU0FBUyxPQUFpQixFQUFVO1FBQ3pDLElBQUksU0FDRixRQUFRO1FBRVYsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUMvQixDQUFDO1FBRUQsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRTlELElBQUksQ0FBQyxTQUFTO1lBQ1osVUFBVSxJQUFJLENBQUMsVUFBVTtZQUV6QixJQUFJLFNBQVM7Z0JBQ1gsU0FBUyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUM7WUFDMUIsQ0FBQztRQUNILENBQUM7UUFFRCxPQUFPO0lBQ1Q7QUFDRixDQUFDIn0=