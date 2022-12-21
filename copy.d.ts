export = copySync;
/**
 * @param source {string} the source path it can be a file or a folder.
 * @param destination {string} the destination directory.
 *
 * @description
 * it copies the files or directories from given soure to the destination directory
 * if the destination dosn't exists then we will create the direcotiry for you and
 * it will replace any existed file in the destination with the copied file.
 */
declare function copySync(source: string, destination: string): void;
