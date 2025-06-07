import { InferType, Schema, ValidateOptions, ValidationError } from 'yup';
import { PartialDeep } from 'type-fest';
import { StandardSchemaV1 } from '@standard-schema/spec';

export function toTypedSchema<TSchema extends Schema, TOutput = InferType<TSchema>, TInput = PartialDeep<TOutput>>(
  yupSchema: TSchema,
  opts: ValidateOptions = { abortEarly: false },
): StandardSchemaV1<TInput, TOutput> {
  const schema: StandardSchemaV1<TInput, TOutput> = {
    '~standard': {
      vendor: 'vee-validate/yup',
      version: 1,
      async validate(values) {
        try {
          // we spread the options because yup mutates the opts object passed
          const output = await yupSchema.validate(values, { ...opts });

          return {
            value: output,
            issues: undefined,
          };
        } catch (err) {
          if (err instanceof ValidationError) {
            return {
              issues: issuesFromValidationError(err),
            };
          }

          throw err;
        }
      },
    },
  };

  return schema;
}

function createStandardPath(path: string | undefined): StandardSchemaV1.Issue['path'] {
  if (!path?.length) {
    return undefined;
  }

  // Array to store the final path segments
  const segments: string[] = [];
  // Buffer for building the current segment
  let currentSegment = '';
  // Track if we're inside square brackets (array/property access)
  let inBrackets = false;
  // Track if we're inside quotes (for property names with special chars)
  let inQuotes = false;

  for (let i = 0; i < path.length; i++) {
    const char = path[i];

    if (char === '[' && !inQuotes) {
      // When entering brackets, push any accumulated segment after splitting on dots
      if (currentSegment) {
        segments.push(...currentSegment.split('.').filter(Boolean));
        currentSegment = '';
      }
      inBrackets = true;
      continue;
    }

    if (char === ']' && !inQuotes) {
      if (currentSegment) {
        // Handle numeric indices (e.g. arr[0])
        if (/^\d+$/.test(currentSegment)) {
          segments.push(currentSegment);
        } else {
          // Handle quoted property names (e.g. obj["foo.bar"])
          segments.push(currentSegment.replace(/^"|"$/g, ''));
        }
        currentSegment = '';
      }
      inBrackets = false;
      continue;
    }

    if (char === '"') {
      // Toggle quote state for handling quoted property names
      inQuotes = !inQuotes;
      continue;
    }

    if (char === '.' && !inBrackets && !inQuotes) {
      // On dots outside brackets/quotes, push current segment
      if (currentSegment) {
        segments.push(currentSegment);
        currentSegment = '';
      }
      continue;
    }

    currentSegment += char;
  }

  // Push any remaining segment after splitting on dots
  if (currentSegment) {
    segments.push(...currentSegment.split('.').filter(Boolean));
  }

  return segments;
}

function createStandardIssues(error: ValidationError, parentPath?: string): StandardSchemaV1.Issue[] {
  const path = parentPath ? `${parentPath}.${error.path}` : error.path;

  return error.errors.map(
    err =>
      ({
        message: err,
        path: createStandardPath(path),
      }) satisfies StandardSchemaV1.Issue,
  );
}

function issuesFromValidationError(error: ValidationError, parentPath?: string): StandardSchemaV1.Issue[] {
  if (!error.inner?.length && error.errors.length) {
    return createStandardIssues(error, parentPath);
  }

  const path = parentPath ? `${parentPath}.${error.path}` : error.path;

  return error.inner.flatMap(err => issuesFromValidationError(err, path));
}
