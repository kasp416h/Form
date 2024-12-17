# Form Plugin

This is a form plugin built with Next.js using the Shadcn UI form setup. It simplifies the creation and management of forms with various input types and advanced features.

## Features

- **Multiple Input Types**: Easily use different types of inputs such as select, multi-select, OTP input, radio buttons, checkboxes, and more.
- **Data Encryption**: Securely encrypt form data using the server action function helper.
- **Form Validation**: Validate form data with Zod schemas and custom validation functions.
- **Multi-Step Forms**: Support for multi-step forms with session storage to save progress.
- **CSRF Protection**: Built-in CSRF token validation for secure form submissions.

## Usage

To use this plugin, import the necessary components and set up your form as shown in the example below:

```tsx
import { Form, Control, Button } from "@/path/to/form";

const MyForm = () => {
  const onSubmit = async (data) => {
    // Handle form submission
  };

  return (
    <Form onSubmit={onSubmit}>
      <Control name="username" type="text" label="Username" required />
      <Control name="email" type="email" label="Email" required />
      <Control name="password" type="password" label="Password" required />
      <Control name="gender" type="radio" label="Gender" options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} required />
      <Control name="hobbies" type="multi-select" label="Hobbies" options={[{ value: 'reading', label: 'Reading' }, { value: 'sports', label: 'Sports' }]} />
      <Button text="Submit" />
    </Form>
  );
};

export default MyForm;
```

```tsx
'use server';

import { withValidation } from '@/plugins/form/validation/with-validation';
import api from '@/lib/api';
import { z } from 'zod';

const updateItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  price: z.number().positive('Price must be a positive number'),
});

export const updateItem = withValidation(
  updateItemSchema,
  async (validatedData) => {
    const { id, ...itemData } = validatedData;

    await api.patch(`/items/update/${id}/`, itemData);

    return { status: 200 };
  },
);