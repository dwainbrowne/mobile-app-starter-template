# Controllers

This folder contains domain-specific controllers that handle business logic for different features of the application.

## Architecture

Controllers sit between the UI layer (screens/components) and the API service layer. They:

1. **Encapsulate business logic** - Keep complex operations out of components
2. **Provide domain-specific methods** - Named methods for specific operations (e.g., `getTransactionById`)
3. **Handle data transformation** - Transform API responses to app-friendly formats
4. **Manage caching strategies** - Decide when to cache and invalidate data
5. **Coordinate multiple API calls** - Handle operations that require multiple requests

## Usage Pattern

```typescript
import { transactionsController } from '@/controllers';

// In a component or hook
const loadTransactions = async () => {
  const result = await transactionsController.getAll({ page: 1, pageSize: 20 });
  
  if (result.success && result.data) {
    setTransactions(result.data.items);
  } else {
    showError(result.error?.message);
  }
};
```

## Creating a New Controller

1. Create a new file: `[domain].controller.ts`
2. Import the base controller and API interfaces
3. Extend `BaseController` with your domain type
4. Add domain-specific methods as needed
5. Export the controller instance
6. Add to `index.ts` barrel export

Example:

```typescript
import { BaseController } from './base.controller';
import { API_ENDPOINTS, CACHE_KEYS, CACHE_CONFIG } from '@/constants/api';
import type { MyEntity } from '@/interfaces';

class MyController extends BaseController<MyEntity> {
  constructor() {
    super({
      baseEndpoint: API_ENDPOINTS.MY_ENTITY.BASE,
      cacheKey: CACHE_KEYS.MY_ENTITY,
      defaultExpiry: CACHE_CONFIG.EXPIRY.MEDIUM,
    });
  }

  // Add domain-specific methods
  async customOperation(id: string): Promise<ApiResponse<MyEntity>> {
    return this.api.post(API_ENDPOINTS.MY_ENTITY.CUSTOM(id));
  }
}

export const myController = new MyController();
```

## Available Controllers

- `base.controller.ts` - Base class with common CRUD operations
- `transactions.controller.ts` - Transaction management
- `receipts.controller.ts` - Receipt upload and management
- `user.controller.ts` - User profile and preferences

## Best Practices

1. **Keep controllers focused** - One domain per controller
2. **Use typed responses** - Always specify generic types
3. **Handle errors gracefully** - Return structured error responses
4. **Document methods** - Add JSDoc comments for complex methods
5. **Use constants** - All endpoints and cache keys from `@/constants/api`
