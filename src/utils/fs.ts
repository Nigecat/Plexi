import { promises as fs } from "fs";
import { extname, resolve } from "path";

/**
 * Recurse into a directory and get a list of files contained within it
 * @param {string} path - The path to start in
 */
export async function getFiles(path: string): Promise<{ path: string; name: string }[]> {
    const entries = await fs.readdir(path, { withFileTypes: true });

    // Get files within the current directory and add a path key to the file objects
    const files = entries
        .filter((file) => !file.isDirectory() && extname(file.name).toLowerCase() === ".js")
        .map((file) => ({ ...file, path: resolve(path, file.name) }));

    // Get folders within the current directory
    const folders = entries.filter((folder) => folder.isDirectory());

    // Add the found files within the subdirectory to the files array by calling this function
    for (const folder of folders) files.push(...(await getFiles(resolve(path, folder.name))));

    return files;
}
