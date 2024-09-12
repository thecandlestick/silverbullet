// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { Type } from "../type.ts";
const _toString = Object.prototype.toString;
function resolveYamlPairs(data) {
    const result = Array.from({
        length: data.length
    });
    for(let index = 0; index < data.length; index++){
        const pair = data[index];
        if (_toString.call(pair) !== "[object Object]") return false;
        const keys = Object.keys(pair);
        if (keys.length !== 1) return false;
        result[index] = [
            keys[0],
            pair[keys[0]]
        ];
    }
    return true;
}
function constructYamlPairs(data) {
    if (data === null) return [];
    const result = Array.from({
        length: data.length
    });
    for(let index = 0; index < data.length; index += 1){
        const pair = data[index];
        const keys = Object.keys(pair);
        result[index] = [
            keys[0],
            pair[keys[0]]
        ];
    }
    return result;
}
export const pairs = new Type("tag:yaml.org,2002:pairs", {
    construct: constructYamlPairs,
    kind: "sequence",
    resolve: resolveYamlPairs
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvX3R5cGUvcGFpcnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gUG9ydGVkIGZyb20ganMteWFtbCB2My4xMy4xOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVjYS9qcy15YW1sL2NvbW1pdC82NjVhYWRkYTQyMzQ5ZGNhZTg2OWYxMjA0MGQ5YjEwZWYxOGQxMmRhXG4vLyBDb3B5cmlnaHQgMjAxMS0yMDE1IGJ5IFZpdGFseSBQdXpyaW4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gQ29weXJpZ2h0IDIwMTgtMjAyMyB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cblxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi90eXBlLnRzXCI7XG5pbXBvcnQgdHlwZSB7IEFueSB9IGZyb20gXCIuLi9fdXRpbHMudHNcIjtcblxuY29uc3QgX3RvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuZnVuY3Rpb24gcmVzb2x2ZVlhbWxQYWlycyhkYXRhOiBBbnlbXVtdKTogYm9vbGVhbiB7XG4gIGNvbnN0IHJlc3VsdCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IGRhdGEubGVuZ3RoIH0pO1xuXG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgIGNvbnN0IHBhaXIgPSBkYXRhW2luZGV4XTtcblxuICAgIGlmIChfdG9TdHJpbmcuY2FsbChwYWlyKSAhPT0gXCJbb2JqZWN0IE9iamVjdF1cIikgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHBhaXIpO1xuXG4gICAgaWYgKGtleXMubGVuZ3RoICE9PSAxKSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXN1bHRbaW5kZXhdID0gW2tleXNbMF0sIHBhaXJba2V5c1swXSBhcyBBbnldXTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RZYW1sUGFpcnMoZGF0YTogc3RyaW5nKTogQW55W10ge1xuICBpZiAoZGF0YSA9PT0gbnVsbCkgcmV0dXJuIFtdO1xuXG4gIGNvbnN0IHJlc3VsdCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IGRhdGEubGVuZ3RoIH0pO1xuXG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhLmxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIGNvbnN0IHBhaXIgPSBkYXRhW2luZGV4XTtcblxuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhwYWlyKTtcblxuICAgIHJlc3VsdFtpbmRleF0gPSBba2V5c1swXSwgcGFpcltrZXlzWzBdIGFzIEFueV1dO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGNvbnN0IHBhaXJzID0gbmV3IFR5cGUoXCJ0YWc6eWFtbC5vcmcsMjAwMjpwYWlyc1wiLCB7XG4gIGNvbnN0cnVjdDogY29uc3RydWN0WWFtbFBhaXJzLFxuICBraW5kOiBcInNlcXVlbmNlXCIsXG4gIHJlc29sdmU6IHJlc29sdmVZYW1sUGFpcnMsXG59KTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFDL0Isb0ZBQW9GO0FBQ3BGLDBFQUEwRTtBQUMxRSwwRUFBMEU7QUFFMUUsU0FBUyxJQUFJLFFBQVEsYUFBYTtBQUdsQyxNQUFNLFlBQVksT0FBTyxTQUFTLENBQUMsUUFBUTtBQUUzQyxTQUFTLGlCQUFpQixJQUFhLEVBQVc7SUFDaEQsTUFBTSxTQUFTLE1BQU0sSUFBSSxDQUFDO1FBQUUsUUFBUSxLQUFLLE1BQU07SUFBQztJQUVoRCxJQUFLLElBQUksUUFBUSxHQUFHLFFBQVEsS0FBSyxNQUFNLEVBQUUsUUFBUztRQUNoRCxNQUFNLE9BQU8sSUFBSSxDQUFDLE1BQU07UUFFeEIsSUFBSSxVQUFVLElBQUksQ0FBQyxVQUFVLG1CQUFtQixPQUFPLEtBQUs7UUFFNUQsTUFBTSxPQUFPLE9BQU8sSUFBSSxDQUFDO1FBRXpCLElBQUksS0FBSyxNQUFNLEtBQUssR0FBRyxPQUFPLEtBQUs7UUFFbkMsTUFBTSxDQUFDLE1BQU0sR0FBRztZQUFDLElBQUksQ0FBQyxFQUFFO1lBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQVE7U0FBQztJQUNqRDtJQUVBLE9BQU8sSUFBSTtBQUNiO0FBRUEsU0FBUyxtQkFBbUIsSUFBWSxFQUFTO0lBQy9DLElBQUksU0FBUyxJQUFJLEVBQUUsT0FBTyxFQUFFO0lBRTVCLE1BQU0sU0FBUyxNQUFNLElBQUksQ0FBQztRQUFFLFFBQVEsS0FBSyxNQUFNO0lBQUM7SUFFaEQsSUFBSyxJQUFJLFFBQVEsR0FBRyxRQUFRLEtBQUssTUFBTSxFQUFFLFNBQVMsRUFBRztRQUNuRCxNQUFNLE9BQU8sSUFBSSxDQUFDLE1BQU07UUFFeEIsTUFBTSxPQUFPLE9BQU8sSUFBSSxDQUFDO1FBRXpCLE1BQU0sQ0FBQyxNQUFNLEdBQUc7WUFBQyxJQUFJLENBQUMsRUFBRTtZQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFRO1NBQUM7SUFDakQ7SUFFQSxPQUFPO0FBQ1Q7QUFFQSxPQUFPLE1BQU0sUUFBUSxJQUFJLEtBQUssMkJBQTJCO0lBQ3ZELFdBQVc7SUFDWCxNQUFNO0lBQ04sU0FBUztBQUNYLEdBQUcifQ==