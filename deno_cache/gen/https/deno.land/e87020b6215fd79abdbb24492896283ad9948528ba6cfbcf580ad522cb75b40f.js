// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// Copyright Joyent, Inc. and Node.js contributors. All rights reserved. MIT license.
// The following are all the process APIs that don't depend on the stream module
// They have to be split this way to prevent a circular dependency
import { isWindows } from "../../_util/os.ts";
import { nextTick as _nextTick } from "../_next_tick.ts";
/** Returns the operating system CPU architecture for which the Deno binary was compiled */ function _arch() {
    if (Deno.build.arch == "x86_64") {
        return "x64";
    } else if (Deno.build.arch == "aarch64") {
        return "arm64";
    } else {
        throw Error("unreachable");
    }
}
/** https://nodejs.org/api/process.html#process_process_arch */ export const arch = _arch();
/** https://nodejs.org/api/process.html#process_process_chdir_directory */ export const chdir = Deno.chdir;
/** https://nodejs.org/api/process.html#process_process_cwd */ export const cwd = Deno.cwd;
/** https://nodejs.org/api/process.html#process_process_nexttick_callback_args */ export const nextTick = _nextTick;
/** Wrapper of Deno.env.get, which doesn't throw type error when
 * the env name has "=" or "\0" in it. */ function denoEnvGet(name) {
    try {
        return Deno.env.get(name);
    } catch (e) {
        if (e instanceof TypeError) {
            return undefined;
        }
        throw e;
    }
}
const OBJECT_PROTO_PROP_NAMES = Object.getOwnPropertyNames(Object.prototype);
/**
 * https://nodejs.org/api/process.html#process_process_env
 * Requires env permissions
 */ export const env = new Proxy(Object(), {
    get: (target, prop)=>{
        if (typeof prop === "symbol") {
            return target[prop];
        }
        const envValue = denoEnvGet(prop);
        if (envValue) {
            return envValue;
        }
        if (OBJECT_PROTO_PROP_NAMES.includes(prop)) {
            return target[prop];
        }
        return envValue;
    },
    ownKeys: ()=>Reflect.ownKeys(Deno.env.toObject()),
    getOwnPropertyDescriptor: (_target, name)=>{
        const value = denoEnvGet(String(name));
        if (value) {
            return {
                enumerable: true,
                configurable: true,
                value
            };
        }
    },
    set (_target, prop, value) {
        Deno.env.set(String(prop), String(value));
        return true; // success
    },
    has: (_target, prop)=>typeof denoEnvGet(String(prop)) === "string"
});
/** https://nodejs.org/api/process.html#process_process_pid */ export const pid = Deno.pid;
/** https://nodejs.org/api/process.html#process_process_platform */ export const platform = isWindows ? "win32" : Deno.build.os;
/**
 * https://nodejs.org/api/process.html#process_process_version
 *
 * This value is hard coded to latest stable release of Node, as
 * some packages are checking it for compatibility. Previously
 * it pointed to Deno version, but that led to incompability
 * with some packages.
 */ export const version = "v18.12.1";
