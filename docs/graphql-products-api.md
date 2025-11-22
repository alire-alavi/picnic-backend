# GraphQL Products API Documentation

This document describes the GraphQL API endpoints for querying products in the Picnic backend.

## Table of Contents
- [Queries](#queries)
  - [products](#products-query)
  - [product](#product-query)
- [Types](#types)
- [Examples](#examples)

---

## Queries

### `products` Query

Fetches a paginated list of products with optional filtering.

**Signature:**
```graphql
products(
  productFilter: ProductsFilterInput
  limit: Int = 20
  offset: Int = 0
): ProductsResponse!
```

**Arguments:**

| Argument | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `productFilter` | `ProductsFilterInput` | No | `null` | Filter criteria for products |
| `limit` | `Int` | No | `20` | Maximum number of products to return (page size) |
| `offset` | `Int` | No | `0` | Number of products to skip (for pagination) |

**Returns:** `ProductsResponse!`

A response object containing:
- `items`: Array of products matching the criteria
- `total`: Total count of products matching the filter (useful for pagination UI)
- `limit`: The limit used in the query
- `offset`: The offset used in the query

---

### `product` Query

Fetches a single product by its ID.

**Signature:**
```graphql
product(id: String!): Product!
```

**Arguments:**

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `String!` | Yes | UUID of the product |

**Returns:** `Product!`

A single product object, or throws an error if not found.

---

## Types

### `ProductsResponse`

The paginated response type for the `products` query.

```graphql
type ProductsResponse {
  items: [Product!]!
  total: Int!
  limit: Int!
  offset: Int!
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `items` | `[Product!]!` | Array of product objects |
| `total` | `Int!` | Total number of products matching the filter |
| `limit` | `Int!` | Page size used in the query |
| `offset` | `Int!` | Offset used in the query |

---

### `Product`

Represents a product in the system.

```graphql
type Product {
  id: ID!
  name: String!
  slug: String!
  price: String!
  categoryId: String!
  seo_title: String!
  seo_description: String!
  seo_keywords: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `ID!` | Unique identifier (UUID) |
| `name` | `String!` | Product name |
| `slug` | `String!` | URL-friendly identifier |
| `price` | `String!` | Product price (decimal as string) |
| `categoryId` | `String!` | UUID of the product's category |
| `seo_title` | `String!` | SEO-optimized title |
| `seo_description` | `String!` | SEO-optimized description |
| `seo_keywords` | `String!` | SEO keywords |
| `createdAt` | `DateTime!` | Creation timestamp |
| `updatedAt` | `DateTime!` | Last update timestamp |

---

### `ProductsFilterInput`

Input type for filtering products.

```graphql
input ProductsFilterInput {
  priceLte: Float
  priceGte: Float
  category: String
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `priceLte` | `Float` | No | Filter products with price less than or equal to this value |
| `priceGte` | `Float` | No | Filter products with price greater than or equal to this value |
| `category` | `String` | No | Filter products by category UUID |

**Note:** All filter fields are optional. If multiple filters are provided, they are combined with AND logic.

---

## Examples

### Example 1: Get All Products (Default Pagination)

Fetch the first 20 products (default limit).

```graphql
query GetProducts {
  products {
    items {
      id
      name
      slug
      price
      categoryId
    }
    total
    limit
    offset
  }
}
```

**Response:**
```json
{
  "data": {
    "products": {
      "items": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "name": "Premium Widget",
          "slug": "premium-widget",
          "price": "29.99",
          "categoryId": "223e4567-e89b-12d3-a456-426614174001"
        }
        // ... more products
      ],
      "total": 150,
      "limit": 20,
      "offset": 0
    }
  }
}
```

---

### Example 2: Filter by Category

Fetch products from a specific category.

```graphql
query GetProductsByCategory {
  products(
    productFilter: { category: "223e4567-e89b-12d3-a456-426614174001" }
  ) {
    items {
      id
      name
      price
    }
    total
  }
}
```

---

### Example 3: Filter by Price Range

Fetch products within a specific price range.

```graphql
query GetProductsByPriceRange {
  products(
    productFilter: { priceGte: 10.0, priceLte: 50.0 }
  ) {
    items {
      id
      name
      price
    }
    total
  }
}
```

---

### Example 4: Pagination (Second Page)

Fetch the second page of products (items 21-40).

```graphql
query GetProductsPage2 {
  products(limit: 20, offset: 20) {
    items {
      id
      name
      price
    }
    total
    limit
    offset
  }
}
```

---

### Example 5: Combined Filters with Custom Pagination

Fetch products in a category within a price range, with custom page size.

```graphql
query GetFilteredProducts {
  products(
    productFilter: {
      category: "223e4567-e89b-12d3-a456-426614174001"
      priceGte: 20.0
      priceLte: 100.0
    }
    limit: 10
    offset: 0
  ) {
    items {
      id
      name
      slug
      price
      seo_title
      seo_description
      createdAt
      updatedAt
    }
    total
    limit
    offset
  }
}
```

**Response:**
```json
{
  "data": {
    "products": {
      "items": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "name": "Premium Widget",
          "slug": "premium-widget",
          "price": "29.99",
          "seo_title": "Premium Widget - Best Quality",
          "seo_description": "High-quality premium widget for all your needs",
          "createdAt": "2025-11-15T10:30:00Z",
          "updatedAt": "2025-11-20T14:22:00Z"
        }
      ],
      "total": 45,
      "limit": 10,
      "offset": 0
    }
  }
}
```

---

### Example 6: Get Single Product by ID

Fetch complete details of a specific product.

```graphql
query GetProductById {
  product(id: "123e4567-e89b-12d3-a456-426614174000") {
    id
    name
    slug
    price
    categoryId
    seo_title
    seo_description
    seo_keywords
    createdAt
    updatedAt
  }
}
```

**Response:**
```json
{
  "data": {
    "product": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Premium Widget",
      "slug": "premium-widget",
      "price": "29.99",
      "categoryId": "223e4567-e89b-12d3-a456-426614174001",
      "seo_title": "Premium Widget - Best Quality",
      "seo_description": "High-quality premium widget for all your needs",
      "seo_keywords": "widget, premium, quality, tools",
      "createdAt": "2025-11-15T10:30:00Z",
      "updatedAt": "2025-11-20T14:22:00Z"
    }
  }
}
```

---

## Pagination Best Practices

### Calculating Total Pages

```javascript
const totalPages = Math.ceil(response.products.total / response.products.limit)
```

### Fetching All Pages

```javascript
// Example: Fetch all products using pagination
async function fetchAllProducts() {
  const limit = 50
  let offset = 0
  let allProducts = []
  
  while (true) {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetProducts($limit: Int!, $offset: Int!) {
            products(limit: $limit, offset: $offset) {
              items { id name price }
              total
            }
          }
        `,
        variables: { limit, offset }
      })
    })
    
    const { data } = await response.json()
    allProducts.push(...data.products.items)
    
    if (allProducts.length >= data.products.total) {
      break
    }
    
    offset += limit
  }
  
  return allProducts
}
```

---

## Error Handling

### Product Not Found

When querying a single product with an invalid ID:

```graphql
query GetInvalidProduct {
  product(id: "invalid-uuid") {
    id
    name
  }
}
```

**Response:**
```json
{
  "errors": [
    {
      "message": "Product not found",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["product"]
    }
  ],
  "data": null
}
```

---

## Performance Notes

1. **Default Sorting**: Products are sorted by `createdAt` in descending order (newest first)
2. **Efficient Counting**: The `total` count is fetched in parallel with the product items for optimal performance
3. **Recommended Page Size**: Default limit of 20 is recommended for most use cases. Larger limits (up to 100) can be used for bulk operations
4. **Caching**: Consider caching product lists on the client side, especially for category-filtered results

---

## Related Types

For complete product functionality, see also:
- **Categories**: Products belong to categories via `categoryId`
- **OrderItems**: Products are referenced in orders
- **Comments**: Products can have comments (not exposed in this query but available in the schema)

---

## Version History

- **2025-11-22**: Added pagination support with `limit` and `offset` parameters
- **2025-11-22**: Added filtering by category and price range
- **2025-11-22**: Introduced `ProductsResponse` type with total count
- **2025-11-22**: Enhanced `Product` type with all Prisma schema fields
