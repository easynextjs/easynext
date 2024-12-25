export function handleRejection(err: any) {
  if (err) {
    if (err instanceof Error) {
      handleUnexpected(err);
    } else {
      console.error(`An unexpected rejection occurred\n  ${err}`);
    }
  } else {
    console.error('An unexpected empty rejection occurred');
  }

  process.exit(1);
}

export function handleUnexpected(err: Error) {
  console.error(`An unexpected error occurred!\n${err.stack}`);

  process.exit(1);
}
