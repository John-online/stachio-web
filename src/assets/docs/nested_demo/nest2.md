<file>
    <file:name val="Category Grouping & Relationships">
    <file:category val="Advanced Documentation">
</file>
<content>
    # Category Grouping in Documentation

    This document showcases how multiple files within the same directory can belong to the same category, creating a cohesive documentation experience.

    ## Category Relationships

    Notice that this file shares the same category (`Advanced Documentation`) as the parent file in this directory. This demonstrates an important feature of the documentation system:

    ### Same Category, Multiple Files
    - Multiple markdown files can belong to the same category
    - Files are automatically grouped in the navigation sidebar
    - The category icon and description are inherited from the parent file
    - Order is determined by file structure and metadata

    ## Practical Use Cases

    This pattern is particularly useful for:

    1. **Multi-Part Tutorials**: Break long tutorials into digestible chapters while keeping them grouped
    2. **API Documentation**: Separate endpoints or modules into individual files within a category
    3. **Feature Documentation**: Document related features separately but under one category
    4. **Version-Specific Docs**: Organize documentation by version while maintaining category structure

    ## File Location Example

    ```
    docs/
    ├── demo.md (Demonstration)
    └── nested_demo/
        ├── nest.md (Advanced Documentation - Parent)
        └── nest2.md (Advanced Documentation - Child) ← You are here
    ```

    ## Navigation Behavior

    When users navigate the documentation:
    - Both files appear under "Advanced Documentation"
    - The sidebar maintains category hierarchy
    - Users can easily switch between related documents
    - Breadcrumbs reflect the actual file structure

    ---

    **Pro Tip**: Use `isParent="true"` in the first file of a category to define the category description and icon. Subsequent files in the same category will inherit these properties automatically.

    ## Deep Dive: Understanding `isParent`

    This file intentionally does **NOT** have `isParent="true"`, making it a child file. Let's explore what this means in practice.

    ### Comparing Parent vs. Child Files

    #### Parent File (`nest.md`):
    ```xml
    <file:category isParent="true" val="Advanced Documentation" icon="FolderTree">
    ```

    #### This File (`nest2.md`):
    ```xml
    <file:category val="Advanced Documentation">
    ```

    ### What's Different?

    | Feature | Parent File | Child File (This File) |
    |---------|-------------|------------------------|
    | `isParent` attribute | ✅ `true` | ❌ Not set (defaults to `false`) |
    | Can define category icon | ✅ Yes | ❌ No (ignored if present) |
    | Can define category description | ✅ Yes | ❌ No (ignored if present) |
    | URL pattern | `/docs/{category}` | `/docs/{category}/{slug}` |
    | Position in sidebar | First (landing page) | Listed under parent |
    | Stored in | `category.parentFile` | `category.files[]` array |

    ## How the System Processes Files

    ### Step 1: File Discovery

    The `scanDocumentationFiles()` function recursively walks through the `docs/` directory:

    ```
    docs/
    ├── demo.md                    ← Scanned first
    └── nested_demo/               ← Directory, recurse into it
        ├── nest.md                ← Scanned (isParent=true found)
        └── nest2.md               ← Scanned (isParent not set)
    ```

    ### Step 2: Metadata Parsing

    For each `.md` file, the system extracts metadata using regex patterns:

    ```typescript
    // Extract file metadata block
    const fileMatch = rawContent.match(/<file>([\s\S]*?)<\/file>/);

    // Extract category with optional isParent attribute
    const categoryMatch = fileSection.match(
      /<file:category\s+(?:isParent="(true|false)"\s+)?val="([^"]+)"(?:\s+icon="([^"]+)")?\s*(?:>|\/?>)/
    );
    ```

    This means the parser looks for:
    - `<file:name val="Your Title">`
    - `<file:category val="Category Name">` or `<file:category isParent="true" val="..." icon="...">`
    - `<category:description>...</category:description>`
    - `<content>...</content>`

    ### Step 3: Category Assignment

    When processing this file (`nest2.md`), the system:

    1. **Checks if category exists**: "Advanced Documentation" was already created by `nest.md`
    2. **Checks isParent flag**: This file has no `isParent="true"`, so it's a child
    3. **Adds to category.files[]**: This file gets pushed to the child files array

    ```typescript
    if (fileMetadata.isParent) {
      if (!category.parentFile) {
        category.parentFile = fileMetadata;  // nest.md goes here
      }
    } else {
      category.files.push(fileMetadata);     // nest2.md goes here
    }
    ```

    ### Step 4: Building the Category Object

    The final category structure looks like:

    ```typescript
    {
      name: "Advanced Documentation",
      icon: "FolderTree",                    // From nest.md
      description: "Learn how the...",       // From nest.md
      parentFile: {                          // nest.md
        name: "Understanding Nested Categories",
        isParent: true,
        content: "...",
        filePath: "nested_demo/nest.md"
      },
      files: [                               // nest2.md
        {
          name: "Category Grouping & Relationships",
          isParent: false,
          content: "...",
          filePath: "nested_demo/nest2.md"
        }
      ]
    }
    ```

    ## Routing and URL Generation

    ### Parent File Routing

    The parent file (`nest.md`) is accessible at:
    ```
    /docs/Advanced-Documentation
    ```

    This is the **category landing page**. When users navigate to a category, they see the parent file first.

    ### Child File Routing

    This file (`nest2.md`) is accessible at:
    ```
    /docs/Advanced-Documentation/category-grouping-relationships
    ```

    The slug is generated by:
    1. Taking the filename or `<file:name>` value
    2. Converting to lowercase
    3. Replacing spaces with hyphens
    4. Removing special characters

    ## Internal Link Resolution

    The system supports special internal linking syntax processed by `markdown-renderer.tsx`:

    ### Syntax

    ```markdown
    [</category/filename>Display Text]
    ```

    ### Example

    ```markdown
    [</Advanced-Documentation/nest>Understanding Nested Categories]
    ```

    This creates a clickable link that navigates to the specified document within the app, maintaining SPA navigation.

    ### How It Works

    1. **Regex Pattern**: `/<\/([^>\]]+)>([^\]]*)\]/g` matches the custom syntax
    2. **Link Generation**: Converts to `<span data-internal-link="/docs/{path}">`
    3. **Click Handler**: JavaScript intercepts clicks and uses Next.js router for navigation

    ## Inheritance Rules

    ### What Child Files Inherit

    ✅ **Category Icon**: Automatically uses the parent's icon in navigation
    ✅ **Category Description**: Shares the same category description
    ✅ **Category Name**: Must match exactly for grouping
    ✅ **Navigation Grouping**: Appears under the same category section

    ### What Child Files DON'T Inherit

    ❌ **File Name**: Each file has its own `<file:name>`
    ❌ **Content**: Each file has its own `<content>` block
    ❌ **URL Slug**: Generated independently from filename
    ❌ **Order**: Position determined by filesystem order

    ## Advanced Example: Multiple Child Files

    Imagine this structure:

    ```
    docs/
    └── api/
        ├── overview.md          (isParent=true, icon="Code")
        ├── authentication.md    (child)
        ├── endpoints.md         (child)
        └── rate-limiting.md     (child)
    ```

    Results in:

    ```typescript
    {
      name: "API",
      icon: "Code",                     // From overview.md
      description: "...",               // From overview.md
      parentFile: overview.md,          // Landing page
      files: [                          // All children
        authentication.md,
        endpoints.md,
        rate-limiting.md
      ]
    }
    ```

    All five files appear under "API" in the navigation, with `overview.md` as the entry point.

    ## Why This Pattern?

    ### Benefits of Parent/Child Architecture

    1. **Clear Entry Points**: Users know where to start (parent file)
    2. **Logical Grouping**: Related content stays together
    3. **Flexible Organization**: Add/remove child files without restructuring
    4. **Consistent Navigation**: Category properties defined once, used everywhere
    5. **Scalable Structure**: Supports unlimited files per category

    ### Real-World Analogy

    Think of it like a book:
    - **Category**: The book itself
    - **Parent File**: Table of contents / Introduction
    - **Child Files**: Individual chapters
    - **Icon & Description**: Book cover and synopsis

    ## Practical Guidelines

    ### When to Use `isParent="true"`

    - ✅ Creating a new category
    - ✅ Need to define category icon and description
    - ✅ Want a landing page for the category
    - ✅ First/main document in a topic area

    ### When to Omit `isParent` (Child Files)

    - ✅ Adding supplementary documentation
    - ✅ Breaking up large topics into parts
    - ✅ Creating sub-sections of a category
    - ✅ All files except the first/main one

    ### Common Mistakes to Avoid

    ❌ **Multiple Parents**: Only the first `isParent="true"` file is used per category
    ❌ **Icon in Child Files**: The icon attribute is ignored in non-parent files
    ❌ **Category Name Mismatch**: Child files must use exact same category name
    ❌ **Missing Parent**: A category without a parent file has no icon or description

    ## Summary

    This file demonstrates the **child file pattern**: no `isParent` attribute, inherits category settings from `nest.md`, and provides additional content under the same category umbrella. This architecture enables clean, scalable documentation with minimal configuration.

</content>
