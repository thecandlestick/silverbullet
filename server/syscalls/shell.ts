import { shell } from "$sb/syscalls.ts";
import { SysCallMapping } from "../../plugos/system.ts";
import { ShellResponse } from "../../server/rpc.ts";
import { ShellBackend } from "../shell_backend.ts";

export function shellSyscalls(shellBackend: ShellBackend): SysCallMapping {
  return {
    "shell.run": (
      _ctx,
      cmd: string,
      args: string[],
    ): Promise<ShellResponse> => {
      return shellBackend.handle({ cmd, args });
    },
  };
}
