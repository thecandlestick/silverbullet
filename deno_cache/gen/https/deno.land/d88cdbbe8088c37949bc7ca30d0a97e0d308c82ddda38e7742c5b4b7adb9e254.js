/** Returns the path to the user's cache directory.
 *
 * The returned value depends on the operating system and is either a string,
 * containing a value from the following table, or `null`.
 *
 * |Platform | Value                               | Example                          |
 * | ------- | ----------------------------------- | -------------------------------- |
 * | Linux   | `$XDG_CACHE_HOME` or `$HOME`/.cache | /home/justjavac/.cache           |
 * | macOS   | `$HOME`/Library/Caches              | /Users/justjavac/Library/Caches  |
 * | Windows | `$LOCALAPPDATA`                     | C:\Users\justjavac\AppData\Local |
 */ export default function cacheDir() {
    switch(Deno.build.os){
        case "linux":
            {
                const xdg = Deno.env.get("XDG_CACHE_HOME");
                if (xdg) return xdg;
                const home = Deno.env.get("HOME");
                if (home) return `${home}/.cache`;
                break;
            }
        case "darwin":
            {
                const home = Deno.env.get("HOME");
                if (home) return `${home}/Library/Caches`;
                break;
            }
        case "windows":
            return Deno.env.get("LOCALAPPDATA") ?? null;
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3gvY2FjaGVfZGlyQDAuMi4wL21vZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogUmV0dXJucyB0aGUgcGF0aCB0byB0aGUgdXNlcidzIGNhY2hlIGRpcmVjdG9yeS5cbiAqXG4gKiBUaGUgcmV0dXJuZWQgdmFsdWUgZGVwZW5kcyBvbiB0aGUgb3BlcmF0aW5nIHN5c3RlbSBhbmQgaXMgZWl0aGVyIGEgc3RyaW5nLFxuICogY29udGFpbmluZyBhIHZhbHVlIGZyb20gdGhlIGZvbGxvd2luZyB0YWJsZSwgb3IgYG51bGxgLlxuICpcbiAqIHxQbGF0Zm9ybSB8IFZhbHVlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgRXhhbXBsZSAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAtLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB8XG4gKiB8IExpbnV4ICAgfCBgJFhER19DQUNIRV9IT01FYCBvciBgJEhPTUVgLy5jYWNoZSB8IC9ob21lL2p1c3RqYXZhYy8uY2FjaGUgICAgICAgICAgIHxcbiAqIHwgbWFjT1MgICB8IGAkSE9NRWAvTGlicmFyeS9DYWNoZXMgICAgICAgICAgICAgIHwgL1VzZXJzL2p1c3RqYXZhYy9MaWJyYXJ5L0NhY2hlcyAgfFxuICogfCBXaW5kb3dzIHwgYCRMT0NBTEFQUERBVEFgICAgICAgICAgICAgICAgICAgICAgfCBDOlxcVXNlcnNcXGp1c3RqYXZhY1xcQXBwRGF0YVxcTG9jYWwgfFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjYWNoZURpcigpOiBzdHJpbmcgfCBudWxsIHtcbiAgc3dpdGNoIChEZW5vLmJ1aWxkLm9zKSB7XG4gICAgY2FzZSBcImxpbnV4XCI6IHtcbiAgICAgIGNvbnN0IHhkZyA9IERlbm8uZW52LmdldChcIlhER19DQUNIRV9IT01FXCIpO1xuICAgICAgaWYgKHhkZykgcmV0dXJuIHhkZztcblxuICAgICAgY29uc3QgaG9tZSA9IERlbm8uZW52LmdldChcIkhPTUVcIik7XG4gICAgICBpZiAoaG9tZSkgcmV0dXJuIGAke2hvbWV9Ly5jYWNoZWA7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjYXNlIFwiZGFyd2luXCI6IHtcbiAgICAgIGNvbnN0IGhvbWUgPSBEZW5vLmVudi5nZXQoXCJIT01FXCIpO1xuICAgICAgaWYgKGhvbWUpIHJldHVybiBgJHtob21lfS9MaWJyYXJ5L0NhY2hlc2A7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjYXNlIFwid2luZG93c1wiOlxuICAgICAgcmV0dXJuIERlbm8uZW52LmdldChcIkxPQ0FMQVBQREFUQVwiKSA/PyBudWxsO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Q0FVQyxHQUNELGVBQWUsU0FBUyxXQUEwQjtJQUNoRCxPQUFRLEtBQUssS0FBSyxDQUFDLEVBQUU7UUFDbkIsS0FBSztZQUFTO2dCQUNaLE1BQU0sTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ3pCLElBQUksS0FBSyxPQUFPO2dCQUVoQixNQUFNLE9BQU8sS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUMxQixJQUFJLE1BQU0sT0FBTyxDQUFDLEVBQUUsS0FBSyxPQUFPLENBQUM7Z0JBQ2pDLEtBQU07WUFDUjtRQUVBLEtBQUs7WUFBVTtnQkFDYixNQUFNLE9BQU8sS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUMxQixJQUFJLE1BQU0sT0FBTyxDQUFDLEVBQUUsS0FBSyxlQUFlLENBQUM7Z0JBQ3pDLEtBQU07WUFDUjtRQUVBLEtBQUs7WUFDSCxPQUFPLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsSUFBSTtJQUMvQztJQUVBLE9BQU8sSUFBSTtBQUNiLENBQUMifQ==