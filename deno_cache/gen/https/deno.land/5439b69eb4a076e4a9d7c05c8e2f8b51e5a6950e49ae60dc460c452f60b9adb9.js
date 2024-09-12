// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
/**
 * Command line arguments parser based on
 * [minimist](https://github.com/minimistjs/minimist).
 *
 * This module is browser compatible.
 *
 * @module
 */ import { assert } from "../_util/asserts.ts";
const { hasOwn  } = Object;
function get(obj, key) {
    if (hasOwn(obj, key)) {
        return obj[key];
    }
}
function getForce(obj, key) {
    const v = get(obj, key);
    assert(v != null);
    return v;
}
function isNumber(x) {
    if (typeof x === "number") return true;
    if (/^0x[0-9a-f]+$/i.test(String(x))) return true;
    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(String(x));
}
function hasKey(obj, keys) {
    let o = obj;
    keys.slice(0, -1).forEach((key)=>{
        o = get(o, key) ?? {};
    });
    const key = keys[keys.length - 1];
    return hasOwn(o, key);
}
/** Take a set of command line arguments, optionally with a set of options, and
 * return an object representing the flags found in the passed arguments.
 *
 * By default, any arguments starting with `-` or `--` are considered boolean
 * flags. If the argument name is followed by an equal sign (`=`) it is
 * considered a key-value pair. Any arguments which could not be parsed are
 * available in the `_` property of the returned object.
 *
 * ```ts
 * import { parse } from "https://deno.land/std@$STD_VERSION/flags/mod.ts";
 * const parsedArgs = parse(Deno.args);
 * ```
 *
 * ```ts
 * import { parse } from "https://deno.land/std@$STD_VERSION/flags/mod.ts";
 * const parsedArgs = parse(["--foo", "--bar=baz", "./quux.txt"]);
 * // parsedArgs: { foo: true, bar: "baz", _: ["./quux.txt"] }
 * ```
 */ export function parse(args, { "--": doubleDash = false , alias ={} , boolean =false , default: defaults = {} , stopEarly =false , string =[] , collect =[] , negatable =[] , unknown =(i)=>i  } = {}) {
    const aliases = {};
    const flags = {
        bools: {},
        strings: {},
        unknownFn: unknown,
        allBools: false,
        collect: {},
        negatable: {}
    };
    if (alias !== undefined) {
        for(const key in alias){
            const val = getForce(alias, key);
            if (typeof val === "string") {
                aliases[key] = [
                    val
                ];
            } else {
                aliases[key] = val;
            }
            for (const alias of getForce(aliases, key)){
                aliases[alias] = [
                    key
                ].concat(aliases[key].filter((y)=>alias !== y));
            }
        }
    }
    if (boolean !== undefined) {
        if (typeof boolean === "boolean") {
            flags.allBools = !!boolean;
        } else {
            const booleanArgs = typeof boolean === "string" ? [
                boolean
            ] : boolean;
            for (const key of booleanArgs.filter(Boolean)){
                flags.bools[key] = true;
                const alias = get(aliases, key);
                if (alias) {
                    for (const al of alias){
                        flags.bools[al] = true;
                    }
                }
            }
        }
    }
    if (string !== undefined) {
        const stringArgs = typeof string === "string" ? [
            string
        ] : string;
        for (const key of stringArgs.filter(Boolean)){
            flags.strings[key] = true;
            const alias = get(aliases, key);
            if (alias) {
                for (const al of alias){
                    flags.strings[al] = true;
                }
            }
        }
    }
    if (collect !== undefined) {
        const collectArgs = typeof collect === "string" ? [
            collect
        ] : collect;
        for (const key of collectArgs.filter(Boolean)){
            flags.collect[key] = true;
            const alias = get(aliases, key);
            if (alias) {
                for (const al of alias){
                    flags.collect[al] = true;
                }
            }
        }
    }
    if (negatable !== undefined) {
        const negatableArgs = typeof negatable === "string" ? [
            negatable
        ] : negatable;
        for (const key of negatableArgs.filter(Boolean)){
            flags.negatable[key] = true;
            const alias = get(aliases, key);
            if (alias) {
                for (const al of alias){
                    flags.negatable[al] = true;
                }
            }
        }
    }
    const argv = {
        _: []
    };
    function argDefined(key, arg) {
        return flags.allBools && /^--[^=]+$/.test(arg) || get(flags.bools, key) || !!get(flags.strings, key) || !!get(aliases, key);
    }
    function setKey(obj, name, value, collect = true) {
        let o = obj;
        const keys = name.split(".");
        keys.slice(0, -1).forEach(function(key) {
            if (get(o, key) === undefined) {
                o[key] = {};
            }
            o = get(o, key);
        });
        const key = keys[keys.length - 1];
        const collectable = collect && !!get(flags.collect, name);
        if (!collectable) {
            o[key] = value;
        } else if (get(o, key) === undefined) {
            o[key] = [
                value
            ];
        } else if (Array.isArray(get(o, key))) {
            o[key].push(value);
        } else {
            o[key] = [
                get(o, key),
                value
            ];
        }
    }
    function setArg(key, val, arg = undefined, collect) {
        if (arg && flags.unknownFn && !argDefined(key, arg)) {
            if (flags.unknownFn(arg, key, val) === false) return;
        }
        const value = !get(flags.strings, key) && isNumber(val) ? Number(val) : val;
        setKey(argv, key, value, collect);
        const alias = get(aliases, key);
        if (alias) {
            for (const x of alias){
                setKey(argv, x, value, collect);
            }
        }
    }
    function aliasIsBoolean(key) {
        return getForce(aliases, key).some((x)=>typeof get(flags.bools, x) === "boolean");
    }
    let notFlags = [];
    // all args after "--" are not parsed
    if (args.includes("--")) {
        notFlags = args.slice(args.indexOf("--") + 1);
        args = args.slice(0, args.indexOf("--"));
    }
    for(let i = 0; i < args.length; i++){
        const arg = args[i];
        if (/^--.+=/.test(arg)) {
            const m = arg.match(/^--([^=]+)=(.*)$/s);
            assert(m != null);
            const [, key, value] = m;
            if (flags.bools[key]) {
                const booleanValue = value !== "false";
                setArg(key, booleanValue, arg);
            } else {
                setArg(key, value, arg);
            }
        } else if (/^--no-.+/.test(arg) && get(flags.negatable, arg.replace(/^--no-/, ""))) {
            const m = arg.match(/^--no-(.+)/);
            assert(m != null);
            setArg(m[1], false, arg, false);
        } else if (/^--.+/.test(arg)) {
            const m = arg.match(/^--(.+)/);
            assert(m != null);
            const [, key] = m;
            const next = args[i + 1];
            if (next !== undefined && !/^-/.test(next) && !get(flags.bools, key) && !flags.allBools && (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
                setArg(key, next, arg);
                i++;
            } else if (/^(true|false)$/.test(next)) {
                setArg(key, next === "true", arg);
                i++;
            } else {
                setArg(key, get(flags.strings, key) ? "" : true, arg);
            }
        } else if (/^-[^-]+/.test(arg)) {
            const letters = arg.slice(1, -1).split("");
            let broken = false;
            for(let j = 0; j < letters.length; j++){
                const next = arg.slice(j + 2);
                if (next === "-") {
                    setArg(letters[j], next, arg);
                    continue;
                }
                if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
                    setArg(letters[j], next.split(/=(.+)/)[1], arg);
                    broken = true;
                    break;
                }
                if (/[A-Za-z]/.test(letters[j]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                    setArg(letters[j], next, arg);
                    broken = true;
                    break;
                }
                if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                    setArg(letters[j], arg.slice(j + 2), arg);
                    broken = true;
                    break;
                } else {
                    setArg(letters[j], get(flags.strings, letters[j]) ? "" : true, arg);
                }
            }
            const [key] = arg.slice(-1);
            if (!broken && key !== "-") {
                if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1]) && !get(flags.bools, key) && (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
                    setArg(key, args[i + 1], arg);
                    i++;
                } else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
                    setArg(key, args[i + 1] === "true", arg);
                    i++;
                } else {
                    setArg(key, get(flags.strings, key) ? "" : true, arg);
                }
            }
        } else {
            if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
                argv._.push(flags.strings["_"] ?? !isNumber(arg) ? arg : Number(arg));
            }
            if (stopEarly) {
                argv._.push(...args.slice(i + 1));
                break;
            }
        }
    }
    for (const [key, value] of Object.entries(defaults)){
        if (!hasKey(argv, key.split("."))) {
            setKey(argv, key, value);
            if (aliases[key]) {
                for (const x of aliases[key]){
                    setKey(argv, x, value);
                }
            }
        }
    }
    for (const key of Object.keys(flags.bools)){
        if (!hasKey(argv, key.split("."))) {
            const value = get(flags.collect, key) ? [] : false;
            setKey(argv, key, value, false);
        }
    }
    for (const key of Object.keys(flags.strings)){
        if (!hasKey(argv, key.split(".")) && get(flags.collect, key)) {
            setKey(argv, key, [], false);
        }
    }
    if (doubleDash) {
        argv["--"] = [];
        for (const key of notFlags){
            argv["--"].push(key);
        }
    } else {
        for (const key of notFlags){
            argv._.push(key);
        }
    }
    return argv;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE2NS4wL2ZsYWdzL21vZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIyIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLyoqXG4gKiBDb21tYW5kIGxpbmUgYXJndW1lbnRzIHBhcnNlciBiYXNlZCBvblxuICogW21pbmltaXN0XShodHRwczovL2dpdGh1Yi5jb20vbWluaW1pc3Rqcy9taW5pbWlzdCkuXG4gKlxuICogVGhpcyBtb2R1bGUgaXMgYnJvd3NlciBjb21wYXRpYmxlLlxuICpcbiAqIEBtb2R1bGVcbiAqL1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSBcIi4uL191dGlsL2Fzc2VydHMudHNcIjtcblxuLyoqIENvbWJpbmVzIHJlY3Vyc2l2ZWx5IGFsbCBpbnRlcnNlY3Rpb24gdHlwZXMgYW5kIHJldHVybnMgYSBuZXcgc2luZ2xlIHR5cGUuICovXG50eXBlIElkPFQ+ID0gVCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gID8gVCBleHRlbmRzIGluZmVyIFUgPyB7IFtLIGluIGtleW9mIFVdOiBJZDxVW0tdPiB9IDogbmV2ZXJcbiAgOiBUO1xuXG4vKiogQ29udmVydHMgYW4gdW5pb24gdHlwZSBgQSB8IEIgfCBDYCBpbnRvIGFuIGludGVyc2VjdGlvbiB0eXBlIGBBICYgQiAmIENgLiAqL1xudHlwZSBVbmlvblRvSW50ZXJzZWN0aW9uPFQ+ID1cbiAgKFQgZXh0ZW5kcyB1bmtub3duID8gKGFyZ3M6IFQpID0+IHVua25vd24gOiBuZXZlcikgZXh0ZW5kc1xuICAgIChhcmdzOiBpbmZlciBSKSA9PiB1bmtub3duID8gUiBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHVua25vd24+ID8gUiA6IG5ldmVyXG4gICAgOiBuZXZlcjtcblxudHlwZSBCb29sZWFuVHlwZSA9IGJvb2xlYW4gfCBzdHJpbmcgfCB1bmRlZmluZWQ7XG50eXBlIFN0cmluZ1R5cGUgPSBzdHJpbmcgfCB1bmRlZmluZWQ7XG50eXBlIEFyZ1R5cGUgPSBTdHJpbmdUeXBlIHwgQm9vbGVhblR5cGU7XG5cbnR5cGUgQ29sbGVjdGFibGUgPSBzdHJpbmcgfCB1bmRlZmluZWQ7XG50eXBlIE5lZ2F0YWJsZSA9IHN0cmluZyB8IHVuZGVmaW5lZDtcblxudHlwZSBVc2VUeXBlczxcbiAgQiBleHRlbmRzIEJvb2xlYW5UeXBlLFxuICBTIGV4dGVuZHMgU3RyaW5nVHlwZSxcbiAgQyBleHRlbmRzIENvbGxlY3RhYmxlLFxuPiA9IHVuZGVmaW5lZCBleHRlbmRzIChcbiAgJiAoZmFsc2UgZXh0ZW5kcyBCID8gdW5kZWZpbmVkIDogQilcbiAgJiBDXG4gICYgU1xuKSA/IGZhbHNlXG4gIDogdHJ1ZTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgcmVjb3JkIHdpdGggYWxsIGF2YWlsYWJsZSBmbGFncyB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIHR5cGUgYW5kXG4gKiBkZWZhdWx0IHR5cGUuXG4gKi9cbnR5cGUgVmFsdWVzPFxuICBCIGV4dGVuZHMgQm9vbGVhblR5cGUsXG4gIFMgZXh0ZW5kcyBTdHJpbmdUeXBlLFxuICBDIGV4dGVuZHMgQ29sbGVjdGFibGUsXG4gIE4gZXh0ZW5kcyBOZWdhdGFibGUsXG4gIEQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IHVuZGVmaW5lZCxcbiAgQSBleHRlbmRzIEFsaWFzZXMgfCB1bmRlZmluZWQsXG4+ID0gVXNlVHlwZXM8QiwgUywgQz4gZXh0ZW5kcyB0cnVlID8gXG4gICAgJiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICAgICYgQWRkQWxpYXNlczxcbiAgICAgIFNwcmVhZERlZmF1bHRzPFxuICAgICAgICAmIENvbGxlY3RWYWx1ZXM8Uywgc3RyaW5nLCBDLCBOPlxuICAgICAgICAmIFJlY3Vyc2l2ZVJlcXVpcmVkPENvbGxlY3RWYWx1ZXM8QiwgYm9vbGVhbiwgQz4+XG4gICAgICAgICYgQ29sbGVjdFVua25vd25WYWx1ZXM8QiwgUywgQywgTj4sXG4gICAgICAgIERlZG90UmVjb3JkPEQ+XG4gICAgICA+LFxuICAgICAgQVxuICAgID5cbiAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuXG50eXBlIEFsaWFzZXM8VCA9IHN0cmluZywgViBleHRlbmRzIHN0cmluZyA9IHN0cmluZz4gPSBQYXJ0aWFsPFxuICBSZWNvcmQ8RXh0cmFjdDxULCBzdHJpbmc+LCBWIHwgUmVhZG9ubHlBcnJheTxWPj5cbj47XG5cbnR5cGUgQWRkQWxpYXNlczxcbiAgVCxcbiAgQSBleHRlbmRzIEFsaWFzZXMgfCB1bmRlZmluZWQsXG4+ID0geyBbSyBpbiBrZXlvZiBUIGFzIEFsaWFzTmFtZTxLLCBBPl06IFRbS10gfTtcblxudHlwZSBBbGlhc05hbWU8XG4gIEssXG4gIEEgZXh0ZW5kcyBBbGlhc2VzIHwgdW5kZWZpbmVkLFxuPiA9IEsgZXh0ZW5kcyBrZXlvZiBBXG4gID8gc3RyaW5nIGV4dGVuZHMgQVtLXSA/IEsgOiBBW0tdIGV4dGVuZHMgc3RyaW5nID8gSyB8IEFbS10gOiBLXG4gIDogSztcblxuLyoqXG4gKiBTcHJlYWRzIGFsbCBkZWZhdWx0IHZhbHVlcyBvZiBSZWNvcmQgYERgIGludG8gUmVjb3JkIGBBYFxuICogYW5kIG1ha2VzIGRlZmF1bHQgdmFsdWVzIHJlcXVpcmVkLlxuICpcbiAqICoqRXhhbXBsZToqKlxuICogYFNwcmVhZFZhbHVlczx7IGZvbz86IGJvb2xlYW4sIGJhcj86IG51bWJlciB9LCB7IGZvbzogbnVtYmVyIH0+YFxuICpcbiAqICoqUmVzdWx0OioqIGB7IGZvbzogYm9vbGFuIHwgbnVtYmVyLCBiYXI/OiBudW1iZXIgfWBcbiAqL1xudHlwZSBTcHJlYWREZWZhdWx0czxBLCBEPiA9IEQgZXh0ZW5kcyB1bmRlZmluZWQgPyBBXG4gIDogQSBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHVua25vd24+ID8gXG4gICAgICAmIE9taXQ8QSwga2V5b2YgRD5cbiAgICAgICYge1xuICAgICAgICBbSyBpbiBrZXlvZiBEXTogSyBleHRlbmRzIGtleW9mIEFcbiAgICAgICAgICA/IChBW0tdICYgRFtLXSB8IERbS10pIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAgICAgICAgICAgID8gTm9uTnVsbGFibGU8U3ByZWFkRGVmYXVsdHM8QVtLXSwgRFtLXT4+XG4gICAgICAgICAgOiBEW0tdIHwgTm9uTnVsbGFibGU8QVtLXT5cbiAgICAgICAgICA6IHVua25vd247XG4gICAgICB9XG4gIDogbmV2ZXI7XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgUmVjb3JkIGZvciB0aGUgYGRlZmF1bHRgIG9wdGlvbiB0byBhZGRcbiAqIGF1dG8gc3VnZ2VzdGlvbiBzdXBwb3J0IGZvciBJREUncy5cbiAqL1xudHlwZSBEZWZhdWx0czxCIGV4dGVuZHMgQm9vbGVhblR5cGUsIFMgZXh0ZW5kcyBTdHJpbmdUeXBlPiA9IElkPFxuICBVbmlvblRvSW50ZXJzZWN0aW9uPFxuICAgICYgUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAgICAvLyBEZWRvdHRlZCBhdXRvIHN1Z2dlc3Rpb25zOiB7IGZvbzogeyBiYXI6IHVua25vd24gfSB9XG4gICAgJiBNYXBUeXBlczxTLCB1bmtub3duPlxuICAgICYgTWFwVHlwZXM8QiwgdW5rbm93bj5cbiAgICAvLyBGbGF0IGF1dG8gc3VnZ2VzdGlvbnM6IHsgXCJmb28uYmFyXCI6IHVua25vd24gfVxuICAgICYgTWFwRGVmYXVsdHM8Qj5cbiAgICAmIE1hcERlZmF1bHRzPFM+XG4gID5cbj47XG5cbnR5cGUgTWFwRGVmYXVsdHM8VCBleHRlbmRzIEFyZ1R5cGU+ID0gUGFydGlhbDxcbiAgUmVjb3JkPFQgZXh0ZW5kcyBzdHJpbmcgPyBUIDogc3RyaW5nLCB1bmtub3duPlxuPjtcblxudHlwZSBSZWN1cnNpdmVSZXF1aXJlZDxUPiA9IFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA/IHtcbiAgICBbSyBpbiBrZXlvZiBUXS0/OiBSZWN1cnNpdmVSZXF1aXJlZDxUW0tdPjtcbiAgfVxuICA6IFQ7XG5cbi8qKiBTYW1lIGFzIGBNYXBUeXBlc2AgYnV0IGFsc28gc3VwcG9ydHMgY29sbGVjdGFibGUgb3B0aW9ucy4gKi9cbnR5cGUgQ29sbGVjdFZhbHVlczxcbiAgVCBleHRlbmRzIEFyZ1R5cGUsXG4gIFYsXG4gIEMgZXh0ZW5kcyBDb2xsZWN0YWJsZSxcbiAgTiBleHRlbmRzIE5lZ2F0YWJsZSA9IHVuZGVmaW5lZCxcbj4gPSBVbmlvblRvSW50ZXJzZWN0aW9uPFxuICBDIGV4dGVuZHMgc3RyaW5nID8gXG4gICAgICAmIE1hcFR5cGVzPEV4Y2x1ZGU8VCwgQz4sIFYsIE4+XG4gICAgICAmIChUIGV4dGVuZHMgdW5kZWZpbmVkID8gUmVjb3JkPG5ldmVyLCBuZXZlcj4gOiBSZWN1cnNpdmVSZXF1aXJlZDxcbiAgICAgICAgTWFwVHlwZXM8RXh0cmFjdDxDLCBUPiwgQXJyYXk8Vj4sIE4+XG4gICAgICA+KVxuICAgIDogTWFwVHlwZXM8VCwgViwgTj5cbj47XG5cbi8qKiBTYW1lIGFzIGBSZWNvcmRgIGJ1dCBhbHNvIHN1cHBvcnRzIGRvdHRlZCBhbmQgbmVnYXRhYmxlIG9wdGlvbnMuICovXG50eXBlIE1hcFR5cGVzPFQgZXh0ZW5kcyBBcmdUeXBlLCBWLCBOIGV4dGVuZHMgTmVnYXRhYmxlID0gdW5kZWZpbmVkPiA9XG4gIHVuZGVmaW5lZCBleHRlbmRzIFQgPyBSZWNvcmQ8bmV2ZXIsIG5ldmVyPlxuICAgIDogVCBleHRlbmRzIGAke2luZmVyIE5hbWV9LiR7aW5mZXIgUmVzdH1gID8ge1xuICAgICAgICBbSyBpbiBOYW1lXT86IE1hcFR5cGVzPFxuICAgICAgICAgIFJlc3QsXG4gICAgICAgICAgVixcbiAgICAgICAgICBOIGV4dGVuZHMgYCR7TmFtZX0uJHtpbmZlciBOZWdhdGV9YCA/IE5lZ2F0ZSA6IHVuZGVmaW5lZFxuICAgICAgICA+O1xuICAgICAgfVxuICAgIDogVCBleHRlbmRzIHN0cmluZyA/IFBhcnRpYWw8UmVjb3JkPFQsIE4gZXh0ZW5kcyBUID8gViB8IGZhbHNlIDogVj4+XG4gICAgOiBSZWNvcmQ8bmV2ZXIsIG5ldmVyPjtcblxudHlwZSBDb2xsZWN0VW5rbm93blZhbHVlczxcbiAgQiBleHRlbmRzIEJvb2xlYW5UeXBlLFxuICBTIGV4dGVuZHMgU3RyaW5nVHlwZSxcbiAgQyBleHRlbmRzIENvbGxlY3RhYmxlLFxuICBOIGV4dGVuZHMgTmVnYXRhYmxlLFxuPiA9IEIgJiBTIGV4dGVuZHMgQyA/IFJlY29yZDxuZXZlciwgbmV2ZXI+XG4gIDogRGVkb3RSZWNvcmQ8XG4gICAgLy8gVW5rbm93biBjb2xsZWN0YWJsZSAmIG5vbi1uZWdhdGFibGUgYXJncy5cbiAgICAmIFJlY29yZDxcbiAgICAgIEV4Y2x1ZGU8XG4gICAgICAgIEV4dHJhY3Q8RXhjbHVkZTxDLCBOPiwgc3RyaW5nPixcbiAgICAgICAgRXh0cmFjdDxTIHwgQiwgc3RyaW5nPlxuICAgICAgPixcbiAgICAgIEFycmF5PHVua25vd24+XG4gICAgPlxuICAgIC8vIFVua25vd24gY29sbGVjdGFibGUgJiBuZWdhdGFibGUgYXJncy5cbiAgICAmIFJlY29yZDxcbiAgICAgIEV4Y2x1ZGU8XG4gICAgICAgIEV4dHJhY3Q8RXh0cmFjdDxDLCBOPiwgc3RyaW5nPixcbiAgICAgICAgRXh0cmFjdDxTIHwgQiwgc3RyaW5nPlxuICAgICAgPixcbiAgICAgIEFycmF5PHVua25vd24+IHwgZmFsc2VcbiAgICA+XG4gID47XG5cbi8qKiBDb252ZXJ0cyBgeyBcImZvby5iYXIuYmF6XCI6IHVua25vd24gfWAgaW50byBgeyBmb286IHsgYmFyOiB7IGJhejogdW5rbm93biB9IH0gfWAuICovXG50eXBlIERlZG90UmVjb3JkPFQ+ID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4gZXh0ZW5kcyBUID8gVFxuICA6IFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA/IFVuaW9uVG9JbnRlcnNlY3Rpb248XG4gICAgICBWYWx1ZU9mPFxuICAgICAgICB7IFtLIGluIGtleW9mIFRdOiBLIGV4dGVuZHMgc3RyaW5nID8gRGVkb3Q8SywgVFtLXT4gOiBuZXZlciB9XG4gICAgICA+XG4gICAgPlxuICA6IFQ7XG5cbnR5cGUgRGVkb3Q8VCBleHRlbmRzIHN0cmluZywgVj4gPSBUIGV4dGVuZHMgYCR7aW5mZXIgTmFtZX0uJHtpbmZlciBSZXN0fWBcbiAgPyB7IFtLIGluIE5hbWVdOiBEZWRvdDxSZXN0LCBWPiB9XG4gIDogeyBbSyBpbiBUXTogViB9O1xuXG50eXBlIFZhbHVlT2Y8VD4gPSBUW2tleW9mIFRdO1xuXG4vKiogVGhlIHZhbHVlIHJldHVybmVkIGZyb20gYHBhcnNlYC4gKi9cbmV4cG9ydCB0eXBlIEFyZ3M8XG4gIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gIEEgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIEREIGV4dGVuZHMgYm9vbGVhbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCxcbj4gPSBJZDxcbiAgJiBBXG4gICYge1xuICAgIC8qKiBDb250YWlucyBhbGwgdGhlIGFyZ3VtZW50cyB0aGF0IGRpZG4ndCBoYXZlIGFuIG9wdGlvbiBhc3NvY2lhdGVkIHdpdGhcbiAgICAgKiB0aGVtLiAqL1xuICAgIF86IEFycmF5PHN0cmluZyB8IG51bWJlcj47XG4gIH1cbiAgJiAoYm9vbGVhbiBleHRlbmRzIEREID8gRG91YmxlRGFzaFxuICAgIDogdHJ1ZSBleHRlbmRzIEREID8gUmVxdWlyZWQ8RG91YmxlRGFzaD5cbiAgICA6IFJlY29yZDxuZXZlciwgbmV2ZXI+KVxuPjtcblxudHlwZSBEb3VibGVEYXNoID0ge1xuICAvKiogQ29udGFpbnMgYWxsIHRoZSBhcmd1bWVudHMgdGhhdCBhcHBlYXIgYWZ0ZXIgdGhlIGRvdWJsZSBkYXNoOiBcIi0tXCIuICovXG4gIFwiLS1cIj86IEFycmF5PHN0cmluZz47XG59O1xuXG4vKiogVGhlIG9wdGlvbnMgZm9yIHRoZSBgcGFyc2VgIGNhbGwuICovXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlT3B0aW9uczxcbiAgQiBleHRlbmRzIEJvb2xlYW5UeXBlID0gQm9vbGVhblR5cGUsXG4gIFMgZXh0ZW5kcyBTdHJpbmdUeXBlID0gU3RyaW5nVHlwZSxcbiAgQyBleHRlbmRzIENvbGxlY3RhYmxlID0gQ29sbGVjdGFibGUsXG4gIE4gZXh0ZW5kcyBOZWdhdGFibGUgPSBOZWdhdGFibGUsXG4gIEQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IHVuZGVmaW5lZCA9XG4gICAgfCBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICAgIHwgdW5kZWZpbmVkLFxuICBBIGV4dGVuZHMgQWxpYXNlczxzdHJpbmcsIHN0cmluZz4gfCB1bmRlZmluZWQgPVxuICAgIHwgQWxpYXNlczxzdHJpbmcsIHN0cmluZz5cbiAgICB8IHVuZGVmaW5lZCxcbiAgREQgZXh0ZW5kcyBib29sZWFuIHwgdW5kZWZpbmVkID0gYm9vbGVhbiB8IHVuZGVmaW5lZCxcbj4ge1xuICAvKiogV2hlbiBgdHJ1ZWAsIHBvcHVsYXRlIHRoZSByZXN1bHQgYF9gIHdpdGggZXZlcnl0aGluZyBiZWZvcmUgdGhlIGAtLWAgYW5kXG4gICAqIHRoZSByZXN1bHQgYFsnLS0nXWAgd2l0aCBldmVyeXRoaW5nIGFmdGVyIHRoZSBgLS1gLiBIZXJlJ3MgYW4gZXhhbXBsZTpcbiAgICpcbiAgICogYGBgdHNcbiAgICogLy8gJCBkZW5vIHJ1biBleGFtcGxlLnRzIC0tIGEgYXJnMVxuICAgKiBpbXBvcnQgeyBwYXJzZSB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAJFNURF9WRVJTSU9OL2ZsYWdzL21vZC50c1wiO1xuICAgKiBjb25zb2xlLmRpcihwYXJzZShEZW5vLmFyZ3MsIHsgXCItLVwiOiBmYWxzZSB9KSk7XG4gICAqIC8vIG91dHB1dDogeyBfOiBbIFwiYVwiLCBcImFyZzFcIiBdIH1cbiAgICogY29uc29sZS5kaXIocGFyc2UoRGVuby5hcmdzLCB7IFwiLS1cIjogdHJ1ZSB9KSk7XG4gICAqIC8vIG91dHB1dDogeyBfOiBbXSwgLS06IFsgXCJhXCIsIFwiYXJnMVwiIF0gfVxuICAgKiBgYGBcbiAgICpcbiAgICogRGVmYXVsdHMgdG8gYGZhbHNlYC5cbiAgICovXG4gIFwiLS1cIj86IEREO1xuXG4gIC8qKiBBbiBvYmplY3QgbWFwcGluZyBzdHJpbmcgbmFtZXMgdG8gc3RyaW5ncyBvciBhcnJheXMgb2Ygc3RyaW5nIGFyZ3VtZW50XG4gICAqIG5hbWVzIHRvIHVzZSBhcyBhbGlhc2VzLiAqL1xuICBhbGlhcz86IEE7XG5cbiAgLyoqIEEgYm9vbGVhbiwgc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZ3MgdG8gYWx3YXlzIHRyZWF0IGFzIGJvb2xlYW5zLiBJZlxuICAgKiBgdHJ1ZWAgd2lsbCB0cmVhdCBhbGwgZG91YmxlIGh5cGhlbmF0ZWQgYXJndW1lbnRzIHdpdGhvdXQgZXF1YWwgc2lnbnMgYXNcbiAgICogYGJvb2xlYW5gIChlLmcuIGFmZmVjdHMgYC0tZm9vYCwgbm90IGAtZmAgb3IgYC0tZm9vPWJhcmApICovXG4gIGJvb2xlYW4/OiBCIHwgUmVhZG9ubHlBcnJheTxFeHRyYWN0PEIsIHN0cmluZz4+O1xuXG4gIC8qKiBBbiBvYmplY3QgbWFwcGluZyBzdHJpbmcgYXJndW1lbnQgbmFtZXMgdG8gZGVmYXVsdCB2YWx1ZXMuICovXG4gIGRlZmF1bHQ/OiBEICYgRGVmYXVsdHM8QiwgUz47XG5cbiAgLyoqIFdoZW4gYHRydWVgLCBwb3B1bGF0ZSB0aGUgcmVzdWx0IGBfYCB3aXRoIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0XG4gICAqIG5vbi1vcHRpb24uICovXG4gIHN0b3BFYXJseT86IGJvb2xlYW47XG5cbiAgLyoqIEEgc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZ3MgYXJndW1lbnQgbmFtZXMgdG8gYWx3YXlzIHRyZWF0IGFzIHN0cmluZ3MuICovXG4gIHN0cmluZz86IFMgfCBSZWFkb25seUFycmF5PEV4dHJhY3Q8Uywgc3RyaW5nPj47XG5cbiAgLyoqIEEgc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZ3MgYXJndW1lbnQgbmFtZXMgdG8gYWx3YXlzIHRyZWF0IGFzIGFycmF5cy5cbiAgICogQ29sbGVjdGFibGUgb3B0aW9ucyBjYW4gYmUgdXNlZCBtdWx0aXBsZSB0aW1lcy4gQWxsIHZhbHVlcyB3aWxsIGJlXG4gICAqIGNvbGxlY3RlZCBpbnRvIG9uZSBhcnJheS4gSWYgYSBub24tY29sbGVjdGFibGUgb3B0aW9uIGlzIHVzZWQgbXVsdGlwbGVcbiAgICogdGltZXMsIHRoZSBsYXN0IHZhbHVlIGlzIHVzZWQuICovXG4gIGNvbGxlY3Q/OiBDIHwgUmVhZG9ubHlBcnJheTxFeHRyYWN0PEMsIHN0cmluZz4+O1xuXG4gIC8qKiBBIHN0cmluZyBvciBhcnJheSBvZiBzdHJpbmdzIGFyZ3VtZW50IG5hbWVzIHdoaWNoIGNhbiBiZSBuZWdhdGVkXG4gICAqIGJ5IHByZWZpeGluZyB0aGVtIHdpdGggYC0tbm8tYCwgbGlrZSBgLS1uby1jb25maWdgLiAqL1xuICBuZWdhdGFibGU/OiBOIHwgUmVhZG9ubHlBcnJheTxFeHRyYWN0PE4sIHN0cmluZz4+O1xuXG4gIC8qKiBBIGZ1bmN0aW9uIHdoaWNoIGlzIGludm9rZWQgd2l0aCBhIGNvbW1hbmQgbGluZSBwYXJhbWV0ZXIgbm90IGRlZmluZWQgaW5cbiAgICogdGhlIGBvcHRpb25zYCBjb25maWd1cmF0aW9uIG9iamVjdC4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgYGZhbHNlYCwgdGhlXG4gICAqIHVua25vd24gb3B0aW9uIGlzIG5vdCBhZGRlZCB0byBgcGFyc2VkQXJnc2AuICovXG4gIHVua25vd24/OiAoYXJnOiBzdHJpbmcsIGtleT86IHN0cmluZywgdmFsdWU/OiB1bmtub3duKSA9PiB1bmtub3duO1xufVxuXG5pbnRlcmZhY2UgRmxhZ3Mge1xuICBib29sczogUmVjb3JkPHN0cmluZywgYm9vbGVhbj47XG4gIHN0cmluZ3M6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+O1xuICBjb2xsZWN0OiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPjtcbiAgbmVnYXRhYmxlOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPjtcbiAgdW5rbm93bkZuOiAoYXJnOiBzdHJpbmcsIGtleT86IHN0cmluZywgdmFsdWU/OiB1bmtub3duKSA9PiB1bmtub3duO1xuICBhbGxCb29sczogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIE5lc3RlZE1hcHBpbmcge1xuICBba2V5OiBzdHJpbmddOiBOZXN0ZWRNYXBwaW5nIHwgdW5rbm93bjtcbn1cblxuY29uc3QgeyBoYXNPd24gfSA9IE9iamVjdDtcblxuZnVuY3Rpb24gZ2V0PFQ+KG9iajogUmVjb3JkPHN0cmluZywgVD4sIGtleTogc3RyaW5nKTogVCB8IHVuZGVmaW5lZCB7XG4gIGlmIChoYXNPd24ob2JqLCBrZXkpKSB7XG4gICAgcmV0dXJuIG9ialtrZXldO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEZvcmNlPFQ+KG9iajogUmVjb3JkPHN0cmluZywgVD4sIGtleTogc3RyaW5nKTogVCB7XG4gIGNvbnN0IHYgPSBnZXQob2JqLCBrZXkpO1xuICBhc3NlcnQodiAhPSBudWxsKTtcbiAgcmV0dXJuIHY7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKHg6IHVua25vd24pOiBib29sZWFuIHtcbiAgaWYgKHR5cGVvZiB4ID09PSBcIm51bWJlclwiKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKC9eMHhbMC05YS1mXSskL2kudGVzdChTdHJpbmcoeCkpKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIC9eWy0rXT8oPzpcXGQrKD86XFwuXFxkKik/fFxcLlxcZCspKGVbLStdP1xcZCspPyQvLnRlc3QoU3RyaW5nKHgpKTtcbn1cblxuZnVuY3Rpb24gaGFzS2V5KG9iajogTmVzdGVkTWFwcGluZywga2V5czogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgbGV0IG8gPSBvYmo7XG4gIGtleXMuc2xpY2UoMCwgLTEpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIG8gPSAoZ2V0KG8sIGtleSkgPz8ge30pIGFzIE5lc3RlZE1hcHBpbmc7XG4gIH0pO1xuXG4gIGNvbnN0IGtleSA9IGtleXNba2V5cy5sZW5ndGggLSAxXTtcbiAgcmV0dXJuIGhhc093bihvLCBrZXkpO1xufVxuXG4vKiogVGFrZSBhIHNldCBvZiBjb21tYW5kIGxpbmUgYXJndW1lbnRzLCBvcHRpb25hbGx5IHdpdGggYSBzZXQgb2Ygb3B0aW9ucywgYW5kXG4gKiByZXR1cm4gYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgZmxhZ3MgZm91bmQgaW4gdGhlIHBhc3NlZCBhcmd1bWVudHMuXG4gKlxuICogQnkgZGVmYXVsdCwgYW55IGFyZ3VtZW50cyBzdGFydGluZyB3aXRoIGAtYCBvciBgLS1gIGFyZSBjb25zaWRlcmVkIGJvb2xlYW5cbiAqIGZsYWdzLiBJZiB0aGUgYXJndW1lbnQgbmFtZSBpcyBmb2xsb3dlZCBieSBhbiBlcXVhbCBzaWduIChgPWApIGl0IGlzXG4gKiBjb25zaWRlcmVkIGEga2V5LXZhbHVlIHBhaXIuIEFueSBhcmd1bWVudHMgd2hpY2ggY291bGQgbm90IGJlIHBhcnNlZCBhcmVcbiAqIGF2YWlsYWJsZSBpbiB0aGUgYF9gIHByb3BlcnR5IG9mIHRoZSByZXR1cm5lZCBvYmplY3QuXG4gKlxuICogYGBgdHNcbiAqIGltcG9ydCB7IHBhcnNlIH0gZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAkU1REX1ZFUlNJT04vZmxhZ3MvbW9kLnRzXCI7XG4gKiBjb25zdCBwYXJzZWRBcmdzID0gcGFyc2UoRGVuby5hcmdzKTtcbiAqIGBgYFxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBwYXJzZSB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAJFNURF9WRVJTSU9OL2ZsYWdzL21vZC50c1wiO1xuICogY29uc3QgcGFyc2VkQXJncyA9IHBhcnNlKFtcIi0tZm9vXCIsIFwiLS1iYXI9YmF6XCIsIFwiLi9xdXV4LnR4dFwiXSk7XG4gKiAvLyBwYXJzZWRBcmdzOiB7IGZvbzogdHJ1ZSwgYmFyOiBcImJhelwiLCBfOiBbXCIuL3F1dXgudHh0XCJdIH1cbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2U8XG4gIFYgZXh0ZW5kcyBWYWx1ZXM8QiwgUywgQywgTiwgRCwgQT4sXG4gIEREIGV4dGVuZHMgYm9vbGVhbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCxcbiAgQiBleHRlbmRzIEJvb2xlYW5UeXBlID0gdW5kZWZpbmVkLFxuICBTIGV4dGVuZHMgU3RyaW5nVHlwZSA9IHVuZGVmaW5lZCxcbiAgQyBleHRlbmRzIENvbGxlY3RhYmxlID0gdW5kZWZpbmVkLFxuICBOIGV4dGVuZHMgTmVnYXRhYmxlID0gdW5kZWZpbmVkLFxuICBEIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQsXG4gIEEgZXh0ZW5kcyBBbGlhc2VzPEFLLCBBVj4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQsXG4gIEFLIGV4dGVuZHMgc3RyaW5nID0gc3RyaW5nLFxuICBBViBleHRlbmRzIHN0cmluZyA9IHN0cmluZyxcbj4oXG4gIGFyZ3M6IHN0cmluZ1tdLFxuICB7XG4gICAgXCItLVwiOiBkb3VibGVEYXNoID0gZmFsc2UsXG4gICAgYWxpYXMgPSB7fSBhcyBOb25OdWxsYWJsZTxBPixcbiAgICBib29sZWFuID0gZmFsc2UsXG4gICAgZGVmYXVsdDogZGVmYXVsdHMgPSB7fSBhcyBEICYgRGVmYXVsdHM8QiwgUz4sXG4gICAgc3RvcEVhcmx5ID0gZmFsc2UsXG4gICAgc3RyaW5nID0gW10sXG4gICAgY29sbGVjdCA9IFtdLFxuICAgIG5lZ2F0YWJsZSA9IFtdLFxuICAgIHVua25vd24gPSAoaTogc3RyaW5nKTogdW5rbm93biA9PiBpLFxuICB9OiBQYXJzZU9wdGlvbnM8QiwgUywgQywgTiwgRCwgQSwgREQ+ID0ge30sXG4pOiBBcmdzPFYsIEREPiB7XG4gIGNvbnN0IGFsaWFzZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPiA9IHt9O1xuICBjb25zdCBmbGFnczogRmxhZ3MgPSB7XG4gICAgYm9vbHM6IHt9LFxuICAgIHN0cmluZ3M6IHt9LFxuICAgIHVua25vd25GbjogdW5rbm93bixcbiAgICBhbGxCb29sczogZmFsc2UsXG4gICAgY29sbGVjdDoge30sXG4gICAgbmVnYXRhYmxlOiB7fSxcbiAgfTtcblxuICBpZiAoYWxpYXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGFsaWFzKSB7XG4gICAgICBjb25zdCB2YWwgPSBnZXRGb3JjZShhbGlhcywga2V5KTtcbiAgICAgIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGFsaWFzZXNba2V5XSA9IFt2YWxdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxpYXNlc1trZXldID0gdmFsIGFzIEFycmF5PHN0cmluZz47XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGFsaWFzIG9mIGdldEZvcmNlKGFsaWFzZXMsIGtleSkpIHtcbiAgICAgICAgYWxpYXNlc1thbGlhc10gPSBba2V5XS5jb25jYXQoYWxpYXNlc1trZXldLmZpbHRlcigoeSkgPT4gYWxpYXMgIT09IHkpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoYm9vbGVhbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHR5cGVvZiBib29sZWFuID09PSBcImJvb2xlYW5cIikge1xuICAgICAgZmxhZ3MuYWxsQm9vbHMgPSAhIWJvb2xlYW47XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGJvb2xlYW5BcmdzOiBSZWFkb25seUFycmF5PHN0cmluZz4gPSB0eXBlb2YgYm9vbGVhbiA9PT0gXCJzdHJpbmdcIlxuICAgICAgICA/IFtib29sZWFuXVxuICAgICAgICA6IGJvb2xlYW47XG5cbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIGJvb2xlYW5BcmdzLmZpbHRlcihCb29sZWFuKSkge1xuICAgICAgICBmbGFncy5ib29sc1trZXldID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgYWxpYXMgPSBnZXQoYWxpYXNlcywga2V5KTtcbiAgICAgICAgaWYgKGFsaWFzKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBhbCBvZiBhbGlhcykge1xuICAgICAgICAgICAgZmxhZ3MuYm9vbHNbYWxdID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoc3RyaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBzdHJpbmdBcmdzOiBSZWFkb25seUFycmF5PHN0cmluZz4gPSB0eXBlb2Ygc3RyaW5nID09PSBcInN0cmluZ1wiXG4gICAgICA/IFtzdHJpbmddXG4gICAgICA6IHN0cmluZztcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIHN0cmluZ0FyZ3MuZmlsdGVyKEJvb2xlYW4pKSB7XG4gICAgICBmbGFncy5zdHJpbmdzW2tleV0gPSB0cnVlO1xuICAgICAgY29uc3QgYWxpYXMgPSBnZXQoYWxpYXNlcywga2V5KTtcbiAgICAgIGlmIChhbGlhcykge1xuICAgICAgICBmb3IgKGNvbnN0IGFsIG9mIGFsaWFzKSB7XG4gICAgICAgICAgZmxhZ3Muc3RyaW5nc1thbF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvbGxlY3QgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGNvbGxlY3RBcmdzOiBSZWFkb25seUFycmF5PHN0cmluZz4gPSB0eXBlb2YgY29sbGVjdCA9PT0gXCJzdHJpbmdcIlxuICAgICAgPyBbY29sbGVjdF1cbiAgICAgIDogY29sbGVjdDtcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIGNvbGxlY3RBcmdzLmZpbHRlcihCb29sZWFuKSkge1xuICAgICAgZmxhZ3MuY29sbGVjdFtrZXldID0gdHJ1ZTtcbiAgICAgIGNvbnN0IGFsaWFzID0gZ2V0KGFsaWFzZXMsIGtleSk7XG4gICAgICBpZiAoYWxpYXMpIHtcbiAgICAgICAgZm9yIChjb25zdCBhbCBvZiBhbGlhcykge1xuICAgICAgICAgIGZsYWdzLmNvbGxlY3RbYWxdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChuZWdhdGFibGUgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IG5lZ2F0YWJsZUFyZ3M6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiA9IHR5cGVvZiBuZWdhdGFibGUgPT09IFwic3RyaW5nXCJcbiAgICAgID8gW25lZ2F0YWJsZV1cbiAgICAgIDogbmVnYXRhYmxlO1xuXG4gICAgZm9yIChjb25zdCBrZXkgb2YgbmVnYXRhYmxlQXJncy5maWx0ZXIoQm9vbGVhbikpIHtcbiAgICAgIGZsYWdzLm5lZ2F0YWJsZVtrZXldID0gdHJ1ZTtcbiAgICAgIGNvbnN0IGFsaWFzID0gZ2V0KGFsaWFzZXMsIGtleSk7XG4gICAgICBpZiAoYWxpYXMpIHtcbiAgICAgICAgZm9yIChjb25zdCBhbCBvZiBhbGlhcykge1xuICAgICAgICAgIGZsYWdzLm5lZ2F0YWJsZVthbF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgYXJndjogQXJncyA9IHsgXzogW10gfTtcblxuICBmdW5jdGlvbiBhcmdEZWZpbmVkKGtleTogc3RyaW5nLCBhcmc6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICAoZmxhZ3MuYWxsQm9vbHMgJiYgL14tLVtePV0rJC8udGVzdChhcmcpKSB8fFxuICAgICAgZ2V0KGZsYWdzLmJvb2xzLCBrZXkpIHx8XG4gICAgICAhIWdldChmbGFncy5zdHJpbmdzLCBrZXkpIHx8XG4gICAgICAhIWdldChhbGlhc2VzLCBrZXkpXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEtleShcbiAgICBvYmo6IE5lc3RlZE1hcHBpbmcsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHZhbHVlOiB1bmtub3duLFxuICAgIGNvbGxlY3QgPSB0cnVlLFxuICApIHtcbiAgICBsZXQgbyA9IG9iajtcbiAgICBjb25zdCBrZXlzID0gbmFtZS5zcGxpdChcIi5cIik7XG4gICAga2V5cy5zbGljZSgwLCAtMSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBpZiAoZ2V0KG8sIGtleSkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvW2tleV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIG8gPSBnZXQobywga2V5KSBhcyBOZXN0ZWRNYXBwaW5nO1xuICAgIH0pO1xuXG4gICAgY29uc3Qga2V5ID0ga2V5c1trZXlzLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IGNvbGxlY3RhYmxlID0gY29sbGVjdCAmJiAhIWdldChmbGFncy5jb2xsZWN0LCBuYW1lKTtcblxuICAgIGlmICghY29sbGVjdGFibGUpIHtcbiAgICAgIG9ba2V5XSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAoZ2V0KG8sIGtleSkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgb1trZXldID0gW3ZhbHVlXTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZ2V0KG8sIGtleSkpKSB7XG4gICAgICAob1trZXldIGFzIHVua25vd25bXSkucHVzaCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ba2V5XSA9IFtnZXQobywga2V5KSwgdmFsdWVdO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEFyZyhcbiAgICBrZXk6IHN0cmluZyxcbiAgICB2YWw6IHVua25vd24sXG4gICAgYXJnOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQsXG4gICAgY29sbGVjdD86IGJvb2xlYW4sXG4gICkge1xuICAgIGlmIChhcmcgJiYgZmxhZ3MudW5rbm93bkZuICYmICFhcmdEZWZpbmVkKGtleSwgYXJnKSkge1xuICAgICAgaWYgKGZsYWdzLnVua25vd25GbihhcmcsIGtleSwgdmFsKSA9PT0gZmFsc2UpIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9ICFnZXQoZmxhZ3Muc3RyaW5ncywga2V5KSAmJiBpc051bWJlcih2YWwpID8gTnVtYmVyKHZhbCkgOiB2YWw7XG4gICAgc2V0S2V5KGFyZ3YsIGtleSwgdmFsdWUsIGNvbGxlY3QpO1xuXG4gICAgY29uc3QgYWxpYXMgPSBnZXQoYWxpYXNlcywga2V5KTtcbiAgICBpZiAoYWxpYXMpIHtcbiAgICAgIGZvciAoY29uc3QgeCBvZiBhbGlhcykge1xuICAgICAgICBzZXRLZXkoYXJndiwgeCwgdmFsdWUsIGNvbGxlY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFsaWFzSXNCb29sZWFuKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGdldEZvcmNlKGFsaWFzZXMsIGtleSkuc29tZShcbiAgICAgICh4KSA9PiB0eXBlb2YgZ2V0KGZsYWdzLmJvb2xzLCB4KSA9PT0gXCJib29sZWFuXCIsXG4gICAgKTtcbiAgfVxuXG4gIGxldCBub3RGbGFnczogc3RyaW5nW10gPSBbXTtcblxuICAvLyBhbGwgYXJncyBhZnRlciBcIi0tXCIgYXJlIG5vdCBwYXJzZWRcbiAgaWYgKGFyZ3MuaW5jbHVkZXMoXCItLVwiKSkge1xuICAgIG5vdEZsYWdzID0gYXJncy5zbGljZShhcmdzLmluZGV4T2YoXCItLVwiKSArIDEpO1xuICAgIGFyZ3MgPSBhcmdzLnNsaWNlKDAsIGFyZ3MuaW5kZXhPZihcIi0tXCIpKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGFyZyA9IGFyZ3NbaV07XG5cbiAgICBpZiAoL14tLS4rPS8udGVzdChhcmcpKSB7XG4gICAgICBjb25zdCBtID0gYXJnLm1hdGNoKC9eLS0oW149XSspPSguKikkL3MpO1xuICAgICAgYXNzZXJ0KG0gIT0gbnVsbCk7XG4gICAgICBjb25zdCBbLCBrZXksIHZhbHVlXSA9IG07XG5cbiAgICAgIGlmIChmbGFncy5ib29sc1trZXldKSB7XG4gICAgICAgIGNvbnN0IGJvb2xlYW5WYWx1ZSA9IHZhbHVlICE9PSBcImZhbHNlXCI7XG4gICAgICAgIHNldEFyZyhrZXksIGJvb2xlYW5WYWx1ZSwgYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldEFyZyhrZXksIHZhbHVlLCBhcmcpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICAvXi0tbm8tLisvLnRlc3QoYXJnKSAmJiBnZXQoZmxhZ3MubmVnYXRhYmxlLCBhcmcucmVwbGFjZSgvXi0tbm8tLywgXCJcIikpXG4gICAgKSB7XG4gICAgICBjb25zdCBtID0gYXJnLm1hdGNoKC9eLS1uby0oLispLyk7XG4gICAgICBhc3NlcnQobSAhPSBudWxsKTtcbiAgICAgIHNldEFyZyhtWzFdLCBmYWxzZSwgYXJnLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmICgvXi0tLisvLnRlc3QoYXJnKSkge1xuICAgICAgY29uc3QgbSA9IGFyZy5tYXRjaCgvXi0tKC4rKS8pO1xuICAgICAgYXNzZXJ0KG0gIT0gbnVsbCk7XG4gICAgICBjb25zdCBbLCBrZXldID0gbTtcbiAgICAgIGNvbnN0IG5leHQgPSBhcmdzW2kgKyAxXTtcbiAgICAgIGlmIChcbiAgICAgICAgbmV4dCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICEvXi0vLnRlc3QobmV4dCkgJiZcbiAgICAgICAgIWdldChmbGFncy5ib29scywga2V5KSAmJlxuICAgICAgICAhZmxhZ3MuYWxsQm9vbHMgJiZcbiAgICAgICAgKGdldChhbGlhc2VzLCBrZXkpID8gIWFsaWFzSXNCb29sZWFuKGtleSkgOiB0cnVlKVxuICAgICAgKSB7XG4gICAgICAgIHNldEFyZyhrZXksIG5leHQsIGFyZyk7XG4gICAgICAgIGkrKztcbiAgICAgIH0gZWxzZSBpZiAoL14odHJ1ZXxmYWxzZSkkLy50ZXN0KG5leHQpKSB7XG4gICAgICAgIHNldEFyZyhrZXksIG5leHQgPT09IFwidHJ1ZVwiLCBhcmcpO1xuICAgICAgICBpKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRBcmcoa2V5LCBnZXQoZmxhZ3Muc3RyaW5ncywga2V5KSA/IFwiXCIgOiB0cnVlLCBhcmcpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoL14tW14tXSsvLnRlc3QoYXJnKSkge1xuICAgICAgY29uc3QgbGV0dGVycyA9IGFyZy5zbGljZSgxLCAtMSkuc3BsaXQoXCJcIik7XG5cbiAgICAgIGxldCBicm9rZW4gPSBmYWxzZTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGV0dGVycy5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25zdCBuZXh0ID0gYXJnLnNsaWNlKGogKyAyKTtcblxuICAgICAgICBpZiAobmV4dCA9PT0gXCItXCIpIHtcbiAgICAgICAgICBzZXRBcmcobGV0dGVyc1tqXSwgbmV4dCwgYXJnKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgvW0EtWmEtel0vLnRlc3QobGV0dGVyc1tqXSkgJiYgLz0vLnRlc3QobmV4dCkpIHtcbiAgICAgICAgICBzZXRBcmcobGV0dGVyc1tqXSwgbmV4dC5zcGxpdCgvPSguKykvKVsxXSwgYXJnKTtcbiAgICAgICAgICBicm9rZW4gPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIC9bQS1aYS16XS8udGVzdChsZXR0ZXJzW2pdKSAmJlxuICAgICAgICAgIC8tP1xcZCsoXFwuXFxkKik/KGUtP1xcZCspPyQvLnRlc3QobmV4dClcbiAgICAgICAgKSB7XG4gICAgICAgICAgc2V0QXJnKGxldHRlcnNbal0sIG5leHQsIGFyZyk7XG4gICAgICAgICAgYnJva2VuID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsZXR0ZXJzW2ogKyAxXSAmJiBsZXR0ZXJzW2ogKyAxXS5tYXRjaCgvXFxXLykpIHtcbiAgICAgICAgICBzZXRBcmcobGV0dGVyc1tqXSwgYXJnLnNsaWNlKGogKyAyKSwgYXJnKTtcbiAgICAgICAgICBicm9rZW4gPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldEFyZyhsZXR0ZXJzW2pdLCBnZXQoZmxhZ3Muc3RyaW5ncywgbGV0dGVyc1tqXSkgPyBcIlwiIDogdHJ1ZSwgYXJnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBba2V5XSA9IGFyZy5zbGljZSgtMSk7XG4gICAgICBpZiAoIWJyb2tlbiAmJiBrZXkgIT09IFwiLVwiKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhcmdzW2kgKyAxXSAmJlxuICAgICAgICAgICEvXigtfC0tKVteLV0vLnRlc3QoYXJnc1tpICsgMV0pICYmXG4gICAgICAgICAgIWdldChmbGFncy5ib29scywga2V5KSAmJlxuICAgICAgICAgIChnZXQoYWxpYXNlcywga2V5KSA/ICFhbGlhc0lzQm9vbGVhbihrZXkpIDogdHJ1ZSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgc2V0QXJnKGtleSwgYXJnc1tpICsgMV0sIGFyZyk7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3NbaSArIDFdICYmIC9eKHRydWV8ZmFsc2UpJC8udGVzdChhcmdzW2kgKyAxXSkpIHtcbiAgICAgICAgICBzZXRBcmcoa2V5LCBhcmdzW2kgKyAxXSA9PT0gXCJ0cnVlXCIsIGFyZyk7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldEFyZyhrZXksIGdldChmbGFncy5zdHJpbmdzLCBrZXkpID8gXCJcIiA6IHRydWUsIGFyZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFmbGFncy51bmtub3duRm4gfHwgZmxhZ3MudW5rbm93bkZuKGFyZykgIT09IGZhbHNlKSB7XG4gICAgICAgIGFyZ3YuXy5wdXNoKGZsYWdzLnN0cmluZ3NbXCJfXCJdID8/ICFpc051bWJlcihhcmcpID8gYXJnIDogTnVtYmVyKGFyZykpO1xuICAgICAgfVxuICAgICAgaWYgKHN0b3BFYXJseSkge1xuICAgICAgICBhcmd2Ll8ucHVzaCguLi5hcmdzLnNsaWNlKGkgKyAxKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRlZmF1bHRzKSkge1xuICAgIGlmICghaGFzS2V5KGFyZ3YsIGtleS5zcGxpdChcIi5cIikpKSB7XG4gICAgICBzZXRLZXkoYXJndiwga2V5LCB2YWx1ZSk7XG5cbiAgICAgIGlmIChhbGlhc2VzW2tleV0pIHtcbiAgICAgICAgZm9yIChjb25zdCB4IG9mIGFsaWFzZXNba2V5XSkge1xuICAgICAgICAgIHNldEtleShhcmd2LCB4LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhmbGFncy5ib29scykpIHtcbiAgICBpZiAoIWhhc0tleShhcmd2LCBrZXkuc3BsaXQoXCIuXCIpKSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBnZXQoZmxhZ3MuY29sbGVjdCwga2V5KSA/IFtdIDogZmFsc2U7XG4gICAgICBzZXRLZXkoXG4gICAgICAgIGFyZ3YsXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGZhbHNlLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhmbGFncy5zdHJpbmdzKSkge1xuICAgIGlmICghaGFzS2V5KGFyZ3YsIGtleS5zcGxpdChcIi5cIikpICYmIGdldChmbGFncy5jb2xsZWN0LCBrZXkpKSB7XG4gICAgICBzZXRLZXkoXG4gICAgICAgIGFyZ3YsXG4gICAgICAgIGtleSxcbiAgICAgICAgW10sXG4gICAgICAgIGZhbHNlLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoZG91YmxlRGFzaCkge1xuICAgIGFyZ3ZbXCItLVwiXSA9IFtdO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIG5vdEZsYWdzKSB7XG4gICAgICBhcmd2W1wiLS1cIl0ucHVzaChrZXkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBub3RGbGFncykge1xuICAgICAgYXJndi5fLnB1c2goa2V5KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXJndiBhcyBBcmdzPFYsIEREPjtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUU7Ozs7Ozs7Q0FPQyxHQUNELFNBQVMsTUFBTSxRQUFRLHNCQUFzQjtBQThSN0MsTUFBTSxFQUFFLE9BQU0sRUFBRSxHQUFHO0FBRW5CLFNBQVMsSUFBTyxHQUFzQixFQUFFLEdBQVcsRUFBaUI7SUFDbEUsSUFBSSxPQUFPLEtBQUssTUFBTTtRQUNwQixPQUFPLEdBQUcsQ0FBQyxJQUFJO0lBQ2pCLENBQUM7QUFDSDtBQUVBLFNBQVMsU0FBWSxHQUFzQixFQUFFLEdBQVcsRUFBSztJQUMzRCxNQUFNLElBQUksSUFBSSxLQUFLO0lBQ25CLE9BQU8sS0FBSyxJQUFJO0lBQ2hCLE9BQU87QUFDVDtBQUVBLFNBQVMsU0FBUyxDQUFVLEVBQVc7SUFDckMsSUFBSSxPQUFPLE1BQU0sVUFBVSxPQUFPLElBQUk7SUFDdEMsSUFBSSxpQkFBaUIsSUFBSSxDQUFDLE9BQU8sS0FBSyxPQUFPLElBQUk7SUFDakQsT0FBTyw2Q0FBNkMsSUFBSSxDQUFDLE9BQU87QUFDbEU7QUFFQSxTQUFTLE9BQU8sR0FBa0IsRUFBRSxJQUFjLEVBQVc7SUFDM0QsSUFBSSxJQUFJO0lBQ1IsS0FBSyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsTUFBUTtRQUNqQyxJQUFLLElBQUksR0FBRyxRQUFRLENBQUM7SUFDdkI7SUFFQSxNQUFNLE1BQU0sSUFBSSxDQUFDLEtBQUssTUFBTSxHQUFHLEVBQUU7SUFDakMsT0FBTyxPQUFPLEdBQUc7QUFDbkI7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBa0JDLEdBQ0QsT0FBTyxTQUFTLE1BWWQsSUFB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