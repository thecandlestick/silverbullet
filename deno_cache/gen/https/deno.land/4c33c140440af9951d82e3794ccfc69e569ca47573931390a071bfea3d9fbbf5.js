// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { YAMLError } from "../_error.ts";
import { Mark } from "../_mark.ts";
import * as common from "../_utils.ts";
import { LoaderState } from "./loader_state.ts";
const { hasOwn  } = Object;
const CONTEXT_FLOW_IN = 1;
const CONTEXT_FLOW_OUT = 2;
const CONTEXT_BLOCK_IN = 3;
const CONTEXT_BLOCK_OUT = 4;
const CHOMPING_CLIP = 1;
const CHOMPING_STRIP = 2;
const CHOMPING_KEEP = 3;
const PATTERN_NON_PRINTABLE = // deno-lint-ignore no-control-regex
/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
const PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
const PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
const PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
const PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
    return Object.prototype.toString.call(obj);
}
function isEOL(c) {
    return c === 0x0a || /* LF */ c === 0x0d /* CR */ ;
}
function isWhiteSpace(c) {
    return c === 0x09 || /* Tab */ c === 0x20 /* Space */ ;
}
function isWsOrEol(c) {
    return c === 0x09 /* Tab */  || c === 0x20 /* Space */  || c === 0x0a /* LF */  || c === 0x0d /* CR */ ;
}
function isFlowIndicator(c) {
    return c === 0x2c /* , */  || c === 0x5b /* [ */  || c === 0x5d /* ] */  || c === 0x7b /* { */  || c === 0x7d /* } */ ;
}
function fromHexCode(c) {
    if (0x30 <= /* 0 */ c && c <= 0x39 /* 9 */ ) {
        return c - 0x30;
    }
    const lc = c | 0x20;
    if (0x61 <= /* a */ lc && lc <= 0x66 /* f */ ) {
        return lc - 0x61 + 10;
    }
    return -1;
}
function escapedHexLen(c) {
    if (c === 0x78 /* x */ ) {
        return 2;
    }
    if (c === 0x75 /* u */ ) {
        return 4;
    }
    if (c === 0x55 /* U */ ) {
        return 8;
    }
    return 0;
}
function fromDecimalCode(c) {
    if (0x30 <= /* 0 */ c && c <= 0x39 /* 9 */ ) {
        return c - 0x30;
    }
    return -1;
}
function simpleEscapeSequence(c) {
    return c === 0x30 /* 0 */  ? "\x00" : c === 0x61 /* a */  ? "\x07" : c === 0x62 /* b */  ? "\x08" : c === 0x74 /* t */  ? "\x09" : c === 0x09 /* Tab */  ? "\x09" : c === 0x6e /* n */  ? "\x0A" : c === 0x76 /* v */  ? "\x0B" : c === 0x66 /* f */  ? "\x0C" : c === 0x72 /* r */  ? "\x0D" : c === 0x65 /* e */  ? "\x1B" : c === 0x20 /* Space */  ? " " : c === 0x22 /* " */  ? "\x22" : c === 0x2f /* / */  ? "/" : c === 0x5c /* \ */  ? "\x5C" : c === 0x4e /* N */  ? "\x85" : c === 0x5f /* _ */  ? "\xA0" : c === 0x4c /* L */  ? "\u2028" : c === 0x50 /* P */  ? "\u2029" : "";
}
function charFromCodepoint(c) {
    if (c <= 0xffff) {
        return String.fromCharCode(c);
    }
    // Encode UTF-16 surrogate pair
    // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
    return String.fromCharCode((c - 0x010000 >> 10) + 0xd800, (c - 0x010000 & 0x03ff) + 0xdc00);
}
const simpleEscapeCheck = Array.from({
    length: 256
}); // integer, for fast access
const simpleEscapeMap = Array.from({
    length: 256
});
for(let i = 0; i < 256; i++){
    simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
    simpleEscapeMap[i] = simpleEscapeSequence(i);
}
function generateError(state, message) {
    return new YAMLError(message, new Mark(state.filename, state.input, state.position, state.line, state.position - state.lineStart));
}
function throwError(state, message) {
    throw generateError(state, message);
}
function throwWarning(state, message) {
    if (state.onWarning) {
        state.onWarning.call(null, generateError(state, message));
    }
}
const directiveHandlers = {
    YAML (state, _name, ...args) {
        if (state.version !== null) {
            return throwError(state, "duplication of %YAML directive");
        }
        if (args.length !== 1) {
            return throwError(state, "YAML directive accepts exactly one argument");
        }
        const match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
        if (match === null) {
            return throwError(state, "ill-formed argument of the YAML directive");
        }
        const major = parseInt(match[1], 10);
        const minor = parseInt(match[2], 10);
        if (major !== 1) {
            return throwError(state, "unacceptable YAML version of the document");
        }
        state.version = args[0];
        state.checkLineBreaks = minor < 2;
        if (minor !== 1 && minor !== 2) {
            return throwWarning(state, "unsupported YAML version of the document");
        }
    },
    TAG (state, _name, ...args) {
        if (args.length !== 2) {
            return throwError(state, "TAG directive accepts exactly two arguments");
        }
        const handle = args[0];
        const prefix = args[1];
        if (!PATTERN_TAG_HANDLE.test(handle)) {
            return throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
        }
        if (state.tagMap && hasOwn(state.tagMap, handle)) {
            return throwError(state, `there is a previously declared suffix for "${handle}" tag handle`);
        }
        if (!PATTERN_TAG_URI.test(prefix)) {
            return throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
        }
        if (typeof state.tagMap === "undefined") {
            state.tagMap = Object.create(null);
        }
        state.tagMap[handle] = prefix;
    }
};
function captureSegment(state, start, end, checkJson) {
    let result;
    if (start < end) {
        result = state.input.slice(start, end);
        if (checkJson) {
            for(let position = 0, length = result.length; position < length; position++){
                const character = result.charCodeAt(position);
                if (!(character === 0x09 || 0x20 <= character && character <= 0x10ffff)) {
                    return throwError(state, "expected valid JSON character");
                }
            }
        } else if (PATTERN_NON_PRINTABLE.test(result)) {
            return throwError(state, "the stream contains non-printable characters");
        }
        state.result += result;
    }
}
function mergeMappings(state, destination, source, overridableKeys) {
    if (!common.isObject(source)) {
        return throwError(state, "cannot merge mappings; the provided source object is unacceptable");
    }
    const keys = Object.keys(source);
    for(let i = 0, len = keys.length; i < len; i++){
        const key = keys[i];
        if (!hasOwn(destination, key)) {
            Object.defineProperty(destination, key, {
                value: source[key],
                writable: true,
                enumerable: true,
                configurable: true
            });
            overridableKeys[key] = true;
        }
    }
}
function storeMappingPair(state, result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
    // The output is a plain object here, so keys can only be strings.
    // We need to convert keyNode to a string, but doing so can hang the process
    // (deeply nested arrays that explode exponentially using aliases).
    if (Array.isArray(keyNode)) {
        keyNode = Array.prototype.slice.call(keyNode);
        for(let index = 0, quantity = keyNode.length; index < quantity; index++){
            if (Array.isArray(keyNode[index])) {
                return throwError(state, "nested arrays are not supported inside keys");
            }
            if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
                keyNode[index] = "[object Object]";
            }
        }
    }
    // Avoid code execution in load() via toString property
    // (still use its own toString for arrays, timestamps,
    // and whatever user schema extensions happen to have @@toStringTag)
    if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
        keyNode = "[object Object]";
    }
    keyNode = String(keyNode);
    if (result === null) {
        result = {};
    }
    if (keyTag === "tag:yaml.org,2002:merge") {
        if (Array.isArray(valueNode)) {
            for(let index = 0, quantity = valueNode.length; index < quantity; index++){
                mergeMappings(state, result, valueNode[index], overridableKeys);
            }
        } else {
            mergeMappings(state, result, valueNode, overridableKeys);
        }
    } else {
        if (!state.json && !hasOwn(overridableKeys, keyNode) && hasOwn(result, keyNode)) {
            state.line = startLine || state.line;
            state.position = startPos || state.position;
            return throwError(state, "duplicated mapping key");
        }
        Object.defineProperty(result, keyNode, {
            value: valueNode,
            writable: true,
            enumerable: true,
            configurable: true
        });
        delete overridableKeys[keyNode];
    }
    return result;
}
function readLineBreak(state) {
    const ch = state.input.charCodeAt(state.position);
    if (ch === 0x0a /* LF */ ) {
        state.position++;
    } else if (ch === 0x0d /* CR */ ) {
        state.position++;
        if (state.input.charCodeAt(state.position) === 0x0a /* LF */ ) {
            state.position++;
        }
    } else {
        return throwError(state, "a line break is expected");
    }
    state.line += 1;
    state.lineStart = state.position;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
    let lineBreaks = 0, ch = state.input.charCodeAt(state.position);
    while(ch !== 0){
        while(isWhiteSpace(ch)){
            ch = state.input.charCodeAt(++state.position);
        }
        if (allowComments && ch === 0x23 /* # */ ) {
            do {
                ch = state.input.charCodeAt(++state.position);
            }while (ch !== 0x0a && /* LF */ ch !== 0x0d && /* CR */ ch !== 0)
        }
        if (isEOL(ch)) {
            readLineBreak(state);
            ch = state.input.charCodeAt(state.position);
            lineBreaks++;
            state.lineIndent = 0;
            while(ch === 0x20 /* Space */ ){
                state.lineIndent++;
                ch = state.input.charCodeAt(++state.position);
            }
        } else {
            break;
        }
    }
    if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
        throwWarning(state, "deficient indentation");
    }
    return lineBreaks;
}
function testDocumentSeparator(state) {
    let _position = state.position;
    let ch = state.input.charCodeAt(_position);
    // Condition state.position === state.lineStart is tested
    // in parent on each call, for efficiency. No needs to test here again.
    if ((ch === 0x2d || /* - */ ch === 0x2e) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
        _position += 3;
        ch = state.input.charCodeAt(_position);
        if (ch === 0 || isWsOrEol(ch)) {
            return true;
        }
    }
    return false;
}
function writeFoldedLines(state, count) {
    if (count === 1) {
        state.result += " ";
    } else if (count > 1) {
        state.result += common.repeat("\n", count - 1);
    }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
    const kind = state.kind;
    const result = state.result;
    let ch = state.input.charCodeAt(state.position);
    if (isWsOrEol(ch) || isFlowIndicator(ch) || ch === 0x23 /* # */  || ch === 0x26 /* & */  || ch === 0x2a /* * */  || ch === 0x21 /* ! */  || ch === 0x7c /* | */  || ch === 0x3e /* > */  || ch === 0x27 /* ' */  || ch === 0x22 /* " */  || ch === 0x25 /* % */  || ch === 0x40 /* @ */  || ch === 0x60 /* ` */ ) {
        return false;
    }
    let following;
    if (ch === 0x3f || /* ? */ ch === 0x2d /* - */ ) {
        following = state.input.charCodeAt(state.position + 1);
        if (isWsOrEol(following) || withinFlowCollection && isFlowIndicator(following)) {
            return false;
        }
    }
    state.kind = "scalar";
    state.result = "";
    let captureEnd, captureStart = captureEnd = state.position;
    let hasPendingContent = false;
    let line = 0;
    while(ch !== 0){
        if (ch === 0x3a /* : */ ) {
            following = state.input.charCodeAt(state.position + 1);
            if (isWsOrEol(following) || withinFlowCollection && isFlowIndicator(following)) {
                break;
            }
        } else if (ch === 0x23 /* # */ ) {
            const preceding = state.input.charCodeAt(state.position - 1);
            if (isWsOrEol(preceding)) {
                break;
            }
        } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && isFlowIndicator(ch)) {
            break;
        } else if (isEOL(ch)) {
            line = state.line;
            const lineStart = state.lineStart;
            const lineIndent = state.lineIndent;
            skipSeparationSpace(state, false, -1);
            if (state.lineIndent >= nodeIndent) {
                hasPendingContent = true;
                ch = state.input.charCodeAt(state.position);
                continue;
            } else {
                state.position = captureEnd;
                state.line = line;
                state.lineStart = lineStart;
                state.lineIndent = lineIndent;
                break;
            }
        }
        if (hasPendingContent) {
            captureSegment(state, captureStart, captureEnd, false);
            writeFoldedLines(state, state.line - line);
            captureStart = captureEnd = state.position;
            hasPendingContent = false;
        }
        if (!isWhiteSpace(ch)) {
            captureEnd = state.position + 1;
        }
        ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, captureEnd, false);
    if (state.result) {
        return true;
    }
    state.kind = kind;
    state.result = result;
    return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
    let ch, captureStart, captureEnd;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 0x27 /* ' */ ) {
        return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while((ch = state.input.charCodeAt(state.position)) !== 0){
        if (ch === 0x27 /* ' */ ) {
            captureSegment(state, captureStart, state.position, true);
            ch = state.input.charCodeAt(++state.position);
            if (ch === 0x27 /* ' */ ) {
                captureStart = state.position;
                state.position++;
                captureEnd = state.position;
            } else {
                return true;
            }
        } else if (isEOL(ch)) {
            captureSegment(state, captureStart, captureEnd, true);
            writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
            captureStart = captureEnd = state.position;
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
            return throwError(state, "unexpected end of the document within a single quoted scalar");
        } else {
            state.position++;
            captureEnd = state.position;
        }
    }
    return throwError(state, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state, nodeIndent) {
    let ch = state.input.charCodeAt(state.position);
    if (ch !== 0x22 /* " */ ) {
        return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    let captureEnd, captureStart = captureEnd = state.position;
    let tmp;
    while((ch = state.input.charCodeAt(state.position)) !== 0){
        if (ch === 0x22 /* " */ ) {
            captureSegment(state, captureStart, state.position, true);
            state.position++;
            return true;
        }
        if (ch === 0x5c /* \ */ ) {
            captureSegment(state, captureStart, state.position, true);
            ch = state.input.charCodeAt(++state.position);
            if (isEOL(ch)) {
                skipSeparationSpace(state, false, nodeIndent);
            // TODO(bartlomieju): rework to inline fn with no type cast?
            } else if (ch < 256 && simpleEscapeCheck[ch]) {
                state.result += simpleEscapeMap[ch];
                state.position++;
            } else if ((tmp = escapedHexLen(ch)) > 0) {
                let hexLength = tmp;
                let hexResult = 0;
                for(; hexLength > 0; hexLength--){
                    ch = state.input.charCodeAt(++state.position);
                    if ((tmp = fromHexCode(ch)) >= 0) {
                        hexResult = (hexResult << 4) + tmp;
                    } else {
                        return throwError(state, "expected hexadecimal character");
                    }
                }
                state.result += charFromCodepoint(hexResult);
                state.position++;
            } else {
                return throwError(state, "unknown escape sequence");
            }
            captureStart = captureEnd = state.position;
        } else if (isEOL(ch)) {
            captureSegment(state, captureStart, captureEnd, true);
            writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
            captureStart = captureEnd = state.position;
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
            return throwError(state, "unexpected end of the document within a double quoted scalar");
        } else {
            state.position++;
            captureEnd = state.position;
        }
    }
    return throwError(state, "unexpected end of the stream within a double quoted scalar");
}
function readFlowCollection(state, nodeIndent) {
    let ch = state.input.charCodeAt(state.position);
    let terminator;
    let isMapping = true;
    let result = {};
    if (ch === 0x5b /* [ */ ) {
        terminator = 0x5d; /* ] */ 
        isMapping = false;
        result = [];
    } else if (ch === 0x7b /* { */ ) {
        terminator = 0x7d; /* } */ 
    } else {
        return false;
    }
    if (state.anchor !== null && typeof state.anchor != "undefined" && typeof state.anchorMap != "undefined") {
        state.anchorMap[state.anchor] = result;
    }
    ch = state.input.charCodeAt(++state.position);
    const tag = state.tag, anchor = state.anchor;
    let readNext = true;
    let valueNode, keyNode, keyTag = keyNode = valueNode = null, isExplicitPair, isPair = isExplicitPair = false;
    let following = 0, line = 0;
    const overridableKeys = Object.create(null);
    while(ch !== 0){
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === terminator) {
            state.position++;
            state.tag = tag;
            state.anchor = anchor;
            state.kind = isMapping ? "mapping" : "sequence";
            state.result = result;
            return true;
        }
        if (!readNext) {
            return throwError(state, "missed comma between flow collection entries");
        }
        keyTag = keyNode = valueNode = null;
        isPair = isExplicitPair = false;
        if (ch === 0x3f /* ? */ ) {
            following = state.input.charCodeAt(state.position + 1);
            if (isWsOrEol(following)) {
                isPair = isExplicitPair = true;
                state.position++;
                skipSeparationSpace(state, true, nodeIndent);
            }
        }
        line = state.line;
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        keyTag = state.tag || null;
        keyNode = state.result;
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if ((isExplicitPair || state.line === line) && ch === 0x3a /* : */ ) {
            isPair = true;
            ch = state.input.charCodeAt(++state.position);
            skipSeparationSpace(state, true, nodeIndent);
            composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
            valueNode = state.result;
        }
        if (isMapping) {
            storeMappingPair(state, result, overridableKeys, keyTag, keyNode, valueNode);
        } else if (isPair) {
            result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
        } else {
            result.push(keyNode);
        }
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === 0x2c /* , */ ) {
            readNext = true;
            ch = state.input.charCodeAt(++state.position);
        } else {
            readNext = false;
        }
    }
    return throwError(state, "unexpected end of the stream within a flow collection");
}
function readBlockScalar(state, nodeIndent) {
    let chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false;
    let ch = state.input.charCodeAt(state.position);
    let folding = false;
    if (ch === 0x7c /* | */ ) {
        folding = false;
    } else if (ch === 0x3e /* > */ ) {
        folding = true;
    } else {
        return false;
    }
    state.kind = "scalar";
    state.result = "";
    let tmp = 0;
    while(ch !== 0){
        ch = state.input.charCodeAt(++state.position);
        if (ch === 0x2b || /* + */ ch === 0x2d /* - */ ) {
            if (CHOMPING_CLIP === chomping) {
                chomping = ch === 0x2b /* + */  ? CHOMPING_KEEP : CHOMPING_STRIP;
            } else {
                return throwError(state, "repeat of a chomping mode identifier");
            }
        } else if ((tmp = fromDecimalCode(ch)) >= 0) {
            if (tmp === 0) {
                return throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
            } else if (!detectedIndent) {
                textIndent = nodeIndent + tmp - 1;
                detectedIndent = true;
            } else {
                return throwError(state, "repeat of an indentation width identifier");
            }
        } else {
            break;
        }
    }
    if (isWhiteSpace(ch)) {
        do {
            ch = state.input.charCodeAt(++state.position);
        }while (isWhiteSpace(ch))
        if (ch === 0x23 /* # */ ) {
            do {
                ch = state.input.charCodeAt(++state.position);
            }while (!isEOL(ch) && ch !== 0)
        }
    }
    while(ch !== 0){
        readLineBreak(state);
        state.lineIndent = 0;
        ch = state.input.charCodeAt(state.position);
        while((!detectedIndent || state.lineIndent < textIndent) && ch === 0x20 /* Space */ ){
            state.lineIndent++;
            ch = state.input.charCodeAt(++state.position);
        }
        if (!detectedIndent && state.lineIndent > textIndent) {
            textIndent = state.lineIndent;
        }
        if (isEOL(ch)) {
            emptyLines++;
            continue;
        }
        // End of the scalar.
        if (state.lineIndent < textIndent) {
            // Perform the chomping.
            if (chomping === CHOMPING_KEEP) {
                state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
            } else if (chomping === CHOMPING_CLIP) {
                if (didReadContent) {
                    // i.e. only if the scalar is not empty.
                    state.result += "\n";
                }
            }
            break;
        }
        // Folded style: use fancy rules to handle line breaks.
        if (folding) {
            // Lines starting with white space characters (more-indented lines) are not folded.
            if (isWhiteSpace(ch)) {
                atMoreIndented = true;
                // except for the first content line (cf. Example 8.1)
                state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
            // End of more-indented block.
            } else if (atMoreIndented) {
                atMoreIndented = false;
                state.result += common.repeat("\n", emptyLines + 1);
            // Just one line break - perceive as the same line.
            } else if (emptyLines === 0) {
                if (didReadContent) {
                    // i.e. only if we have already read some scalar content.
                    state.result += " ";
                }
            // Several line breaks - perceive as different lines.
            } else {
                state.result += common.repeat("\n", emptyLines);
            }
        // Literal style: just add exact number of line breaks between content lines.
        } else {
            // Keep all line breaks except the header line break.
            state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        }
        didReadContent = true;
        detectedIndent = true;
        emptyLines = 0;
        const captureStart = state.position;
        while(!isEOL(ch) && ch !== 0){
            ch = state.input.charCodeAt(++state.position);
        }
        captureSegment(state, captureStart, state.position, false);
    }
    return true;
}
function readBlockSequence(state, nodeIndent) {
    let line, following, detected = false, ch;
    const tag = state.tag, anchor = state.anchor, result = [];
    if (state.anchor !== null && typeof state.anchor !== "undefined" && typeof state.anchorMap !== "undefined") {
        state.anchorMap[state.anchor] = result;
    }
    ch = state.input.charCodeAt(state.position);
    while(ch !== 0){
        if (ch !== 0x2d /* - */ ) {
            break;
        }
        following = state.input.charCodeAt(state.position + 1);
        if (!isWsOrEol(following)) {
            break;
        }
        detected = true;
        state.position++;
        if (skipSeparationSpace(state, true, -1)) {
            if (state.lineIndent <= nodeIndent) {
                result.push(null);
                ch = state.input.charCodeAt(state.position);
                continue;
            }
        }
        line = state.line;
        composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
        result.push(state.result);
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if ((state.line === line || state.lineIndent > nodeIndent) && ch !== 0) {
            return throwError(state, "bad indentation of a sequence entry");
        } else if (state.lineIndent < nodeIndent) {
            break;
        }
    }
    if (detected) {
        state.tag = tag;
        state.anchor = anchor;
        state.kind = "sequence";
        state.result = result;
        return true;
    }
    return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
    const tag = state.tag, anchor = state.anchor, result = {}, overridableKeys = Object.create(null);
    let following, allowCompact = false, line, pos, keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
    if (state.anchor !== null && typeof state.anchor !== "undefined" && typeof state.anchorMap !== "undefined") {
        state.anchorMap[state.anchor] = result;
    }
    ch = state.input.charCodeAt(state.position);
    while(ch !== 0){
        following = state.input.charCodeAt(state.position + 1);
        line = state.line; // Save the current line.
        pos = state.position;
        //
        // Explicit notation case. There are two separate blocks:
        // first for the key (denoted by "?") and second for the value (denoted by ":")
        //
        if ((ch === 0x3f || /* ? */ ch === 0x3a) && /* : */ isWsOrEol(following)) {
            if (ch === 0x3f /* ? */ ) {
                if (atExplicitKey) {
                    storeMappingPair(state, result, overridableKeys, keyTag, keyNode, null);
                    keyTag = keyNode = valueNode = null;
                }
                detected = true;
                atExplicitKey = true;
                allowCompact = true;
            } else if (atExplicitKey) {
                // i.e. 0x3A/* : */ === character after the explicit key.
                atExplicitKey = false;
                allowCompact = true;
            } else {
                return throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
            }
            state.position += 1;
            ch = following;
        //
        // Implicit notation case. Flow-style node as the key first, then ":", and the value.
        //
        } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
            if (state.line === line) {
                ch = state.input.charCodeAt(state.position);
                while(isWhiteSpace(ch)){
                    ch = state.input.charCodeAt(++state.position);
                }
                if (ch === 0x3a /* : */ ) {
                    ch = state.input.charCodeAt(++state.position);
                    if (!isWsOrEol(ch)) {
                        return throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
                    }
                    if (atExplicitKey) {
                        storeMappingPair(state, result, overridableKeys, keyTag, keyNode, null);
                        keyTag = keyNode = valueNode = null;
                    }
                    detected = true;
                    atExplicitKey = false;
                    allowCompact = false;
                    keyTag = state.tag;
                    keyNode = state.result;
                } else if (detected) {
                    return throwError(state, "can not read an implicit mapping pair; a colon is missed");
                } else {
                    state.tag = tag;
                    state.anchor = anchor;
                    return true; // Keep the result of `composeNode`.
                }
            } else if (detected) {
                return throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
            } else {
                state.tag = tag;
                state.anchor = anchor;
                return true; // Keep the result of `composeNode`.
            }
        } else {
            break; // Reading is done. Go to the epilogue.
        }
        //
        // Common reading code for both explicit and implicit notations.
        //
        if (state.line === line || state.lineIndent > nodeIndent) {
            if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
                if (atExplicitKey) {
                    keyNode = state.result;
                } else {
                    valueNode = state.result;
                }
            }
            if (!atExplicitKey) {
                storeMappingPair(state, result, overridableKeys, keyTag, keyNode, valueNode, line, pos);
                keyTag = keyNode = valueNode = null;
            }
            skipSeparationSpace(state, true, -1);
            ch = state.input.charCodeAt(state.position);
        }
        if (state.lineIndent > nodeIndent && ch !== 0) {
            return throwError(state, "bad indentation of a mapping entry");
        } else if (state.lineIndent < nodeIndent) {
            break;
        }
    }
    //
    // Epilogue.
    //
    // Special case: last mapping's node contains only the key in explicit notation.
    if (atExplicitKey) {
        storeMappingPair(state, result, overridableKeys, keyTag, keyNode, null);
    }
    // Expose the resulting mapping.
    if (detected) {
        state.tag = tag;
        state.anchor = anchor;
        state.kind = "mapping";
        state.result = result;
    }
    return detected;
}
function readTagProperty(state) {
    let position, isVerbatim = false, isNamed = false, tagHandle = "", tagName, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 0x21 /* ! */ ) return false;
    if (state.tag !== null) {
        return throwError(state, "duplication of a tag property");
    }
    ch = state.input.charCodeAt(++state.position);
    if (ch === 0x3c /* < */ ) {
        isVerbatim = true;
        ch = state.input.charCodeAt(++state.position);
    } else if (ch === 0x21 /* ! */ ) {
        isNamed = true;
        tagHandle = "!!";
        ch = state.input.charCodeAt(++state.position);
    } else {
        tagHandle = "!";
    }
    position = state.position;
    if (isVerbatim) {
        do {
            ch = state.input.charCodeAt(++state.position);
        }while (ch !== 0 && ch !== 0x3e /* > */ )
        if (state.position < state.length) {
            tagName = state.input.slice(position, state.position);
            ch = state.input.charCodeAt(++state.position);
        } else {
            return throwError(state, "unexpected end of the stream within a verbatim tag");
        }
    } else {
        while(ch !== 0 && !isWsOrEol(ch)){
            if (ch === 0x21 /* ! */ ) {
                if (!isNamed) {
                    tagHandle = state.input.slice(position - 1, state.position + 1);
                    if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
                        return throwError(state, "named tag handle cannot contain such characters");
                    }
                    isNamed = true;
                    position = state.position + 1;
                } else {
                    return throwError(state, "tag suffix cannot contain exclamation marks");
                }
            }
            ch = state.input.charCodeAt(++state.position);
        }
        tagName = state.input.slice(position, state.position);
        if (PATTERN_FLOW_INDICATORS.test(tagName)) {
            return throwError(state, "tag suffix cannot contain flow indicator characters");
        }
    }
    if (tagName && !PATTERN_TAG_URI.test(tagName)) {
        return throwError(state, `tag name cannot contain such characters: ${tagName}`);
    }
    if (isVerbatim) {
        state.tag = tagName;
    } else if (typeof state.tagMap !== "undefined" && hasOwn(state.tagMap, tagHandle)) {
        state.tag = state.tagMap[tagHandle] + tagName;
    } else if (tagHandle === "!") {
        state.tag = `!${tagName}`;
    } else if (tagHandle === "!!") {
        state.tag = `tag:yaml.org,2002:${tagName}`;
    } else {
        return throwError(state, `undeclared tag handle "${tagHandle}"`);
    }
    return true;
}
function readAnchorProperty(state) {
    let ch = state.input.charCodeAt(state.position);
    if (ch !== 0x26 /* & */ ) return false;
    if (state.anchor !== null) {
        return throwError(state, "duplication of an anchor property");
    }
    ch = state.input.charCodeAt(++state.position);
    const position = state.position;
    while(ch !== 0 && !isWsOrEol(ch) && !isFlowIndicator(ch)){
        ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === position) {
        return throwError(state, "name of an anchor node must contain at least one character");
    }
    state.anchor = state.input.slice(position, state.position);
    return true;
}
function readAlias(state) {
    let ch = state.input.charCodeAt(state.position);
    if (ch !== 0x2a /* * */ ) return false;
    ch = state.input.charCodeAt(++state.position);
    const _position = state.position;
    while(ch !== 0 && !isWsOrEol(ch) && !isFlowIndicator(ch)){
        ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
        return throwError(state, "name of an alias node must contain at least one character");
    }
    const alias = state.input.slice(_position, state.position);
    if (typeof state.anchorMap !== "undefined" && !hasOwn(state.anchorMap, alias)) {
        return throwError(state, `unidentified alias "${alias}"`);
    }
    if (typeof state.anchorMap !== "undefined") {
        state.result = state.anchorMap[alias];
    }
    skipSeparationSpace(state, true, -1);
    return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
    let allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, type, flowIndent, blockIndent;
    if (state.listener && state.listener !== null) {
        state.listener("open", state);
    }
    state.tag = null;
    state.anchor = null;
    state.kind = null;
    state.result = null;
    const allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
    if (allowToSeek) {
        if (skipSeparationSpace(state, true, -1)) {
            atNewLine = true;
            if (state.lineIndent > parentIndent) {
                indentStatus = 1;
            } else if (state.lineIndent === parentIndent) {
                indentStatus = 0;
            } else if (state.lineIndent < parentIndent) {
                indentStatus = -1;
            }
        }
    }
    if (indentStatus === 1) {
        while(readTagProperty(state) || readAnchorProperty(state)){
            if (skipSeparationSpace(state, true, -1)) {
                atNewLine = true;
                allowBlockCollections = allowBlockStyles;
                if (state.lineIndent > parentIndent) {
                    indentStatus = 1;
                } else if (state.lineIndent === parentIndent) {
                    indentStatus = 0;
                } else if (state.lineIndent < parentIndent) {
                    indentStatus = -1;
                }
            } else {
                allowBlockCollections = false;
            }
        }
    }
    if (allowBlockCollections) {
        allowBlockCollections = atNewLine || allowCompact;
    }
    if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
        const cond = CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext;
        flowIndent = cond ? parentIndent : parentIndent + 1;
        blockIndent = state.position - state.lineStart;
        if (indentStatus === 1) {
            if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
                hasContent = true;
            } else {
                if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
                    hasContent = true;
                } else if (readAlias(state)) {
                    hasContent = true;
                    if (state.tag !== null || state.anchor !== null) {
                        return throwError(state, "alias node should not have Any properties");
                    }
                } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
                    hasContent = true;
                    if (state.tag === null) {
                        state.tag = "?";
                    }
                }
                if (state.anchor !== null && typeof state.anchorMap !== "undefined") {
                    state.anchorMap[state.anchor] = state.result;
                }
            }
        } else if (indentStatus === 0) {
            // Special case: block sequences are allowed to have same indentation level as the parent.
            // http://www.yaml.org/spec/1.2/spec.html#id2799784
            hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
        }
    }
    if (state.tag !== null && state.tag !== "!") {
        if (state.tag === "?") {
            for(let typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex++){
                type = state.implicitTypes[typeIndex];
                // Implicit resolving is not allowed for non-scalar types, and '?'
                // non-specific tag is only assigned to plain scalars. So, it isn't
                // needed to check for 'kind' conformity.
                if (type.resolve(state.result)) {
                    // `state.result` updated in resolver if matched
                    state.result = type.construct(state.result);
                    state.tag = type.tag;
                    if (state.anchor !== null && typeof state.anchorMap !== "undefined") {
                        state.anchorMap[state.anchor] = state.result;
                    }
                    break;
                }
            }
        } else if (hasOwn(state.typeMap[state.kind || "fallback"], state.tag)) {
            type = state.typeMap[state.kind || "fallback"][state.tag];
            if (state.result !== null && type.kind !== state.kind) {
                return throwError(state, `unacceptable node kind for !<${state.tag}> tag; it should be "${type.kind}", not "${state.kind}"`);
            }
            if (!type.resolve(state.result)) {
                // `state.result` updated in resolver if matched
                return throwError(state, `cannot resolve a node with !<${state.tag}> explicit tag`);
            } else {
                state.result = type.construct(state.result);
                if (state.anchor !== null && typeof state.anchorMap !== "undefined") {
                    state.anchorMap[state.anchor] = state.result;
                }
            }
        } else {
            return throwError(state, `unknown tag !<${state.tag}>`);
        }
    }
    if (state.listener && state.listener !== null) {
        state.listener("close", state);
    }
    return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
    const documentStart = state.position;
    let position, directiveName, directiveArgs, hasDirectives = false, ch;
    state.version = null;
    state.checkLineBreaks = state.legacy;
    state.tagMap = Object.create(null);
    state.anchorMap = Object.create(null);
    while((ch = state.input.charCodeAt(state.position)) !== 0){
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if (state.lineIndent > 0 || ch !== 0x25 /* % */ ) {
            break;
        }
        hasDirectives = true;
        ch = state.input.charCodeAt(++state.position);
        position = state.position;
        while(ch !== 0 && !isWsOrEol(ch)){
            ch = state.input.charCodeAt(++state.position);
        }
        directiveName = state.input.slice(position, state.position);
        directiveArgs = [];
        if (directiveName.length < 1) {
            return throwError(state, "directive name must not be less than one character in length");
        }
        while(ch !== 0){
            while(isWhiteSpace(ch)){
                ch = state.input.charCodeAt(++state.position);
            }
            if (ch === 0x23 /* # */ ) {
                do {
                    ch = state.input.charCodeAt(++state.position);
                }while (ch !== 0 && !isEOL(ch))
                break;
            }
            if (isEOL(ch)) break;
            position = state.position;
            while(ch !== 0 && !isWsOrEol(ch)){
                ch = state.input.charCodeAt(++state.position);
            }
            directiveArgs.push(state.input.slice(position, state.position));
        }
        if (ch !== 0) readLineBreak(state);
        if (hasOwn(directiveHandlers, directiveName)) {
            directiveHandlers[directiveName](state, directiveName, ...directiveArgs);
        } else {
            throwWarning(state, `unknown document directive "${directiveName}"`);
        }
    }
    skipSeparationSpace(state, true, -1);
    if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 0x2d /* - */  && state.input.charCodeAt(state.position + 1) === 0x2d /* - */  && state.input.charCodeAt(state.position + 2) === 0x2d /* - */ ) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
    } else if (hasDirectives) {
        return throwError(state, "directives end mark is expected");
    }
    composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
    skipSeparationSpace(state, true, -1);
    if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
        throwWarning(state, "non-ASCII line breaks are interpreted as content");
    }
    state.documents.push(state.result);
    if (state.position === state.lineStart && testDocumentSeparator(state)) {
        if (state.input.charCodeAt(state.position) === 0x2e /* . */ ) {
            state.position += 3;
            skipSeparationSpace(state, true, -1);
        }
        return;
    }
    if (state.position < state.length - 1) {
        return throwError(state, "end of the stream or a document separator is expected");
    }
}
function loadDocuments(input, options) {
    input = String(input);
    options = options || {};
    if (input.length !== 0) {
        // Add tailing `\n` if not exists
        if (input.charCodeAt(input.length - 1) !== 0x0a /* LF */  && input.charCodeAt(input.length - 1) !== 0x0d /* CR */ ) {
            input += "\n";
        }
        // Strip BOM
        if (input.charCodeAt(0) === 0xfeff) {
            input = input.slice(1);
        }
    }
    const state = new LoaderState(input, options);
    // Use 0 as string terminator. That significantly simplifies bounds check.
    state.input += "\0";
    while(state.input.charCodeAt(state.position) === 0x20 /* Space */ ){
        state.lineIndent += 1;
        state.position += 1;
    }
    while(state.position < state.length - 1){
        readDocument(state);
    }
    return state.documents;
}
function isCbFunction(fn) {
    return typeof fn === "function";
}
export function loadAll(input, iteratorOrOption, options) {
    if (!isCbFunction(iteratorOrOption)) {
        return loadDocuments(input, iteratorOrOption);
    }
    const documents = loadDocuments(input, options);
    const iterator = iteratorOrOption;
    for(let index = 0, length = documents.length; index < length; index++){
        iterator(documents[index]);
    }
    return void 0;
}
export function load(input, options) {
    const documents = loadDocuments(input, options);
    if (documents.length === 0) {
        return;
    }
    if (documents.length === 1) {
        return documents[0];
    }
    throw new YAMLError("expected a single document in the stream, but found more");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvX2xvYWRlci9sb2FkZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gUG9ydGVkIGZyb20ganMteWFtbCB2My4xMy4xOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVjYS9qcy15YW1sL2NvbW1pdC82NjVhYWRkYTQyMzQ5ZGNhZTg2OWYxMjA0MGQ5YjEwZWYxOGQxMmRhXG4vLyBDb3B5cmlnaHQgMjAxMS0yMDE1IGJ5IFZpdGFseSBQdXpyaW4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gQ29weXJpZ2h0IDIwMTgtMjAyMyB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cblxuaW1wb3J0IHsgWUFNTEVycm9yIH0gZnJvbSBcIi4uL19lcnJvci50c1wiO1xuaW1wb3J0IHsgTWFyayB9IGZyb20gXCIuLi9fbWFyay50c1wiO1xuaW1wb3J0IHR5cGUgeyBUeXBlIH0gZnJvbSBcIi4uL3R5cGUudHNcIjtcbmltcG9ydCAqIGFzIGNvbW1vbiBmcm9tIFwiLi4vX3V0aWxzLnRzXCI7XG5pbXBvcnQgeyBMb2FkZXJTdGF0ZSwgTG9hZGVyU3RhdGVPcHRpb25zLCBSZXN1bHRUeXBlIH0gZnJvbSBcIi4vbG9hZGVyX3N0YXRlLnRzXCI7XG5cbnR5cGUgQW55ID0gY29tbW9uLkFueTtcbnR5cGUgQXJyYXlPYmplY3Q8VCA9IEFueT4gPSBjb21tb24uQXJyYXlPYmplY3Q8VD47XG5cbmNvbnN0IHsgaGFzT3duIH0gPSBPYmplY3Q7XG5cbmNvbnN0IENPTlRFWFRfRkxPV19JTiA9IDE7XG5jb25zdCBDT05URVhUX0ZMT1dfT1VUID0gMjtcbmNvbnN0IENPTlRFWFRfQkxPQ0tfSU4gPSAzO1xuY29uc3QgQ09OVEVYVF9CTE9DS19PVVQgPSA0O1xuXG5jb25zdCBDSE9NUElOR19DTElQID0gMTtcbmNvbnN0IENIT01QSU5HX1NUUklQID0gMjtcbmNvbnN0IENIT01QSU5HX0tFRVAgPSAzO1xuXG5jb25zdCBQQVRURVJOX05PTl9QUklOVEFCTEUgPVxuICAvLyBkZW5vLWxpbnQtaWdub3JlIG5vLWNvbnRyb2wtcmVnZXhcbiAgL1tcXHgwMC1cXHgwOFxceDBCXFx4MENcXHgwRS1cXHgxRlxceDdGLVxceDg0XFx4ODYtXFx4OUZcXHVGRkZFXFx1RkZGRl18W1xcdUQ4MDAtXFx1REJGRl0oPyFbXFx1REMwMC1cXHVERkZGXSl8KD86W15cXHVEODAwLVxcdURCRkZdfF4pW1xcdURDMDAtXFx1REZGRl0vO1xuY29uc3QgUEFUVEVSTl9OT05fQVNDSUlfTElORV9CUkVBS1MgPSAvW1xceDg1XFx1MjAyOFxcdTIwMjldLztcbmNvbnN0IFBBVFRFUk5fRkxPV19JTkRJQ0FUT1JTID0gL1ssXFxbXFxdXFx7XFx9XS87XG5jb25zdCBQQVRURVJOX1RBR19IQU5ETEUgPSAvXig/OiF8ISF8IVthLXpcXC1dKyEpJC9pO1xuY29uc3QgUEFUVEVSTl9UQUdfVVJJID1cbiAgL14oPzohfFteLFxcW1xcXVxce1xcfV0pKD86JVswLTlhLWZdezJ9fFswLTlhLXpcXC0jO1xcL1xcPzpAJj1cXCtcXCQsX1xcLiF+XFwqJ1xcKFxcKVxcW1xcXV0pKiQvaTtcblxuZnVuY3Rpb24gX2NsYXNzKG9iajogdW5rbm93bik6IHN0cmluZyB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbn1cblxuZnVuY3Rpb24gaXNFT0woYzogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBjID09PSAweDBhIHx8IC8qIExGICovIGMgPT09IDB4MGQgLyogQ1IgKi87XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVTcGFjZShjOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIGMgPT09IDB4MDkgfHwgLyogVGFiICovIGMgPT09IDB4MjAgLyogU3BhY2UgKi87XG59XG5cbmZ1bmN0aW9uIGlzV3NPckVvbChjOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBjID09PSAweDA5IC8qIFRhYiAqLyB8fFxuICAgIGMgPT09IDB4MjAgLyogU3BhY2UgKi8gfHxcbiAgICBjID09PSAweDBhIC8qIExGICovIHx8XG4gICAgYyA9PT0gMHgwZCAvKiBDUiAqL1xuICApO1xufVxuXG5mdW5jdGlvbiBpc0Zsb3dJbmRpY2F0b3IoYzogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgYyA9PT0gMHgyYyAvKiAsICovIHx8XG4gICAgYyA9PT0gMHg1YiAvKiBbICovIHx8XG4gICAgYyA9PT0gMHg1ZCAvKiBdICovIHx8XG4gICAgYyA9PT0gMHg3YiAvKiB7ICovIHx8XG4gICAgYyA9PT0gMHg3ZCAvKiB9ICovXG4gICk7XG59XG5cbmZ1bmN0aW9uIGZyb21IZXhDb2RlKGM6IG51bWJlcik6IG51bWJlciB7XG4gIGlmICgweDMwIDw9IC8qIDAgKi8gYyAmJiBjIDw9IDB4MzkgLyogOSAqLykge1xuICAgIHJldHVybiBjIC0gMHgzMDtcbiAgfVxuXG4gIGNvbnN0IGxjID0gYyB8IDB4MjA7XG5cbiAgaWYgKDB4NjEgPD0gLyogYSAqLyBsYyAmJiBsYyA8PSAweDY2IC8qIGYgKi8pIHtcbiAgICByZXR1cm4gbGMgLSAweDYxICsgMTA7XG4gIH1cblxuICByZXR1cm4gLTE7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZWRIZXhMZW4oYzogbnVtYmVyKTogbnVtYmVyIHtcbiAgaWYgKGMgPT09IDB4NzggLyogeCAqLykge1xuICAgIHJldHVybiAyO1xuICB9XG4gIGlmIChjID09PSAweDc1IC8qIHUgKi8pIHtcbiAgICByZXR1cm4gNDtcbiAgfVxuICBpZiAoYyA9PT0gMHg1NSAvKiBVICovKSB7XG4gICAgcmV0dXJuIDg7XG4gIH1cbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGZyb21EZWNpbWFsQ29kZShjOiBudW1iZXIpOiBudW1iZXIge1xuICBpZiAoMHgzMCA8PSAvKiAwICovIGMgJiYgYyA8PSAweDM5IC8qIDkgKi8pIHtcbiAgICByZXR1cm4gYyAtIDB4MzA7XG4gIH1cblxuICByZXR1cm4gLTE7XG59XG5cbmZ1bmN0aW9uIHNpbXBsZUVzY2FwZVNlcXVlbmNlKGM6IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBjID09PSAweDMwIC8qIDAgKi9cbiAgICA/IFwiXFx4MDBcIlxuICAgIDogYyA9PT0gMHg2MSAvKiBhICovXG4gICAgPyBcIlxceDA3XCJcbiAgICA6IGMgPT09IDB4NjIgLyogYiAqL1xuICAgID8gXCJcXHgwOFwiXG4gICAgOiBjID09PSAweDc0IC8qIHQgKi9cbiAgICA/IFwiXFx4MDlcIlxuICAgIDogYyA9PT0gMHgwOSAvKiBUYWIgKi9cbiAgICA/IFwiXFx4MDlcIlxuICAgIDogYyA9PT0gMHg2ZSAvKiBuICovXG4gICAgPyBcIlxceDBBXCJcbiAgICA6IGMgPT09IDB4NzYgLyogdiAqL1xuICAgID8gXCJcXHgwQlwiXG4gICAgOiBjID09PSAweDY2IC8qIGYgKi9cbiAgICA/IFwiXFx4MENcIlxuICAgIDogYyA9PT0gMHg3MiAvKiByICovXG4gICAgPyBcIlxceDBEXCJcbiAgICA6IGMgPT09IDB4NjUgLyogZSAqL1xuICAgID8gXCJcXHgxQlwiXG4gICAgOiBjID09PSAweDIwIC8qIFNwYWNlICovXG4gICAgPyBcIiBcIlxuICAgIDogYyA9PT0gMHgyMiAvKiBcIiAqL1xuICAgID8gXCJcXHgyMlwiXG4gICAgOiBjID09PSAweDJmIC8qIC8gKi9cbiAgICA/IFwiL1wiXG4gICAgOiBjID09PSAweDVjIC8qIFxcICovXG4gICAgPyBcIlxceDVDXCJcbiAgICA6IGMgPT09IDB4NGUgLyogTiAqL1xuICAgID8gXCJcXHg4NVwiXG4gICAgOiBjID09PSAweDVmIC8qIF8gKi9cbiAgICA/IFwiXFx4QTBcIlxuICAgIDogYyA9PT0gMHg0YyAvKiBMICovXG4gICAgPyBcIlxcdTIwMjhcIlxuICAgIDogYyA9PT0gMHg1MCAvKiBQICovXG4gICAgPyBcIlxcdTIwMjlcIlxuICAgIDogXCJcIjtcbn1cblxuZnVuY3Rpb24gY2hhckZyb21Db2RlcG9pbnQoYzogbnVtYmVyKTogc3RyaW5nIHtcbiAgaWYgKGMgPD0gMHhmZmZmKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7XG4gIH1cbiAgLy8gRW5jb2RlIFVURi0xNiBzdXJyb2dhdGUgcGFpclxuICAvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9VVEYtMTYjQ29kZV9wb2ludHNfVS4yQjAxMDAwMF90b19VLjJCMTBGRkZGXG4gIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKFxuICAgICgoYyAtIDB4MDEwMDAwKSA+PiAxMCkgKyAweGQ4MDAsXG4gICAgKChjIC0gMHgwMTAwMDApICYgMHgwM2ZmKSArIDB4ZGMwMCxcbiAgKTtcbn1cblxuY29uc3Qgc2ltcGxlRXNjYXBlQ2hlY2sgPSBBcnJheS5mcm9tPG51bWJlcj4oeyBsZW5ndGg6IDI1NiB9KTsgLy8gaW50ZWdlciwgZm9yIGZhc3QgYWNjZXNzXG5jb25zdCBzaW1wbGVFc2NhcGVNYXAgPSBBcnJheS5mcm9tPHN0cmluZz4oeyBsZW5ndGg6IDI1NiB9KTtcbmZvciAobGV0IGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgc2ltcGxlRXNjYXBlQ2hlY2tbaV0gPSBzaW1wbGVFc2NhcGVTZXF1ZW5jZShpKSA/IDEgOiAwO1xuICBzaW1wbGVFc2NhcGVNYXBbaV0gPSBzaW1wbGVFc2NhcGVTZXF1ZW5jZShpKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVFcnJvcihzdGF0ZTogTG9hZGVyU3RhdGUsIG1lc3NhZ2U6IHN0cmluZyk6IFlBTUxFcnJvciB7XG4gIHJldHVybiBuZXcgWUFNTEVycm9yKFxuICAgIG1lc3NhZ2UsXG4gICAgbmV3IE1hcmsoXG4gICAgICBzdGF0ZS5maWxlbmFtZSBhcyBzdHJpbmcsXG4gICAgICBzdGF0ZS5pbnB1dCxcbiAgICAgIHN0YXRlLnBvc2l0aW9uLFxuICAgICAgc3RhdGUubGluZSxcbiAgICAgIHN0YXRlLnBvc2l0aW9uIC0gc3RhdGUubGluZVN0YXJ0LFxuICAgICksXG4gICk7XG59XG5cbmZ1bmN0aW9uIHRocm93RXJyb3Ioc3RhdGU6IExvYWRlclN0YXRlLCBtZXNzYWdlOiBzdHJpbmcpOiBuZXZlciB7XG4gIHRocm93IGdlbmVyYXRlRXJyb3Ioc3RhdGUsIG1lc3NhZ2UpO1xufVxuXG5mdW5jdGlvbiB0aHJvd1dhcm5pbmcoc3RhdGU6IExvYWRlclN0YXRlLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgaWYgKHN0YXRlLm9uV2FybmluZykge1xuICAgIHN0YXRlLm9uV2FybmluZy5jYWxsKG51bGwsIGdlbmVyYXRlRXJyb3Ioc3RhdGUsIG1lc3NhZ2UpKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgRGlyZWN0aXZlSGFuZGxlcnMge1xuICBbZGlyZWN0aXZlOiBzdHJpbmddOiAoXG4gICAgc3RhdGU6IExvYWRlclN0YXRlLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICAuLi5hcmdzOiBzdHJpbmdbXVxuICApID0+IHZvaWQ7XG59XG5cbmNvbnN0IGRpcmVjdGl2ZUhhbmRsZXJzOiBEaXJlY3RpdmVIYW5kbGVycyA9IHtcbiAgWUFNTChzdGF0ZSwgX25hbWUsIC4uLmFyZ3M6IHN0cmluZ1tdKSB7XG4gICAgaWYgKHN0YXRlLnZlcnNpb24gIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKHN0YXRlLCBcImR1cGxpY2F0aW9uIG9mICVZQU1MIGRpcmVjdGl2ZVwiKTtcbiAgICB9XG5cbiAgICBpZiAoYXJncy5sZW5ndGggIT09IDEpIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKHN0YXRlLCBcIllBTUwgZGlyZWN0aXZlIGFjY2VwdHMgZXhhY3RseSBvbmUgYXJndW1lbnRcIik7XG4gICAgfVxuXG4gICAgY29uc3QgbWF0Y2ggPSAvXihbMC05XSspXFwuKFswLTldKykkLy5leGVjKGFyZ3NbMF0pO1xuICAgIGlmIChtYXRjaCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRocm93RXJyb3Ioc3RhdGUsIFwiaWxsLWZvcm1lZCBhcmd1bWVudCBvZiB0aGUgWUFNTCBkaXJlY3RpdmVcIik7XG4gICAgfVxuXG4gICAgY29uc3QgbWFqb3IgPSBwYXJzZUludChtYXRjaFsxXSwgMTApO1xuICAgIGNvbnN0IG1pbm9yID0gcGFyc2VJbnQobWF0Y2hbMl0sIDEwKTtcbiAgICBpZiAobWFqb3IgIT09IDEpIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKHN0YXRlLCBcInVuYWNjZXB0YWJsZSBZQU1MIHZlcnNpb24gb2YgdGhlIGRvY3VtZW50XCIpO1xuICAgIH1cblxuICAgIHN0YXRlLnZlcnNpb24gPSBhcmdzWzBdO1xuICAgIHN0YXRlLmNoZWNrTGluZUJyZWFrcyA9IG1pbm9yIDwgMjtcbiAgICBpZiAobWlub3IgIT09IDEgJiYgbWlub3IgIT09IDIpIHtcbiAgICAgIHJldHVybiB0aHJvd1dhcm5pbmcoc3RhdGUsIFwidW5zdXBwb3J0ZWQgWUFNTCB2ZXJzaW9uIG9mIHRoZSBkb2N1bWVudFwiKTtcbiAgICB9XG4gIH0sXG5cbiAgVEFHKHN0YXRlLCBfbmFtZSwgLi4uYXJnczogc3RyaW5nW10pIHtcbiAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKHN0YXRlLCBcIlRBRyBkaXJlY3RpdmUgYWNjZXB0cyBleGFjdGx5IHR3byBhcmd1bWVudHNcIik7XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxlID0gYXJnc1swXTtcbiAgICBjb25zdCBwcmVmaXggPSBhcmdzWzFdO1xuXG4gICAgaWYgKCFQQVRURVJOX1RBR19IQU5ETEUudGVzdChoYW5kbGUpKSB7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIFwiaWxsLWZvcm1lZCB0YWcgaGFuZGxlIChmaXJzdCBhcmd1bWVudCkgb2YgdGhlIFRBRyBkaXJlY3RpdmVcIixcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLnRhZ01hcCAmJiBoYXNPd24oc3RhdGUudGFnTWFwLCBoYW5kbGUpKSB7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIGB0aGVyZSBpcyBhIHByZXZpb3VzbHkgZGVjbGFyZWQgc3VmZml4IGZvciBcIiR7aGFuZGxlfVwiIHRhZyBoYW5kbGVgLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIVBBVFRFUk5fVEFHX1VSSS50ZXN0KHByZWZpeCkpIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKFxuICAgICAgICBzdGF0ZSxcbiAgICAgICAgXCJpbGwtZm9ybWVkIHRhZyBwcmVmaXggKHNlY29uZCBhcmd1bWVudCkgb2YgdGhlIFRBRyBkaXJlY3RpdmVcIixcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzdGF0ZS50YWdNYXAgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHN0YXRlLnRhZ01hcCA9IE9iamVjdC5jcmVhdGUobnVsbCkgYXMgY29tbW9uLkFycmF5T2JqZWN0O1xuICAgIH1cbiAgICBzdGF0ZS50YWdNYXBbaGFuZGxlXSA9IHByZWZpeDtcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIGNhcHR1cmVTZWdtZW50KFxuICBzdGF0ZTogTG9hZGVyU3RhdGUsXG4gIHN0YXJ0OiBudW1iZXIsXG4gIGVuZDogbnVtYmVyLFxuICBjaGVja0pzb246IGJvb2xlYW4sXG4pIHtcbiAgbGV0IHJlc3VsdDogc3RyaW5nO1xuICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICByZXN1bHQgPSBzdGF0ZS5pbnB1dC5zbGljZShzdGFydCwgZW5kKTtcblxuICAgIGlmIChjaGVja0pzb24pIHtcbiAgICAgIGZvciAoXG4gICAgICAgIGxldCBwb3NpdGlvbiA9IDAsIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG4gICAgICAgIHBvc2l0aW9uIDwgbGVuZ3RoO1xuICAgICAgICBwb3NpdGlvbisrXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgY2hhcmFjdGVyID0gcmVzdWx0LmNoYXJDb2RlQXQocG9zaXRpb24pO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIShjaGFyYWN0ZXIgPT09IDB4MDkgfHwgKDB4MjAgPD0gY2hhcmFjdGVyICYmIGNoYXJhY3RlciA8PSAweDEwZmZmZikpXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKHN0YXRlLCBcImV4cGVjdGVkIHZhbGlkIEpTT04gY2hhcmFjdGVyXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChQQVRURVJOX05PTl9QUklOVEFCTEUudGVzdChyZXN1bHQpKSB7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihzdGF0ZSwgXCJ0aGUgc3RyZWFtIGNvbnRhaW5zIG5vbi1wcmludGFibGUgY2hhcmFjdGVyc1wiKTtcbiAgICB9XG5cbiAgICBzdGF0ZS5yZXN1bHQgKz0gcmVzdWx0O1xuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlTWFwcGluZ3MoXG4gIHN0YXRlOiBMb2FkZXJTdGF0ZSxcbiAgZGVzdGluYXRpb246IEFycmF5T2JqZWN0LFxuICBzb3VyY2U6IEFycmF5T2JqZWN0LFxuICBvdmVycmlkYWJsZUtleXM6IEFycmF5T2JqZWN0PGJvb2xlYW4+LFxuKSB7XG4gIGlmICghY29tbW9uLmlzT2JqZWN0KHNvdXJjZSkpIHtcbiAgICByZXR1cm4gdGhyb3dFcnJvcihcbiAgICAgIHN0YXRlLFxuICAgICAgXCJjYW5ub3QgbWVyZ2UgbWFwcGluZ3M7IHRoZSBwcm92aWRlZCBzb3VyY2Ugb2JqZWN0IGlzIHVuYWNjZXB0YWJsZVwiLFxuICAgICk7XG4gIH1cblxuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgIGlmICghaGFzT3duKGRlc3RpbmF0aW9uLCBrZXkpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVzdGluYXRpb24sIGtleSwge1xuICAgICAgICB2YWx1ZTogc291cmNlW2tleV0sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIG92ZXJyaWRhYmxlS2V5c1trZXldID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc3RvcmVNYXBwaW5nUGFpcihcbiAgc3RhdGU6IExvYWRlclN0YXRlLFxuICByZXN1bHQ6IEFycmF5T2JqZWN0IHwgbnVsbCxcbiAgb3ZlcnJpZGFibGVLZXlzOiBBcnJheU9iamVjdDxib29sZWFuPixcbiAga2V5VGFnOiBzdHJpbmcgfCBudWxsLFxuICBrZXlOb2RlOiBBbnksXG4gIHZhbHVlTm9kZTogdW5rbm93bixcbiAgc3RhcnRMaW5lPzogbnVtYmVyLFxuICBzdGFydFBvcz86IG51bWJlcixcbik6IEFycmF5T2JqZWN0IHtcbiAgLy8gVGhlIG91dHB1dCBpcyBhIHBsYWluIG9iamVjdCBoZXJlLCBzbyBrZXlzIGNhbiBvbmx5IGJlIHN0cmluZ3MuXG4gIC8vIFdlIG5lZWQgdG8gY29udmVydCBrZXlOb2RlIHRvIGEgc3RyaW5nLCBidXQgZG9pbmcgc28gY2FuIGhhbmcgdGhlIHByb2Nlc3NcbiAgLy8gKGRlZXBseSBuZXN0ZWQgYXJyYXlzIHRoYXQgZXhwbG9kZSBleHBvbmVudGlhbGx5IHVzaW5nIGFsaWFzZXMpLlxuICBpZiAoQXJyYXkuaXNBcnJheShrZXlOb2RlKSkge1xuICAgIGtleU5vZGUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChrZXlOb2RlKTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMCwgcXVhbnRpdHkgPSBrZXlOb2RlLmxlbmd0aDsgaW5kZXggPCBxdWFudGl0eTsgaW5kZXgrKykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5Tm9kZVtpbmRleF0pKSB7XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKHN0YXRlLCBcIm5lc3RlZCBhcnJheXMgYXJlIG5vdCBzdXBwb3J0ZWQgaW5zaWRlIGtleXNcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIGtleU5vZGUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgX2NsYXNzKGtleU5vZGVbaW5kZXhdKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIlxuICAgICAgKSB7XG4gICAgICAgIGtleU5vZGVbaW5kZXhdID0gXCJbb2JqZWN0IE9iamVjdF1cIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBBdm9pZCBjb2RlIGV4ZWN1dGlvbiBpbiBsb2FkKCkgdmlhIHRvU3RyaW5nIHByb3BlcnR5XG4gIC8vIChzdGlsbCB1c2UgaXRzIG93biB0b1N0cmluZyBmb3IgYXJyYXlzLCB0aW1lc3RhbXBzLFxuICAvLyBhbmQgd2hhdGV2ZXIgdXNlciBzY2hlbWEgZXh0ZW5zaW9ucyBoYXBwZW4gdG8gaGF2ZSBAQHRvU3RyaW5nVGFnKVxuICBpZiAodHlwZW9mIGtleU5vZGUgPT09IFwib2JqZWN0XCIgJiYgX2NsYXNzKGtleU5vZGUpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG4gICAga2V5Tm9kZSA9IFwiW29iamVjdCBPYmplY3RdXCI7XG4gIH1cblxuICBrZXlOb2RlID0gU3RyaW5nKGtleU5vZGUpO1xuXG4gIGlmIChyZXN1bHQgPT09IG51bGwpIHtcbiAgICByZXN1bHQgPSB7fTtcbiAgfVxuXG4gIGlmIChrZXlUYWcgPT09IFwidGFnOnlhbWwub3JnLDIwMDI6bWVyZ2VcIikge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlTm9kZSkpIHtcbiAgICAgIGZvciAoXG4gICAgICAgIGxldCBpbmRleCA9IDAsIHF1YW50aXR5ID0gdmFsdWVOb2RlLmxlbmd0aDtcbiAgICAgICAgaW5kZXggPCBxdWFudGl0eTtcbiAgICAgICAgaW5kZXgrK1xuICAgICAgKSB7XG4gICAgICAgIG1lcmdlTWFwcGluZ3Moc3RhdGUsIHJlc3VsdCwgdmFsdWVOb2RlW2luZGV4XSwgb3ZlcnJpZGFibGVLZXlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWVyZ2VNYXBwaW5ncyhzdGF0ZSwgcmVzdWx0LCB2YWx1ZU5vZGUgYXMgQXJyYXlPYmplY3QsIG92ZXJyaWRhYmxlS2V5cyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChcbiAgICAgICFzdGF0ZS5qc29uICYmXG4gICAgICAhaGFzT3duKG92ZXJyaWRhYmxlS2V5cywga2V5Tm9kZSkgJiZcbiAgICAgIGhhc093bihyZXN1bHQsIGtleU5vZGUpXG4gICAgKSB7XG4gICAgICBzdGF0ZS5saW5lID0gc3RhcnRMaW5lIHx8IHN0YXRlLmxpbmU7XG4gICAgICBzdGF0ZS5wb3NpdGlvbiA9IHN0YXJ0UG9zIHx8IHN0YXRlLnBvc2l0aW9uO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3Ioc3RhdGUsIFwiZHVwbGljYXRlZCBtYXBwaW5nIGtleVwiKTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5Tm9kZSwge1xuICAgICAgdmFsdWU6IHZhbHVlTm9kZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB9KTtcbiAgICBkZWxldGUgb3ZlcnJpZGFibGVLZXlzW2tleU5vZGVdO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcmVhZExpbmVCcmVhayhzdGF0ZTogTG9hZGVyU3RhdGUpIHtcbiAgY29uc3QgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoY2ggPT09IDB4MGEgLyogTEYgKi8pIHtcbiAgICBzdGF0ZS5wb3NpdGlvbisrO1xuICB9IGVsc2UgaWYgKGNoID09PSAweDBkIC8qIENSICovKSB7XG4gICAgc3RhdGUucG9zaXRpb24rKztcbiAgICBpZiAoc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbikgPT09IDB4MGEgLyogTEYgKi8pIHtcbiAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aHJvd0Vycm9yKHN0YXRlLCBcImEgbGluZSBicmVhayBpcyBleHBlY3RlZFwiKTtcbiAgfVxuXG4gIHN0YXRlLmxpbmUgKz0gMTtcbiAgc3RhdGUubGluZVN0YXJ0ID0gc3RhdGUucG9zaXRpb247XG59XG5cbmZ1bmN0aW9uIHNraXBTZXBhcmF0aW9uU3BhY2UoXG4gIHN0YXRlOiBMb2FkZXJTdGF0ZSxcbiAgYWxsb3dDb21tZW50czogYm9vbGVhbixcbiAgY2hlY2tJbmRlbnQ6IG51bWJlcixcbik6IG51bWJlciB7XG4gIGxldCBsaW5lQnJlYWtzID0gMCxcbiAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIHdoaWxlIChjaCAhPT0gMCkge1xuICAgIHdoaWxlIChpc1doaXRlU3BhY2UoY2gpKSB7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKGFsbG93Q29tbWVudHMgJiYgY2ggPT09IDB4MjMgLyogIyAqLykge1xuICAgICAgZG8ge1xuICAgICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgICB9IHdoaWxlIChjaCAhPT0gMHgwYSAmJiAvKiBMRiAqLyBjaCAhPT0gMHgwZCAmJiAvKiBDUiAqLyBjaCAhPT0gMCk7XG4gICAgfVxuXG4gICAgaWYgKGlzRU9MKGNoKSkge1xuICAgICAgcmVhZExpbmVCcmVhayhzdGF0ZSk7XG5cbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG4gICAgICBsaW5lQnJlYWtzKys7XG4gICAgICBzdGF0ZS5saW5lSW5kZW50ID0gMDtcblxuICAgICAgd2hpbGUgKGNoID09PSAweDIwIC8qIFNwYWNlICovKSB7XG4gICAgICAgIHN0YXRlLmxpbmVJbmRlbnQrKztcbiAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoXG4gICAgY2hlY2tJbmRlbnQgIT09IC0xICYmXG4gICAgbGluZUJyZWFrcyAhPT0gMCAmJlxuICAgIHN0YXRlLmxpbmVJbmRlbnQgPCBjaGVja0luZGVudFxuICApIHtcbiAgICB0aHJvd1dhcm5pbmcoc3RhdGUsIFwiZGVmaWNpZW50IGluZGVudGF0aW9uXCIpO1xuICB9XG5cbiAgcmV0dXJuIGxpbmVCcmVha3M7XG59XG5cbmZ1bmN0aW9uIHRlc3REb2N1bWVudFNlcGFyYXRvcihzdGF0ZTogTG9hZGVyU3RhdGUpOiBib29sZWFuIHtcbiAgbGV0IF9wb3NpdGlvbiA9IHN0YXRlLnBvc2l0aW9uO1xuICBsZXQgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KF9wb3NpdGlvbik7XG5cbiAgLy8gQ29uZGl0aW9uIHN0YXRlLnBvc2l0aW9uID09PSBzdGF0ZS5saW5lU3RhcnQgaXMgdGVzdGVkXG4gIC8vIGluIHBhcmVudCBvbiBlYWNoIGNhbGwsIGZvciBlZmZpY2llbmN5LiBObyBuZWVkcyB0byB0ZXN0IGhlcmUgYWdhaW4uXG4gIGlmIChcbiAgICAoY2ggPT09IDB4MmQgfHwgLyogLSAqLyBjaCA9PT0gMHgyZSkgLyogLiAqLyAmJlxuICAgIGNoID09PSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KF9wb3NpdGlvbiArIDEpICYmXG4gICAgY2ggPT09IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoX3Bvc2l0aW9uICsgMilcbiAgKSB7XG4gICAgX3Bvc2l0aW9uICs9IDM7XG5cbiAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoX3Bvc2l0aW9uKTtcblxuICAgIGlmIChjaCA9PT0gMCB8fCBpc1dzT3JFb2woY2gpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHdyaXRlRm9sZGVkTGluZXMoc3RhdGU6IExvYWRlclN0YXRlLCBjb3VudDogbnVtYmVyKSB7XG4gIGlmIChjb3VudCA9PT0gMSkge1xuICAgIHN0YXRlLnJlc3VsdCArPSBcIiBcIjtcbiAgfSBlbHNlIGlmIChjb3VudCA+IDEpIHtcbiAgICBzdGF0ZS5yZXN1bHQgKz0gY29tbW9uLnJlcGVhdChcIlxcblwiLCBjb3VudCAtIDEpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlYWRQbGFpblNjYWxhcihcbiAgc3RhdGU6IExvYWRlclN0YXRlLFxuICBub2RlSW5kZW50OiBudW1iZXIsXG4gIHdpdGhpbkZsb3dDb2xsZWN0aW9uOiBib29sZWFuLFxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IGtpbmQgPSBzdGF0ZS5raW5kO1xuICBjb25zdCByZXN1bHQgPSBzdGF0ZS5yZXN1bHQ7XG4gIGxldCBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIGlmIChcbiAgICBpc1dzT3JFb2woY2gpIHx8XG4gICAgaXNGbG93SW5kaWNhdG9yKGNoKSB8fFxuICAgIGNoID09PSAweDIzIC8qICMgKi8gfHxcbiAgICBjaCA9PT0gMHgyNiAvKiAmICovIHx8XG4gICAgY2ggPT09IDB4MmEgLyogKiAqLyB8fFxuICAgIGNoID09PSAweDIxIC8qICEgKi8gfHxcbiAgICBjaCA9PT0gMHg3YyAvKiB8ICovIHx8XG4gICAgY2ggPT09IDB4M2UgLyogPiAqLyB8fFxuICAgIGNoID09PSAweDI3IC8qICcgKi8gfHxcbiAgICBjaCA9PT0gMHgyMiAvKiBcIiAqLyB8fFxuICAgIGNoID09PSAweDI1IC8qICUgKi8gfHxcbiAgICBjaCA9PT0gMHg0MCAvKiBAICovIHx8XG4gICAgY2ggPT09IDB4NjAgLyogYCAqL1xuICApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBsZXQgZm9sbG93aW5nOiBudW1iZXI7XG4gIGlmIChjaCA9PT0gMHgzZiB8fCAvKiA/ICovIGNoID09PSAweDJkIC8qIC0gKi8pIHtcbiAgICBmb2xsb3dpbmcgPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uICsgMSk7XG5cbiAgICBpZiAoXG4gICAgICBpc1dzT3JFb2woZm9sbG93aW5nKSB8fFxuICAgICAgKHdpdGhpbkZsb3dDb2xsZWN0aW9uICYmIGlzRmxvd0luZGljYXRvcihmb2xsb3dpbmcpKVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRlLmtpbmQgPSBcInNjYWxhclwiO1xuICBzdGF0ZS5yZXN1bHQgPSBcIlwiO1xuICBsZXQgY2FwdHVyZUVuZDogbnVtYmVyLFxuICAgIGNhcHR1cmVTdGFydCA9IChjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb24pO1xuICBsZXQgaGFzUGVuZGluZ0NvbnRlbnQgPSBmYWxzZTtcbiAgbGV0IGxpbmUgPSAwO1xuICB3aGlsZSAoY2ggIT09IDApIHtcbiAgICBpZiAoY2ggPT09IDB4M2EgLyogOiAqLykge1xuICAgICAgZm9sbG93aW5nID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbiArIDEpO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGlzV3NPckVvbChmb2xsb3dpbmcpIHx8XG4gICAgICAgICh3aXRoaW5GbG93Q29sbGVjdGlvbiAmJiBpc0Zsb3dJbmRpY2F0b3IoZm9sbG93aW5nKSlcbiAgICAgICkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNoID09PSAweDIzIC8qICMgKi8pIHtcbiAgICAgIGNvbnN0IHByZWNlZGluZyA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24gLSAxKTtcblxuICAgICAgaWYgKGlzV3NPckVvbChwcmVjZWRpbmcpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICAoc3RhdGUucG9zaXRpb24gPT09IHN0YXRlLmxpbmVTdGFydCAmJiB0ZXN0RG9jdW1lbnRTZXBhcmF0b3Ioc3RhdGUpKSB8fFxuICAgICAgKHdpdGhpbkZsb3dDb2xsZWN0aW9uICYmIGlzRmxvd0luZGljYXRvcihjaCkpXG4gICAgKSB7XG4gICAgICBicmVhaztcbiAgICB9IGVsc2UgaWYgKGlzRU9MKGNoKSkge1xuICAgICAgbGluZSA9IHN0YXRlLmxpbmU7XG4gICAgICBjb25zdCBsaW5lU3RhcnQgPSBzdGF0ZS5saW5lU3RhcnQ7XG4gICAgICBjb25zdCBsaW5lSW5kZW50ID0gc3RhdGUubGluZUluZGVudDtcbiAgICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIGZhbHNlLCAtMSk7XG5cbiAgICAgIGlmIChzdGF0ZS5saW5lSW5kZW50ID49IG5vZGVJbmRlbnQpIHtcbiAgICAgICAgaGFzUGVuZGluZ0NvbnRlbnQgPSB0cnVlO1xuICAgICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnBvc2l0aW9uID0gY2FwdHVyZUVuZDtcbiAgICAgICAgc3RhdGUubGluZSA9IGxpbmU7XG4gICAgICAgIHN0YXRlLmxpbmVTdGFydCA9IGxpbmVTdGFydDtcbiAgICAgICAgc3RhdGUubGluZUluZGVudCA9IGxpbmVJbmRlbnQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNQZW5kaW5nQ29udGVudCkge1xuICAgICAgY2FwdHVyZVNlZ21lbnQoc3RhdGUsIGNhcHR1cmVTdGFydCwgY2FwdHVyZUVuZCwgZmFsc2UpO1xuICAgICAgd3JpdGVGb2xkZWRMaW5lcyhzdGF0ZSwgc3RhdGUubGluZSAtIGxpbmUpO1xuICAgICAgY2FwdHVyZVN0YXJ0ID0gY2FwdHVyZUVuZCA9IHN0YXRlLnBvc2l0aW9uO1xuICAgICAgaGFzUGVuZGluZ0NvbnRlbnQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIWlzV2hpdGVTcGFjZShjaCkpIHtcbiAgICAgIGNhcHR1cmVFbmQgPSBzdGF0ZS5wb3NpdGlvbiArIDE7XG4gICAgfVxuXG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICB9XG5cbiAgY2FwdHVyZVNlZ21lbnQoc3RhdGUsIGNhcHR1cmVTdGFydCwgY2FwdHVyZUVuZCwgZmFsc2UpO1xuXG4gIGlmIChzdGF0ZS5yZXN1bHQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHN0YXRlLmtpbmQgPSBraW5kO1xuICBzdGF0ZS5yZXN1bHQgPSByZXN1bHQ7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcmVhZFNpbmdsZVF1b3RlZFNjYWxhcihcbiAgc3RhdGU6IExvYWRlclN0YXRlLFxuICBub2RlSW5kZW50OiBudW1iZXIsXG4pOiBib29sZWFuIHtcbiAgbGV0IGNoLCBjYXB0dXJlU3RhcnQsIGNhcHR1cmVFbmQ7XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoY2ggIT09IDB4MjcgLyogJyAqLykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0YXRlLmtpbmQgPSBcInNjYWxhclwiO1xuICBzdGF0ZS5yZXN1bHQgPSBcIlwiO1xuICBzdGF0ZS5wb3NpdGlvbisrO1xuICBjYXB0dXJlU3RhcnQgPSBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG5cbiAgd2hpbGUgKChjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pKSAhPT0gMCkge1xuICAgIGlmIChjaCA9PT0gMHgyNyAvKiAnICovKSB7XG4gICAgICBjYXB0dXJlU2VnbWVudChzdGF0ZSwgY2FwdHVyZVN0YXJ0LCBzdGF0ZS5wb3NpdGlvbiwgdHJ1ZSk7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICAgIGlmIChjaCA9PT0gMHgyNyAvKiAnICovKSB7XG4gICAgICAgIGNhcHR1cmVTdGFydCA9IHN0YXRlLnBvc2l0aW9uO1xuICAgICAgICBzdGF0ZS5wb3NpdGlvbisrO1xuICAgICAgICBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzRU9MKGNoKSkge1xuICAgICAgY2FwdHVyZVNlZ21lbnQoc3RhdGUsIGNhcHR1cmVTdGFydCwgY2FwdHVyZUVuZCwgdHJ1ZSk7XG4gICAgICB3cml0ZUZvbGRlZExpbmVzKHN0YXRlLCBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCBmYWxzZSwgbm9kZUluZGVudCkpO1xuICAgICAgY2FwdHVyZVN0YXJ0ID0gY2FwdHVyZUVuZCA9IHN0YXRlLnBvc2l0aW9uO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBzdGF0ZS5wb3NpdGlvbiA9PT0gc3RhdGUubGluZVN0YXJ0ICYmXG4gICAgICB0ZXN0RG9jdW1lbnRTZXBhcmF0b3Ioc3RhdGUpXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIFwidW5leHBlY3RlZCBlbmQgb2YgdGhlIGRvY3VtZW50IHdpdGhpbiBhIHNpbmdsZSBxdW90ZWQgc2NhbGFyXCIsXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5wb3NpdGlvbisrO1xuICAgICAgY2FwdHVyZUVuZCA9IHN0YXRlLnBvc2l0aW9uO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aHJvd0Vycm9yKFxuICAgIHN0YXRlLFxuICAgIFwidW5leHBlY3RlZCBlbmQgb2YgdGhlIHN0cmVhbSB3aXRoaW4gYSBzaW5nbGUgcXVvdGVkIHNjYWxhclwiLFxuICApO1xufVxuXG5mdW5jdGlvbiByZWFkRG91YmxlUXVvdGVkU2NhbGFyKFxuICBzdGF0ZTogTG9hZGVyU3RhdGUsXG4gIG5vZGVJbmRlbnQ6IG51bWJlcixcbik6IGJvb2xlYW4ge1xuICBsZXQgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoY2ggIT09IDB4MjIgLyogXCIgKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdGF0ZS5raW5kID0gXCJzY2FsYXJcIjtcbiAgc3RhdGUucmVzdWx0ID0gXCJcIjtcbiAgc3RhdGUucG9zaXRpb24rKztcbiAgbGV0IGNhcHR1cmVFbmQ6IG51bWJlcixcbiAgICBjYXB0dXJlU3RhcnQgPSAoY2FwdHVyZUVuZCA9IHN0YXRlLnBvc2l0aW9uKTtcbiAgbGV0IHRtcDogbnVtYmVyO1xuICB3aGlsZSAoKGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbikpICE9PSAwKSB7XG4gICAgaWYgKGNoID09PSAweDIyIC8qIFwiICovKSB7XG4gICAgICBjYXB0dXJlU2VnbWVudChzdGF0ZSwgY2FwdHVyZVN0YXJ0LCBzdGF0ZS5wb3NpdGlvbiwgdHJ1ZSk7XG4gICAgICBzdGF0ZS5wb3NpdGlvbisrO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChjaCA9PT0gMHg1YyAvKiBcXCAqLykge1xuICAgICAgY2FwdHVyZVNlZ21lbnQoc3RhdGUsIGNhcHR1cmVTdGFydCwgc3RhdGUucG9zaXRpb24sIHRydWUpO1xuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuXG4gICAgICBpZiAoaXNFT0woY2gpKSB7XG4gICAgICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIGZhbHNlLCBub2RlSW5kZW50KTtcblxuICAgICAgICAvLyBUT0RPKGJhcnRsb21pZWp1KTogcmV3b3JrIHRvIGlubGluZSBmbiB3aXRoIG5vIHR5cGUgY2FzdD9cbiAgICAgIH0gZWxzZSBpZiAoY2ggPCAyNTYgJiYgc2ltcGxlRXNjYXBlQ2hlY2tbY2hdKSB7XG4gICAgICAgIHN0YXRlLnJlc3VsdCArPSBzaW1wbGVFc2NhcGVNYXBbY2hdO1xuICAgICAgICBzdGF0ZS5wb3NpdGlvbisrO1xuICAgICAgfSBlbHNlIGlmICgodG1wID0gZXNjYXBlZEhleExlbihjaCkpID4gMCkge1xuICAgICAgICBsZXQgaGV4TGVuZ3RoID0gdG1wO1xuICAgICAgICBsZXQgaGV4UmVzdWx0ID0gMDtcblxuICAgICAgICBmb3IgKDsgaGV4TGVuZ3RoID4gMDsgaGV4TGVuZ3RoLS0pIHtcbiAgICAgICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICAgICAgICBpZiAoKHRtcCA9IGZyb21IZXhDb2RlKGNoKSkgPj0gMCkge1xuICAgICAgICAgICAgaGV4UmVzdWx0ID0gKGhleFJlc3VsdCA8PCA0KSArIHRtcDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3Ioc3RhdGUsIFwiZXhwZWN0ZWQgaGV4YWRlY2ltYWwgY2hhcmFjdGVyXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlLnJlc3VsdCArPSBjaGFyRnJvbUNvZGVwb2ludChoZXhSZXN1bHQpO1xuXG4gICAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihzdGF0ZSwgXCJ1bmtub3duIGVzY2FwZSBzZXF1ZW5jZVwiKTtcbiAgICAgIH1cblxuICAgICAgY2FwdHVyZVN0YXJ0ID0gY2FwdHVyZUVuZCA9IHN0YXRlLnBvc2l0aW9uO1xuICAgIH0gZWxzZSBpZiAoaXNFT0woY2gpKSB7XG4gICAgICBjYXB0dXJlU2VnbWVudChzdGF0ZSwgY2FwdHVyZVN0YXJ0LCBjYXB0dXJlRW5kLCB0cnVlKTtcbiAgICAgIHdyaXRlRm9sZGVkTGluZXMoc3RhdGUsIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIGZhbHNlLCBub2RlSW5kZW50KSk7XG4gICAgICBjYXB0dXJlU3RhcnQgPSBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHN0YXRlLnBvc2l0aW9uID09PSBzdGF0ZS5saW5lU3RhcnQgJiZcbiAgICAgIHRlc3REb2N1bWVudFNlcGFyYXRvcihzdGF0ZSlcbiAgICApIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKFxuICAgICAgICBzdGF0ZSxcbiAgICAgICAgXCJ1bmV4cGVjdGVkIGVuZCBvZiB0aGUgZG9jdW1lbnQgd2l0aGluIGEgZG91YmxlIHF1b3RlZCBzY2FsYXJcIixcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgICBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRocm93RXJyb3IoXG4gICAgc3RhdGUsXG4gICAgXCJ1bmV4cGVjdGVkIGVuZCBvZiB0aGUgc3RyZWFtIHdpdGhpbiBhIGRvdWJsZSBxdW90ZWQgc2NhbGFyXCIsXG4gICk7XG59XG5cbmZ1bmN0aW9uIHJlYWRGbG93Q29sbGVjdGlvbihzdGF0ZTogTG9hZGVyU3RhdGUsIG5vZGVJbmRlbnQ6IG51bWJlcik6IGJvb2xlYW4ge1xuICBsZXQgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcbiAgbGV0IHRlcm1pbmF0b3I6IG51bWJlcjtcbiAgbGV0IGlzTWFwcGluZyA9IHRydWU7XG4gIGxldCByZXN1bHQ6IFJlc3VsdFR5cGUgPSB7fTtcbiAgaWYgKGNoID09PSAweDViIC8qIFsgKi8pIHtcbiAgICB0ZXJtaW5hdG9yID0gMHg1ZDsgLyogXSAqL1xuICAgIGlzTWFwcGluZyA9IGZhbHNlO1xuICAgIHJlc3VsdCA9IFtdO1xuICB9IGVsc2UgaWYgKGNoID09PSAweDdiIC8qIHsgKi8pIHtcbiAgICB0ZXJtaW5hdG9yID0gMHg3ZDsgLyogfSAqL1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChcbiAgICBzdGF0ZS5hbmNob3IgIT09IG51bGwgJiZcbiAgICB0eXBlb2Ygc3RhdGUuYW5jaG9yICE9IFwidW5kZWZpbmVkXCIgJiZcbiAgICB0eXBlb2Ygc3RhdGUuYW5jaG9yTWFwICE9IFwidW5kZWZpbmVkXCJcbiAgKSB7XG4gICAgc3RhdGUuYW5jaG9yTWFwW3N0YXRlLmFuY2hvcl0gPSByZXN1bHQ7XG4gIH1cblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG5cbiAgY29uc3QgdGFnID0gc3RhdGUudGFnLFxuICAgIGFuY2hvciA9IHN0YXRlLmFuY2hvcjtcbiAgbGV0IHJlYWROZXh0ID0gdHJ1ZTtcbiAgbGV0IHZhbHVlTm9kZSxcbiAgICBrZXlOb2RlLFxuICAgIGtleVRhZzogc3RyaW5nIHwgbnVsbCA9IChrZXlOb2RlID0gdmFsdWVOb2RlID0gbnVsbCksXG4gICAgaXNFeHBsaWNpdFBhaXI6IGJvb2xlYW4sXG4gICAgaXNQYWlyID0gKGlzRXhwbGljaXRQYWlyID0gZmFsc2UpO1xuICBsZXQgZm9sbG93aW5nID0gMCxcbiAgICBsaW5lID0gMDtcbiAgY29uc3Qgb3ZlcnJpZGFibGVLZXlzOiBBcnJheU9iamVjdDxib29sZWFuPiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHdoaWxlIChjaCAhPT0gMCkge1xuICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIG5vZGVJbmRlbnQpO1xuXG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICAgIGlmIChjaCA9PT0gdGVybWluYXRvcikge1xuICAgICAgc3RhdGUucG9zaXRpb24rKztcbiAgICAgIHN0YXRlLnRhZyA9IHRhZztcbiAgICAgIHN0YXRlLmFuY2hvciA9IGFuY2hvcjtcbiAgICAgIHN0YXRlLmtpbmQgPSBpc01hcHBpbmcgPyBcIm1hcHBpbmdcIiA6IFwic2VxdWVuY2VcIjtcbiAgICAgIHN0YXRlLnJlc3VsdCA9IHJlc3VsdDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXJlYWROZXh0KSB7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihzdGF0ZSwgXCJtaXNzZWQgY29tbWEgYmV0d2VlbiBmbG93IGNvbGxlY3Rpb24gZW50cmllc1wiKTtcbiAgICB9XG5cbiAgICBrZXlUYWcgPSBrZXlOb2RlID0gdmFsdWVOb2RlID0gbnVsbDtcbiAgICBpc1BhaXIgPSBpc0V4cGxpY2l0UGFpciA9IGZhbHNlO1xuXG4gICAgaWYgKGNoID09PSAweDNmIC8qID8gKi8pIHtcbiAgICAgIGZvbGxvd2luZyA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24gKyAxKTtcblxuICAgICAgaWYgKGlzV3NPckVvbChmb2xsb3dpbmcpKSB7XG4gICAgICAgIGlzUGFpciA9IGlzRXhwbGljaXRQYWlyID0gdHJ1ZTtcbiAgICAgICAgc3RhdGUucG9zaXRpb24rKztcbiAgICAgICAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgbm9kZUluZGVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGluZSA9IHN0YXRlLmxpbmU7XG4gICAgY29tcG9zZU5vZGUoc3RhdGUsIG5vZGVJbmRlbnQsIENPTlRFWFRfRkxPV19JTiwgZmFsc2UsIHRydWUpO1xuICAgIGtleVRhZyA9IHN0YXRlLnRhZyB8fCBudWxsO1xuICAgIGtleU5vZGUgPSBzdGF0ZS5yZXN1bHQ7XG4gICAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgbm9kZUluZGVudCk7XG5cbiAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gICAgaWYgKChpc0V4cGxpY2l0UGFpciB8fCBzdGF0ZS5saW5lID09PSBsaW5lKSAmJiBjaCA9PT0gMHgzYSAvKiA6ICovKSB7XG4gICAgICBpc1BhaXIgPSB0cnVlO1xuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgICAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgbm9kZUluZGVudCk7XG4gICAgICBjb21wb3NlTm9kZShzdGF0ZSwgbm9kZUluZGVudCwgQ09OVEVYVF9GTE9XX0lOLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICB2YWx1ZU5vZGUgPSBzdGF0ZS5yZXN1bHQ7XG4gICAgfVxuXG4gICAgaWYgKGlzTWFwcGluZykge1xuICAgICAgc3RvcmVNYXBwaW5nUGFpcihcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIHJlc3VsdCxcbiAgICAgICAgb3ZlcnJpZGFibGVLZXlzLFxuICAgICAgICBrZXlUYWcsXG4gICAgICAgIGtleU5vZGUsXG4gICAgICAgIHZhbHVlTm9kZSxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChpc1BhaXIpIHtcbiAgICAgIChyZXN1bHQgYXMgQXJyYXlPYmplY3RbXSkucHVzaChcbiAgICAgICAgc3RvcmVNYXBwaW5nUGFpcihcbiAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIG92ZXJyaWRhYmxlS2V5cyxcbiAgICAgICAgICBrZXlUYWcsXG4gICAgICAgICAga2V5Tm9kZSxcbiAgICAgICAgICB2YWx1ZU5vZGUsXG4gICAgICAgICksXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAocmVzdWx0IGFzIFJlc3VsdFR5cGVbXSkucHVzaChrZXlOb2RlIGFzIFJlc3VsdFR5cGUpO1xuICAgIH1cblxuICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIG5vZGVJbmRlbnQpO1xuXG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICAgIGlmIChjaCA9PT0gMHgyYyAvKiAsICovKSB7XG4gICAgICByZWFkTmV4dCA9IHRydWU7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYWROZXh0ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRocm93RXJyb3IoXG4gICAgc3RhdGUsXG4gICAgXCJ1bmV4cGVjdGVkIGVuZCBvZiB0aGUgc3RyZWFtIHdpdGhpbiBhIGZsb3cgY29sbGVjdGlvblwiLFxuICApO1xufVxuXG5mdW5jdGlvbiByZWFkQmxvY2tTY2FsYXIoc3RhdGU6IExvYWRlclN0YXRlLCBub2RlSW5kZW50OiBudW1iZXIpOiBib29sZWFuIHtcbiAgbGV0IGNob21waW5nID0gQ0hPTVBJTkdfQ0xJUCxcbiAgICBkaWRSZWFkQ29udGVudCA9IGZhbHNlLFxuICAgIGRldGVjdGVkSW5kZW50ID0gZmFsc2UsXG4gICAgdGV4dEluZGVudCA9IG5vZGVJbmRlbnQsXG4gICAgZW1wdHlMaW5lcyA9IDAsXG4gICAgYXRNb3JlSW5kZW50ZWQgPSBmYWxzZTtcblxuICBsZXQgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBsZXQgZm9sZGluZyA9IGZhbHNlO1xuICBpZiAoY2ggPT09IDB4N2MgLyogfCAqLykge1xuICAgIGZvbGRpbmcgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChjaCA9PT0gMHgzZSAvKiA+ICovKSB7XG4gICAgZm9sZGluZyA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RhdGUua2luZCA9IFwic2NhbGFyXCI7XG4gIHN0YXRlLnJlc3VsdCA9IFwiXCI7XG5cbiAgbGV0IHRtcCA9IDA7XG4gIHdoaWxlIChjaCAhPT0gMCkge1xuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcblxuICAgIGlmIChjaCA9PT0gMHgyYiB8fCAvKiArICovIGNoID09PSAweDJkIC8qIC0gKi8pIHtcbiAgICAgIGlmIChDSE9NUElOR19DTElQID09PSBjaG9tcGluZykge1xuICAgICAgICBjaG9tcGluZyA9IGNoID09PSAweDJiIC8qICsgKi8gPyBDSE9NUElOR19LRUVQIDogQ0hPTVBJTkdfU1RSSVA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihzdGF0ZSwgXCJyZXBlYXQgb2YgYSBjaG9tcGluZyBtb2RlIGlkZW50aWZpZXJcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgodG1wID0gZnJvbURlY2ltYWxDb2RlKGNoKSkgPj0gMCkge1xuICAgICAgaWYgKHRtcCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihcbiAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICBcImJhZCBleHBsaWNpdCBpbmRlbnRhdGlvbiB3aWR0aCBvZiBhIGJsb2NrIHNjYWxhcjsgaXQgY2Fubm90IGJlIGxlc3MgdGhhbiBvbmVcIixcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoIWRldGVjdGVkSW5kZW50KSB7XG4gICAgICAgIHRleHRJbmRlbnQgPSBub2RlSW5kZW50ICsgdG1wIC0gMTtcbiAgICAgICAgZGV0ZWN0ZWRJbmRlbnQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3Ioc3RhdGUsIFwicmVwZWF0IG9mIGFuIGluZGVudGF0aW9uIHdpZHRoIGlkZW50aWZpZXJcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChpc1doaXRlU3BhY2UoY2gpKSB7XG4gICAgZG8ge1xuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgIH0gd2hpbGUgKGlzV2hpdGVTcGFjZShjaCkpO1xuXG4gICAgaWYgKGNoID09PSAweDIzIC8qICMgKi8pIHtcbiAgICAgIGRvIHtcbiAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgICAgfSB3aGlsZSAoIWlzRU9MKGNoKSAmJiBjaCAhPT0gMCk7XG4gICAgfVxuICB9XG5cbiAgd2hpbGUgKGNoICE9PSAwKSB7XG4gICAgcmVhZExpbmVCcmVhayhzdGF0ZSk7XG4gICAgc3RhdGUubGluZUluZGVudCA9IDA7XG5cbiAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gICAgd2hpbGUgKFxuICAgICAgKCFkZXRlY3RlZEluZGVudCB8fCBzdGF0ZS5saW5lSW5kZW50IDwgdGV4dEluZGVudCkgJiZcbiAgICAgIGNoID09PSAweDIwIC8qIFNwYWNlICovXG4gICAgKSB7XG4gICAgICBzdGF0ZS5saW5lSW5kZW50Kys7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKCFkZXRlY3RlZEluZGVudCAmJiBzdGF0ZS5saW5lSW5kZW50ID4gdGV4dEluZGVudCkge1xuICAgICAgdGV4dEluZGVudCA9IHN0YXRlLmxpbmVJbmRlbnQ7XG4gICAgfVxuXG4gICAgaWYgKGlzRU9MKGNoKSkge1xuICAgICAgZW1wdHlMaW5lcysrO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gRW5kIG9mIHRoZSBzY2FsYXIuXG4gICAgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPCB0ZXh0SW5kZW50KSB7XG4gICAgICAvLyBQZXJmb3JtIHRoZSBjaG9tcGluZy5cbiAgICAgIGlmIChjaG9tcGluZyA9PT0gQ0hPTVBJTkdfS0VFUCkge1xuICAgICAgICBzdGF0ZS5yZXN1bHQgKz0gY29tbW9uLnJlcGVhdChcbiAgICAgICAgICBcIlxcblwiLFxuICAgICAgICAgIGRpZFJlYWRDb250ZW50ID8gMSArIGVtcHR5TGluZXMgOiBlbXB0eUxpbmVzLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChjaG9tcGluZyA9PT0gQ0hPTVBJTkdfQ0xJUCkge1xuICAgICAgICBpZiAoZGlkUmVhZENvbnRlbnQpIHtcbiAgICAgICAgICAvLyBpLmUuIG9ubHkgaWYgdGhlIHNjYWxhciBpcyBub3QgZW1wdHkuXG4gICAgICAgICAgc3RhdGUucmVzdWx0ICs9IFwiXFxuXCI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQnJlYWsgdGhpcyBgd2hpbGVgIGN5Y2xlIGFuZCBnbyB0byB0aGUgZnVuY3Rpb24ncyBlcGlsb2d1ZS5cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIEZvbGRlZCBzdHlsZTogdXNlIGZhbmN5IHJ1bGVzIHRvIGhhbmRsZSBsaW5lIGJyZWFrcy5cbiAgICBpZiAoZm9sZGluZykge1xuICAgICAgLy8gTGluZXMgc3RhcnRpbmcgd2l0aCB3aGl0ZSBzcGFjZSBjaGFyYWN0ZXJzIChtb3JlLWluZGVudGVkIGxpbmVzKSBhcmUgbm90IGZvbGRlZC5cbiAgICAgIGlmIChpc1doaXRlU3BhY2UoY2gpKSB7XG4gICAgICAgIGF0TW9yZUluZGVudGVkID0gdHJ1ZTtcbiAgICAgICAgLy8gZXhjZXB0IGZvciB0aGUgZmlyc3QgY29udGVudCBsaW5lIChjZi4gRXhhbXBsZSA4LjEpXG4gICAgICAgIHN0YXRlLnJlc3VsdCArPSBjb21tb24ucmVwZWF0KFxuICAgICAgICAgIFwiXFxuXCIsXG4gICAgICAgICAgZGlkUmVhZENvbnRlbnQgPyAxICsgZW1wdHlMaW5lcyA6IGVtcHR5TGluZXMsXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gRW5kIG9mIG1vcmUtaW5kZW50ZWQgYmxvY2suXG4gICAgICB9IGVsc2UgaWYgKGF0TW9yZUluZGVudGVkKSB7XG4gICAgICAgIGF0TW9yZUluZGVudGVkID0gZmFsc2U7XG4gICAgICAgIHN0YXRlLnJlc3VsdCArPSBjb21tb24ucmVwZWF0KFwiXFxuXCIsIGVtcHR5TGluZXMgKyAxKTtcblxuICAgICAgICAvLyBKdXN0IG9uZSBsaW5lIGJyZWFrIC0gcGVyY2VpdmUgYXMgdGhlIHNhbWUgbGluZS5cbiAgICAgIH0gZWxzZSBpZiAoZW1wdHlMaW5lcyA9PT0gMCkge1xuICAgICAgICBpZiAoZGlkUmVhZENvbnRlbnQpIHtcbiAgICAgICAgICAvLyBpLmUuIG9ubHkgaWYgd2UgaGF2ZSBhbHJlYWR5IHJlYWQgc29tZSBzY2FsYXIgY29udGVudC5cbiAgICAgICAgICBzdGF0ZS5yZXN1bHQgKz0gXCIgXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXZlcmFsIGxpbmUgYnJlYWtzIC0gcGVyY2VpdmUgYXMgZGlmZmVyZW50IGxpbmVzLlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdGUucmVzdWx0ICs9IGNvbW1vbi5yZXBlYXQoXCJcXG5cIiwgZW1wdHlMaW5lcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIExpdGVyYWwgc3R5bGU6IGp1c3QgYWRkIGV4YWN0IG51bWJlciBvZiBsaW5lIGJyZWFrcyBiZXR3ZWVuIGNvbnRlbnQgbGluZXMuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEtlZXAgYWxsIGxpbmUgYnJlYWtzIGV4Y2VwdCB0aGUgaGVhZGVyIGxpbmUgYnJlYWsuXG4gICAgICBzdGF0ZS5yZXN1bHQgKz0gY29tbW9uLnJlcGVhdChcbiAgICAgICAgXCJcXG5cIixcbiAgICAgICAgZGlkUmVhZENvbnRlbnQgPyAxICsgZW1wdHlMaW5lcyA6IGVtcHR5TGluZXMsXG4gICAgICApO1xuICAgIH1cblxuICAgIGRpZFJlYWRDb250ZW50ID0gdHJ1ZTtcbiAgICBkZXRlY3RlZEluZGVudCA9IHRydWU7XG4gICAgZW1wdHlMaW5lcyA9IDA7XG4gICAgY29uc3QgY2FwdHVyZVN0YXJ0ID0gc3RhdGUucG9zaXRpb247XG5cbiAgICB3aGlsZSAoIWlzRU9MKGNoKSAmJiBjaCAhPT0gMCkge1xuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgIH1cblxuICAgIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBjYXB0dXJlU3RhcnQsIHN0YXRlLnBvc2l0aW9uLCBmYWxzZSk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcmVhZEJsb2NrU2VxdWVuY2Uoc3RhdGU6IExvYWRlclN0YXRlLCBub2RlSW5kZW50OiBudW1iZXIpOiBib29sZWFuIHtcbiAgbGV0IGxpbmU6IG51bWJlcixcbiAgICBmb2xsb3dpbmc6IG51bWJlcixcbiAgICBkZXRlY3RlZCA9IGZhbHNlLFxuICAgIGNoOiBudW1iZXI7XG4gIGNvbnN0IHRhZyA9IHN0YXRlLnRhZyxcbiAgICBhbmNob3IgPSBzdGF0ZS5hbmNob3IsXG4gICAgcmVzdWx0OiB1bmtub3duW10gPSBbXTtcblxuICBpZiAoXG4gICAgc3RhdGUuYW5jaG9yICE9PSBudWxsICYmXG4gICAgdHlwZW9mIHN0YXRlLmFuY2hvciAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgIHR5cGVvZiBzdGF0ZS5hbmNob3JNYXAgIT09IFwidW5kZWZpbmVkXCJcbiAgKSB7XG4gICAgc3RhdGUuYW5jaG9yTWFwW3N0YXRlLmFuY2hvcl0gPSByZXN1bHQ7XG4gIH1cblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIHdoaWxlIChjaCAhPT0gMCkge1xuICAgIGlmIChjaCAhPT0gMHgyZCAvKiAtICovKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBmb2xsb3dpbmcgPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uICsgMSk7XG5cbiAgICBpZiAoIWlzV3NPckVvbChmb2xsb3dpbmcpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBkZXRlY3RlZCA9IHRydWU7XG4gICAgc3RhdGUucG9zaXRpb24rKztcblxuICAgIGlmIChza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCAtMSkpIHtcbiAgICAgIGlmIChzdGF0ZS5saW5lSW5kZW50IDw9IG5vZGVJbmRlbnQpIHtcbiAgICAgICAgcmVzdWx0LnB1c2gobnVsbCk7XG4gICAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxpbmUgPSBzdGF0ZS5saW5lO1xuICAgIGNvbXBvc2VOb2RlKHN0YXRlLCBub2RlSW5kZW50LCBDT05URVhUX0JMT0NLX0lOLCBmYWxzZSwgdHJ1ZSk7XG4gICAgcmVzdWx0LnB1c2goc3RhdGUucmVzdWx0KTtcbiAgICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCAtMSk7XG5cbiAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gICAgaWYgKChzdGF0ZS5saW5lID09PSBsaW5lIHx8IHN0YXRlLmxpbmVJbmRlbnQgPiBub2RlSW5kZW50KSAmJiBjaCAhPT0gMCkge1xuICAgICAgcmV0dXJuIHRocm93RXJyb3Ioc3RhdGUsIFwiYmFkIGluZGVudGF0aW9uIG9mIGEgc2VxdWVuY2UgZW50cnlcIik7XG4gICAgfSBlbHNlIGlmIChzdGF0ZS5saW5lSW5kZW50IDwgbm9kZUluZGVudCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKGRldGVjdGVkKSB7XG4gICAgc3RhdGUudGFnID0gdGFnO1xuICAgIHN0YXRlLmFuY2hvciA9IGFuY2hvcjtcbiAgICBzdGF0ZS5raW5kID0gXCJzZXF1ZW5jZVwiO1xuICAgIHN0YXRlLnJlc3VsdCA9IHJlc3VsdDtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9ja01hcHBpbmcoXG4gIHN0YXRlOiBMb2FkZXJTdGF0ZSxcbiAgbm9kZUluZGVudDogbnVtYmVyLFxuICBmbG93SW5kZW50OiBudW1iZXIsXG4pOiBib29sZWFuIHtcbiAgY29uc3QgdGFnID0gc3RhdGUudGFnLFxuICAgIGFuY2hvciA9IHN0YXRlLmFuY2hvcixcbiAgICByZXN1bHQgPSB7fSxcbiAgICBvdmVycmlkYWJsZUtleXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBsZXQgZm9sbG93aW5nOiBudW1iZXIsXG4gICAgYWxsb3dDb21wYWN0ID0gZmFsc2UsXG4gICAgbGluZTogbnVtYmVyLFxuICAgIHBvczogbnVtYmVyLFxuICAgIGtleVRhZyA9IG51bGwsXG4gICAga2V5Tm9kZSA9IG51bGwsXG4gICAgdmFsdWVOb2RlID0gbnVsbCxcbiAgICBhdEV4cGxpY2l0S2V5ID0gZmFsc2UsXG4gICAgZGV0ZWN0ZWQgPSBmYWxzZSxcbiAgICBjaDogbnVtYmVyO1xuXG4gIGlmIChcbiAgICBzdGF0ZS5hbmNob3IgIT09IG51bGwgJiZcbiAgICB0eXBlb2Ygc3RhdGUuYW5jaG9yICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgdHlwZW9mIHN0YXRlLmFuY2hvck1hcCAhPT0gXCJ1bmRlZmluZWRcIlxuICApIHtcbiAgICBzdGF0ZS5hbmNob3JNYXBbc3RhdGUuYW5jaG9yXSA9IHJlc3VsdDtcbiAgfVxuXG4gIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgd2hpbGUgKGNoICE9PSAwKSB7XG4gICAgZm9sbG93aW5nID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbiArIDEpO1xuICAgIGxpbmUgPSBzdGF0ZS5saW5lOyAvLyBTYXZlIHRoZSBjdXJyZW50IGxpbmUuXG4gICAgcG9zID0gc3RhdGUucG9zaXRpb247XG5cbiAgICAvL1xuICAgIC8vIEV4cGxpY2l0IG5vdGF0aW9uIGNhc2UuIFRoZXJlIGFyZSB0d28gc2VwYXJhdGUgYmxvY2tzOlxuICAgIC8vIGZpcnN0IGZvciB0aGUga2V5IChkZW5vdGVkIGJ5IFwiP1wiKSBhbmQgc2Vjb25kIGZvciB0aGUgdmFsdWUgKGRlbm90ZWQgYnkgXCI6XCIpXG4gICAgLy9cbiAgICBpZiAoKGNoID09PSAweDNmIHx8IC8qID8gKi8gY2ggPT09IDB4M2EpICYmIC8qIDogKi8gaXNXc09yRW9sKGZvbGxvd2luZykpIHtcbiAgICAgIGlmIChjaCA9PT0gMHgzZiAvKiA/ICovKSB7XG4gICAgICAgIGlmIChhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgICAgc3RvcmVNYXBwaW5nUGFpcihcbiAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgICAgb3ZlcnJpZGFibGVLZXlzLFxuICAgICAgICAgICAga2V5VGFnIGFzIHN0cmluZyxcbiAgICAgICAgICAgIGtleU5vZGUsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICk7XG4gICAgICAgICAga2V5VGFnID0ga2V5Tm9kZSA9IHZhbHVlTm9kZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBkZXRlY3RlZCA9IHRydWU7XG4gICAgICAgIGF0RXhwbGljaXRLZXkgPSB0cnVlO1xuICAgICAgICBhbGxvd0NvbXBhY3QgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgIC8vIGkuZS4gMHgzQS8qIDogKi8gPT09IGNoYXJhY3RlciBhZnRlciB0aGUgZXhwbGljaXQga2V5LlxuICAgICAgICBhdEV4cGxpY2l0S2V5ID0gZmFsc2U7XG4gICAgICAgIGFsbG93Q29tcGFjdCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihcbiAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICBcImluY29tcGxldGUgZXhwbGljaXQgbWFwcGluZyBwYWlyOyBhIGtleSBub2RlIGlzIG1pc3NlZDsgb3IgZm9sbG93ZWQgYnkgYSBub24tdGFidWxhdGVkIGVtcHR5IGxpbmVcIixcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgc3RhdGUucG9zaXRpb24gKz0gMTtcbiAgICAgIGNoID0gZm9sbG93aW5nO1xuXG4gICAgICAvL1xuICAgICAgLy8gSW1wbGljaXQgbm90YXRpb24gY2FzZS4gRmxvdy1zdHlsZSBub2RlIGFzIHRoZSBrZXkgZmlyc3QsIHRoZW4gXCI6XCIsIGFuZCB0aGUgdmFsdWUuXG4gICAgICAvL1xuICAgIH0gZWxzZSBpZiAoY29tcG9zZU5vZGUoc3RhdGUsIGZsb3dJbmRlbnQsIENPTlRFWFRfRkxPV19PVVQsIGZhbHNlLCB0cnVlKSkge1xuICAgICAgaWYgKHN0YXRlLmxpbmUgPT09IGxpbmUpIHtcbiAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICAgICAgICB3aGlsZSAoaXNXaGl0ZVNwYWNlKGNoKSkge1xuICAgICAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaCA9PT0gMHgzYSAvKiA6ICovKSB7XG4gICAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuXG4gICAgICAgICAgaWYgKCFpc1dzT3JFb2woY2gpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihcbiAgICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICAgIFwiYSB3aGl0ZXNwYWNlIGNoYXJhY3RlciBpcyBleHBlY3RlZCBhZnRlciB0aGUga2V5LXZhbHVlIHNlcGFyYXRvciB3aXRoaW4gYSBibG9jayBtYXBwaW5nXCIsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgICAgICBzdG9yZU1hcHBpbmdQYWlyKFxuICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgICAgICBvdmVycmlkYWJsZUtleXMsXG4gICAgICAgICAgICAgIGtleVRhZyBhcyBzdHJpbmcsXG4gICAgICAgICAgICAgIGtleU5vZGUsXG4gICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAga2V5VGFnID0ga2V5Tm9kZSA9IHZhbHVlTm9kZSA9IG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGV0ZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIGF0RXhwbGljaXRLZXkgPSBmYWxzZTtcbiAgICAgICAgICBhbGxvd0NvbXBhY3QgPSBmYWxzZTtcbiAgICAgICAgICBrZXlUYWcgPSBzdGF0ZS50YWc7XG4gICAgICAgICAga2V5Tm9kZSA9IHN0YXRlLnJlc3VsdDtcbiAgICAgICAgfSBlbHNlIGlmIChkZXRlY3RlZCkge1xuICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKFxuICAgICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgICBcImNhbiBub3QgcmVhZCBhbiBpbXBsaWNpdCBtYXBwaW5nIHBhaXI7IGEgY29sb24gaXMgbWlzc2VkXCIsXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGF0ZS50YWcgPSB0YWc7XG4gICAgICAgICAgc3RhdGUuYW5jaG9yID0gYW5jaG9yO1xuICAgICAgICAgIHJldHVybiB0cnVlOyAvLyBLZWVwIHRoZSByZXN1bHQgb2YgYGNvbXBvc2VOb2RlYC5cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChkZXRlY3RlZCkge1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihcbiAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICBcImNhbiBub3QgcmVhZCBhIGJsb2NrIG1hcHBpbmcgZW50cnk7IGEgbXVsdGlsaW5lIGtleSBtYXkgbm90IGJlIGFuIGltcGxpY2l0IGtleVwiLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdGUudGFnID0gdGFnO1xuICAgICAgICBzdGF0ZS5hbmNob3IgPSBhbmNob3I7XG4gICAgICAgIHJldHVybiB0cnVlOyAvLyBLZWVwIHRoZSByZXN1bHQgb2YgYGNvbXBvc2VOb2RlYC5cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7IC8vIFJlYWRpbmcgaXMgZG9uZS4gR28gdG8gdGhlIGVwaWxvZ3VlLlxuICAgIH1cblxuICAgIC8vXG4gICAgLy8gQ29tbW9uIHJlYWRpbmcgY29kZSBmb3IgYm90aCBleHBsaWNpdCBhbmQgaW1wbGljaXQgbm90YXRpb25zLlxuICAgIC8vXG4gICAgaWYgKHN0YXRlLmxpbmUgPT09IGxpbmUgfHwgc3RhdGUubGluZUluZGVudCA+IG5vZGVJbmRlbnQpIHtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcG9zZU5vZGUoc3RhdGUsIG5vZGVJbmRlbnQsIENPTlRFWFRfQkxPQ0tfT1VULCB0cnVlLCBhbGxvd0NvbXBhY3QpXG4gICAgICApIHtcbiAgICAgICAgaWYgKGF0RXhwbGljaXRLZXkpIHtcbiAgICAgICAgICBrZXlOb2RlID0gc3RhdGUucmVzdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlTm9kZSA9IHN0YXRlLnJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWF0RXhwbGljaXRLZXkpIHtcbiAgICAgICAgc3RvcmVNYXBwaW5nUGFpcihcbiAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICByZXN1bHQsXG4gICAgICAgICAgb3ZlcnJpZGFibGVLZXlzLFxuICAgICAgICAgIGtleVRhZyBhcyBzdHJpbmcsXG4gICAgICAgICAga2V5Tm9kZSxcbiAgICAgICAgICB2YWx1ZU5vZGUsXG4gICAgICAgICAgbGluZSxcbiAgICAgICAgICBwb3MsXG4gICAgICAgICk7XG4gICAgICAgIGtleVRhZyA9IGtleU5vZGUgPSB2YWx1ZU5vZGUgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCAtMSk7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuICAgIH1cblxuICAgIGlmIChzdGF0ZS5saW5lSW5kZW50ID4gbm9kZUluZGVudCAmJiBjaCAhPT0gMCkge1xuICAgICAgcmV0dXJuIHRocm93RXJyb3Ioc3RhdGUsIFwiYmFkIGluZGVudGF0aW9uIG9mIGEgbWFwcGluZyBlbnRyeVwiKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPCBub2RlSW5kZW50KSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvL1xuICAvLyBFcGlsb2d1ZS5cbiAgLy9cblxuICAvLyBTcGVjaWFsIGNhc2U6IGxhc3QgbWFwcGluZydzIG5vZGUgY29udGFpbnMgb25seSB0aGUga2V5IGluIGV4cGxpY2l0IG5vdGF0aW9uLlxuICBpZiAoYXRFeHBsaWNpdEtleSkge1xuICAgIHN0b3JlTWFwcGluZ1BhaXIoXG4gICAgICBzdGF0ZSxcbiAgICAgIHJlc3VsdCxcbiAgICAgIG92ZXJyaWRhYmxlS2V5cyxcbiAgICAgIGtleVRhZyBhcyBzdHJpbmcsXG4gICAgICBrZXlOb2RlLFxuICAgICAgbnVsbCxcbiAgICApO1xuICB9XG5cbiAgLy8gRXhwb3NlIHRoZSByZXN1bHRpbmcgbWFwcGluZy5cbiAgaWYgKGRldGVjdGVkKSB7XG4gICAgc3RhdGUudGFnID0gdGFnO1xuICAgIHN0YXRlLmFuY2hvciA9IGFuY2hvcjtcbiAgICBzdGF0ZS5raW5kID0gXCJtYXBwaW5nXCI7XG4gICAgc3RhdGUucmVzdWx0ID0gcmVzdWx0O1xuICB9XG5cbiAgcmV0dXJuIGRldGVjdGVkO1xufVxuXG5mdW5jdGlvbiByZWFkVGFnUHJvcGVydHkoc3RhdGU6IExvYWRlclN0YXRlKTogYm9vbGVhbiB7XG4gIGxldCBwb3NpdGlvbjogbnVtYmVyLFxuICAgIGlzVmVyYmF0aW0gPSBmYWxzZSxcbiAgICBpc05hbWVkID0gZmFsc2UsXG4gICAgdGFnSGFuZGxlID0gXCJcIixcbiAgICB0YWdOYW1lOiBzdHJpbmcsXG4gICAgY2g6IG51bWJlcjtcblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIGlmIChjaCAhPT0gMHgyMSAvKiAhICovKSByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHN0YXRlLnRhZyAhPT0gbnVsbCkge1xuICAgIHJldHVybiB0aHJvd0Vycm9yKHN0YXRlLCBcImR1cGxpY2F0aW9uIG9mIGEgdGFnIHByb3BlcnR5XCIpO1xuICB9XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuXG4gIGlmIChjaCA9PT0gMHgzYyAvKiA8ICovKSB7XG4gICAgaXNWZXJiYXRpbSA9IHRydWU7XG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICB9IGVsc2UgaWYgKGNoID09PSAweDIxIC8qICEgKi8pIHtcbiAgICBpc05hbWVkID0gdHJ1ZTtcbiAgICB0YWdIYW5kbGUgPSBcIiEhXCI7XG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICB9IGVsc2Uge1xuICAgIHRhZ0hhbmRsZSA9IFwiIVwiO1xuICB9XG5cbiAgcG9zaXRpb24gPSBzdGF0ZS5wb3NpdGlvbjtcblxuICBpZiAoaXNWZXJiYXRpbSkge1xuICAgIGRvIHtcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICB9IHdoaWxlIChjaCAhPT0gMCAmJiBjaCAhPT0gMHgzZSAvKiA+ICovKTtcblxuICAgIGlmIChzdGF0ZS5wb3NpdGlvbiA8IHN0YXRlLmxlbmd0aCkge1xuICAgICAgdGFnTmFtZSA9IHN0YXRlLmlucHV0LnNsaWNlKHBvc2l0aW9uLCBzdGF0ZS5wb3NpdGlvbik7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKFxuICAgICAgICBzdGF0ZSxcbiAgICAgICAgXCJ1bmV4cGVjdGVkIGVuZCBvZiB0aGUgc3RyZWFtIHdpdGhpbiBhIHZlcmJhdGltIHRhZ1wiLFxuICAgICAgKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKGNoICE9PSAwICYmICFpc1dzT3JFb2woY2gpKSB7XG4gICAgICBpZiAoY2ggPT09IDB4MjEgLyogISAqLykge1xuICAgICAgICBpZiAoIWlzTmFtZWQpIHtcbiAgICAgICAgICB0YWdIYW5kbGUgPSBzdGF0ZS5pbnB1dC5zbGljZShwb3NpdGlvbiAtIDEsIHN0YXRlLnBvc2l0aW9uICsgMSk7XG5cbiAgICAgICAgICBpZiAoIVBBVFRFUk5fVEFHX0hBTkRMRS50ZXN0KHRhZ0hhbmRsZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKFxuICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgXCJuYW1lZCB0YWcgaGFuZGxlIGNhbm5vdCBjb250YWluIHN1Y2ggY2hhcmFjdGVyc1wiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpc05hbWVkID0gdHJ1ZTtcbiAgICAgICAgICBwb3NpdGlvbiA9IHN0YXRlLnBvc2l0aW9uICsgMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihcbiAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgXCJ0YWcgc3VmZml4IGNhbm5vdCBjb250YWluIGV4Y2xhbWF0aW9uIG1hcmtzXCIsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgdGFnTmFtZSA9IHN0YXRlLmlucHV0LnNsaWNlKHBvc2l0aW9uLCBzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICBpZiAoUEFUVEVSTl9GTE9XX0lORElDQVRPUlMudGVzdCh0YWdOYW1lKSkge1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoXG4gICAgICAgIHN0YXRlLFxuICAgICAgICBcInRhZyBzdWZmaXggY2Fubm90IGNvbnRhaW4gZmxvdyBpbmRpY2F0b3IgY2hhcmFjdGVyc1wiLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZiAodGFnTmFtZSAmJiAhUEFUVEVSTl9UQUdfVVJJLnRlc3QodGFnTmFtZSkpIHtcbiAgICByZXR1cm4gdGhyb3dFcnJvcihcbiAgICAgIHN0YXRlLFxuICAgICAgYHRhZyBuYW1lIGNhbm5vdCBjb250YWluIHN1Y2ggY2hhcmFjdGVyczogJHt0YWdOYW1lfWAsXG4gICAgKTtcbiAgfVxuXG4gIGlmIChpc1ZlcmJhdGltKSB7XG4gICAgc3RhdGUudGFnID0gdGFnTmFtZTtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2Ygc3RhdGUudGFnTWFwICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgaGFzT3duKHN0YXRlLnRhZ01hcCwgdGFnSGFuZGxlKVxuICApIHtcbiAgICBzdGF0ZS50YWcgPSBzdGF0ZS50YWdNYXBbdGFnSGFuZGxlXSArIHRhZ05hbWU7XG4gIH0gZWxzZSBpZiAodGFnSGFuZGxlID09PSBcIiFcIikge1xuICAgIHN0YXRlLnRhZyA9IGAhJHt0YWdOYW1lfWA7XG4gIH0gZWxzZSBpZiAodGFnSGFuZGxlID09PSBcIiEhXCIpIHtcbiAgICBzdGF0ZS50YWcgPSBgdGFnOnlhbWwub3JnLDIwMDI6JHt0YWdOYW1lfWA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRocm93RXJyb3Ioc3RhdGUsIGB1bmRlY2xhcmVkIHRhZyBoYW5kbGUgXCIke3RhZ0hhbmRsZX1cImApO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHJlYWRBbmNob3JQcm9wZXJ0eShzdGF0ZTogTG9hZGVyU3RhdGUpOiBib29sZWFuIHtcbiAgbGV0IGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG4gIGlmIChjaCAhPT0gMHgyNiAvKiAmICovKSByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHN0YXRlLmFuY2hvciAhPT0gbnVsbCkge1xuICAgIHJldHVybiB0aHJvd0Vycm9yKHN0YXRlLCBcImR1cGxpY2F0aW9uIG9mIGFuIGFuY2hvciBwcm9wZXJ0eVwiKTtcbiAgfVxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG5cbiAgY29uc3QgcG9zaXRpb24gPSBzdGF0ZS5wb3NpdGlvbjtcbiAgd2hpbGUgKGNoICE9PSAwICYmICFpc1dzT3JFb2woY2gpICYmICFpc0Zsb3dJbmRpY2F0b3IoY2gpKSB7XG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICB9XG5cbiAgaWYgKHN0YXRlLnBvc2l0aW9uID09PSBwb3NpdGlvbikge1xuICAgIHJldHVybiB0aHJvd0Vycm9yKFxuICAgICAgc3RhdGUsXG4gICAgICBcIm5hbWUgb2YgYW4gYW5jaG9yIG5vZGUgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSBjaGFyYWN0ZXJcIixcbiAgICApO1xuICB9XG5cbiAgc3RhdGUuYW5jaG9yID0gc3RhdGUuaW5wdXQuc2xpY2UocG9zaXRpb24sIHN0YXRlLnBvc2l0aW9uKTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHJlYWRBbGlhcyhzdGF0ZTogTG9hZGVyU3RhdGUpOiBib29sZWFuIHtcbiAgbGV0IGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgaWYgKGNoICE9PSAweDJhIC8qICogKi8pIHJldHVybiBmYWxzZTtcblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gIGNvbnN0IF9wb3NpdGlvbiA9IHN0YXRlLnBvc2l0aW9uO1xuXG4gIHdoaWxlIChjaCAhPT0gMCAmJiAhaXNXc09yRW9sKGNoKSAmJiAhaXNGbG93SW5kaWNhdG9yKGNoKSkge1xuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgfVxuXG4gIGlmIChzdGF0ZS5wb3NpdGlvbiA9PT0gX3Bvc2l0aW9uKSB7XG4gICAgcmV0dXJuIHRocm93RXJyb3IoXG4gICAgICBzdGF0ZSxcbiAgICAgIFwibmFtZSBvZiBhbiBhbGlhcyBub2RlIG11c3QgY29udGFpbiBhdCBsZWFzdCBvbmUgY2hhcmFjdGVyXCIsXG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IGFsaWFzID0gc3RhdGUuaW5wdXQuc2xpY2UoX3Bvc2l0aW9uLCBzdGF0ZS5wb3NpdGlvbik7XG4gIGlmIChcbiAgICB0eXBlb2Ygc3RhdGUuYW5jaG9yTWFwICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgIWhhc093bihzdGF0ZS5hbmNob3JNYXAsIGFsaWFzKVxuICApIHtcbiAgICByZXR1cm4gdGhyb3dFcnJvcihzdGF0ZSwgYHVuaWRlbnRpZmllZCBhbGlhcyBcIiR7YWxpYXN9XCJgKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygc3RhdGUuYW5jaG9yTWFwICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgc3RhdGUucmVzdWx0ID0gc3RhdGUuYW5jaG9yTWFwW2FsaWFzXTtcbiAgfVxuICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCAtMSk7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjb21wb3NlTm9kZShcbiAgc3RhdGU6IExvYWRlclN0YXRlLFxuICBwYXJlbnRJbmRlbnQ6IG51bWJlcixcbiAgbm9kZUNvbnRleHQ6IG51bWJlcixcbiAgYWxsb3dUb1NlZWs6IGJvb2xlYW4sXG4gIGFsbG93Q29tcGFjdDogYm9vbGVhbixcbik6IGJvb2xlYW4ge1xuICBsZXQgYWxsb3dCbG9ja1NjYWxhcnM6IGJvb2xlYW4sXG4gICAgYWxsb3dCbG9ja0NvbGxlY3Rpb25zOiBib29sZWFuLFxuICAgIGluZGVudFN0YXR1cyA9IDEsIC8vIDE6IHRoaXM+cGFyZW50LCAwOiB0aGlzPXBhcmVudCwgLTE6IHRoaXM8cGFyZW50XG4gICAgYXROZXdMaW5lID0gZmFsc2UsXG4gICAgaGFzQ29udGVudCA9IGZhbHNlLFxuICAgIHR5cGU6IFR5cGUsXG4gICAgZmxvd0luZGVudDogbnVtYmVyLFxuICAgIGJsb2NrSW5kZW50OiBudW1iZXI7XG5cbiAgaWYgKHN0YXRlLmxpc3RlbmVyICYmIHN0YXRlLmxpc3RlbmVyICE9PSBudWxsKSB7XG4gICAgc3RhdGUubGlzdGVuZXIoXCJvcGVuXCIsIHN0YXRlKTtcbiAgfVxuXG4gIHN0YXRlLnRhZyA9IG51bGw7XG4gIHN0YXRlLmFuY2hvciA9IG51bGw7XG4gIHN0YXRlLmtpbmQgPSBudWxsO1xuICBzdGF0ZS5yZXN1bHQgPSBudWxsO1xuXG4gIGNvbnN0IGFsbG93QmxvY2tTdHlsZXMgPSAoYWxsb3dCbG9ja1NjYWxhcnMgPVxuICAgIGFsbG93QmxvY2tDb2xsZWN0aW9ucyA9XG4gICAgICBDT05URVhUX0JMT0NLX09VVCA9PT0gbm9kZUNvbnRleHQgfHwgQ09OVEVYVF9CTE9DS19JTiA9PT0gbm9kZUNvbnRleHQpO1xuXG4gIGlmIChhbGxvd1RvU2Vlaykge1xuICAgIGlmIChza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCAtMSkpIHtcbiAgICAgIGF0TmV3TGluZSA9IHRydWU7XG5cbiAgICAgIGlmIChzdGF0ZS5saW5lSW5kZW50ID4gcGFyZW50SW5kZW50KSB7XG4gICAgICAgIGluZGVudFN0YXR1cyA9IDE7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPT09IHBhcmVudEluZGVudCkge1xuICAgICAgICBpbmRlbnRTdGF0dXMgPSAwO1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5saW5lSW5kZW50IDwgcGFyZW50SW5kZW50KSB7XG4gICAgICAgIGluZGVudFN0YXR1cyA9IC0xO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChpbmRlbnRTdGF0dXMgPT09IDEpIHtcbiAgICB3aGlsZSAocmVhZFRhZ1Byb3BlcnR5KHN0YXRlKSB8fCByZWFkQW5jaG9yUHJvcGVydHkoc3RhdGUpKSB7XG4gICAgICBpZiAoc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgLTEpKSB7XG4gICAgICAgIGF0TmV3TGluZSA9IHRydWU7XG4gICAgICAgIGFsbG93QmxvY2tDb2xsZWN0aW9ucyA9IGFsbG93QmxvY2tTdHlsZXM7XG5cbiAgICAgICAgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPiBwYXJlbnRJbmRlbnQpIHtcbiAgICAgICAgICBpbmRlbnRTdGF0dXMgPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPT09IHBhcmVudEluZGVudCkge1xuICAgICAgICAgIGluZGVudFN0YXR1cyA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUubGluZUluZGVudCA8IHBhcmVudEluZGVudCkge1xuICAgICAgICAgIGluZGVudFN0YXR1cyA9IC0xO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGxvd0Jsb2NrQ29sbGVjdGlvbnMgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoYWxsb3dCbG9ja0NvbGxlY3Rpb25zKSB7XG4gICAgYWxsb3dCbG9ja0NvbGxlY3Rpb25zID0gYXROZXdMaW5lIHx8IGFsbG93Q29tcGFjdDtcbiAgfVxuXG4gIGlmIChpbmRlbnRTdGF0dXMgPT09IDEgfHwgQ09OVEVYVF9CTE9DS19PVVQgPT09IG5vZGVDb250ZXh0KSB7XG4gICAgY29uc3QgY29uZCA9IENPTlRFWFRfRkxPV19JTiA9PT0gbm9kZUNvbnRleHQgfHxcbiAgICAgIENPTlRFWFRfRkxPV19PVVQgPT09IG5vZGVDb250ZXh0O1xuICAgIGZsb3dJbmRlbnQgPSBjb25kID8gcGFyZW50SW5kZW50IDogcGFyZW50SW5kZW50ICsgMTtcblxuICAgIGJsb2NrSW5kZW50ID0gc3RhdGUucG9zaXRpb24gLSBzdGF0ZS5saW5lU3RhcnQ7XG5cbiAgICBpZiAoaW5kZW50U3RhdHVzID09PSAxKSB7XG4gICAgICBpZiAoXG4gICAgICAgIChhbGxvd0Jsb2NrQ29sbGVjdGlvbnMgJiZcbiAgICAgICAgICAocmVhZEJsb2NrU2VxdWVuY2Uoc3RhdGUsIGJsb2NrSW5kZW50KSB8fFxuICAgICAgICAgICAgcmVhZEJsb2NrTWFwcGluZyhzdGF0ZSwgYmxvY2tJbmRlbnQsIGZsb3dJbmRlbnQpKSkgfHxcbiAgICAgICAgcmVhZEZsb3dDb2xsZWN0aW9uKHN0YXRlLCBmbG93SW5kZW50KVxuICAgICAgKSB7XG4gICAgICAgIGhhc0NvbnRlbnQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIChhbGxvd0Jsb2NrU2NhbGFycyAmJiByZWFkQmxvY2tTY2FsYXIoc3RhdGUsIGZsb3dJbmRlbnQpKSB8fFxuICAgICAgICAgIHJlYWRTaW5nbGVRdW90ZWRTY2FsYXIoc3RhdGUsIGZsb3dJbmRlbnQpIHx8XG4gICAgICAgICAgcmVhZERvdWJsZVF1b3RlZFNjYWxhcihzdGF0ZSwgZmxvd0luZGVudClcbiAgICAgICAgKSB7XG4gICAgICAgICAgaGFzQ29udGVudCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAocmVhZEFsaWFzKHN0YXRlKSkge1xuICAgICAgICAgIGhhc0NvbnRlbnQgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKHN0YXRlLnRhZyAhPT0gbnVsbCB8fCBzdGF0ZS5hbmNob3IgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKFxuICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgXCJhbGlhcyBub2RlIHNob3VsZCBub3QgaGF2ZSBBbnkgcHJvcGVydGllc1wiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgcmVhZFBsYWluU2NhbGFyKHN0YXRlLCBmbG93SW5kZW50LCBDT05URVhUX0ZMT1dfSU4gPT09IG5vZGVDb250ZXh0KVxuICAgICAgICApIHtcbiAgICAgICAgICBoYXNDb250ZW50ID0gdHJ1ZTtcblxuICAgICAgICAgIGlmIChzdGF0ZS50YWcgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHN0YXRlLnRhZyA9IFwiP1wiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0ZS5hbmNob3IgIT09IG51bGwgJiYgdHlwZW9mIHN0YXRlLmFuY2hvck1hcCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIHN0YXRlLmFuY2hvck1hcFtzdGF0ZS5hbmNob3JdID0gc3RhdGUucmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpbmRlbnRTdGF0dXMgPT09IDApIHtcbiAgICAgIC8vIFNwZWNpYWwgY2FzZTogYmxvY2sgc2VxdWVuY2VzIGFyZSBhbGxvd2VkIHRvIGhhdmUgc2FtZSBpbmRlbnRhdGlvbiBsZXZlbCBhcyB0aGUgcGFyZW50LlxuICAgICAgLy8gaHR0cDovL3d3dy55YW1sLm9yZy9zcGVjLzEuMi9zcGVjLmh0bWwjaWQyNzk5Nzg0XG4gICAgICBoYXNDb250ZW50ID0gYWxsb3dCbG9ja0NvbGxlY3Rpb25zICYmXG4gICAgICAgIHJlYWRCbG9ja1NlcXVlbmNlKHN0YXRlLCBibG9ja0luZGVudCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN0YXRlLnRhZyAhPT0gbnVsbCAmJiBzdGF0ZS50YWcgIT09IFwiIVwiKSB7XG4gICAgaWYgKHN0YXRlLnRhZyA9PT0gXCI/XCIpIHtcbiAgICAgIGZvciAoXG4gICAgICAgIGxldCB0eXBlSW5kZXggPSAwLCB0eXBlUXVhbnRpdHkgPSBzdGF0ZS5pbXBsaWNpdFR5cGVzLmxlbmd0aDtcbiAgICAgICAgdHlwZUluZGV4IDwgdHlwZVF1YW50aXR5O1xuICAgICAgICB0eXBlSW5kZXgrK1xuICAgICAgKSB7XG4gICAgICAgIHR5cGUgPSBzdGF0ZS5pbXBsaWNpdFR5cGVzW3R5cGVJbmRleF07XG5cbiAgICAgICAgLy8gSW1wbGljaXQgcmVzb2x2aW5nIGlzIG5vdCBhbGxvd2VkIGZvciBub24tc2NhbGFyIHR5cGVzLCBhbmQgJz8nXG4gICAgICAgIC8vIG5vbi1zcGVjaWZpYyB0YWcgaXMgb25seSBhc3NpZ25lZCB0byBwbGFpbiBzY2FsYXJzLiBTbywgaXQgaXNuJ3RcbiAgICAgICAgLy8gbmVlZGVkIHRvIGNoZWNrIGZvciAna2luZCcgY29uZm9ybWl0eS5cblxuICAgICAgICBpZiAodHlwZS5yZXNvbHZlKHN0YXRlLnJlc3VsdCkpIHtcbiAgICAgICAgICAvLyBgc3RhdGUucmVzdWx0YCB1cGRhdGVkIGluIHJlc29sdmVyIGlmIG1hdGNoZWRcbiAgICAgICAgICBzdGF0ZS5yZXN1bHQgPSB0eXBlLmNvbnN0cnVjdChzdGF0ZS5yZXN1bHQpO1xuICAgICAgICAgIHN0YXRlLnRhZyA9IHR5cGUudGFnO1xuICAgICAgICAgIGlmIChzdGF0ZS5hbmNob3IgIT09IG51bGwgJiYgdHlwZW9mIHN0YXRlLmFuY2hvck1hcCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgc3RhdGUuYW5jaG9yTWFwW3N0YXRlLmFuY2hvcl0gPSBzdGF0ZS5yZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGhhc093bihzdGF0ZS50eXBlTWFwW3N0YXRlLmtpbmQgfHwgXCJmYWxsYmFja1wiXSwgc3RhdGUudGFnKVxuICAgICkge1xuICAgICAgdHlwZSA9IHN0YXRlLnR5cGVNYXBbc3RhdGUua2luZCB8fCBcImZhbGxiYWNrXCJdW3N0YXRlLnRhZ107XG5cbiAgICAgIGlmIChzdGF0ZS5yZXN1bHQgIT09IG51bGwgJiYgdHlwZS5raW5kICE9PSBzdGF0ZS5raW5kKSB7XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKFxuICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgIGB1bmFjY2VwdGFibGUgbm9kZSBraW5kIGZvciAhPCR7c3RhdGUudGFnfT4gdGFnOyBpdCBzaG91bGQgYmUgXCIke3R5cGUua2luZH1cIiwgbm90IFwiJHtzdGF0ZS5raW5kfVwiYCxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0eXBlLnJlc29sdmUoc3RhdGUucmVzdWx0KSkge1xuICAgICAgICAvLyBgc3RhdGUucmVzdWx0YCB1cGRhdGVkIGluIHJlc29sdmVyIGlmIG1hdGNoZWRcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoXG4gICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgYGNhbm5vdCByZXNvbHZlIGEgbm9kZSB3aXRoICE8JHtzdGF0ZS50YWd9PiBleHBsaWNpdCB0YWdgLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdGUucmVzdWx0ID0gdHlwZS5jb25zdHJ1Y3Qoc3RhdGUucmVzdWx0KTtcbiAgICAgICAgaWYgKHN0YXRlLmFuY2hvciAhPT0gbnVsbCAmJiB0eXBlb2Ygc3RhdGUuYW5jaG9yTWFwICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgc3RhdGUuYW5jaG9yTWFwW3N0YXRlLmFuY2hvcl0gPSBzdGF0ZS5yZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRocm93RXJyb3Ioc3RhdGUsIGB1bmtub3duIHRhZyAhPCR7c3RhdGUudGFnfT5gKTtcbiAgICB9XG4gIH1cblxuICBpZiAoc3RhdGUubGlzdGVuZXIgJiYgc3RhdGUubGlzdGVuZXIgIT09IG51bGwpIHtcbiAgICBzdGF0ZS5saXN0ZW5lcihcImNsb3NlXCIsIHN0YXRlKTtcbiAgfVxuICByZXR1cm4gc3RhdGUudGFnICE9PSBudWxsIHx8IHN0YXRlLmFuY2hvciAhPT0gbnVsbCB8fCBoYXNDb250ZW50O1xufVxuXG5mdW5jdGlvbiByZWFkRG9jdW1lbnQoc3RhdGU6IExvYWRlclN0YXRlKSB7XG4gIGNvbnN0IGRvY3VtZW50U3RhcnQgPSBzdGF0ZS5wb3NpdGlvbjtcbiAgbGV0IHBvc2l0aW9uOiBudW1iZXIsXG4gICAgZGlyZWN0aXZlTmFtZTogc3RyaW5nLFxuICAgIGRpcmVjdGl2ZUFyZ3M6IHN0cmluZ1tdLFxuICAgIGhhc0RpcmVjdGl2ZXMgPSBmYWxzZSxcbiAgICBjaDogbnVtYmVyO1xuXG4gIHN0YXRlLnZlcnNpb24gPSBudWxsO1xuICBzdGF0ZS5jaGVja0xpbmVCcmVha3MgPSBzdGF0ZS5sZWdhY3k7XG4gIHN0YXRlLnRhZ01hcCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHN0YXRlLmFuY2hvck1hcCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgd2hpbGUgKChjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pKSAhPT0gMCkge1xuICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICBpZiAoc3RhdGUubGluZUluZGVudCA+IDAgfHwgY2ggIT09IDB4MjUgLyogJSAqLykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaGFzRGlyZWN0aXZlcyA9IHRydWU7XG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgIHBvc2l0aW9uID0gc3RhdGUucG9zaXRpb247XG5cbiAgICB3aGlsZSAoY2ggIT09IDAgJiYgIWlzV3NPckVvbChjaCkpIHtcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBkaXJlY3RpdmVOYW1lID0gc3RhdGUuaW5wdXQuc2xpY2UocG9zaXRpb24sIHN0YXRlLnBvc2l0aW9uKTtcbiAgICBkaXJlY3RpdmVBcmdzID0gW107XG5cbiAgICBpZiAoZGlyZWN0aXZlTmFtZS5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIFwiZGlyZWN0aXZlIG5hbWUgbXVzdCBub3QgYmUgbGVzcyB0aGFuIG9uZSBjaGFyYWN0ZXIgaW4gbGVuZ3RoXCIsXG4gICAgICApO1xuICAgIH1cblxuICAgIHdoaWxlIChjaCAhPT0gMCkge1xuICAgICAgd2hpbGUgKGlzV2hpdGVTcGFjZShjaCkpIHtcbiAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2ggPT09IDB4MjMgLyogIyAqLykge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgICAgICB9IHdoaWxlIChjaCAhPT0gMCAmJiAhaXNFT0woY2gpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0VPTChjaCkpIGJyZWFrO1xuXG4gICAgICBwb3NpdGlvbiA9IHN0YXRlLnBvc2l0aW9uO1xuXG4gICAgICB3aGlsZSAoY2ggIT09IDAgJiYgIWlzV3NPckVvbChjaCkpIHtcbiAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgICAgfVxuXG4gICAgICBkaXJlY3RpdmVBcmdzLnB1c2goc3RhdGUuaW5wdXQuc2xpY2UocG9zaXRpb24sIHN0YXRlLnBvc2l0aW9uKSk7XG4gICAgfVxuXG4gICAgaWYgKGNoICE9PSAwKSByZWFkTGluZUJyZWFrKHN0YXRlKTtcblxuICAgIGlmIChoYXNPd24oZGlyZWN0aXZlSGFuZGxlcnMsIGRpcmVjdGl2ZU5hbWUpKSB7XG4gICAgICBkaXJlY3RpdmVIYW5kbGVyc1tkaXJlY3RpdmVOYW1lXShzdGF0ZSwgZGlyZWN0aXZlTmFtZSwgLi4uZGlyZWN0aXZlQXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93V2FybmluZyhzdGF0ZSwgYHVua25vd24gZG9jdW1lbnQgZGlyZWN0aXZlIFwiJHtkaXJlY3RpdmVOYW1lfVwiYCk7XG4gICAgfVxuICB9XG5cbiAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgLTEpO1xuXG4gIGlmIChcbiAgICBzdGF0ZS5saW5lSW5kZW50ID09PSAwICYmXG4gICAgc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbikgPT09IDB4MmQgLyogLSAqLyAmJlxuICAgIHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24gKyAxKSA9PT0gMHgyZCAvKiAtICovICYmXG4gICAgc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbiArIDIpID09PSAweDJkIC8qIC0gKi9cbiAgKSB7XG4gICAgc3RhdGUucG9zaXRpb24gKz0gMztcbiAgICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCAtMSk7XG4gIH0gZWxzZSBpZiAoaGFzRGlyZWN0aXZlcykge1xuICAgIHJldHVybiB0aHJvd0Vycm9yKHN0YXRlLCBcImRpcmVjdGl2ZXMgZW5kIG1hcmsgaXMgZXhwZWN0ZWRcIik7XG4gIH1cblxuICBjb21wb3NlTm9kZShzdGF0ZSwgc3RhdGUubGluZUluZGVudCAtIDEsIENPTlRFWFRfQkxPQ0tfT1VULCBmYWxzZSwgdHJ1ZSk7XG4gIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcblxuICBpZiAoXG4gICAgc3RhdGUuY2hlY2tMaW5lQnJlYWtzICYmXG4gICAgUEFUVEVSTl9OT05fQVNDSUlfTElORV9CUkVBS1MudGVzdChcbiAgICAgIHN0YXRlLmlucHV0LnNsaWNlKGRvY3VtZW50U3RhcnQsIHN0YXRlLnBvc2l0aW9uKSxcbiAgICApXG4gICkge1xuICAgIHRocm93V2FybmluZyhzdGF0ZSwgXCJub24tQVNDSUkgbGluZSBicmVha3MgYXJlIGludGVycHJldGVkIGFzIGNvbnRlbnRcIik7XG4gIH1cblxuICBzdGF0ZS5kb2N1bWVudHMucHVzaChzdGF0ZS5yZXN1bHQpO1xuXG4gIGlmIChzdGF0ZS5wb3NpdGlvbiA9PT0gc3RhdGUubGluZVN0YXJ0ICYmIHRlc3REb2N1bWVudFNlcGFyYXRvcihzdGF0ZSkpIHtcbiAgICBpZiAoc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbikgPT09IDB4MmUgLyogLiAqLykge1xuICAgICAgc3RhdGUucG9zaXRpb24gKz0gMztcbiAgICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHN0YXRlLnBvc2l0aW9uIDwgc3RhdGUubGVuZ3RoIC0gMSkge1xuICAgIHJldHVybiB0aHJvd0Vycm9yKFxuICAgICAgc3RhdGUsXG4gICAgICBcImVuZCBvZiB0aGUgc3RyZWFtIG9yIGEgZG9jdW1lbnQgc2VwYXJhdG9yIGlzIGV4cGVjdGVkXCIsXG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBsb2FkRG9jdW1lbnRzKGlucHV0OiBzdHJpbmcsIG9wdGlvbnM/OiBMb2FkZXJTdGF0ZU9wdGlvbnMpOiB1bmtub3duW10ge1xuICBpbnB1dCA9IFN0cmluZyhpbnB1dCk7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGlmIChpbnB1dC5sZW5ndGggIT09IDApIHtcbiAgICAvLyBBZGQgdGFpbGluZyBgXFxuYCBpZiBub3QgZXhpc3RzXG4gICAgaWYgKFxuICAgICAgaW5wdXQuY2hhckNvZGVBdChpbnB1dC5sZW5ndGggLSAxKSAhPT0gMHgwYSAvKiBMRiAqLyAmJlxuICAgICAgaW5wdXQuY2hhckNvZGVBdChpbnB1dC5sZW5ndGggLSAxKSAhPT0gMHgwZCAvKiBDUiAqL1xuICAgICkge1xuICAgICAgaW5wdXQgKz0gXCJcXG5cIjtcbiAgICB9XG5cbiAgICAvLyBTdHJpcCBCT01cbiAgICBpZiAoaW5wdXQuY2hhckNvZGVBdCgwKSA9PT0gMHhmZWZmKSB7XG4gICAgICBpbnB1dCA9IGlucHV0LnNsaWNlKDEpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0YXRlID0gbmV3IExvYWRlclN0YXRlKGlucHV0LCBvcHRpb25zKTtcblxuICAvLyBVc2UgMCBhcyBzdHJpbmcgdGVybWluYXRvci4gVGhhdCBzaWduaWZpY2FudGx5IHNpbXBsaWZpZXMgYm91bmRzIGNoZWNrLlxuICBzdGF0ZS5pbnB1dCArPSBcIlxcMFwiO1xuXG4gIHdoaWxlIChzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKSA9PT0gMHgyMCAvKiBTcGFjZSAqLykge1xuICAgIHN0YXRlLmxpbmVJbmRlbnQgKz0gMTtcbiAgICBzdGF0ZS5wb3NpdGlvbiArPSAxO1xuICB9XG5cbiAgd2hpbGUgKHN0YXRlLnBvc2l0aW9uIDwgc3RhdGUubGVuZ3RoIC0gMSkge1xuICAgIHJlYWREb2N1bWVudChzdGF0ZSk7XG4gIH1cblxuICByZXR1cm4gc3RhdGUuZG9jdW1lbnRzO1xufVxuXG5leHBvcnQgdHlwZSBDYkZ1bmN0aW9uID0gKGRvYzogdW5rbm93bikgPT4gdm9pZDtcbmZ1bmN0aW9uIGlzQ2JGdW5jdGlvbihmbjogdW5rbm93bik6IGZuIGlzIENiRnVuY3Rpb24ge1xuICByZXR1cm4gdHlwZW9mIGZuID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkQWxsPFQgZXh0ZW5kcyBDYkZ1bmN0aW9uIHwgTG9hZGVyU3RhdGVPcHRpb25zPihcbiAgaW5wdXQ6IHN0cmluZyxcbiAgaXRlcmF0b3JPck9wdGlvbj86IFQsXG4gIG9wdGlvbnM/OiBMb2FkZXJTdGF0ZU9wdGlvbnMsXG4pOiBUIGV4dGVuZHMgQ2JGdW5jdGlvbiA/IHZvaWQgOiB1bmtub3duW10ge1xuICBpZiAoIWlzQ2JGdW5jdGlvbihpdGVyYXRvck9yT3B0aW9uKSkge1xuICAgIHJldHVybiBsb2FkRG9jdW1lbnRzKGlucHV0LCBpdGVyYXRvck9yT3B0aW9uIGFzIExvYWRlclN0YXRlT3B0aW9ucykgYXMgQW55O1xuICB9XG5cbiAgY29uc3QgZG9jdW1lbnRzID0gbG9hZERvY3VtZW50cyhpbnB1dCwgb3B0aW9ucyk7XG4gIGNvbnN0IGl0ZXJhdG9yID0gaXRlcmF0b3JPck9wdGlvbjtcbiAgZm9yIChsZXQgaW5kZXggPSAwLCBsZW5ndGggPSBkb2N1bWVudHMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgIGl0ZXJhdG9yKGRvY3VtZW50c1tpbmRleF0pO1xuICB9XG5cbiAgcmV0dXJuIHZvaWQgMCBhcyBBbnk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkKGlucHV0OiBzdHJpbmcsIG9wdGlvbnM/OiBMb2FkZXJTdGF0ZU9wdGlvbnMpOiB1bmtub3duIHtcbiAgY29uc3QgZG9jdW1lbnRzID0gbG9hZERvY3VtZW50cyhpbnB1dCwgb3B0aW9ucyk7XG5cbiAgaWYgKGRvY3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGRvY3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gZG9jdW1lbnRzWzBdO1xuICB9XG4gIHRocm93IG5ldyBZQU1MRXJyb3IoXG4gICAgXCJleHBlY3RlZCBhIHNpbmdsZSBkb2N1bWVudCBpbiB0aGUgc3RyZWFtLCBidXQgZm91bmQgbW9yZVwiLFxuICApO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixvRkFBb0Y7QUFDcEYsMEVBQTBFO0FBQzFFLDBFQUEwRTtBQUUxRSxTQUFTLFNBQVMsUUFBUSxlQUFlO0FBQ3pDLFNBQVMsSUFBSSxRQUFRLGNBQWM7QUFFbkMsWUFBWSxZQUFZLGVBQWU7QUFDdkMsU0FBUyxXQUFXLFFBQXdDLG9CQUFvQjtBQUtoRixNQUFNLEVBQUUsT0FBTSxFQUFFLEdBQUc7QUFFbkIsTUFBTSxrQkFBa0I7QUFDeEIsTUFBTSxtQkFBbUI7QUFDekIsTUFBTSxtQkFBbUI7QUFDekIsTUFBTSxvQkFBb0I7QUFFMUIsTUFBTSxnQkFBZ0I7QUFDdEIsTUFBTSxpQkFBaUI7QUFDdkIsTUFBTSxnQkFBZ0I7QUFFdEIsTUFBTSx3QkFDSixvQ0FBb0M7QUFDcEM7QUFDRixNQUFNLGdDQUFnQztBQUN0QyxNQUFNLDBCQUEwQjtBQUNoQyxNQUFNLHFCQUFxQjtBQUMzQixNQUFN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