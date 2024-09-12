// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
import { YAMLError } from "./_error.ts";
function compileList(schema, name, result) {
    const exclude = [];
    for (const includedSchema of schema.include){
        result = compileList(includedSchema, name, result);
    }
    for (const currentType of schema[name]){
        for(let previousIndex = 0; previousIndex < result.length; previousIndex++){
            const previousType = result[previousIndex];
            if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
                exclude.push(previousIndex);
            }
        }
        result.push(currentType);
    }
    return result.filter((_type, index)=>!exclude.includes(index));
}
function compileMap(...typesList) {
    const result = {
        fallback: {},
        mapping: {},
        scalar: {},
        sequence: {}
    };
    for (const types of typesList){
        for (const type of types){
            if (type.kind !== null) {
                result[type.kind][type.tag] = result["fallback"][type.tag] = type;
            }
        }
    }
    return result;
}
export class Schema {
    static SCHEMA_DEFAULT;
    implicit;
    explicit;
    include;
    compiledImplicit;
    compiledExplicit;
    compiledTypeMap;
    constructor(definition){
        this.explicit = definition.explicit || [];
        this.implicit = definition.implicit || [];
        this.include = definition.include || [];
        for (const type of this.implicit){
            if (type.loadKind && type.loadKind !== "scalar") {
                throw new YAMLError("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
            }
        }
        this.compiledImplicit = compileList(this, "implicit", []);
        this.compiledExplicit = compileList(this, "explicit", []);
        this.compiledTypeMap = compileMap(this.compiledImplicit, this.compiledExplicit);
    }
    /* Returns a new extended schema from current schema */ extend(definition) {
        return new Schema({
            implicit: [
                ...new Set([
                    ...this.implicit,
                    ...definition?.implicit ?? []
                ])
            ],
            explicit: [
                ...new Set([
                    ...this.explicit,
                    ...definition?.explicit ?? []
                ])
            ],
            include: [
                ...new Set([
                    ...this.include,
                    ...definition?.include ?? []
                ])
            ]
        });
    }
    static create() {}
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvc2NoZW1hLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFBvcnRlZCBmcm9tIGpzLXlhbWwgdjMuMTMuMTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlY2EvanMteWFtbC9jb21taXQvNjY1YWFkZGE0MjM0OWRjYWU4NjlmMTIwNDBkOWIxMGVmMThkMTJkYVxuLy8gQ29weXJpZ2h0IDIwMTEtMjAxNSBieSBWaXRhbHkgUHV6cmluLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cbi8vIENvcHlyaWdodCAyMDE4LTIwMjMgdGhlIERlbm8gYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG4vLyBUaGlzIG1vZHVsZSBpcyBicm93c2VyIGNvbXBhdGlibGUuXG5cbmltcG9ydCB7IFlBTUxFcnJvciB9IGZyb20gXCIuL19lcnJvci50c1wiO1xuaW1wb3J0IHR5cGUgeyBLaW5kVHlwZSwgVHlwZSB9IGZyb20gXCIuL3R5cGUudHNcIjtcbmltcG9ydCB0eXBlIHsgQW55LCBBcnJheU9iamVjdCB9IGZyb20gXCIuL191dGlscy50c1wiO1xuXG5mdW5jdGlvbiBjb21waWxlTGlzdChcbiAgc2NoZW1hOiBTY2hlbWEsXG4gIG5hbWU6IFwiaW1wbGljaXRcIiB8IFwiZXhwbGljaXRcIixcbiAgcmVzdWx0OiBUeXBlW10sXG4pOiBUeXBlW10ge1xuICBjb25zdCBleGNsdWRlOiBudW1iZXJbXSA9IFtdO1xuXG4gIGZvciAoY29uc3QgaW5jbHVkZWRTY2hlbWEgb2Ygc2NoZW1hLmluY2x1ZGUpIHtcbiAgICByZXN1bHQgPSBjb21waWxlTGlzdChpbmNsdWRlZFNjaGVtYSwgbmFtZSwgcmVzdWx0KTtcbiAgfVxuXG4gIGZvciAoY29uc3QgY3VycmVudFR5cGUgb2Ygc2NoZW1hW25hbWVdKSB7XG4gICAgZm9yIChcbiAgICAgIGxldCBwcmV2aW91c0luZGV4ID0gMDtcbiAgICAgIHByZXZpb3VzSW5kZXggPCByZXN1bHQubGVuZ3RoO1xuICAgICAgcHJldmlvdXNJbmRleCsrXG4gICAgKSB7XG4gICAgICBjb25zdCBwcmV2aW91c1R5cGUgPSByZXN1bHRbcHJldmlvdXNJbmRleF07XG4gICAgICBpZiAoXG4gICAgICAgIHByZXZpb3VzVHlwZS50YWcgPT09IGN1cnJlbnRUeXBlLnRhZyAmJlxuICAgICAgICBwcmV2aW91c1R5cGUua2luZCA9PT0gY3VycmVudFR5cGUua2luZFxuICAgICAgKSB7XG4gICAgICAgIGV4Y2x1ZGUucHVzaChwcmV2aW91c0luZGV4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQucHVzaChjdXJyZW50VHlwZSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0LmZpbHRlcigoX3R5cGUsIGluZGV4KTogdW5rbm93biA9PiAhZXhjbHVkZS5pbmNsdWRlcyhpbmRleCkpO1xufVxuXG5leHBvcnQgdHlwZSBUeXBlTWFwID0geyBbayBpbiBLaW5kVHlwZSB8IFwiZmFsbGJhY2tcIl06IEFycmF5T2JqZWN0PFR5cGU+IH07XG5mdW5jdGlvbiBjb21waWxlTWFwKC4uLnR5cGVzTGlzdDogVHlwZVtdW10pOiBUeXBlTWFwIHtcbiAgY29uc3QgcmVzdWx0OiBUeXBlTWFwID0ge1xuICAgIGZhbGxiYWNrOiB7fSxcbiAgICBtYXBwaW5nOiB7fSxcbiAgICBzY2FsYXI6IHt9LFxuICAgIHNlcXVlbmNlOiB7fSxcbiAgfTtcblxuICBmb3IgKGNvbnN0IHR5cGVzIG9mIHR5cGVzTGlzdCkge1xuICAgIGZvciAoY29uc3QgdHlwZSBvZiB0eXBlcykge1xuICAgICAgaWYgKHR5cGUua2luZCAhPT0gbnVsbCkge1xuICAgICAgICByZXN1bHRbdHlwZS5raW5kXVt0eXBlLnRhZ10gPSByZXN1bHRbXCJmYWxsYmFja1wiXVt0eXBlLnRhZ10gPSB0eXBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgY2xhc3MgU2NoZW1hIGltcGxlbWVudHMgU2NoZW1hRGVmaW5pdGlvbiB7XG4gIHB1YmxpYyBzdGF0aWMgU0NIRU1BX0RFRkFVTFQ/OiBTY2hlbWE7XG5cbiAgcHVibGljIGltcGxpY2l0OiBUeXBlW107XG4gIHB1YmxpYyBleHBsaWNpdDogVHlwZVtdO1xuICBwdWJsaWMgaW5jbHVkZTogU2NoZW1hW107XG5cbiAgcHVibGljIGNvbXBpbGVkSW1wbGljaXQ6IFR5cGVbXTtcbiAgcHVibGljIGNvbXBpbGVkRXhwbGljaXQ6IFR5cGVbXTtcbiAgcHVibGljIGNvbXBpbGVkVHlwZU1hcDogVHlwZU1hcDtcblxuICBjb25zdHJ1Y3RvcihkZWZpbml0aW9uOiBTY2hlbWFEZWZpbml0aW9uKSB7XG4gICAgdGhpcy5leHBsaWNpdCA9IGRlZmluaXRpb24uZXhwbGljaXQgfHwgW107XG4gICAgdGhpcy5pbXBsaWNpdCA9IGRlZmluaXRpb24uaW1wbGljaXQgfHwgW107XG4gICAgdGhpcy5pbmNsdWRlID0gZGVmaW5pdGlvbi5pbmNsdWRlIHx8IFtdO1xuXG4gICAgZm9yIChjb25zdCB0eXBlIG9mIHRoaXMuaW1wbGljaXQpIHtcbiAgICAgIGlmICh0eXBlLmxvYWRLaW5kICYmIHR5cGUubG9hZEtpbmQgIT09IFwic2NhbGFyXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IFlBTUxFcnJvcihcbiAgICAgICAgICBcIlRoZXJlIGlzIGEgbm9uLXNjYWxhciB0eXBlIGluIHRoZSBpbXBsaWNpdCBsaXN0IG9mIGEgc2NoZW1hLiBJbXBsaWNpdCByZXNvbHZpbmcgb2Ygc3VjaCB0eXBlcyBpcyBub3Qgc3VwcG9ydGVkLlwiLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY29tcGlsZWRJbXBsaWNpdCA9IGNvbXBpbGVMaXN0KHRoaXMsIFwiaW1wbGljaXRcIiwgW10pO1xuICAgIHRoaXMuY29tcGlsZWRFeHBsaWNpdCA9IGNvbXBpbGVMaXN0KHRoaXMsIFwiZXhwbGljaXRcIiwgW10pO1xuICAgIHRoaXMuY29tcGlsZWRUeXBlTWFwID0gY29tcGlsZU1hcChcbiAgICAgIHRoaXMuY29tcGlsZWRJbXBsaWNpdCxcbiAgICAgIHRoaXMuY29tcGlsZWRFeHBsaWNpdCxcbiAgICApO1xuICB9XG5cbiAgLyogUmV0dXJucyBhIG5ldyBleHRlbmRlZCBzY2hlbWEgZnJvbSBjdXJyZW50IHNjaGVtYSAqL1xuICBwdWJsaWMgZXh0ZW5kKGRlZmluaXRpb246IFNjaGVtYURlZmluaXRpb24pIHtcbiAgICByZXR1cm4gbmV3IFNjaGVtYSh7XG4gICAgICBpbXBsaWNpdDogW1xuICAgICAgICAuLi5uZXcgU2V0KFsuLi50aGlzLmltcGxpY2l0LCAuLi4oZGVmaW5pdGlvbj8uaW1wbGljaXQgPz8gW10pXSksXG4gICAgICBdLFxuICAgICAgZXhwbGljaXQ6IFtcbiAgICAgICAgLi4ubmV3IFNldChbLi4udGhpcy5leHBsaWNpdCwgLi4uKGRlZmluaXRpb24/LmV4cGxpY2l0ID8/IFtdKV0pLFxuICAgICAgXSxcbiAgICAgIGluY2x1ZGU6IFsuLi5uZXcgU2V0KFsuLi50aGlzLmluY2x1ZGUsIC4uLihkZWZpbml0aW9uPy5pbmNsdWRlID8/IFtdKV0pXSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgY3JlYXRlKCkge31cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTY2hlbWFEZWZpbml0aW9uIHtcbiAgaW1wbGljaXQ/OiBBbnlbXTtcbiAgZXhwbGljaXQ/OiBUeXBlW107XG4gIGluY2x1ZGU/OiBTY2hlbWFbXTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFDL0Isb0ZBQW9GO0FBQ3BGLDBFQUEwRTtBQUMxRSwwRUFBMEU7QUFDMUUscUNBQXFDO0FBRXJDLFNBQVMsU0FBUyxRQUFRLGNBQWM7QUFJeEMsU0FBUyxZQUNQLE1BQWMsRUFDZCxJQUE2QixFQUM3QixNQUFjLEVBQ047SUFDUixNQUFNLFVBQW9CLEVBQUU7SUFFNUIsS0FBSyxNQUFNLGtCQUFrQixPQUFPLE9B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