import { validateStandardSchema } from '../src/validate';
import { z } from 'zod';

// #5108
test('validateStandardSchema normalizes dot notation array paths to bracket notation', async () => {
  const schema = z.object({
    items: z.array(
      z.object({
        name: z.string().min(1, 'Name is required'),
        id: z.string().min(1, 'ID is required'),
      }),
    ),
  });

  const result = await validateStandardSchema(schema, {
    items: [{ name: '', id: '' }],
  });

  expect(result.valid).toBe(false);

  // Error paths should use bracket notation (items[0].name) not dot notation (items.0.name)
  expect(result.errors['items[0].name' as keyof typeof result.errors]).toBe('Name is required');
  expect(result.errors['items[0].id' as keyof typeof result.errors]).toBe('ID is required');

  // Dot notation should NOT be present
  expect(result.errors['items.0.name' as keyof typeof result.errors]).toBeUndefined();
  expect(result.errors['items.0.id' as keyof typeof result.errors]).toBeUndefined();
});

test('validateStandardSchema handles nested array paths with multiple indices', async () => {
  const schema = z.object({
    groups: z.array(
      z.object({
        members: z.array(
          z.object({
            email: z.string().email('Invalid email'),
          }),
        ),
      }),
    ),
  });

  const result = await validateStandardSchema(schema, {
    groups: [{ members: [{ email: 'bad' }] }],
  });

  expect(result.valid).toBe(false);
  expect(result.errors['groups[0].members[0].email' as keyof typeof result.errors]).toBe('Invalid email');
  expect(result.errors['groups.0.members.0.email' as keyof typeof result.errors]).toBeUndefined();
});

test('validateStandardSchema preserves non-array dot paths', async () => {
  const schema = z.object({
    user: z.object({
      name: z.string().min(1, 'Name is required'),
    }),
  });

  const result = await validateStandardSchema(schema, {
    user: { name: '' },
  });

  expect(result.valid).toBe(false);
  // Non-array paths should remain as dot notation
  expect(result.errors['user.name' as keyof typeof result.errors]).toBe('Name is required');
});