/**
 * https://nodejs.org/api/process.html#process_process_versions
 *
 * This value is hard coded to latest stable release of Node, as
 * some packages are checking it for compatibility. Previously
 * it contained only output of `Deno.version`, but that led to incompability
 * with some packages. Value of `v8` field is still taken from `Deno.version`.
 */ export const versions = {
    node: "18.12.1",
    uv: "1.43.0",
    zlib: "1.2.11",
    brotli: "1.0.9",
    ares: "1.18.1",
    modules: "108",
    nghttp2: "1.47.0",
    napi: "8",
    llhttp: "6.0.10",
    openssl: "3.0.7+quic",
    cldr: "41.0",
    icu: "71.1",
    tz: "2022b",
    unicode: "14.0",
    ngtcp2: "0.8.1",
    nghttp3: "0.7.0",
    ...Deno.version
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE3Ny4wL25vZGUvX3Byb2Nlc3MvcHJvY2Vzcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIzIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgTm9kZS5qcyBjb250cmlidXRvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuXG4vLyBUaGUgZm9sbG93aW5nIGFyZSBhbGwgdGhlIHByb2Nlc3MgQVBJcyB0aGF0IGRvbid0IGRlcGVuZCBvbiB0aGUgc3RyZWFtIG1vZHVsZVxuLy8gVGhleSBoYXZlIHRvIGJlIHNwbGl0IHRoaXMgd2F5IHRvIHByZXZlbnQgYSBjaXJjdWxhciBkZXBlbmRlbmN5XG5cbmltcG9ydCB7IGlzV2luZG93cyB9IGZyb20gXCIuLi8uLi9fdXRpbC9vcy50c1wiO1xuaW1wb3J0IHsgbmV4dFRpY2sgYXMgX25leHRUaWNrIH0gZnJvbSBcIi4uL19uZXh0X3RpY2sudHNcIjtcbmltcG9ydCB7IF9leGl0aW5nIH0gZnJvbSBcIi4vZXhpdGluZy50c1wiO1xuXG4vKiogUmV0dXJucyB0aGUgb3BlcmF0aW5nIHN5c3RlbSBDUFUgYXJjaGl0ZWN0dXJlIGZvciB3aGljaCB0aGUgRGVubyBiaW5hcnkgd2FzIGNvbXBpbGVkICovXG5mdW5jdGlvbiBfYXJjaCgpOiBzdHJpbmcge1xuICBpZiAoRGVuby5idWlsZC5hcmNoID09IFwieDg2XzY0XCIpIHtcbiAgICByZXR1cm4gXCJ4NjRcIjtcbiAgfSBlbHNlIGlmIChEZW5vLmJ1aWxkLmFyY2ggPT0gXCJhYXJjaDY0XCIpIHtcbiAgICByZXR1cm4gXCJhcm02NFwiO1xuICB9IGVsc2Uge1xuICAgIHRocm93IEVycm9yKFwidW5yZWFjaGFibGVcIik7XG4gIH1cbn1cblxuLyoqIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvcHJvY2Vzcy5odG1sI3Byb2Nlc3NfcHJvY2Vzc19hcmNoICovXG5leHBvcnQgY29uc3QgYXJjaCA9IF9hcmNoKCk7XG5cbi8qKiBodHRwczovL25vZGVqcy5vcmcvYXBpL3Byb2Nlc3MuaHRtbCNwcm9jZXNzX3Byb2Nlc3NfY2hkaXJfZGlyZWN0b3J5ICovXG5leHBvcnQgY29uc3QgY2hkaXIgPSBEZW5vLmNoZGlyO1xuXG4vKiogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc19wcm9jZXNzX2N3ZCAqL1xuZXhwb3J0IGNvbnN0IGN3ZCA9IERlbm8uY3dkO1xuXG4vKiogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc19wcm9jZXNzX25leHR0aWNrX2NhbGxiYWNrX2FyZ3MgKi9cbmV4cG9ydCBjb25zdCBuZXh0VGljayA9IF9uZXh0VGljaztcblxuLyoqIFdyYXBwZXIgb2YgRGVuby5lbnYuZ2V0LCB3aGljaCBkb2Vzbid0IHRocm93IHR5cGUgZXJyb3Igd2hlblxuICogdGhlIGVudiBuYW1lIGhhcyBcIj1cIiBvciBcIlxcMFwiIGluIGl0LiAqL1xuZnVuY3Rpb24gZGVub0VudkdldChuYW1lOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gRGVuby5lbnYuZ2V0KG5hbWUpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGUgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRocm93IGU7XG4gIH1cbn1cblxuY29uc3QgT0JKRUNUX1BST1RPX1BST1BfTkFNRVMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPYmplY3QucHJvdG90eXBlKTtcbi8qKlxuICogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc19wcm9jZXNzX2VudlxuICogUmVxdWlyZXMgZW52IHBlcm1pc3Npb25zXG4gKi9cbmV4cG9ydCBjb25zdCBlbnY6IEluc3RhbmNlVHlwZTxPYmplY3RDb25zdHJ1Y3Rvcj4gJiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID1cbiAgbmV3IFByb3h5KE9iamVjdCgpLCB7XG4gICAgZ2V0OiAodGFyZ2V0LCBwcm9wKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHByb3AgPT09IFwic3ltYm9sXCIpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZW52VmFsdWUgPSBkZW5vRW52R2V0KHByb3ApO1xuXG4gICAgICBpZiAoZW52VmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGVudlZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoT0JKRUNUX1BST1RPX1BST1BfTkFNRVMuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGVudlZhbHVlO1xuICAgIH0sXG4gICAgb3duS2V5czogKCkgPT4gUmVmbGVjdC5vd25LZXlzKERlbm8uZW52LnRvT2JqZWN0KCkpLFxuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogKF90YXJnZXQsIG5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gZGVub0VudkdldChTdHJpbmcobmFtZSkpO1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXQoX3RhcmdldCwgcHJvcCwgdmFsdWUpIHtcbiAgICAgIERlbm8uZW52LnNldChTdHJpbmcocHJvcCksIFN0cmluZyh2YWx1ZSkpO1xuICAgICAgcmV0dXJuIHRydWU7IC8vIHN1Y2Nlc3NcbiAgICB9LFxuICAgIGhhczogKF90YXJnZXQsIHByb3ApID0+IHR5cGVvZiBkZW5vRW52R2V0KFN0cmluZyhwcm9wKSkgPT09IFwic3RyaW5nXCIsXG4gIH0pO1xuXG4vKiogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc19wcm9jZXNzX3BpZCAqL1xuZXhwb3J0IGNvbnN0IHBpZCA9IERlbm8ucGlkO1xuXG4vKiogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9wcm9jZXNzLmh0bWwjcHJvY2Vzc19wcm9jZXNzX3BsYXRmb3JtICovXG5leHBvcnQgY29uc3QgcGxhdGZvcm0gPSBpc1dpbmRvd3MgPyBcIndpbjMyXCIgOiBEZW5vLmJ1aWxkLm9zO1xuXG4vKipcbiAqIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvcHJvY2Vzcy5odG1sI3Byb2Nlc3NfcHJvY2Vzc192ZXJzaW9uXG4gKlxuICogVGhpcyB2YWx1ZSBpcyBoYXJkIGNvZGVkIHRvIGxhdGVzdCBzdGFibGUgcmVsZWFzZSBvZiBOb2RlLCBhc1xuICogc29tZSBwYWNrYWdlcyBhcmUgY2hlY2tpbmcgaXQgZm9yIGNvbXBhdGliaWxpdHkuIFByZXZpb3VzbHlcbiAqIGl0IHBvaW50ZWQgdG8gRGVubyB2ZXJzaW9uLCBidXQgdGhhdCBsZWQgdG8gaW5jb21wYWJpbGl0eVxuICogd2l0aCBzb21lIHBhY2thZ2VzLlxuICovXG5leHBvcnQgY29uc3QgdmVyc2lvbiA9IFwidjE4LjEyLjFcIjtcblxuLyoqXG4gKiBodHRwczovL25vZGVqcy5vcmcvYXBpL3Byb2Nlc3MuaHRtbCNwcm9jZXNzX3Byb2Nlc3NfdmVyc2lvbnNcbiAqXG4gKiBUaGlzIHZhbHVlIGlzIGhhcmQgY29kZWQgdG8gbGF0ZXN0IHN0YWJsZSByZWxlYXNlIG9mIE5vZGUsIGFzXG4gKiBzb21lIHBhY2thZ2VzIGFyZSBjaGVja2luZyBpdCBmb3IgY29tcGF0aWJpbGl0eS4gUHJldmlvdXNseVxuICogaXQgY29udGFpbmVkIG9ubHkgb3V0cHV0IG9mIGBEZW5vLnZlcnNpb25gLCBidXQgdGhhdCBsZWQgdG8gaW5jb21wYWJpbGl0eVxuICogd2l0aCBzb21lIHBhY2thZ2VzLiBWYWx1ZSBvZiBgdjhgIGZpZWxkIGlzIHN0aWxsIHRha2VuIGZyb20gYERlbm8udmVyc2lvbmAuXG4gKi9cbmV4cG9ydCBjb25zdCB2ZXJzaW9ucyA9IHtcbiAgbm9kZTogXCIxOC4xMi4xXCIsXG4gIHV2OiBcIjEuNDMuMFwiLFxuICB6bGliOiBcIjEuMi4xMVwiLFxuICBicm90bGk6IFwiMS4wLjlcIixcbiAgYXJlczogXCIxLjE4LjFcIixcbiAgbW9kdWxlczogXCIxMDhcIixcbiAgbmdodHRwMjogXCIxLjQ3LjBcIixcbiAgbmFwaTogXCI4XCIsXG4gIGxsaHR0cDogXCI2LjAuMTBcIixcbiAgb3BlbnNzbDogXCIzLjAuNytxdWljXCIsXG4gIGNsZHI6IFwiNDEuMFwiLFxuICBpY3U6IFwiNzEuMVwiLFxuICB0ejogXCIyMDIyYlwiLFxuICB1bmljb2RlOiBcIjE0LjBcIixcbiAgbmd0Y3AyOiBcIjAuOC4xXCIsXG4gIG5naHR0cDM6IFwiMC43LjBcIixcbiAgLi4uRGVuby52ZXJzaW9uLFxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUscUZBQXFGO0FBRXJGLGdGQUFnRjtBQUNoRixrRUFBa0U7QUFFbEUsU0FBUyxTQUFTLFFBQVEsb0JBQW9CO0FBQzlDLFNBQVMsWUFBWSxTQUFTLFFBQVEsbUJBQW1CO0FBR3pELHlGQUF5RixHQUN6RixTQUFTLFFBQWdCO0lBQ3ZCLElBQUksS0FBSyxLQUFLLENBQUMsSUFBSSxJQUFJLFVBQVU7UUFDL0IsT0FBTztJQUNULE9BQU8sSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksV0FBVztRQUN2QyxPQUFPO0lBQ1QsT0FBTztRQUNMLE1BQU0sTUFBTSxlQUFlO0lBQzdCLENBQUM7QUFDSDtBQUVBLDZEQUE2RCxHQUM3RCxPQUFPLE1BQU0sT0FBTyxRQUFRO0FBRTVCLHdFQUF3RSxHQUN4RSxPQUFPLE1BQU0sUUFBUSxLQUFLLEtBQUssQ0FBQztBQUVoQyw0REFBNEQsR0FDNUQsT0FBTyxNQUFNLE1BQU0sS0FBSyxHQUFHLENBQUM7QUFFNUIsK0VBQStFLEdBQy9FLE9BQU8sTUFBTSxXQUFXLFVBQVU7QUFFbEM7dUNBQ3VDLEdBQ3ZDLFNBQVMsV0FBVyxJQUFZLEVBQUU7SUFDaEMsSUFBSTtRQUNGLE9BQU8sS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3RCLEVBQUUsT0FBTyxHQUFHO1FBQ1YsSUFBSSxhQUFhLFdBQVc7WUFDMUIsT0FBTztRQUNULENBQUM7UUFDRCxNQUFNLEVBQUU7SUFDVjtBQUNGO0FBRUEsTUFBTSwwQkFBMEIsT0FBTyxtQkFBbUIsQ0FBQyxPQUFPLFNBQVM7QUFDM0U7OztDQUdDLEdBQ0QsT0FBTyxNQUFNLE1BQ1gsSUFBSSxNQUFNLFVBQVU7SUFDbEIsS0FBSyxDQUFDLFFBQVEsT0FBUztRQUNyQixJQUFJLE9BQU8sU0FBUyxVQUFVO1lBQzVCLE9BQU8sTUFBTSxDQUFDLEtBQUs7UUFDckIsQ0FBQztRQUVELE1BQU0sV0FBVyxXQUFXO1FBRTVCLElBQUksVUFBVTtZQUNaLE9BQU87UUFDVCxDQUFDO1FBRUQsSUFBSSx3QkFBd0IsUUFBUSxDQUFDLE9BQU87WUFDMUMsT0FBTyxNQUFNLENBQUMsS0FBSztRQUNyQixDQUFDO1FBRUQsT0FBTztJQUNUO0lBQ0EsU0FBUyxJQUFNLFFBQVEsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLFFBQVE7SUFDaEQsMEJBQTBCLENBQUMsU0FBUyxPQUFTO1FBQzNDLE1BQU0sUUFBUSxXQUFXLE9BQU87UUFDaEMsSUFBSSxPQUFPO1lBQ1QsT0FBTztnQkFDTCxZQUFZLElBQUk7Z0JBQ2hCLGNBQWMsSUFBSTtnQkFDbEI7WUFDRjtRQUNGLENBQUM7SUFDSDtJQUNBLEtBQUksT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7UUFDeEIsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sT0FBTyxPQUFPO1FBQ2xDLE9BQU8sSUFBSSxFQUFFLFVBQVU7SUFDekI7SUFDQSxLQUFLLENBQUMsU0FBUyxPQUFTLE9BQU8sV0FBVyxPQUFPLFdBQVc7QUFDOUQsR0FBRztBQUVMLDREQUE0RCxHQUM1RCxPQUFPLE1BQU0sTUFBTSxLQUFLLEdBQUcsQ0FBQztBQUU1QixpRUFBaUUsR0FDakUsT0FBTyxNQUFNLFdBQVcsWUFBWSxVQUFVLEtBQUssS0FBSyxDQUFDLEVBQUUsQ0FBQztBQUU1RDs7Ozs7OztDQU9DLEdBQ0QsT0FBTyxNQUFNLFVBQVUsV0FBVztBQUVsQzs7Ozs7OztDQU9DLEdBQ0QsT0FBTyxNQUFNLFdBQVc7SUFDdEIsTUFBTTtJQUNOLElBQUk7SUFDSixNQUFNO0lBQ04sUUFBUTtJQUNSLE1BQU07SUFDTixTQUFTO0lBQ1QsU0FBUztJQUNULE1BQU07SUFDTixRQUFRO0lBQ1IsU0FBUztJQUNULE1BQU07SUFDTixLQUFLO0lBQ0wsSUFBSTtJQUNKLFNBQVM7SUFDVCxRQUFRO0lBQ1IsU0FBUztJQUNULEdBQUcsS0FBSyxPQUFPO0FBQ2pCLEVBQUUifQ==