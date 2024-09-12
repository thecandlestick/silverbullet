// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// Copyright Joyent, Inc. and Node.js contributors. All rights reserved. MIT license.
import { notImplemented, warnNotImplemented } from "./_utils.ts";
import { EventEmitter } from "./events.ts";
import { validateString } from "./internal/validators.mjs";
import { ERR_INVALID_ARG_TYPE, ERR_UNKNOWN_SIGNAL, errnoException } from "./internal/errors.ts";
import { getOptionValue } from "./internal/options.ts";
import { assert } from "../_util/asserts.ts";
import { fromFileUrl, join } from "../path/mod.ts";
import { arch, chdir, cwd, env, nextTick as _nextTick, pid, platform, version, versions } from "./_process/process.ts";
import { _exiting } from "./_process/exiting.ts";
export { _nextTick as nextTick, arch, argv, chdir, cwd, env, pid, platform, version, versions };
import { stderr as stderr_, stdin as stdin_, stdout as stdout_ } from "./_process/streams.mjs";
import { core } from "./_core.ts";
import { processTicksAndRejections } from "./_next_tick.ts";
// TODO(kt3k): Give better types to stdio objects
// deno-lint-ignore no-explicit-any
const stderr = stderr_;
// deno-lint-ignore no-explicit-any
const stdin = stdin_;
// deno-lint-ignore no-explicit-any
const stdout = stdout_;
export { stderr, stdin, stdout };
import { getBinding } from "./internal_binding/mod.ts";
import * as constants from "./internal_binding/constants.ts";
import * as uv from "./internal_binding/uv.ts";
import { buildAllowedFlags } from "./internal/process/per_thread.mjs";
// @ts-ignore Deno[Deno.internal] is used on purpose here
const DenoCommand = Deno[Deno.internal]?.nodeUnstable?.Command || Deno.Command;
const notImplementedEvents = [
    "disconnect",
    "message",
    "multipleResolves",
    "rejectionHandled",
    "worker"
];
// The first 2 items are placeholders.
// They will be overwritten by the below Object.defineProperty calls.
const argv = [
    "",
    "",
    ...Deno.args
];
// Overwrites the 1st item with getter.
Object.defineProperty(argv, "0", {
    get: Deno.execPath
});
// Overwrites the 2st item with getter.
Object.defineProperty(argv, "1", {
    get: ()=>{
        if (Deno.mainModule.startsWith("file:")) {
            return fromFileUrl(Deno.mainModule);
        } else {
            return join(Deno.cwd(), "$deno$node.js");
        }
    }
});
/** https://nodejs.org/api/process.html#process_process_exit_code */ export const exit = (code)=>{
    if (code || code === 0) {
        if (typeof code === "string") {
            const parsedCode = parseInt(code);
            process.exitCode = isNaN(parsedCode) ? undefined : parsedCode;
        } else {
            process.exitCode = code;
        }
    }
    if (!process._exiting) {
        process._exiting = true;
        // FIXME(bartlomieju): this is wrong, we won't be using syscall to exit
        // and thus the `unload` event will not be emitted to properly trigger "emit"
        // event on `process`.
        process.emit("exit", process.exitCode || 0);
    }
    Deno.exit(process.exitCode || 0);
};
function addReadOnlyProcessAlias(name, option, enumerable = true) {
    const value = getOptionValue(option);
    if (value) {
        Object.defineProperty(process, name, {
            writable: false,
            configurable: true,
            enumerable,
            value
        });
    }
}
function createWarningObject(warning, type, code, // deno-lint-ignore ban-types
ctor, detail) {
    assert(typeof warning === "string");
    // deno-lint-ignore no-explicit-any
    const warningErr = new Error(warning);
    warningErr.name = String(type || "Warning");
    if (code !== undefined) {
        warningErr.code = code;
    }
    if (detail !== undefined) {
        warningErr.detail = detail;
    }
    // @ts-ignore this function is not available in lib.dom.d.ts
    Error.captureStackTrace(warningErr, ctor || process.emitWarning);
    return warningErr;
}
function doEmitWarning(warning) {
    process.emit("warning", warning);
}
/** https://nodejs.org/api/process.html#process_process_emitwarning_warning_options */ export function emitWarning(warning, type, code, // deno-lint-ignore ban-types
ctor) {
    let detail;
    if (type !== null && typeof type === "object" && !Array.isArray(type)) {
        ctor = type.ctor;
        code = type.code;
        if (typeof type.detail === "string") {
            detail = type.detail;
        }
        type = type.type || "Warning";
    } else if (typeof type === "function") {
        ctor = type;
        code = undefined;
        type = "Warning";
    }
    if (type !== undefined) {
        validateString(type, "type");
    }
    if (typeof code === "function") {
        ctor = code;
        code = undefined;
    } else if (code !== undefined) {
        validateString(code, "code");
    }
    if (typeof warning === "string") {
        warning = createWarningObject(warning, type, code, ctor, detail);
    } else if (!(warning instanceof Error)) {
        throw new ERR_INVALID_ARG_TYPE("warning", [
            "Error",
            "string"
        ], warning);
    }
    if (warning.name === "DeprecationWarning") {
        // deno-lint-ignore no-explicit-any
        if (process.noDeprecation) {
            return;
        }
        // deno-lint-ignore no-explicit-any
        if (process.throwDeprecation) {
            // Delay throwing the error to guarantee that all former warnings were
            // properly logged.
            return process.nextTick(()=>{
                throw warning;
            });
        }
    }
    process.nextTick(doEmitWarning, warning);
}
export function hrtime(time) {
    const milli = performance.now();
    const sec = Math.floor(milli / 1000);
    const nano = Math.floor(milli * 1_000_000 - sec * 1_000_000_000);
    if (!time) {
        return [
            sec,
            nano
        ];
    }
    const [prevSec, prevNano] = time;
    return [
        sec - prevSec,
        nano - prevNano
    ];
}
hrtime.bigint = function() {
    const [sec, nano] = hrtime();
    return BigInt(sec) * 1_000_000_000n + BigInt(nano);
};
export function memoryUsage() {
    return {
        ...Deno.memoryUsage(),
        arrayBuffers: 0
    };
}
memoryUsage.rss = function() {
    return memoryUsage().rss;
};
// Returns a negative error code than can be recognized by errnoException
function _kill(pid, sig) {
    let errCode;
    if (sig === 0) {
        let status;
        if (Deno.build.os === "windows") {
            status = new DenoCommand("powershell.exe", {
                args: [
                    "Get-Process",
                    "-pid",
                    pid
                ]
            }).outputSync();
        } else {
            status = new DenoCommand("kill", {
                args: [
                    "-0",
                    pid
                ]
            }).outputSync();
        }
        if (!status.success) {
            errCode = uv.codeMap.get("ESRCH");
        }
    } else {
        // Reverse search the shortname based on the numeric code
        const maybeSignal = Object.entries(constants.os.signals).find(([_, numericCode])=>numericCode === sig);
        if (!maybeSignal) {
            errCode = uv.codeMap.get("EINVAL");
        } else {
            try {
                Deno.kill(pid, maybeSignal[0]);
            } catch (e) {
                if (e instanceof TypeError) {
                    throw notImplemented(maybeSignal[0]);
                }
                throw e;
            }
        }
    }
    if (!errCode) {
        return 0;
    } else {
        return errCode;
    }
}
export function kill(pid, sig = "SIGTERM") {
    if (pid != (pid | 0)) {
        throw new ERR_INVALID_ARG_TYPE("pid", "number", pid);
    }
    let err;
    if (typeof sig === "number") {
        err = process._kill(pid, sig);
    } else {
        if (sig in constants.os.signals) {
            // @ts-ignore Index previously checked
            err = process._kill(pid, constants.os.signals[sig]);
        } else {
            throw new ERR_UNKNOWN_SIGNAL(sig);
        }
    }
    if (err) {
        throw errnoException(err, "kill");
    }
    return true;
}
// deno-lint-ignore no-explicit-any
function uncaughtExceptionHandler(err, origin) {
    // The origin parameter can be 'unhandledRejection' or 'uncaughtException'
    // depending on how the uncaught exception was created. In Node.js,
    // exceptions thrown from the top level of a CommonJS module are reported as
    // 'uncaughtException', while exceptions thrown from the top level of an ESM
    // module are reported as 'unhandledRejection'. Deno does not have a true
    // CommonJS implementation, so all exceptions thrown from the top level are
    // reported as 'uncaughtException'.
    process.emit("uncaughtExceptionMonitor", err, origin);
    process.emit("uncaughtException", err, origin);
}
let execPath = null;
class Process extends EventEmitter {
    constructor(){
        super();
        globalThis.addEventListener("unhandledrejection", (event)=>{
            if (process.listenerCount("unhandledRejection") === 0) {
                // The Node.js default behavior is to raise an uncaught exception if
                // an unhandled rejection occurs and there are no unhandledRejection
                // listeners.
                if (process.listenerCount("uncaughtException") === 0) {
                    throw event.reason;
                }
                event.preventDefault();
                uncaughtExceptionHandler(event.reason, "unhandledRejection");
                return;
            }
            event.preventDefault();
            process.emit("unhandledRejection", event.reason, event.promise);
        });
        globalThis.addEventListener("error", (event)=>{
            if (process.listenerCount("uncaughtException") > 0) {
                event.preventDefault();
            }
            uncaughtExceptionHandler(event.error, "uncaughtException");
        });
        globalThis.addEventListener("beforeunload", (e)=>{
            super.emit("beforeExit", process.exitCode || 0);
            processTicksAndRejections();
            if (core.eventLoopHasMoreWork()) {
                e.preventDefault();
            }
        });
        globalThis.addEventListener("unload", ()=>{
            if (!process._exiting) {
                process._exiting = true;
                super.emit("exit", process.exitCode || 0);
            }
        });
    }
    /** https://nodejs.org/api/process.html#process_process_arch */ arch = arch;
    /**
   * https://nodejs.org/api/process.html#process_process_argv
   * Read permissions are required in order to get the executable route
   */ argv = argv;
    /** https://nodejs.org/api/process.html#process_process_chdir_directory */ chdir = chdir;
    /** https://nodejs.org/api/process.html#processconfig */ config = {
        target_defaults: {},
        variables: {}
    };
    /** https://nodejs.org/api/process.html#process_process_cwd */ cwd = cwd;
    /**
   * https://nodejs.org/api/process.html#process_process_env
   * Requires env permissions
   */ env = env;
    /** https://nodejs.org/api/process.html#process_process_execargv */ execArgv = [];
    /** https://nodejs.org/api/process.html#process_process_exit_code */ exit = exit;
    _exiting = _exiting;
    /** https://nodejs.org/api/process.html#processexitcode_1 */ exitCode = undefined;
    // Typed as any to avoid importing "module" module for types
    // deno-lint-ignore no-explicit-any
    mainModule = undefined;
    /** https://nodejs.org/api/process.html#process_process_nexttick_callback_args */ nextTick = _nextTick;
    // deno-lint-ignore no-explicit-any
    on(event, listener) {
        if (notImplementedEvents.includes(event)) {
            warnNotImplemented(`process.on("${event}")`);
            super.on(event, listener);
        } else if (event.startsWith("SIG")) {
            if (event === "SIGBREAK" && Deno.build.os !== "windows") {
            // Ignores SIGBREAK if the platform is not windows.
            } else if (event === "SIGTERM" && Deno.build.os === "windows") {
            // Ignores SIGTERM on windows.
            } else {
                Deno.addSignalListener(event, listener);
            }
        } else {
            super.on(event, listener);
        }
        return this;
    }
    // deno-lint-ignore no-explicit-any
    off(event, listener) {
        if (notImplementedEvents.includes(event)) {
            warnNotImplemented(`process.off("${event}")`);
            super.off(event, listener);
        } else if (event.startsWith("SIG")) {
            if (event === "SIGBREAK" && Deno.build.os !== "windows") {
            // Ignores SIGBREAK if the platform is not windows.
            } else if (event === "SIGTERM" && Deno.build.os === "windows") {
            // Ignores SIGTERM on windows.
            } else {
                Deno.removeSignalListener(event, listener);
            }
        } else {
            super.off(event, listener);
        }
        return this;
    }
    // deno-lint-ignore no-explicit-any
    emit(event, ...args) {
        if (event.startsWith("SIG")) {
            if (event === "SIGBREAK" && Deno.build.os !== "windows") {
            // Ignores SIGBREAK if the platform is not windows.
            } else {
                Deno.kill(Deno.pid, event);
            }
        } else {
            return super.emit(event, ...args);
        }
        return true;
    }
    prependListener(event, // deno-lint-ignore no-explicit-any
    listener) {
        if (notImplementedEvents.includes(event)) {
            warnNotImplemented(`process.prependListener("${event}")`);
            super.prependListener(event, listener);
        } else if (event.startsWith("SIG")) {
            if (event === "SIGBREAK" && Deno.build.os !== "windows") {
            // Ignores SIGBREAK if the platform is not windows.
            } else {
                Deno.addSignalListener(event, listener);
            }
        } else {
            super.prependListener(event, listener);
        }
        return this;
    }
    /** https://nodejs.org/api/process.html#process_process_pid */ pid = pid;
    /** https://nodejs.org/api/process.html#process_process_platform */ platform = platform;
    addListener(event, // deno-lint-ignore no-explicit-any
    listener) {
        if (notImplementedEvents.includes(event)) {
            warnNotImplemented(`process.addListener("${event}")`);
        }
        return this.on(event, listener);
    }
    removeListener(event, // deno-lint-ignore no-explicit-any
    listener) {
        if (notImplementedEvents.includes(event)) {
            warnNotImplemented(`process.removeListener("${event}")`);
        }
        return this.off(event, listener);
    }
    /**
   * Returns the current high-resolution real time in a [seconds, nanoseconds]
   * tuple.
   *
   * Note: You need to give --allow-hrtime permission to Deno to actually get
   * nanoseconds precision values. If you don't give 'hrtime' permission, the returned
   * values only have milliseconds precision.
   *
   * `time` is an optional parameter that must be the result of a previous process.hrtime() call to diff with the current time.
   *
   * These times are relative to an arbitrary time in the past, and not related to the time of day and therefore not subject to clock drift. The primary use is for measuring performance between intervals.
   * https://nodejs.org/api/process.html#process_process_hrtime_time
   */ hrtime = hrtime;
    /**
   * @private
   *
   * NodeJS internal, use process.kill instead
   */ _kill = _kill;
    /** https://nodejs.org/api/process.html#processkillpid-signal */ kill = kill;
    memoryUsage = memoryUsage;
    /** https://nodejs.org/api/process.html#process_process_stderr */ stderr = stderr;
    /** https://nodejs.org/api/process.html#process_process_stdin */ stdin = stdin;
    /** https://nodejs.org/api/process.html#process_process_stdout */ stdout = stdout;
    /** https://nodejs.org/api/process.html#process_process_version */ version = version;
    /** https://nodejs.org/api/process.html#process_process_versions */ versions = versions;
    /** https://nodejs.org/api/process.html#process_process_emitwarning_warning_options */ emitWarning = emitWarning;
    binding(name) {
        return getBinding(name);
    }
    /** https://nodejs.org/api/process.html#processumaskmask */ umask() {
        // Always return the system default umask value.
        // We don't use Deno.umask here because it has a race
        // condition bug.
        // See https://github.com/denoland/deno_std/issues/1893#issuecomment-1032897779
        return 0o22;
    }
    /** This method is removed on Windows */ getgid() {
        return Deno.gid();
    }
    /** This method is removed on Windows */ getuid() {
        return Deno.uid();
    }
    // TODO(kt3k): Implement this when we added -e option to node compat mode
    _eval = undefined;
    /** https://nodejs.org/api/process.html#processexecpath */ get execPath() {
        if (execPath) {
            return execPath;
        }
        execPath = Deno.execPath();
        return execPath;
    }
    set execPath(path) {
        execPath = path;
    }
    #startTime = Date.now();
    /** https://nodejs.org/api/process.html#processuptime */ uptime() {
        return (Date.now() - this.#startTime) / 1000;
    }
    #allowedFlags = buildAllowedFlags();
    /** https://nodejs.org/api/process.html#processallowednodeenvironmentflags */ get allowedNodeEnvironmentFlags() {
        return this.#allowedFlags;
    }
    features = {
        inspector: false
    };
    // TODO(kt3k): Get the value from --no-deprecation flag.
    noDeprecation = false;
}
if (Deno.build.os === "windows") {
    delete Process.prototype.getgid;
    delete Process.prototype.getuid;
}
/** https://nodejs.org/api/process.html#process_process */ const process = new Process();
Object.defineProperty(process, Symbol.toStringTag, {
    enumerable: false,
    writable: true,
    configurable: false,
    value: "process"
});
addReadOnlyProcessAlias("noDeprecation", "--no-deprecation");
addReadOnlyProcessAlias("throwDeprecation", "--throw-deprecation");
export const removeListener = process.removeListener;
export const removeAllListeners = process.removeAllListeners;
export default process;
//TODO(Soremwar)
//Remove on 1.0
//Kept for backwards compatibility with std
export { process };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE3Ny4wL25vZGUvcHJvY2Vzcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIzIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgTm9kZS5qcyBjb250cmlidXRvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuXG5pbXBvcnQgeyBub3RJbXBsZW1lbnRlZCwgd2Fybk5vdEltcGxlbWVudGVkIH0gZnJvbSBcIi4vX3V0aWxzLnRzXCI7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tIFwiLi9ldmVudHMudHNcIjtcbmltcG9ydCB7IHZhbGlkYXRlU3RyaW5nIH0gZnJvbSBcIi4vaW50ZXJuYWwvdmFsaWRhdG9ycy5tanNcIjtcbmltcG9ydCB7XG4gIEVSUl9JTlZBTElEX0FSR19UWVBFLFxuICBFUlJfVU5LTk9XTl9TSUdOQUwsXG4gIGVycm5vRXhjZXB0aW9uLFxufSBmcm9tIFwiLi9pbnRlcm5hbC9lcnJvcnMudHNcIjtcbmltcG9ydCB7IGdldE9wdGlvblZhbHVlIH0gZnJvbSBcIi4vaW50ZXJuYWwvb3B0aW9ucy50c1wiO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSBcIi4uL191dGlsL2Fzc2VydHMudHNcIjtcbmltcG9ydCB7IGZyb21GaWxlVXJsLCBqb2luIH0gZnJvbSBcIi4uL3BhdGgvbW9kLnRzXCI7XG5pbXBvcnQge1xuICBhcmNoLFxuICBjaGRpcixcbiAgY3dkLFxuICBlbnYsXG4gIG5leHRUaWNrIGFzIF9uZXh0VGljayxcbiAgcGlkLFxuICBwbGF0Zm9ybSxcbiAgdmVyc2lvbixcbiAgdmVyc2lvbnMsXG59IGZyb20gXCIuL19wcm9jZXNzL3Byb2Nlc3MudHNcIjtcbmltcG9ydCB7IF9leGl0aW5nIH0gZnJvbSBcIi4vX3Byb2Nlc3MvZXhpdGluZy50c1wiO1xuZXhwb3J0IHtcbiAgX25leHRUaWNrIGFzIG5leHRUaWNrLFxuICBhcmNoLFxuICBhcmd2LFxuICBjaGRpcixcbiAgY3dkLFxuICBlbnYsXG4gIHBpZCxcbiAgcGxhdGZvcm0sXG4gIHZlcnNpb24sXG4gIHZlcnNpb25zLFxufTtcbmltcG9ydCB7XG4gIHN0ZGVyciBhcyBzdGRlcnJfLFxuICBzdGRpbiBhcyBzdGRpbl8sXG4gIHN0ZG91dCBhcyBzdGRvdXRfLFxufSBmcm9tIFwiLi9fcHJvY2Vzcy9zdHJlYW1zLm1qc1wiO1xuaW1wb3J0IHsgY29yZSB9IGZyb20gXCIuL19jb3JlLnRzXCI7XG5pbXBvcnQgeyBwcm9jZXNzVGlja3NBbmRSZWplY3Rpb25zIH0gZnJvbSBcIi4vX25leHRfdGljay50c1wiO1xuXG4vLyBUT0RPKGt0M2spOiBHaXZlIGJldHRlciB0eXBlcyB0byBzdGRpbyBvYmplY3RzXG4vLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuY29uc3Qgc3RkZXJyID0gc3RkZXJyXyBhcyBhbnk7XG4vLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuY29uc3Qgc3RkaW4gPSBzdGRpbl8gYXMgYW55O1xuLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbmNvbnN0IHN0ZG91dCA9IHN0ZG91dF8gYXMgYW55O1xuZXhwb3J0IHsgc3RkZXJyLCBzdGRpbiwgc3Rkb3V0IH07XG5pbXBvcnQgeyBnZXRCaW5kaW5nIH0gZnJvbSBcIi4vaW50ZXJuYWxfYmluZGluZy9tb2QudHNcIjtcbmltcG9ydCAqIGFzIGNvbnN0YW50cyBmcm9tIFwiLi9pbnRlcm5hbF9iaW5kaW5nL2NvbnN0YW50cy50c1wiO1xuaW1wb3J0ICogYXMgdXYgZnJvbSBcIi4vaW50ZXJuYWxfYmluZGluZy91di50c1wiO1xuaW1wb3J0IHR5cGUgeyBCaW5kaW5nTmFtZSB9IGZyb20gXCIuL2ludGVybmFsX2JpbmRpbmcvbW9kLnRzXCI7XG5pbXBvcnQgeyBidWlsZEFsbG93ZWRGbGFncyB9IGZyb20gXCIuL2ludGVybmFsL3Byb2Nlc3MvcGVyX3RocmVhZC5tanNcIjtcblxuLy8gQHRzLWlnbm9yZSBEZW5vW0Rlbm8uaW50ZXJuYWxdIGlzIHVzZWQgb24gcHVycG9zZSBoZXJlXG5jb25zdCBEZW5vQ29tbWFuZCA9IERlbm9bRGVuby5pbnRlcm5hbF0/Lm5vZGVVbnN0YWJsZT8uQ29tbWFuZCB8fFxuICBEZW5vLkNvbW1hbmQ7XG5cbmNvbnN0IG5vdEltcGxlbWVudGVkRXZlbnRzID0gW1xuICBcImRpc2Nvbm5lY3RcIixcbiAgXCJtZXNzYWdlXCIsXG4gIFwibXVsdGlwbGVSZXNvbHZlc1wiLFxuICBcInJlamVjdGlvbkhhbmRsZWRcIixcbiAgXCJ3b3JrZXJcIixcbl07XG5cbi8vIFRoZSBmaXJzdCAyIGl0ZW1zIGFyZSBwbGFjZWhvbGRlcnMuXG4vLyBUaGV5IHdpbGwgYmUgb3ZlcndyaXR0ZW4gYnkgdGhlIGJlbG93IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBjYWxscy5cbmNvbnN0IGFyZ3YgPSBbXCJcIiwgXCJcIiwgLi4uRGVuby5hcmdzXTtcbi8vIE92ZXJ3cml0ZXMgdGhlIDFzdCBpdGVtIHdpdGggZ2V0dGVyLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGFyZ3YsIFwiMFwiLCB7IGdldDogRGVuby5leGVjUGF0aCB9KTtcbi8vIE92ZXJ3cml0ZXMgdGhlIDJzdCBpdGVtIHdpdGggZ2V0dGVyLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGFyZ3YsIFwiMVwiLCB7XG4gIGdldDogKCkgPT4ge1xuICAgIGlmIChEZW5vLm1haW5Nb2R1bGUuc3RhcnRzV2l0aChcImZpbGU6XCIpKSB7XG4gICAgICByZXR1cm4gZnJvbUZpbGVVcmwoRGVuby5tYWluTW9kdWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGpvaW4oRGVuby5jd2QoKSwgXCIkZGVubyRub2RlLmpzXCIpO1xuICAgIH1cbiAgfSxcbn0pO1xuXG4vKiogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc19wcm9jZXNzX2V4aXRfY29kZSAqL1xuZXhwb3J0IGNvbnN0IGV4aXQgPSAoY29kZT86IG51bWJlciB8IHN0cmluZykgPT4ge1xuICBpZiAoY29kZSB8fCBjb2RlID09PSAwKSB7XG4gICAgaWYgKHR5cGVvZiBjb2RlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBjb25zdCBwYXJzZWRDb2RlID0gcGFyc2VJbnQoY29kZSk7XG4gICAgICBwcm9jZXNzLmV4aXRDb2RlID0gaXNOYU4ocGFyc2VkQ29kZSkgPyB1bmRlZmluZWQgOiBwYXJzZWRDb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9jZXNzLmV4aXRDb2RlID0gY29kZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIXByb2Nlc3MuX2V4aXRpbmcpIHtcbiAgICBwcm9jZXNzLl9leGl0aW5nID0gdHJ1ZTtcbiAgICAvLyBGSVhNRShiYXJ0bG9taWVqdSk6IHRoaXMgaXMgd3JvbmcsIHdlIHdvbid0IGJlIHVzaW5nIHN5c2NhbGwgdG8gZXhpdFxuICAgIC8vIGFuZCB0aHVzIHRoZSBgdW5sb2FkYCBldmVudCB3aWxsIG5vdCBiZSBlbWl0dGVkIHRvIHByb3Blcmx5IHRyaWdnZXIgXCJlbWl0XCJcbiAgICAvLyBldmVudCBvbiBgcHJvY2Vzc2AuXG4gICAgcHJvY2Vzcy5lbWl0KFwiZXhpdFwiLCBwcm9jZXNzLmV4aXRDb2RlIHx8IDApO1xuICB9XG5cbiAgRGVuby5leGl0KHByb2Nlc3MuZXhpdENvZGUgfHwgMCk7XG59O1xuXG5mdW5jdGlvbiBhZGRSZWFkT25seVByb2Nlc3NBbGlhcyhcbiAgbmFtZTogc3RyaW5nLFxuICBvcHRpb246IHN0cmluZyxcbiAgZW51bWVyYWJsZSA9IHRydWUsXG4pIHtcbiAgY29uc3QgdmFsdWUgPSBnZXRPcHRpb25WYWx1ZShvcHRpb24pO1xuXG4gIGlmICh2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9jZXNzLCBuYW1lLCB7XG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBlbnVtZXJhYmxlLFxuICAgICAgdmFsdWUsXG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlV2FybmluZ09iamVjdChcbiAgd2FybmluZzogc3RyaW5nLFxuICB0eXBlOiBzdHJpbmcsXG4gIGNvZGU/OiBzdHJpbmcsXG4gIC8vIGRlbm8tbGludC1pZ25vcmUgYmFuLXR5cGVzXG4gIGN0b3I/OiBGdW5jdGlvbixcbiAgZGV0YWlsPzogc3RyaW5nLFxuKTogRXJyb3Ige1xuICBhc3NlcnQodHlwZW9mIHdhcm5pbmcgPT09IFwic3RyaW5nXCIpO1xuXG4gIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gIGNvbnN0IHdhcm5pbmdFcnI6IGFueSA9IG5ldyBFcnJvcih3YXJuaW5nKTtcbiAgd2FybmluZ0Vyci5uYW1lID0gU3RyaW5nKHR5cGUgfHwgXCJXYXJuaW5nXCIpO1xuXG4gIGlmIChjb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICB3YXJuaW5nRXJyLmNvZGUgPSBjb2RlO1xuICB9XG4gIGlmIChkZXRhaWwgIT09IHVuZGVmaW5lZCkge1xuICAgIHdhcm5pbmdFcnIuZGV0YWlsID0gZGV0YWlsO1xuICB9XG5cbiAgLy8gQHRzLWlnbm9yZSB0aGlzIGZ1bmN0aW9uIGlzIG5vdCBhdmFpbGFibGUgaW4gbGliLmRvbS5kLnRzXG4gIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHdhcm5pbmdFcnIsIGN0b3IgfHwgcHJvY2Vzcy5lbWl0V2FybmluZyk7XG5cbiAgcmV0dXJuIHdhcm5pbmdFcnI7XG59XG5cbmZ1bmN0aW9uIGRvRW1pdFdhcm5pbmcod2FybmluZzogRXJyb3IpIHtcbiAgcHJvY2Vzcy5lbWl0KFwid2FybmluZ1wiLCB3YXJuaW5nKTtcbn1cblxuLyoqIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvcHJvY2Vzcy5odG1sI3Byb2Nlc3NfcHJvY2Vzc19lbWl0d2FybmluZ193YXJuaW5nX29wdGlvbnMgKi9cbmV4cG9ydCBmdW5jdGlvbiBlbWl0V2FybmluZyhcbiAgd2FybmluZzogc3RyaW5nIHwgRXJyb3IsXG4gIHR5cGU6XG4gICAgLy8gZGVuby1saW50LWlnbm9yZSBiYW4tdHlwZXNcbiAgICB8IHsgdHlwZTogc3RyaW5nOyBkZXRhaWw6IHN0cmluZzsgY29kZTogc3RyaW5nOyBjdG9yOiBGdW5jdGlvbiB9XG4gICAgfCBzdHJpbmdcbiAgICB8IG51bGwsXG4gIGNvZGU/OiBzdHJpbmcsXG4gIC8vIGRlbm8tbGludC1pZ25vcmUgYmFuLXR5cGVzXG4gIGN0b3I/OiBGdW5jdGlvbixcbikge1xuICBsZXQgZGV0YWlsO1xuXG4gIGlmICh0eXBlICE9PSBudWxsICYmIHR5cGVvZiB0eXBlID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHR5cGUpKSB7XG4gICAgY3RvciA9IHR5cGUuY3RvcjtcbiAgICBjb2RlID0gdHlwZS5jb2RlO1xuXG4gICAgaWYgKHR5cGVvZiB0eXBlLmRldGFpbCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgZGV0YWlsID0gdHlwZS5kZXRhaWw7XG4gICAgfVxuXG4gICAgdHlwZSA9IHR5cGUudHlwZSB8fCBcIldhcm5pbmdcIjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY3RvciA9IHR5cGU7XG4gICAgY29kZSA9IHVuZGVmaW5lZDtcbiAgICB0eXBlID0gXCJXYXJuaW5nXCI7XG4gIH1cblxuICBpZiAodHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFsaWRhdGVTdHJpbmcodHlwZSwgXCJ0eXBlXCIpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBjb2RlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjdG9yID0gY29kZTtcbiAgICBjb2RlID0gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKGNvZGUgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhbGlkYXRlU3RyaW5nKGNvZGUsIFwiY29kZVwiKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygd2FybmluZyA9PT0gXCJzdHJpbmdcIikge1xuICAgIHdhcm5pbmcgPSBjcmVhdGVXYXJuaW5nT2JqZWN0KHdhcm5pbmcsIHR5cGUgYXMgc3RyaW5nLCBjb2RlLCBjdG9yLCBkZXRhaWwpO1xuICB9IGVsc2UgaWYgKCEod2FybmluZyBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgIHRocm93IG5ldyBFUlJfSU5WQUxJRF9BUkdfVFlQRShcIndhcm5pbmdcIiwgW1wiRXJyb3JcIiwgXCJzdHJpbmdcIl0sIHdhcm5pbmcpO1xuICB9XG5cbiAgaWYgKHdhcm5pbmcubmFtZSA9PT0gXCJEZXByZWNhdGlvbldhcm5pbmdcIikge1xuICAgIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gICAgaWYgKChwcm9jZXNzIGFzIGFueSkubm9EZXByZWNhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gICAgaWYgKChwcm9jZXNzIGFzIGFueSkudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgLy8gRGVsYXkgdGhyb3dpbmcgdGhlIGVycm9yIHRvIGd1YXJhbnRlZSB0aGF0IGFsbCBmb3JtZXIgd2FybmluZ3Mgd2VyZVxuICAgICAgLy8gcHJvcGVybHkgbG9nZ2VkLlxuICAgICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aHJvdyB3YXJuaW5nO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzcy5uZXh0VGljayhkb0VtaXRXYXJuaW5nLCB3YXJuaW5nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhydGltZSh0aW1lPzogW251bWJlciwgbnVtYmVyXSk6IFtudW1iZXIsIG51bWJlcl0ge1xuICBjb25zdCBtaWxsaSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICBjb25zdCBzZWMgPSBNYXRoLmZsb29yKG1pbGxpIC8gMTAwMCk7XG4gIGNvbnN0IG5hbm8gPSBNYXRoLmZsb29yKG1pbGxpICogMV8wMDBfMDAwIC0gc2VjICogMV8wMDBfMDAwXzAwMCk7XG4gIGlmICghdGltZSkge1xuICAgIHJldHVybiBbc2VjLCBuYW5vXTtcbiAgfVxuICBjb25zdCBbcHJldlNlYywgcHJldk5hbm9dID0gdGltZTtcbiAgcmV0dXJuIFtzZWMgLSBwcmV2U2VjLCBuYW5vIC0gcHJldk5hbm9dO1xufVxuXG5ocnRpbWUuYmlnaW50ID0gZnVuY3Rpb24gKCk6IEJpZ0ludCB7XG4gIGNvbnN0IFtzZWMsIG5hbm9dID0gaHJ0aW1lKCk7XG4gIHJldHVybiBCaWdJbnQoc2VjKSAqIDFfMDAwXzAwMF8wMDBuICsgQmlnSW50KG5hbm8pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1lbW9yeVVzYWdlKCk6IHtcbiAgcnNzOiBudW1iZXI7XG4gIGhlYXBUb3RhbDogbnVtYmVyO1xuICBoZWFwVXNlZDogbnVtYmVyO1xuICBleHRlcm5hbDogbnVtYmVyO1xuICBhcnJheUJ1ZmZlcnM6IG51bWJlcjtcbn0ge1xuICByZXR1cm4ge1xuICAgIC4uLkRlbm8ubWVtb3J5VXNhZ2UoKSxcbiAgICBhcnJheUJ1ZmZlcnM6IDAsXG4gIH07XG59XG5cbm1lbW9yeVVzYWdlLnJzcyA9IGZ1bmN0aW9uICgpOiBudW1iZXIge1xuICByZXR1cm4gbWVtb3J5VXNhZ2UoKS5yc3M7XG59O1xuXG4vLyBSZXR1cm5zIGEgbmVnYXRpdmUgZXJyb3IgY29kZSB0aGFuIGNhbiBiZSByZWNvZ25pemVkIGJ5IGVycm5vRXhjZXB0aW9uXG5mdW5jdGlvbiBfa2lsbChwaWQ6IG51bWJlciwgc2lnOiBudW1iZXIpOiBudW1iZXIge1xuICBsZXQgZXJyQ29kZTtcblxuICBpZiAoc2lnID09PSAwKSB7XG4gICAgbGV0IHN0YXR1cztcbiAgICBpZiAoRGVuby5idWlsZC5vcyA9PT0gXCJ3aW5kb3dzXCIpIHtcbiAgICAgIHN0YXR1cyA9IChuZXcgRGVub0NvbW1hbmQoXCJwb3dlcnNoZWxsLmV4ZVwiLCB7XG4gICAgICAgIGFyZ3M6IFtcIkdldC1Qcm9jZXNzXCIsIFwiLXBpZFwiLCBwaWRdLFxuICAgICAgfSkpLm91dHB1dFN5bmMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdHVzID0gKG5ldyBEZW5vQ29tbWFuZChcImtpbGxcIiwge1xuICAgICAgICBhcmdzOiBbXCItMFwiLCBwaWRdLFxuICAgICAgfSkpLm91dHB1dFN5bmMoKTtcbiAgICB9XG5cbiAgICBpZiAoIXN0YXR1cy5zdWNjZXNzKSB7XG4gICAgICBlcnJDb2RlID0gdXYuY29kZU1hcC5nZXQoXCJFU1JDSFwiKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gUmV2ZXJzZSBzZWFyY2ggdGhlIHNob3J0bmFtZSBiYXNlZCBvbiB0aGUgbnVtZXJpYyBjb2RlXG4gICAgY29uc3QgbWF5YmVTaWduYWwgPSBPYmplY3QuZW50cmllcyhjb25zdGFudHMub3Muc2lnbmFscykuZmluZCgoXG4gICAgICBbXywgbnVtZXJpY0NvZGVdLFxuICAgICkgPT4gbnVtZXJpY0NvZGUgPT09IHNpZyk7XG5cbiAgICBpZiAoIW1heWJlU2lnbmFsKSB7XG4gICAgICBlcnJDb2RlID0gdXYuY29kZU1hcC5nZXQoXCJFSU5WQUxcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIERlbm8ua2lsbChwaWQsIG1heWJlU2lnbmFsWzBdIGFzIERlbm8uU2lnbmFsKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBub3RJbXBsZW1lbnRlZChtYXliZVNpZ25hbFswXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICghZXJyQ29kZSkge1xuICAgIHJldHVybiAwO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBlcnJDb2RlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBraWxsKHBpZDogbnVtYmVyLCBzaWc6IHN0cmluZyB8IG51bWJlciA9IFwiU0lHVEVSTVwiKSB7XG4gIGlmIChwaWQgIT0gKHBpZCB8IDApKSB7XG4gICAgdGhyb3cgbmV3IEVSUl9JTlZBTElEX0FSR19UWVBFKFwicGlkXCIsIFwibnVtYmVyXCIsIHBpZCk7XG4gIH1cblxuICBsZXQgZXJyO1xuICBpZiAodHlwZW9mIHNpZyA9PT0gXCJudW1iZXJcIikge1xuICAgIGVyciA9IHByb2Nlc3MuX2tpbGwocGlkLCBzaWcpO1xuICB9IGVsc2Uge1xuICAgIGlmIChzaWcgaW4gY29uc3RhbnRzLm9zLnNpZ25hbHMpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmUgSW5kZXggcHJldmlvdXNseSBjaGVja2VkXG4gICAgICBlcnIgPSBwcm9jZXNzLl9raWxsKHBpZCwgY29uc3RhbnRzLm9zLnNpZ25hbHNbc2lnXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFUlJfVU5LTk9XTl9TSUdOQUwoc2lnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoZXJyKSB7XG4gICAgdGhyb3cgZXJybm9FeGNlcHRpb24oZXJyLCBcImtpbGxcIik7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbmZ1bmN0aW9uIHVuY2F1Z2h0RXhjZXB0aW9uSGFuZGxlcihlcnI6IGFueSwgb3JpZ2luOiBzdHJpbmcpIHtcbiAgLy8gVGhlIG9yaWdpbiBwYXJhbWV0ZXIgY2FuIGJlICd1bmhhbmRsZWRSZWplY3Rpb24nIG9yICd1bmNhdWdodEV4Y2VwdGlvbidcbiAgLy8gZGVwZW5kaW5nIG9uIGhvdyB0aGUgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcyBjcmVhdGVkLiBJbiBOb2RlLmpzLFxuICAvLyBleGNlcHRpb25zIHRocm93biBmcm9tIHRoZSB0b3AgbGV2ZWwgb2YgYSBDb21tb25KUyBtb2R1bGUgYXJlIHJlcG9ydGVkIGFzXG4gIC8vICd1bmNhdWdodEV4Y2VwdGlvbicsIHdoaWxlIGV4Y2VwdGlvbnMgdGhyb3duIGZyb20gdGhlIHRvcCBsZXZlbCBvZiBhbiBFU01cbiAgLy8gbW9kdWxlIGFyZSByZXBvcnRlZCBhcyAndW5oYW5kbGVkUmVqZWN0aW9uJy4gRGVubyBkb2VzIG5vdCBoYXZlIGEgdHJ1ZVxuICAvLyBDb21tb25KUyBpbXBsZW1lbnRhdGlvbiwgc28gYWxsIGV4Y2VwdGlvbnMgdGhyb3duIGZyb20gdGhlIHRvcCBsZXZlbCBhcmVcbiAgLy8gcmVwb3J0ZWQgYXMgJ3VuY2F1Z2h0RXhjZXB0aW9uJy5cbiAgcHJvY2Vzcy5lbWl0KFwidW5jYXVnaHRFeGNlcHRpb25Nb25pdG9yXCIsIGVyciwgb3JpZ2luKTtcbiAgcHJvY2Vzcy5lbWl0KFwidW5jYXVnaHRFeGNlcHRpb25cIiwgZXJyLCBvcmlnaW4pO1xufVxuXG5sZXQgZXhlY1BhdGg6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG5jbGFzcyBQcm9jZXNzIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGdsb2JhbFRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcInVuaGFuZGxlZHJlamVjdGlvblwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmxpc3RlbmVyQ291bnQoXCJ1bmhhbmRsZWRSZWplY3Rpb25cIikgPT09IDApIHtcbiAgICAgICAgLy8gVGhlIE5vZGUuanMgZGVmYXVsdCBiZWhhdmlvciBpcyB0byByYWlzZSBhbiB1bmNhdWdodCBleGNlcHRpb24gaWZcbiAgICAgICAgLy8gYW4gdW5oYW5kbGVkIHJlamVjdGlvbiBvY2N1cnMgYW5kIHRoZXJlIGFyZSBubyB1bmhhbmRsZWRSZWplY3Rpb25cbiAgICAgICAgLy8gbGlzdGVuZXJzLlxuICAgICAgICBpZiAocHJvY2Vzcy5saXN0ZW5lckNvdW50KFwidW5jYXVnaHRFeGNlcHRpb25cIikgPT09IDApIHtcbiAgICAgICAgICB0aHJvdyBldmVudC5yZWFzb247XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB1bmNhdWdodEV4Y2VwdGlvbkhhbmRsZXIoZXZlbnQucmVhc29uLCBcInVuaGFuZGxlZFJlamVjdGlvblwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcHJvY2Vzcy5lbWl0KFwidW5oYW5kbGVkUmVqZWN0aW9uXCIsIGV2ZW50LnJlYXNvbiwgZXZlbnQucHJvbWlzZSk7XG4gICAgfSk7XG5cbiAgICBnbG9iYWxUaGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmxpc3RlbmVyQ291bnQoXCJ1bmNhdWdodEV4Y2VwdGlvblwiKSA+IDApIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cblxuICAgICAgdW5jYXVnaHRFeGNlcHRpb25IYW5kbGVyKGV2ZW50LmVycm9yLCBcInVuY2F1Z2h0RXhjZXB0aW9uXCIpO1xuICAgIH0pO1xuXG4gICAgZ2xvYmFsVGhpcy5hZGRFdmVudExpc3RlbmVyKFwiYmVmb3JldW5sb2FkXCIsIChlKSA9PiB7XG4gICAgICBzdXBlci5lbWl0KFwiYmVmb3JlRXhpdFwiLCBwcm9jZXNzLmV4aXRDb2RlIHx8IDApO1xuICAgICAgcHJvY2Vzc1RpY2tzQW5kUmVqZWN0aW9ucygpO1xuICAgICAgaWYgKGNvcmUuZXZlbnRMb29wSGFzTW9yZVdvcmsoKSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBnbG9iYWxUaGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmxvYWRcIiwgKCkgPT4ge1xuICAgICAgaWYgKCFwcm9jZXNzLl9leGl0aW5nKSB7XG4gICAgICAgIHByb2Nlc3MuX2V4aXRpbmcgPSB0cnVlO1xuICAgICAgICBzdXBlci5lbWl0KFwiZXhpdFwiLCBwcm9jZXNzLmV4aXRDb2RlIHx8IDApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvcHJvY2Vzcy5odG1sI3Byb2Nlc3NfcHJvY2Vzc19hcmNoICovXG4gIGFyY2ggPSBhcmNoO1xuXG4gIC8qKlxuICAgKiBodHRwczovL25vZGVqcy5vcmcvYXBpL3Byb2Nlc3MuaHRtbCNwcm9jZXNzX3Byb2Nlc3NfYXJndlxuICAgKiBSZWFkIHBlcm1pc3Npb25zIGFyZSByZXF1aXJlZCBpbiBvcmRlciB0byBnZXQgdGhlIGV4ZWN1dGFibGUgcm91dGVcbiAgICovXG4gIGFyZ3YgPSBhcmd2O1xuXG4gIC8qKiBodHRwczovL25vZGVqcy5vcmcvYXBpL3Byb2Nlc3MuaHRtbCNwcm9jZXNzX3Byb2Nlc3NfY2hkaXJfZGlyZWN0b3J5ICovXG4gIGNoZGlyID0gY2hkaXI7XG5cbiAgLyoqIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvcHJvY2Vzcy5odG1sI3Byb2Nlc3Njb25maWcgKi9cbiAgY29uZmlnID0ge1xuICAgIHRhcmdldF9kZWZhdWx0czoge30sXG4gICAgdmFyaWFibGVzOiB7fSxcbiAgfTtcblxuICAvKiogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc19wcm9jZXNzX2N3ZCAqL1xuICBjd2QgPSBjd2Q7XG5cbiAgLyoqXG4gICAqIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvcHJvY2Vzcy5odG1sI3Byb2Nlc3NfcHJvY2Vzc19lbnZcbiAgICogUmVxdWlyZXMgZW52IHBlcm1pc3Npb25zXG4gICAqL1xuICBlbnYgPSBlbnY7XG5cbiAgLyoqIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvcHJvY2Vzcy5odG1sI3Byb2Nlc3NfcHJvY2Vzc19leGVjYXJndiAqL1xuICBleGVjQXJndjogc3RyaW5nW10gPSBbXTtcblxuICAvKiogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc19wcm9jZXNzX2V4aXRfY29kZSAqL1xuICBleGl0ID0gZXhpdDtcblxuICBfZXhpdGluZyA9IF9leGl0aW5nO1xuXG4gIC8qKiBodHRwczovL25vZGVqcy5vcmcvYXBpL3Byb2Nlc3MuaHRtbCNwcm9jZXNzZXhpdGNvZGVfMSAqL1xuICBleGl0Q29kZTogdW5kZWZpbmVkIHwgbnVtYmVyID0gdW5kZWZpbmVkO1xuXG4gIC8vIFR5cGVkIGFzIGFueSB0byBhdm9pZCBpbXBvcnRpbmcgXCJtb2R1bGVcIiBtb2R1bGUgZm9yIHR5cGVzXG4gIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gIG1haW5Nb2R1bGU6IGFueSA9IHVuZGVmaW5lZDtcblxuICAvKiogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc19wcm9jZXNzX25leHR0aWNrX2NhbGxiYWNrX2FyZ3MgKi9cbiAgbmV4dFRpY2sgPSBfbmV4dFRpY2s7XG5cbiAgLyoqIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvcHJvY2Vzcy5odG1sI3Byb2Nlc3NfcHJvY2Vzc19ldmVudHMgKi9cbiAgb3ZlcnJpZGUgb24oZXZlbnQ6IFwiZXhpdFwiLCBsaXN0ZW5lcjogKGNvZGU6IG51bWJlcikgPT4gdm9pZCk6IHRoaXM7XG4gIG92ZXJyaWRlIG9uKFxuICAgIGV2ZW50OiB0eXBlb2Ygbm90SW1wbGVtZW50ZWRFdmVudHNbbnVtYmVyXSxcbiAgICAvLyBkZW5vLWxpbnQtaWdub3JlIGJhbi10eXBlc1xuICAgIGxpc3RlbmVyOiBGdW5jdGlvbixcbiAgKTogdGhpcztcbiAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgb3ZlcnJpZGUgb24oZXZlbnQ6IHN0cmluZywgbGlzdGVuZXI6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCk6IHRoaXMge1xuICAgIGlmIChub3RJbXBsZW1lbnRlZEV2ZW50cy5pbmNsdWRlcyhldmVudCkpIHtcbiAgICAgIHdhcm5Ob3RJbXBsZW1lbnRlZChgcHJvY2Vzcy5vbihcIiR7ZXZlbnR9XCIpYCk7XG4gICAgICBzdXBlci5vbihldmVudCwgbGlzdGVuZXIpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQuc3RhcnRzV2l0aChcIlNJR1wiKSkge1xuICAgICAgaWYgKGV2ZW50ID09PSBcIlNJR0JSRUFLXCIgJiYgRGVuby5idWlsZC5vcyAhPT0gXCJ3aW5kb3dzXCIpIHtcbiAgICAgICAgLy8gSWdub3JlcyBTSUdCUkVBSyBpZiB0aGUgcGxhdGZvcm0gaXMgbm90IHdpbmRvd3MuXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSBcIlNJR1RFUk1cIiAmJiBEZW5vLmJ1aWxkLm9zID09PSBcIndpbmRvd3NcIikge1xuICAgICAgICAvLyBJZ25vcmVzIFNJR1RFUk0gb24gd2luZG93cy5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERlbm8uYWRkU2lnbmFsTGlzdGVuZXIoZXZlbnQgYXMgRGVuby5TaWduYWwsIGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3VwZXIub24oZXZlbnQsIGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG92ZXJyaWRlIG9mZihldmVudDogXCJleGl0XCIsIGxpc3RlbmVyOiAoY29kZTogbnVtYmVyKSA9PiB2b2lkKTogdGhpcztcbiAgb3ZlcnJpZGUgb2ZmKFxuICAgIGV2ZW50OiB0eXBlb2Ygbm90SW1wbGVtZW50ZWRFdmVudHNbbnVtYmVyXSxcbiAgICAvLyBkZW5vLWxpbnQtaWdub3JlIGJhbi10eXBlc1xuICAgIGxpc3RlbmVyOiBGdW5jdGlvbixcbiAgKTogdGhpcztcbiAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgb3ZlcnJpZGUgb2ZmKGV2ZW50OiBzdHJpbmcsIGxpc3RlbmVyOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQpOiB0aGlzIHtcbiAgICBpZiAobm90SW1wbGVtZW50ZWRFdmVudHMuaW5jbHVkZXMoZXZlbnQpKSB7XG4gICAgICB3YXJuTm90SW1wbGVtZW50ZWQoYHByb2Nlc3Mub2ZmKFwiJHtldmVudH1cIilgKTtcbiAgICAgIHN1cGVyLm9mZihldmVudCwgbGlzdGVuZXIpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQuc3RhcnRzV2l0aChcIlNJR1wiKSkge1xuICAgICAgaWYgKGV2ZW50ID09PSBcIlNJR0JSRUFLXCIgJiYgRGVuby5idWlsZC5vcyAhPT0gXCJ3aW5kb3dzXCIpIHtcbiAgICAgICAgLy8gSWdub3JlcyBTSUdCUkVBSyBpZiB0aGUgcGxhdGZvcm0gaXMgbm90IHdpbmRvd3MuXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSBcIlNJR1RFUk1cIiAmJiBEZW5vLmJ1aWxkLm9zID09PSBcIndpbmRvd3NcIikge1xuICAgICAgICAvLyBJZ25vcmVzIFNJR1RFUk0gb24gd2luZG93cy5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERlbm8ucmVtb3ZlU2lnbmFsTGlzdGVuZXIoZXZlbnQgYXMgRGVuby5TaWduYWwsIGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3VwZXIub2ZmKGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuICBvdmVycmlkZSBlbWl0KGV2ZW50OiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogYm9vbGVhbiB7XG4gICAgaWYgKGV2ZW50LnN0YXJ0c1dpdGgoXCJTSUdcIikpIHtcbiAgICAgIGlmIChldmVudCA9PT0gXCJTSUdCUkVBS1wiICYmIERlbm8uYnVpbGQub3MgIT09IFwid2luZG93c1wiKSB7XG4gICAgICAgIC8vIElnbm9yZXMgU0lHQlJFQUsgaWYgdGhlIHBsYXRmb3JtIGlzIG5vdCB3aW5kb3dzLlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGVuby5raWxsKERlbm8ucGlkLCBldmVudCBhcyBEZW5vLlNpZ25hbCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdXBlci5lbWl0KGV2ZW50LCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG92ZXJyaWRlIHByZXBlbmRMaXN0ZW5lcihcbiAgICBldmVudDogXCJleGl0XCIsXG4gICAgbGlzdGVuZXI6IChjb2RlOiBudW1iZXIpID0+IHZvaWQsXG4gICk6IHRoaXM7XG4gIG92ZXJyaWRlIHByZXBlbmRMaXN0ZW5lcihcbiAgICBldmVudDogdHlwZW9mIG5vdEltcGxlbWVudGVkRXZlbnRzW251bWJlcl0sXG4gICAgLy8gZGVuby1saW50LWlnbm9yZSBiYW4tdHlwZXNcbiAgICBsaXN0ZW5lcjogRnVuY3Rpb24sXG4gICk6IHRoaXM7XG4gIG92ZXJyaWRlIHByZXBlbmRMaXN0ZW5lcihcbiAgICBldmVudDogc3RyaW5nLFxuICAgIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gICAgbGlzdGVuZXI6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCxcbiAgKTogdGhpcyB7XG4gICAgaWYgKG5vdEltcGxlbWVudGVkRXZlbnRzLmluY2x1ZGVzKGV2ZW50KSkge1xuICAgICAgd2Fybk5vdEltcGxlbWVudGVkKGBwcm9jZXNzLnByZXBlbmRMaXN0ZW5lcihcIiR7ZXZlbnR9XCIpYCk7XG4gICAgICBzdXBlci5wcmVwZW5kTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnN0YXJ0c1dpdGgoXCJTSUdcIikpIHtcbiAgICAgIGlmIChldmVudCA9PT0gXCJTSUdCUkVBS1wiICYmIERlbm8uYnVpbGQub3MgIT09IFwid2luZG93c1wiKSB7XG4gICAgICAgIC8vIElnbm9yZXMgU0lHQlJFQUsgaWYgdGhlIHBsYXRmb3JtIGlzIG5vdCB3aW5kb3dzLlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGVuby5hZGRTaWduYWxMaXN0ZW5lcihldmVudCBhcyBEZW5vLlNpZ25hbCwgbGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlci5wcmVwZW5kTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBodHRwczovL25vZGVqcy5vcmcvYXBpL3Byb2Nlc3MuaHRtbCNwcm9jZXNzX3Byb2Nlc3NfcGlkICovXG4gIHBpZCA9IHBpZDtcblxuICAvKiogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc19wcm9jZXNzX3BsYXRmb3JtICovXG4gIHBsYXRmb3JtID0gcGxhdGZvcm07XG5cbiAgb3ZlcnJpZGUgYWRkTGlzdGVuZXIoZXZlbnQ6IFwiZXhpdFwiLCBsaXN0ZW5lcjogKGNvZGU6IG51bWJlcikgPT4gdm9pZCk6IHRoaXM7XG4gIG92ZXJyaWRlIGFkZExpc3RlbmVyKFxuICAgIGV2ZW50OiB0eXBlb2Ygbm90SW1wbGVtZW50ZWRFdmVudHNbbnVtYmVyXSxcbiAgICAvLyBkZW5vLWxpbnQtaWdub3JlIGJhbi10eXBlc1xuICAgIGxpc3RlbmVyOiBGdW5jdGlvbixcbiAgKTogdGhpcztcbiAgb3ZlcnJpZGUgYWRkTGlzdGVuZXIoXG4gICAgZXZlbnQ6IHN0cmluZyxcbiAgICAvLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuICAgIGxpc3RlbmVyOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQsXG4gICk6IHRoaXMge1xuICAgIGlmIChub3RJbXBsZW1lbnRlZEV2ZW50cy5pbmNsdWRlcyhldmVudCkpIHtcbiAgICAgIHdhcm5Ob3RJbXBsZW1lbnRlZChgcHJvY2Vzcy5hZGRMaXN0ZW5lcihcIiR7ZXZlbnR9XCIpYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub24oZXZlbnQsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIG92ZXJyaWRlIHJlbW92ZUxpc3RlbmVyKFxuICAgIGV2ZW50OiBcImV4aXRcIixcbiAgICBsaXN0ZW5lcjogKGNvZGU6IG51bWJlcikgPT4gdm9pZCxcbiAgKTogdGhpcztcbiAgb3ZlcnJpZGUgcmVtb3ZlTGlzdGVuZXIoXG4gICAgZXZlbnQ6IHR5cGVvZiBub3RJbXBsZW1lbnRlZEV2ZW50c1tudW1iZXJdLFxuICAgIC8vIGRlbm8tbGludC1pZ25vcmUgYmFuLXR5cGVzXG4gICAgbGlzdGVuZXI6IEZ1bmN0aW9uLFxuICApOiB0aGlzO1xuICBvdmVycmlkZSByZW1vdmVMaXN0ZW5lcihcbiAgICBldmVudDogc3RyaW5nLFxuICAgIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG4gICAgbGlzdGVuZXI6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCxcbiAgKTogdGhpcyB7XG4gICAgaWYgKG5vdEltcGxlbWVudGVkRXZlbnRzLmluY2x1ZGVzKGV2ZW50KSkge1xuICAgICAgd2Fybk5vdEltcGxlbWVudGVkKGBwcm9jZXNzLnJlbW92ZUxpc3RlbmVyKFwiJHtldmVudH1cIilgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vZmYoZXZlbnQsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IGhpZ2gtcmVzb2x1dGlvbiByZWFsIHRpbWUgaW4gYSBbc2Vjb25kcywgbmFub3NlY29uZHNdXG4gICAqIHR1cGxlLlxuICAgKlxuICAgKiBOb3RlOiBZb3UgbmVlZCB0byBnaXZlIC0tYWxsb3ctaHJ0aW1lIHBlcm1pc3Npb24gdG8gRGVubyB0byBhY3R1YWxseSBnZXRcbiAgICogbmFub3NlY29uZHMgcHJlY2lzaW9uIHZhbHVlcy4gSWYgeW91IGRvbid0IGdpdmUgJ2hydGltZScgcGVybWlzc2lvbiwgdGhlIHJldHVybmVkXG4gICAqIHZhbHVlcyBvbmx5IGhhdmUgbWlsbGlzZWNvbmRzIHByZWNpc2lvbi5cbiAgICpcbiAgICogYHRpbWVgIGlzIGFuIG9wdGlvbmFsIHBhcmFtZXRlciB0aGF0IG11c3QgYmUgdGhlIHJlc3VsdCBvZiBhIHByZXZpb3VzIHByb2Nlc3MuaHJ0aW1lKCkgY2FsbCB0byBkaWZmIHdpdGggdGhlIGN1cnJlbnQgdGltZS5cbiAgICpcbiAgICogVGhlc2UgdGltZXMgYXJlIHJlbGF0aXZlIHRvIGFuIGFyYml0cmFyeSB0aW1lIGluIHRoZSBwYXN0LCBhbmQgbm90IHJlbGF0ZWQgdG8gdGhlIHRpbWUgb2YgZGF5IGFuZCB0aGVyZWZvcmUgbm90IHN1YmplY3QgdG8gY2xvY2sgZHJpZnQuIFRoZSBwcmltYXJ5IHVzZSBpcyBmb3IgbWVhc3VyaW5nIHBlcmZvcm1hbmNlIGJldHdlZW4gaW50ZXJ2YWxzLlxuICAgKiBodHRwczovL25vZGVqcy5vcmcvYXBpL3Byb2Nlc3MuaHRtbCNwcm9jZXNzX3Byb2Nlc3NfaHJ0aW1lX3RpbWVcbiAgICovXG4gIGhydGltZSA9IGhydGltZTtcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogTm9kZUpTIGludGVybmFsLCB1c2UgcHJvY2Vzcy5raWxsIGluc3RlYWRcbiAgICovXG4gIF9raWxsID0gX2tpbGw7XG5cbiAgLyoqIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvcHJvY2Vzcy5odG1sI3Byb2Nlc3NraWxscGlkLXNpZ25hbCAqL1xuICBraWxsID0ga2lsbDtcblxuICBtZW1vcnlVc2FnZSA9IG1lbW9yeVVzYWdlO1xuXG4gIC8qKiBodHRwczovL25vZGVqcy5vcmcvYXBpL3Byb2Nlc3MuaHRtbCNwcm9jZXNzX3Byb2Nlc3Nfc3RkZXJyICovXG4gIHN0ZGVyciA9IHN0ZGVycjtcblxuICAvKiogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc19wcm9jZXNzX3N0ZGluICovXG4gIHN0ZGluID0gc3RkaW47XG5cbiAgLyoqIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvcHJvY2Vzcy5odG1sI3Byb2Nlc3NfcHJvY2Vzc19zdGRvdXQgKi9cbiAgc3Rkb3V0ID0gc3Rkb3V0O1xuXG4gIC8qKiBodHRwczovL25vZGVqcy5vcmcvYXBpL3Byb2Nlc3MuaHRtbCNwcm9jZXNzX3Byb2Nlc3NfdmVyc2lvbiAqL1xuICB2ZXJzaW9uID0gdmVyc2lvbjtcblxuICAvKiogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc19wcm9jZXNzX3ZlcnNpb25zICovXG4gIHZlcnNpb25zID0gdmVyc2lvbnM7XG5cbiAgLyoqIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvcHJvY2Vzcy5odG1sI3Byb2Nlc3NfcHJvY2Vzc19lbWl0d2FybmluZ193YXJuaW5nX29wdGlvbnMgKi9cbiAgZW1pdFdhcm5pbmcgPSBlbWl0V2FybmluZztcblxuICBiaW5kaW5nKG5hbWU6IEJpbmRpbmdOYW1lKSB7XG4gICAgcmV0dXJuIGdldEJpbmRpbmcobmFtZSk7XG4gIH1cblxuICAvKiogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc3VtYXNrbWFzayAqL1xuICB1bWFzaygpIHtcbiAgICAvLyBBbHdheXMgcmV0dXJuIHRoZSBzeXN0ZW0gZGVmYXVsdCB1bWFzayB2YWx1ZS5cbiAgICAvLyBXZSBkb24ndCB1c2UgRGVuby51bWFzayBoZXJlIGJlY2F1c2UgaXQgaGFzIGEgcmFjZVxuICAgIC8vIGNvbmRpdGlvbiBidWcuXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kZW5vbGFuZC9kZW5vX3N0ZC9pc3N1ZXMvMTg5MyNpc3N1ZWNvbW1lbnQtMTAzMjg5Nzc3OVxuICAgIHJldHVybiAwbzIyO1xuICB9XG5cbiAgLyoqIFRoaXMgbWV0aG9kIGlzIHJlbW92ZWQgb24gV2luZG93cyAqL1xuICBnZXRnaWQ/KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIERlbm8uZ2lkKCkhO1xuICB9XG5cbiAgLyoqIFRoaXMgbWV0aG9kIGlzIHJlbW92ZWQgb24gV2luZG93cyAqL1xuICBnZXR1aWQ/KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIERlbm8udWlkKCkhO1xuICB9XG5cbiAgLy8gVE9ETyhrdDNrKTogSW1wbGVtZW50IHRoaXMgd2hlbiB3ZSBhZGRlZCAtZSBvcHRpb24gdG8gbm9kZSBjb21wYXQgbW9kZVxuICBfZXZhbDogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIC8qKiBodHRwczovL25vZGVqcy5vcmcvYXBpL3Byb2Nlc3MuaHRtbCNwcm9jZXNzZXhlY3BhdGggKi9cbiAgZ2V0IGV4ZWNQYXRoKCkge1xuICAgIGlmIChleGVjUGF0aCkge1xuICAgICAgcmV0dXJuIGV4ZWNQYXRoO1xuICAgIH1cbiAgICBleGVjUGF0aCA9IERlbm8uZXhlY1BhdGgoKTtcbiAgICByZXR1cm4gZXhlY1BhdGg7XG4gIH1cblxuICBzZXQgZXhlY1BhdGgocGF0aDogc3RyaW5nKSB7XG4gICAgZXhlY1BhdGggPSBwYXRoO1xuICB9XG5cbiAgI3N0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gIC8qKiBodHRwczovL25vZGVqcy5vcmcvYXBpL3Byb2Nlc3MuaHRtbCNwcm9jZXNzdXB0aW1lICovXG4gIHVwdGltZSgpIHtcbiAgICByZXR1cm4gKERhdGUubm93KCkgLSB0aGlzLiNzdGFydFRpbWUpIC8gMTAwMDtcbiAgfVxuXG4gICNhbGxvd2VkRmxhZ3MgPSBidWlsZEFsbG93ZWRGbGFncygpO1xuICAvKiogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc2FsbG93ZWRub2RlZW52aXJvbm1lbnRmbGFncyAqL1xuICBnZXQgYWxsb3dlZE5vZGVFbnZpcm9ubWVudEZsYWdzKCkge1xuICAgIHJldHVybiB0aGlzLiNhbGxvd2VkRmxhZ3M7XG4gIH1cblxuICBmZWF0dXJlcyA9IHsgaW5zcGVjdG9yOiBmYWxzZSB9O1xuXG4gIC8vIFRPRE8oa3Qzayk6IEdldCB0aGUgdmFsdWUgZnJvbSAtLW5vLWRlcHJlY2F0aW9uIGZsYWcuXG4gIG5vRGVwcmVjYXRpb24gPSBmYWxzZTtcbn1cblxuaWYgKERlbm8uYnVpbGQub3MgPT09IFwid2luZG93c1wiKSB7XG4gIGRlbGV0ZSBQcm9jZXNzLnByb3RvdHlwZS5nZXRnaWQ7XG4gIGRlbGV0ZSBQcm9jZXNzLnByb3RvdHlwZS5nZXR1aWQ7XG59XG5cbi8qKiBodHRwczovL25vZGVqcy5vcmcvYXBpL3Byb2Nlc3MuaHRtbCNwcm9jZXNzX3Byb2Nlc3MgKi9cbmNvbnN0IHByb2Nlc3MgPSBuZXcgUHJvY2VzcygpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkocHJvY2VzcywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogdHJ1ZSxcbiAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgdmFsdWU6IFwicHJvY2Vzc1wiLFxufSk7XG5cbmFkZFJlYWRPbmx5UHJvY2Vzc0FsaWFzKFwibm9EZXByZWNhdGlvblwiLCBcIi0tbm8tZGVwcmVjYXRpb25cIik7XG5hZGRSZWFkT25seVByb2Nlc3NBbGlhcyhcInRocm93RGVwcmVjYXRpb25cIiwgXCItLXRocm93LWRlcHJlY2F0aW9uXCIpO1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlTGlzdGVuZXIgPSBwcm9jZXNzLnJlbW92ZUxpc3RlbmVyO1xuZXhwb3J0IGNvbnN0IHJlbW92ZUFsbExpc3RlbmVycyA9IHByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzO1xuXG5leHBvcnQgZGVmYXVsdCBwcm9jZXNzO1xuXG4vL1RPRE8oU29yZW13YXIpXG4vL1JlbW92ZSBvbiAxLjBcbi8vS2VwdCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgd2l0aCBzdGRcbmV4cG9ydCB7IHByb2Nlc3MgfTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUscUZBQXFGO0FBRXJGLFNBQVMsY0FBYyxFQUFFLGtCQUFrQixRQUFRLGNBQWM7QUFDakUsU0FBUyxZQUFZLFFBQVEsY0FBYztBQUMzQyxTQUFTLGNBQWMsUUFBUSw0QkFBNEI7QUFDM0QsU0FDRSxvQkFBb0IsRUFDcEIsa0JBQWtCLEVBQ2xCLGNBQWMsUUFDVCx1QkFBdUI7QUFDOUIsU0FBUyxjQUFjLFFBQVEsd0JBQXdCO0FBQ3ZELFNBQVMsTUFBTSxRQUFRLHNCQUFzQjtBQUM3QyxTQUFT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