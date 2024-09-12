// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// This module ports:
// - https://github.com/nodejs/node/blob/master/src/tcp_wrap.cc
// - https://github.com/nodejs/node/blob/master/src/tcp_wrap.h
import { notImplemented } from "../_utils.ts";
import { unreachable } from "../../_util/asserts.ts";
import { ConnectionWrap } from "./connection_wrap.ts";
import { AsyncWrap, providerType } from "./async_wrap.ts";
import { LibuvStreamWrap } from "./stream_wrap.ts";
import { ownerSymbol } from "./symbols.ts";
import { codeMap } from "./uv.ts";
import { delay } from "../../async/mod.ts";
import { kStreamBaseField } from "./stream_wrap.ts";
import { isIP } from "../internal/net.ts";
import { ceilPowOf2, INITIAL_ACCEPT_BACKOFF_DELAY, MAX_ACCEPT_BACKOFF_DELAY } from "./_listen.ts";
var /** The type of TCP socket. */ socketType;
(function(socketType) {
    socketType[socketType["SOCKET"] = 0] = "SOCKET";
    socketType[socketType["SERVER"] = 1] = "SERVER";
})(socketType || (socketType = {}));
export class TCPConnectWrap extends AsyncWrap {
    oncomplete;
    address;
    port;
    localAddress;
    localPort;
    constructor(){
        super(providerType.TCPCONNECTWRAP);
    }
}
export var constants;
(function(constants) {
    constants[constants["SOCKET"] = socketType.SOCKET] = "SOCKET";
    constants[constants["SERVER"] = socketType.SERVER] = "SERVER";
    constants[constants["UV_TCP_IPV6ONLY"] = 0] = "UV_TCP_IPV6ONLY";
})(constants || (constants = {}));
export class TCP extends ConnectionWrap {
    [ownerSymbol] = null;
    reading = false;
    #address;
    #port;
    #remoteAddress;
    #remoteFamily;
    #remotePort;
    #backlog;
    #listener;
    #connections = 0;
    #closed = false;
    #acceptBackoffDelay;
    /**
   * Creates a new TCP class instance.
   * @param type The socket type.
   * @param conn Optional connection object to wrap.
   */ constructor(type, conn){
        let provider;
        switch(type){
            case socketType.SOCKET:
                {
                    provider = providerType.TCPWRAP;
                    break;
                }
            case socketType.SERVER:
                {
                    provider = providerType.TCPSERVERWRAP;
                    break;
                }
            default:
                {
                    unreachable();
                }
        }
        super(provider, conn);
        // TODO(cmorten): the handling of new connections and construction feels
        // a little off. Suspect duplicating in some fashion.
        if (conn && provider === providerType.TCPWRAP) {
            const localAddr = conn.localAddr;
            this.#address = localAddr.hostname;
            this.#port = localAddr.port;
            const remoteAddr = conn.remoteAddr;
            this.#remoteAddress = remoteAddr.hostname;
            this.#remotePort = remoteAddr.port;
            this.#remoteFamily = isIP(remoteAddr.hostname);
        }
    }
    /**
   * Opens a file descriptor.
   * @param fd The file descriptor to open.
   * @return An error status code.
   */ open(_fd) {
        // REF: https://github.com/denoland/deno/issues/6529
        notImplemented("TCP.prototype.open");
    }
    /**
   * Bind to an IPv4 address.
   * @param address The hostname to bind to.
   * @param port The port to bind to
   * @return An error status code.
   */ bind(address, port) {
        return this.#bind(address, port, 0);
    }
    /**
   * Bind to an IPv6 address.
   * @param address The hostname to bind to.
   * @param port The port to bind to
   * @return An error status code.
   */ bind6(address, port, flags) {
        return this.#bind(address, port, flags);
    }
    /**
   * Connect to an IPv4 address.
   * @param req A TCPConnectWrap instance.
   * @param address The hostname to connect to.
   * @param port The port to connect to.
   * @return An error status code.
   */ connect(req, address, port) {
        return this.#connect(req, address, port);
    }
    /**
   * Connect to an IPv6 address.
   * @param req A TCPConnectWrap instance.
   * @param address The hostname to connect to.
   * @param port The port to connect to.
   * @return An error status code.
   */ connect6(req, address, port) {
        return this.#connect(req, address, port);
    }
    /**
   * Listen for new connections.
   * @param backlog The maximum length of the queue of pending connections.
   * @return An error status code.
   */ listen(backlog) {
        this.#backlog = ceilPowOf2(backlog + 1);
        const listenOptions = {
            hostname: this.#address,
            port: this.#port,
            transport: "tcp"
        };
        let listener;
        try {
            listener = Deno.listen(listenOptions);
        } catch (e) {
            if (e instanceof Deno.errors.AddrInUse) {
                return codeMap.get("EADDRINUSE");
            } else if (e instanceof Deno.errors.AddrNotAvailable) {
                return codeMap.get("EADDRNOTAVAIL");
            } else if (e instanceof Deno.errors.PermissionDenied) {
                throw e;
            }
            // TODO(cmorten): map errors to appropriate error codes.
            return codeMap.get("UNKNOWN");
        }
        const address = listener.addr;
        this.#address = address.hostname;
        this.#port = address.port;
        this.#listener = listener;
        this.#accept();
        return 0;
    }
    ref() {
        if (this.#listener) {
            this.#listener.ref();
        }
        if (this[kStreamBaseField]) {
            this[kStreamBaseField].ref();
        }
    }
    unref() {
        if (this.#listener) {
            this.#listener.unref();
        }
        if (this[kStreamBaseField]) {
            this[kStreamBaseField].unref();
        }
    }
    /**
   * Populates the provided object with local address entries.
   * @param sockname An object to add the local address entries to.
   * @return An error status code.
   */ getsockname(sockname) {
        if (typeof this.#address === "undefined" || typeof this.#port === "undefined") {
            return codeMap.get("EADDRNOTAVAIL");
        }
        sockname.address = this.#address;
        sockname.port = this.#port;
        sockname.family = isIP(this.#address);
        return 0;
    }
    /**
   * Populates the provided object with remote address entries.
   * @param peername An object to add the remote address entries to.
   * @return An error status code.
   */ getpeername(peername) {
        if (typeof this.#remoteAddress === "undefined" || typeof this.#remotePort === "undefined") {
            return codeMap.get("EADDRNOTAVAIL");
        }
        peername.address = this.#remoteAddress;
        peername.port = this.#remotePort;
        peername.family = this.#remoteFamily;
        return 0;
    }
    /**
   * @param noDelay
   * @return An error status code.
   */ setNoDelay(_noDelay) {
        // TODO(bnoordhuis) https://github.com/denoland/deno/pull/13103
        return 0;
    }
    /**
   * @param enable
   * @param initialDelay
   * @return An error status code.
   */ setKeepAlive(_enable, _initialDelay) {
        // TODO(bnoordhuis) https://github.com/denoland/deno/pull/13103
        return 0;
    }
    /**
   * Windows only.
   *
   * Deprecated by Node.
   * REF: https://github.com/nodejs/node/blob/master/lib/net.js#L1731
   *
   * @param enable
   * @return An error status code.
   * @deprecated
   */ setSimultaneousAccepts(_enable) {
        // Low priority to implement owing to it being deprecated in Node.
        notImplemented("TCP.prototype.setSimultaneousAccepts");
    }
    /**
   * Bind to an IPv4 or IPv6 address.
   * @param address The hostname to bind to.
   * @param port The port to bind to
   * @param _flags
   * @return An error status code.
   */ #bind(address, port, _flags) {
        // Deno doesn't currently separate bind from connect etc.
        // REF:
        // - https://doc.deno.land/deno/stable/~/Deno.connect
        // - https://doc.deno.land/deno/stable/~/Deno.listen
        //
        // This also means we won't be connecting from the specified local address
        // and port as providing these is not an option in Deno.
        // REF:
        // - https://doc.deno.land/deno/stable/~/Deno.ConnectOptions
        // - https://doc.deno.land/deno/stable/~/Deno.ListenOptions
        this.#address = address;
        this.#port = port;
        return 0;
    }
    /**
   * Connect to an IPv4 or IPv6 address.
   * @param req A TCPConnectWrap instance.
   * @param address The hostname to connect to.
   * @param port The port to connect to.
   * @return An error status code.
   */ #connect(req, address, port) {
        this.#remoteAddress = address;
        this.#remotePort = port;
        this.#remoteFamily = isIP(address);
        const connectOptions = {
            hostname: address,
            port,
            transport: "tcp"
        };
        Deno.connect(connectOptions).then((conn)=>{
            // Incorrect / backwards, but correcting the local address and port with
            // what was actually used given we can't actually specify these in Deno.
            const localAddr = conn.localAddr;
            this.#address = req.localAddress = localAddr.hostname;
            this.#port = req.localPort = localAddr.port;
            this[kStreamBaseField] = conn;
            try {
                this.afterConnect(req, 0);
            } catch  {
            // swallow callback errors.
            }
        }, ()=>{
            try {
                // TODO(cmorten): correct mapping of connection error to status code.
                this.afterConnect(req, codeMap.get("ECONNREFUSED"));
            } catch  {
            // swallow callback errors.
            }
        });
        return 0;
    }
    /** Handle backoff delays following an unsuccessful accept. */ async #acceptBackoff() {
        // Backoff after transient errors to allow time for the system to
        // recover, and avoid blocking up the event loop with a continuously
        // running loop.
        if (!this.#acceptBackoffDelay) {
            this.#acceptBackoffDelay = INITIAL_ACCEPT_BACKOFF_DELAY;
        } else {
            this.#acceptBackoffDelay *= 2;
        }
        if (this.#acceptBackoffDelay >= MAX_ACCEPT_BACKOFF_DELAY) {
            this.#acceptBackoffDelay = MAX_ACCEPT_BACKOFF_DELAY;
        }
        await delay(this.#acceptBackoffDelay);
        this.#accept();
    }
    /** Accept new connections. */ async #accept() {
        if (this.#closed) {
            return;
        }
        if (this.#connections > this.#backlog) {
            this.#acceptBackoff();
            return;
        }
        let connection;
        try {
            connection = await this.#listener.accept();
        } catch (e) {
            if (e instanceof Deno.errors.BadResource && this.#closed) {
                // Listener and server has closed.
                return;
            }
            try {
                // TODO(cmorten): map errors to appropriate error codes.
                this.onconnection(codeMap.get("UNKNOWN"), undefined);
            } catch  {
            // swallow callback errors.
            }
            this.#acceptBackoff();
            return;
        }
        // Reset the backoff delay upon successful accept.
        this.#acceptBackoffDelay = undefined;
        const connectionHandle = new TCP(socketType.SOCKET, connection);
        this.#connections++;
        try {
            this.onconnection(0, connectionHandle);
        } catch  {
        // swallow callback errors.
        }
        return this.#accept();
    }
    /** Handle server closure. */ _onClose() {
        this.#closed = true;
        this.reading = false;
        this.#address = undefined;
        this.#port = undefined;
        this.#remoteAddress = undefined;
        this.#remoteFamily = undefined;
        this.#remotePort = undefined;
        this.#backlog = undefined;
        this.#connections = 0;
        this.#acceptBackoffDelay = undefined;
        if (this.provider === providerType.TCPSERVERWRAP) {
            try {
                this.#listener.close();
            } catch  {
            // listener already closed
            }
        }
        return LibuvStreamWrap.prototype._onClose.call(this);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE3Ny4wL25vZGUvaW50ZXJuYWxfYmluZGluZy90Y3Bfd3JhcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIzIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIFRoaXMgbW9kdWxlIHBvcnRzOlxuLy8gLSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvYmxvYi9tYXN0ZXIvc3JjL3RjcF93cmFwLmNjXG4vLyAtIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9ibG9iL21hc3Rlci9zcmMvdGNwX3dyYXAuaFxuXG5pbXBvcnQgeyBub3RJbXBsZW1lbnRlZCB9IGZyb20gXCIuLi9fdXRpbHMudHNcIjtcbmltcG9ydCB7IHVucmVhY2hhYmxlIH0gZnJvbSBcIi4uLy4uL191dGlsL2Fzc2VydHMudHNcIjtcbmltcG9ydCB7IENvbm5lY3Rpb25XcmFwIH0gZnJvbSBcIi4vY29ubmVjdGlvbl93cmFwLnRzXCI7XG5pbXBvcnQgeyBBc3luY1dyYXAsIHByb3ZpZGVyVHlwZSB9IGZyb20gXCIuL2FzeW5jX3dyYXAudHNcIjtcbmltcG9ydCB7IExpYnV2U3RyZWFtV3JhcCB9IGZyb20gXCIuL3N0cmVhbV93cmFwLnRzXCI7XG5pbXBvcnQgeyBvd25lclN5bWJvbCB9IGZyb20gXCIuL3N5bWJvbHMudHNcIjtcbmltcG9ydCB7IGNvZGVNYXAgfSBmcm9tIFwiLi91di50c1wiO1xuaW1wb3J0IHsgZGVsYXkgfSBmcm9tIFwiLi4vLi4vYXN5bmMvbW9kLnRzXCI7XG5pbXBvcnQgeyBrU3RyZWFtQmFzZUZpZWxkIH0gZnJvbSBcIi4vc3RyZWFtX3dyYXAudHNcIjtcbmltcG9ydCB7IGlzSVAgfSBmcm9tIFwiLi4vaW50ZXJuYWwvbmV0LnRzXCI7XG5pbXBvcnQge1xuICBjZWlsUG93T2YyLFxuICBJTklUSUFMX0FDQ0VQVF9CQUNLT0ZGX0RFTEFZLFxuICBNQVhfQUNDRVBUX0JBQ0tPRkZfREVMQVksXG59IGZyb20gXCIuL19saXN0ZW4udHNcIjtcblxuLyoqIFRoZSB0eXBlIG9mIFRDUCBzb2NrZXQuICovXG5lbnVtIHNvY2tldFR5cGUge1xuICBTT0NLRVQsXG4gIFNFUlZFUixcbn1cblxuaW50ZXJmYWNlIEFkZHJlc3NJbmZvIHtcbiAgYWRkcmVzczogc3RyaW5nO1xuICBmYW1pbHk/OiBudW1iZXI7XG4gIHBvcnQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFRDUENvbm5lY3RXcmFwIGV4dGVuZHMgQXN5bmNXcmFwIHtcbiAgb25jb21wbGV0ZSE6IChcbiAgICBzdGF0dXM6IG51bWJlcixcbiAgICBoYW5kbGU6IENvbm5lY3Rpb25XcmFwLFxuICAgIHJlcTogVENQQ29ubmVjdFdyYXAsXG4gICAgcmVhZGFibGU6IGJvb2xlYW4sXG4gICAgd3JpdGVhYmxlOiBib29sZWFuLFxuICApID0+IHZvaWQ7XG4gIGFkZHJlc3MhOiBzdHJpbmc7XG4gIHBvcnQhOiBudW1iZXI7XG4gIGxvY2FsQWRkcmVzcyE6IHN0cmluZztcbiAgbG9jYWxQb3J0ITogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHByb3ZpZGVyVHlwZS5UQ1BDT05ORUNUV1JBUCk7XG4gIH1cbn1cblxuZXhwb3J0IGVudW0gY29uc3RhbnRzIHtcbiAgU09DS0VUID0gc29ja2V0VHlwZS5TT0NLRVQsXG4gIFNFUlZFUiA9IHNvY2tldFR5cGUuU0VSVkVSLFxuICBVVl9UQ1BfSVBWNk9OTFksXG59XG5cbmV4cG9ydCBjbGFzcyBUQ1AgZXh0ZW5kcyBDb25uZWN0aW9uV3JhcCB7XG4gIFtvd25lclN5bWJvbF06IHVua25vd24gPSBudWxsO1xuICBvdmVycmlkZSByZWFkaW5nID0gZmFsc2U7XG5cbiAgI2FkZHJlc3M/OiBzdHJpbmc7XG4gICNwb3J0PzogbnVtYmVyO1xuXG4gICNyZW1vdGVBZGRyZXNzPzogc3RyaW5nO1xuICAjcmVtb3RlRmFtaWx5PzogbnVtYmVyO1xuICAjcmVtb3RlUG9ydD86IG51bWJlcjtcblxuICAjYmFja2xvZz86IG51bWJlcjtcbiAgI2xpc3RlbmVyITogRGVuby5MaXN0ZW5lcjtcbiAgI2Nvbm5lY3Rpb25zID0gMDtcblxuICAjY2xvc2VkID0gZmFsc2U7XG4gICNhY2NlcHRCYWNrb2ZmRGVsYXk/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVENQIGNsYXNzIGluc3RhbmNlLlxuICAgKiBAcGFyYW0gdHlwZSBUaGUgc29ja2V0IHR5cGUuXG4gICAqIEBwYXJhbSBjb25uIE9wdGlvbmFsIGNvbm5lY3Rpb24gb2JqZWN0IHRvIHdyYXAuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0eXBlOiBudW1iZXIsIGNvbm4/OiBEZW5vLkNvbm4pIHtcbiAgICBsZXQgcHJvdmlkZXI6IHByb3ZpZGVyVHlwZTtcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBzb2NrZXRUeXBlLlNPQ0tFVDoge1xuICAgICAgICBwcm92aWRlciA9IHByb3ZpZGVyVHlwZS5UQ1BXUkFQO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBzb2NrZXRUeXBlLlNFUlZFUjoge1xuICAgICAgICBwcm92aWRlciA9IHByb3ZpZGVyVHlwZS5UQ1BTRVJWRVJXUkFQO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICB1bnJlYWNoYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN1cGVyKHByb3ZpZGVyLCBjb25uKTtcblxuICAgIC8vIFRPRE8oY21vcnRlbik6IHRoZSBoYW5kbGluZyBvZiBuZXcgY29ubmVjdGlvbnMgYW5kIGNvbnN0cnVjdGlvbiBmZWVsc1xuICAgIC8vIGEgbGl0dGxlIG9mZi4gU3VzcGVjdCBkdXBsaWNhdGluZyBpbiBzb21lIGZhc2hpb24uXG4gICAgaWYgKGNvbm4gJiYgcHJvdmlkZXIgPT09IHByb3ZpZGVyVHlwZS5UQ1BXUkFQKSB7XG4gICAgICBjb25zdCBsb2NhbEFkZHIgPSBjb25uLmxvY2FsQWRkciBhcyBEZW5vLk5ldEFkZHI7XG4gICAgICB0aGlzLiNhZGRyZXNzID0gbG9jYWxBZGRyLmhvc3RuYW1lO1xuICAgICAgdGhpcy4jcG9ydCA9IGxvY2FsQWRkci5wb3J0O1xuXG4gICAgICBjb25zdCByZW1vdGVBZGRyID0gY29ubi5yZW1vdGVBZGRyIGFzIERlbm8uTmV0QWRkcjtcbiAgICAgIHRoaXMuI3JlbW90ZUFkZHJlc3MgPSByZW1vdGVBZGRyLmhvc3RuYW1lO1xuICAgICAgdGhpcy4jcmVtb3RlUG9ydCA9IHJlbW90ZUFkZHIucG9ydDtcbiAgICAgIHRoaXMuI3JlbW90ZUZhbWlseSA9IGlzSVAocmVtb3RlQWRkci5ob3N0bmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGEgZmlsZSBkZXNjcmlwdG9yLlxuICAgKiBAcGFyYW0gZmQgVGhlIGZpbGUgZGVzY3JpcHRvciB0byBvcGVuLlxuICAgKiBAcmV0dXJuIEFuIGVycm9yIHN0YXR1cyBjb2RlLlxuICAgKi9cbiAgb3BlbihfZmQ6IG51bWJlcik6IG51bWJlciB7XG4gICAgLy8gUkVGOiBodHRwczovL2dpdGh1Yi5jb20vZGVub2xhbmQvZGVuby9pc3N1ZXMvNjUyOVxuICAgIG5vdEltcGxlbWVudGVkKFwiVENQLnByb3RvdHlwZS5vcGVuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJpbmQgdG8gYW4gSVB2NCBhZGRyZXNzLlxuICAgKiBAcGFyYW0gYWRkcmVzcyBUaGUgaG9zdG5hbWUgdG8gYmluZCB0by5cbiAgICogQHBhcmFtIHBvcnQgVGhlIHBvcnQgdG8gYmluZCB0b1xuICAgKiBAcmV0dXJuIEFuIGVycm9yIHN0YXR1cyBjb2RlLlxuICAgKi9cbiAgYmluZChhZGRyZXNzOiBzdHJpbmcsIHBvcnQ6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuI2JpbmQoYWRkcmVzcywgcG9ydCwgMCk7XG4gIH1cblxuICAvKipcbiAgICogQmluZCB0byBhbiBJUHY2IGFkZHJlc3MuXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSBob3N0bmFtZSB0byBiaW5kIHRvLlxuICAgKiBAcGFyYW0gcG9ydCBUaGUgcG9ydCB0byBiaW5kIHRvXG4gICAqIEByZXR1cm4gQW4gZXJyb3Igc3RhdHVzIGNvZGUuXG4gICAqL1xuICBiaW5kNihhZGRyZXNzOiBzdHJpbmcsIHBvcnQ6IG51bWJlciwgZmxhZ3M6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuI2JpbmQoYWRkcmVzcywgcG9ydCwgZmxhZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbm5lY3QgdG8gYW4gSVB2NCBhZGRyZXNzLlxuICAgKiBAcGFyYW0gcmVxIEEgVENQQ29ubmVjdFdyYXAgaW5zdGFuY2UuXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSBob3N0bmFtZSB0byBjb25uZWN0IHRvLlxuICAgKiBAcGFyYW0gcG9ydCBUaGUgcG9ydCB0byBjb25uZWN0IHRvLlxuICAgKiBAcmV0dXJuIEFuIGVycm9yIHN0YXR1cyBjb2RlLlxuICAgKi9cbiAgY29ubmVjdChyZXE6IFRDUENvbm5lY3RXcmFwLCBhZGRyZXNzOiBzdHJpbmcsIHBvcnQ6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuI2Nvbm5lY3QocmVxLCBhZGRyZXNzLCBwb3J0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25uZWN0IHRvIGFuIElQdjYgYWRkcmVzcy5cbiAgICogQHBhcmFtIHJlcSBBIFRDUENvbm5lY3RXcmFwIGluc3RhbmNlLlxuICAgKiBAcGFyYW0gYWRkcmVzcyBUaGUgaG9zdG5hbWUgdG8gY29ubmVjdCB0by5cbiAgICogQHBhcmFtIHBvcnQgVGhlIHBvcnQgdG8gY29ubmVjdCB0by5cbiAgICogQHJldHVybiBBbiBlcnJvciBzdGF0dXMgY29kZS5cbiAgICovXG4gIGNvbm5lY3Q2KHJlcTogVENQQ29ubmVjdFdyYXAsIGFkZHJlc3M6IHN0cmluZywgcG9ydDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy4jY29ubmVjdChyZXEsIGFkZHJlc3MsIHBvcnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiBmb3IgbmV3IGNvbm5lY3Rpb25zLlxuICAgKiBAcGFyYW0gYmFja2xvZyBUaGUgbWF4aW11bSBsZW5ndGggb2YgdGhlIHF1ZXVlIG9mIHBlbmRpbmcgY29ubmVjdGlvbnMuXG4gICAqIEByZXR1cm4gQW4gZXJyb3Igc3RhdHVzIGNvZGUuXG4gICAqL1xuICBsaXN0ZW4oYmFja2xvZzogbnVtYmVyKTogbnVtYmVyIHtcbiAgICB0aGlzLiNiYWNrbG9nID0gY2VpbFBvd09mMihiYWNrbG9nICsgMSk7XG5cbiAgICBjb25zdCBsaXN0ZW5PcHRpb25zID0ge1xuICAgICAgaG9zdG5hbWU6IHRoaXMuI2FkZHJlc3MhLFxuICAgICAgcG9ydDogdGhpcy4jcG9ydCEsXG4gICAgICB0cmFuc3BvcnQ6IFwidGNwXCIgYXMgY29uc3QsXG4gICAgfTtcblxuICAgIGxldCBsaXN0ZW5lcjtcblxuICAgIHRyeSB7XG4gICAgICBsaXN0ZW5lciA9IERlbm8ubGlzdGVuKGxpc3Rlbk9wdGlvbnMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgRGVuby5lcnJvcnMuQWRkckluVXNlKSB7XG4gICAgICAgIHJldHVybiBjb2RlTWFwLmdldChcIkVBRERSSU5VU0VcIikhO1xuICAgICAgfSBlbHNlIGlmIChlIGluc3RhbmNlb2YgRGVuby5lcnJvcnMuQWRkck5vdEF2YWlsYWJsZSkge1xuICAgICAgICByZXR1cm4gY29kZU1hcC5nZXQoXCJFQUREUk5PVEFWQUlMXCIpITtcbiAgICAgIH0gZWxzZSBpZiAoZSBpbnN0YW5jZW9mIERlbm8uZXJyb3JzLlBlcm1pc3Npb25EZW5pZWQpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cblxuICAgICAgLy8gVE9ETyhjbW9ydGVuKTogbWFwIGVycm9ycyB0byBhcHByb3ByaWF0ZSBlcnJvciBjb2Rlcy5cbiAgICAgIHJldHVybiBjb2RlTWFwLmdldChcIlVOS05PV05cIikhO1xuICAgIH1cblxuICAgIGNvbnN0IGFkZHJlc3MgPSBsaXN0ZW5lci5hZGRyIGFzIERlbm8uTmV0QWRkcjtcbiAgICB0aGlzLiNhZGRyZXNzID0gYWRkcmVzcy5ob3N0bmFtZTtcbiAgICB0aGlzLiNwb3J0ID0gYWRkcmVzcy5wb3J0O1xuXG4gICAgdGhpcy4jbGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgICB0aGlzLiNhY2NlcHQoKTtcblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgb3ZlcnJpZGUgcmVmKCkge1xuICAgIGlmICh0aGlzLiNsaXN0ZW5lcikge1xuICAgICAgdGhpcy4jbGlzdGVuZXIucmVmKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXNba1N0cmVhbUJhc2VGaWVsZF0pIHtcbiAgICAgIHRoaXNba1N0cmVhbUJhc2VGaWVsZF0ucmVmKCk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgdW5yZWYoKSB7XG4gICAgaWYgKHRoaXMuI2xpc3RlbmVyKSB7XG4gICAgICB0aGlzLiNsaXN0ZW5lci51bnJlZigpO1xuICAgIH1cblxuICAgIGlmICh0aGlzW2tTdHJlYW1CYXNlRmllbGRdKSB7XG4gICAgICB0aGlzW2tTdHJlYW1CYXNlRmllbGRdLnVucmVmKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBvcHVsYXRlcyB0aGUgcHJvdmlkZWQgb2JqZWN0IHdpdGggbG9jYWwgYWRkcmVzcyBlbnRyaWVzLlxuICAgKiBAcGFyYW0gc29ja25hbWUgQW4gb2JqZWN0IHRvIGFkZCB0aGUgbG9jYWwgYWRkcmVzcyBlbnRyaWVzIHRvLlxuICAgKiBAcmV0dXJuIEFuIGVycm9yIHN0YXR1cyBjb2RlLlxuICAgKi9cbiAgZ2V0c29ja25hbWUoc29ja25hbWU6IFJlY29yZDxzdHJpbmcsIG5ldmVyPiB8IEFkZHJlc3NJbmZvKTogbnVtYmVyIHtcbiAgICBpZiAoXG4gICAgICB0eXBlb2YgdGhpcy4jYWRkcmVzcyA9PT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAgdHlwZW9mIHRoaXMuI3BvcnQgPT09IFwidW5kZWZpbmVkXCJcbiAgICApIHtcbiAgICAgIHJldHVybiBjb2RlTWFwLmdldChcIkVBRERSTk9UQVZBSUxcIikhO1xuICAgIH1cblxuICAgIHNvY2tuYW1lLmFkZHJlc3MgPSB0aGlzLiNhZGRyZXNzO1xuICAgIHNvY2tuYW1lLnBvcnQgPSB0aGlzLiNwb3J0O1xuICAgIHNvY2tuYW1lLmZhbWlseSA9IGlzSVAodGhpcy4jYWRkcmVzcyk7XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQb3B1bGF0ZXMgdGhlIHByb3ZpZGVkIG9iamVjdCB3aXRoIHJlbW90ZSBhZGRyZXNzIGVudHJpZXMuXG4gICAqIEBwYXJhbSBwZWVybmFtZSBBbiBvYmplY3QgdG8gYWRkIHRoZSByZW1vdGUgYWRkcmVzcyBlbnRyaWVzIHRvLlxuICAgKiBAcmV0dXJuIEFuIGVycm9yIHN0YXR1cyBjb2RlLlxuICAgKi9cbiAgZ2V0cGVlcm5hbWUocGVlcm5hbWU6IFJlY29yZDxzdHJpbmcsIG5ldmVyPiB8IEFkZHJlc3NJbmZvKTogbnVtYmVyIHtcbiAgICBpZiAoXG4gICAgICB0eXBlb2YgdGhpcy4jcmVtb3RlQWRkcmVzcyA9PT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAgdHlwZW9mIHRoaXMuI3JlbW90ZVBvcnQgPT09IFwidW5kZWZpbmVkXCJcbiAgICApIHtcbiAgICAgIHJldHVybiBjb2RlTWFwLmdldChcIkVBRERSTk9UQVZBSUxcIikhO1xuICAgIH1cblxuICAgIHBlZXJuYW1lLmFkZHJlc3MgPSB0aGlzLiNyZW1vdGVBZGRyZXNzO1xuICAgIHBlZXJuYW1lLnBvcnQgPSB0aGlzLiNyZW1vdGVQb3J0O1xuICAgIHBlZXJuYW1lLmZhbWlseSA9IHRoaXMuI3JlbW90ZUZhbWlseTtcblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBub0RlbGF5XG4gICAqIEByZXR1cm4gQW4gZXJyb3Igc3RhdHVzIGNvZGUuXG4gICAqL1xuICBzZXROb0RlbGF5KF9ub0RlbGF5OiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAvLyBUT0RPKGJub29yZGh1aXMpIGh0dHBzOi8vZ2l0aHViLmNvbS9kZW5vbGFuZC9kZW5vL3B1bGwvMTMxMDNcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gZW5hYmxlXG4gICAqIEBwYXJhbSBpbml0aWFsRGVsYXlcbiAgICogQHJldHVybiBBbiBlcnJvciBzdGF0dXMgY29kZS5cbiAgICovXG4gIHNldEtlZXBBbGl2ZShfZW5hYmxlOiBib29sZWFuLCBfaW5pdGlhbERlbGF5OiBudW1iZXIpOiBudW1iZXIge1xuICAgIC8vIFRPRE8oYm5vb3JkaHVpcykgaHR0cHM6Ly9naXRodWIuY29tL2Rlbm9sYW5kL2Rlbm8vcHVsbC8xMzEwM1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFdpbmRvd3Mgb25seS5cbiAgICpcbiAgICogRGVwcmVjYXRlZCBieSBOb2RlLlxuICAgKiBSRUY6IGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9ibG9iL21hc3Rlci9saWIvbmV0LmpzI0wxNzMxXG4gICAqXG4gICAqIEBwYXJhbSBlbmFibGVcbiAgICogQHJldHVybiBBbiBlcnJvciBzdGF0dXMgY29kZS5cbiAgICogQGRlcHJlY2F0ZWRcbiAgICovXG4gIHNldFNpbXVsdGFuZW91c0FjY2VwdHMoX2VuYWJsZTogYm9vbGVhbikge1xuICAgIC8vIExvdyBwcmlvcml0eSB0byBpbXBsZW1lbnQgb3dpbmcgdG8gaXQgYmVpbmcgZGVwcmVjYXRlZCBpbiBOb2RlLlxuICAgIG5vdEltcGxlbWVudGVkKFwiVENQLnByb3RvdHlwZS5zZXRTaW11bHRhbmVvdXNBY2NlcHRzXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJpbmQgdG8gYW4gSVB2NCBvciBJUHY2IGFkZHJlc3MuXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSBob3N0bmFtZSB0byBiaW5kIHRvLlxuICAgKiBAcGFyYW0gcG9ydCBUaGUgcG9ydCB0byBiaW5kIHRvXG4gICAqIEBwYXJhbSBfZmxhZ3NcbiAgICogQHJldHVybiBBbiBlcnJvciBzdGF0dXMgY29kZS5cbiAgICovXG4gICNiaW5kKGFkZHJlc3M6IHN0cmluZywgcG9ydDogbnVtYmVyLCBfZmxhZ3M6IG51bWJlcik6IG51bWJlciB7XG4gICAgLy8gRGVubyBkb2Vzbid0IGN1cnJlbnRseSBzZXBhcmF0ZSBiaW5kIGZyb20gY29ubmVjdCBldGMuXG4gICAgLy8gUkVGOlxuICAgIC8vIC0gaHR0cHM6Ly9kb2MuZGVuby5sYW5kL2Rlbm8vc3RhYmxlL34vRGVuby5jb25uZWN0XG4gICAgLy8gLSBodHRwczovL2RvYy5kZW5vLmxhbmQvZGVuby9zdGFibGUvfi9EZW5vLmxpc3RlblxuICAgIC8vXG4gICAgLy8gVGhpcyBhbHNvIG1lYW5zIHdlIHdvbid0IGJlIGNvbm5lY3RpbmcgZnJvbSB0aGUgc3BlY2lmaWVkIGxvY2FsIGFkZHJlc3NcbiAgICAvLyBhbmQgcG9ydCBhcyBwcm92aWRpbmcgdGhlc2UgaXMgbm90IGFuIG9wdGlvbiBpbiBEZW5vLlxuICAgIC8vIFJFRjpcbiAgICAvLyAtIGh0dHBzOi8vZG9jLmRlbm8ubGFuZC9kZW5vL3N0YWJsZS9+L0Rlbm8uQ29ubmVjdE9wdGlvbnNcbiAgICAvLyAtIGh0dHBzOi8vZG9jLmRlbm8ubGFuZC9kZW5vL3N0YWJsZS9+L0Rlbm8uTGlzdGVuT3B0aW9uc1xuXG4gICAgdGhpcy4jYWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgdGhpcy4jcG9ydCA9IHBvcnQ7XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25uZWN0IHRvIGFuIElQdjQgb3IgSVB2NiBhZGRyZXNzLlxuICAgKiBAcGFyYW0gcmVxIEEgVENQQ29ubmVjdFdyYXAgaW5zdGFuY2UuXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSBob3N0bmFtZSB0byBjb25uZWN0IHRvLlxuICAgKiBAcGFyYW0gcG9ydCBUaGUgcG9ydCB0byBjb25uZWN0IHRvLlxuICAgKiBAcmV0dXJuIEFuIGVycm9yIHN0YXR1cyBjb2RlLlxuICAgKi9cbiAgI2Nvbm5lY3QocmVxOiBUQ1BDb25uZWN0V3JhcCwgYWRkcmVzczogc3RyaW5nLCBwb3J0OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHRoaXMuI3JlbW90ZUFkZHJlc3MgPSBhZGRyZXNzO1xuICAgIHRoaXMuI3JlbW90ZVBvcnQgPSBwb3J0O1xuICAgIHRoaXMuI3JlbW90ZUZhbWlseSA9IGlzSVAoYWRkcmVzcyk7XG5cbiAgICBjb25zdCBjb25uZWN0T3B0aW9uczogRGVuby5Db25uZWN0T3B0aW9ucyA9IHtcbiAgICAgIGhvc3RuYW1lOiBhZGRyZXNzLFxuICAgICAgcG9ydCxcbiAgICAgIHRyYW5zcG9ydDogXCJ0Y3BcIixcbiAgICB9O1xuXG4gICAgRGVuby5jb25uZWN0KGNvbm5lY3RPcHRpb25zKS50aGVuKFxuICAgICAgKGNvbm46IERlbm8uQ29ubikgPT4ge1xuICAgICAgICAvLyBJbmNvcnJlY3QgLyBiYWNrd2FyZHMsIGJ1dCBjb3JyZWN0aW5nIHRoZSBsb2NhbCBhZGRyZXNzIGFuZCBwb3J0IHdpdGhcbiAgICAgICAgLy8gd2hhdCB3YXMgYWN0dWFsbHkgdXNlZCBnaXZlbiB3ZSBjYW4ndCBhY3R1YWxseSBzcGVjaWZ5IHRoZXNlIGluIERlbm8uXG4gICAgICAgIGNvbnN0IGxvY2FsQWRkciA9IGNvbm4ubG9jYWxBZGRyIGFzIERlbm8uTmV0QWRkcjtcbiAgICAgICAgdGhpcy4jYWRkcmVzcyA9IHJlcS5sb2NhbEFkZHJlc3MgPSBsb2NhbEFkZHIuaG9zdG5hbWU7XG4gICAgICAgIHRoaXMuI3BvcnQgPSByZXEubG9jYWxQb3J0ID0gbG9jYWxBZGRyLnBvcnQ7XG4gICAgICAgIHRoaXNba1N0cmVhbUJhc2VGaWVsZF0gPSBjb25uO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5hZnRlckNvbm5lY3QocmVxLCAwKTtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgLy8gc3dhbGxvdyBjYWxsYmFjayBlcnJvcnMuXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVE9ETyhjbW9ydGVuKTogY29ycmVjdCBtYXBwaW5nIG9mIGNvbm5lY3Rpb24gZXJyb3IgdG8gc3RhdHVzIGNvZGUuXG4gICAgICAgICAgdGhpcy5hZnRlckNvbm5lY3QocmVxLCBjb2RlTWFwLmdldChcIkVDT05OUkVGVVNFRFwiKSEpO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAvLyBzd2FsbG93IGNhbGxiYWNrIGVycm9ycy5cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICApO1xuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvKiogSGFuZGxlIGJhY2tvZmYgZGVsYXlzIGZvbGxvd2luZyBhbiB1bnN1Y2Nlc3NmdWwgYWNjZXB0LiAqL1xuICBhc3luYyAjYWNjZXB0QmFja29mZigpIHtcbiAgICAvLyBCYWNrb2ZmIGFmdGVyIHRyYW5zaWVudCBlcnJvcnMgdG8gYWxsb3cgdGltZSBmb3IgdGhlIHN5c3RlbSB0b1xuICAgIC8vIHJlY292ZXIsIGFuZCBhdm9pZCBibG9ja2luZyB1cCB0aGUgZXZlbnQgbG9vcCB3aXRoIGEgY29udGludW91c2x5XG4gICAgLy8gcnVubmluZyBsb29wLlxuICAgIGlmICghdGhpcy4jYWNjZXB0QmFja29mZkRlbGF5KSB7XG4gICAgICB0aGlzLiNhY2NlcHRCYWNrb2ZmRGVsYXkgPSBJTklUSUFMX0FDQ0VQVF9CQUNLT0ZGX0RFTEFZO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiNhY2NlcHRCYWNrb2ZmRGVsYXkgKj0gMjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy4jYWNjZXB0QmFja29mZkRlbGF5ID49IE1BWF9BQ0NFUFRfQkFDS09GRl9ERUxBWSkge1xuICAgICAgdGhpcy4jYWNjZXB0QmFja29mZkRlbGF5ID0gTUFYX0FDQ0VQVF9CQUNLT0ZGX0RFTEFZO1xuICAgIH1cblxuICAgIGF3YWl0IGRlbGF5KHRoaXMuI2FjY2VwdEJhY2tvZmZEZWxheSk7XG5cbiAgICB0aGlzLiNhY2NlcHQoKTtcbiAgfVxuXG4gIC8qKiBBY2NlcHQgbmV3IGNvbm5lY3Rpb25zLiAqL1xuICBhc3luYyAjYWNjZXB0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLiNjbG9zZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy4jY29ubmVjdGlvbnMgPiB0aGlzLiNiYWNrbG9nISkge1xuICAgICAgdGhpcy4jYWNjZXB0QmFja29mZigpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGNvbm5lY3Rpb246IERlbm8uQ29ubjtcblxuICAgIHRyeSB7XG4gICAgICBjb25uZWN0aW9uID0gYXdhaXQgdGhpcy4jbGlzdGVuZXIuYWNjZXB0KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUgaW5zdGFuY2VvZiBEZW5vLmVycm9ycy5CYWRSZXNvdXJjZSAmJiB0aGlzLiNjbG9zZWQpIHtcbiAgICAgICAgLy8gTGlzdGVuZXIgYW5kIHNlcnZlciBoYXMgY2xvc2VkLlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRPRE8oY21vcnRlbik6IG1hcCBlcnJvcnMgdG8gYXBwcm9wcmlhdGUgZXJyb3IgY29kZXMuXG4gICAgICAgIHRoaXMub25jb25uZWN0aW9uIShjb2RlTWFwLmdldChcIlVOS05PV05cIikhLCB1bmRlZmluZWQpO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIHN3YWxsb3cgY2FsbGJhY2sgZXJyb3JzLlxuICAgICAgfVxuXG4gICAgICB0aGlzLiNhY2NlcHRCYWNrb2ZmKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZXNldCB0aGUgYmFja29mZiBkZWxheSB1cG9uIHN1Y2Nlc3NmdWwgYWNjZXB0LlxuICAgIHRoaXMuI2FjY2VwdEJhY2tvZmZEZWxheSA9IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IGNvbm5lY3Rpb25IYW5kbGUgPSBuZXcgVENQKHNvY2tldFR5cGUuU09DS0VULCBjb25uZWN0aW9uKTtcbiAgICB0aGlzLiNjb25uZWN0aW9ucysrO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMub25jb25uZWN0aW9uISgwLCBjb25uZWN0aW9uSGFuZGxlKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIHN3YWxsb3cgY2FsbGJhY2sgZXJyb3JzLlxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiNhY2NlcHQoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGUgc2VydmVyIGNsb3N1cmUuICovXG4gIG92ZXJyaWRlIF9vbkNsb3NlKCk6IG51bWJlciB7XG4gICAgdGhpcy4jY2xvc2VkID0gdHJ1ZTtcbiAgICB0aGlzLnJlYWRpbmcgPSBmYWxzZTtcblxuICAgIHRoaXMuI2FkZHJlc3MgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy4jcG9ydCA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuI3JlbW90ZUFkZHJlc3MgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy4jcmVtb3RlRmFtaWx5ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuI3JlbW90ZVBvcnQgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLiNiYWNrbG9nID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuI2Nvbm5lY3Rpb25zID0gMDtcbiAgICB0aGlzLiNhY2NlcHRCYWNrb2ZmRGVsYXkgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAodGhpcy5wcm92aWRlciA9PT0gcHJvdmlkZXJUeXBlLlRDUFNFUlZFUldSQVApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuI2xpc3RlbmVyLmNsb3NlKCk7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgLy8gbGlzdGVuZXIgYWxyZWFkeSBjbG9zZWRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gTGlidXZTdHJlYW1XcmFwLnByb3RvdHlwZS5fb25DbG9zZS5jYWxsKHRoaXMpO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEVBQTBFO0FBQzFFLHNEQUFzRDtBQUN0RCxFQUFFO0FBQ0YsMEVBQTBFO0FBQzFFLGdFQUFnRTtBQUNoRSxzRUFBc0U7QUFDdEUsc0VBQXNFO0FBQ3RFLDRFQUE0RTtBQUM1RSxxRUFBcUU7QUFDckUsd0JBQXdCO0FBQ3hCLEVBQUU7QUFDRiwwRUFBMEU7QUFDMUUseURBQXlEO0FBQ3pELEVBQUU7QUFDRiwwRUFBMEU7QUFDMUUsNkRBQTZEO0FBQzdELDRFQUE0RTtBQUM1RSwyRUFBMkU7QUFDM0Usd0VBQXdFO0FBQ3hFLDRFQUE0RTtBQUM1RSx5Q0FBeUM7QUFFekMscUJBQXFCO0FBQ3JCLCtEQUErRDtBQUMvRCw4REFBOEQ7QUFFOUQsU0FBUyxjQUFjLFFBQVEsZUFBZTtBQUM5QyxTQUFTLFdBQVcsUUFBUSx5QkFBeUI7QUFDckQsU0FBUyxjQUFjLFFBQVEsdUJBQXVCO0FBQ3RELFNBQVMsU0FBUyxFQUFFLFlBQVksUUFBUSxrQkFBa0I7QUFDMUQsU0FBUyxlQUFlLFFBQVEsbUJBQW1CO0FBQ25ELFNBQVMsV0FBVyxRQUFRLGVBQWU7QUFDM0MsU0FBUyxPQUFPLFFBQVEsVUFBVTtBQUNsQyxTQUFTLEtBQUssUUFBUSxxQkFBcUI7QUFDM0MsU0FBUyxnQkFBZ0IsUUFBUSxtQkFBbUI7QUFDcEQsU0FBUyxJQUFJ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