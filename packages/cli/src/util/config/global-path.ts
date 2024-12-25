import { lstatSync } from 'fs-extra';
import XDGAppPaths from 'xdg-app-paths';

// Returns whether a directory exists
export const isDirectory = (path: string): boolean => {
  try {
    return lstatSync(path).isDirectory();
  } catch {
    // We don't care which kind of error occured, it isn't a directory anyway.
    return false;
  }
};

// Returns in which directory the config should be present
const getGlobalPathConfig = (): string => {
  const easynextDirectories = XDGAppPaths('com.easynext.cli').dataDirs();

  // use the easynext directory.
  return (
    easynextDirectories.find((configPath) => isDirectory(configPath)) ||
    easynextDirectories[0]
  );
};

export default getGlobalPathConfig;
