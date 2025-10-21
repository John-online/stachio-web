<file>
    <file:name val="Understanding Nested Categories">
    <file:category isParent="true" val="Advanced Documentation" icon="FolderTree">
</file>
<category:description>
    Learn how the documentation system handles nested folder structures and category hierarchies. This example demonstrates the power of organizing documentation in subdirectories while maintaining a clean, accessible navigation structure.
</category:description>
<content>
    # Nested Documentation Structure

    This file demonstrates how the Stachio documentation system elegantly handles nested folder structures. Despite being located at `docs/nested_demo/nest.md`, this document is processed identically to top-level files like `docs/demo.md`.

    ## Key Features

    ### Folder Organization
    - **Hierarchical Structure**: Organize your documentation in subdirectories for better maintainability
    - **Seamless Integration**: Nested files are automatically discovered and integrated into the navigation
    - **Clean URLs**: The routing system generates clean, intuitive URLs regardless of folder depth

    ### Benefits

    1. **Improved File Management**: Keep related documentation grouped together in logical folders
    2. **Scalability**: As your documentation grows, maintain organization without cluttering the root directory
    3. **Consistency**: All markdown files follow the same processing pipeline, ensuring uniform behavior
    4. **Developer Experience**: Easier to locate and edit files during development

    ## Technical Details

    The system recursively scans the `docs` directory, processing each markdown file and extracting:
    - File metadata (name, category, icon)
    - Category descriptions
    - Content structure
    - Navigation hierarchy

    This approach allows for unlimited nesting depth while maintaining performance and simplicity.

    > **Note**: Whether your documentation is one level deep or five levels deep, the rendering engine treats all files consistently, ensuring a predictable development experience.

    ## Understanding the `isParent` Attribute

    The `isParent="true"` attribute is a crucial part of the documentation system's metadata structure. Here's how it works:

    ### What is `isParent`?

    When you set `isParent="true"` in a file's metadata, you're designating that file as the **category parent** — the primary, defining document for that category. This file serves as:

    - **The Category Definition**: Sets the category icon, description, and display properties
    - **The Entry Point**: Typically the first file users see when exploring a category
    - **The Landing Page**: Accessed directly via `/docs/{category-name}` URL

    ### How It Works in Code

    From `docs-utils.ts`, the system processes files like this:

    ```typescript
    if (fileMetadata.isParent) {
      if (!category.parentFile) {
        category.parentFile = fileMetadata;

        if (fileMetadata.categoryDescription && !category.description) {
          category.description = fileMetadata.categoryDescription;
        }
      }
    } else {
      category.files.push(fileMetadata);
    }
    ```

    ### Key Behaviors

    1. **Category Icon Assignment**: Only parent files can define the category icon
    2. **Description Inheritance**: The `<category:description>` tag in parent files becomes the category's description
    3. **URL Structure**: Parent files are accessible at `/docs/{category}` while child files use `/docs/{category}/{filename}`
    4. **Navigation Order**: Parent files appear first in category listings

    ### Example: This File

    Look at the metadata for this file:

    ```xml
    <file:category isParent="true" val="Advanced Documentation" icon="FolderTree">
    ```

    This declaration means:
    - ✅ This is the parent file for "Advanced Documentation"
    - ✅ The category icon is `FolderTree` (from Lucide Icons)
    - ✅ The category description comes from the `<category:description>` block
    - ✅ Accessible at `/docs/Advanced-Documentation`

    ### Without `isParent` (Child Files)

    Files without `isParent="true"` (or with `isParent="false"`) are treated as child documents:

    ```xml
    <file:category val="Advanced Documentation">
    ```

    These files:
    - ❌ Cannot define category icons or descriptions
    - ✅ Inherit the parent's category settings
    - ✅ Are grouped under the same category in navigation
    - ✅ Accessible at `/docs/{category}/{slug}`

    ## File Structure Internals

    ### How Files Are Scanned

    The `scanDocumentationFiles()` function recursively traverses the `docs` directory:

    ```typescript
    function scanDirectory(dirPath: string, relativePath: string = "") {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const item of items) {
        if (item.isDirectory()) {
          scanDirectory(fullPath, relPath);  // Recursion for nested folders
        } else if (item.name.endsWith(".md")) {
          // Process markdown file
        }
      }
    }
    ```

    ### Metadata Extraction

    Each `.md` file is parsed to extract:

    1. **File Name**: From `<file:name val="...">` or defaults to filename
    2. **Category**: From `<file:category val="...">`
    3. **Parent Status**: From `isParent="true"` attribute
    4. **Category Icon**: From `icon="..."` attribute (only in parent files)
    5. **Category Description**: From `<category:description>` block
    6. **Content**: Everything inside `<content>...</content>` tags

    ### Category Map Structure

    The system builds a `Map<string, DocCategory>` where each category contains:

    ```typescript
    interface DocCategory {
      name: string;                    // Category name
      icon: string;                    // Icon name (from parent file)
      description?: string;            // Category description
      parentFile: DocFileMetadata | null;  // The parent file (isParent=true)
      files: DocFileMetadata[];        // Child files (isParent=false)
    }
    ```

    ### Icon Resolution

    Icons are resolved through `icon-utils.ts`, which maps icon names to Lucide React components:

    ```typescript
    getIconComponent("FolderTree") // Returns LucideIcons.FolderTree
    ```

    Supported icons include: `Shield`, `Book`, `FileText`, `FolderTree`, `Settings`, `Code`, `Heart`, `HelpCircle`, and many more.

    ### Markdown Rendering

    Content is processed by `markdown-renderer.tsx`, which:

    1. **Parses Custom Syntax**: Handles headers, lists, tables, code blocks, etc.
    2. **Resolves Internal Links**: Converts `[</category/file>Text]` to clickable navigation
    3. **Applies Styling**: Uses Tailwind CSS classes for consistent formatting
    4. **Prevents XSS**: Sanitizes content and blocks dangerous patterns

    ### Caching Strategy

    For performance, the system implements a 2-minute cache:

    ```typescript
    const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes
    ```

    This means category scans only happen when the cache expires, reducing filesystem I/O.

    ## Best Practices

    ### ✅ DO:
    - Use `isParent="true"` for the main/introductory file of each category
    - Keep one parent file per category
    - Define meaningful category descriptions in parent files
    - Choose appropriate icons that represent the category's content
    - Organize related files in subdirectories

    ### ❌ DON'T:
    - Create multiple parent files for the same category (only the first is used)
    - Define icons in non-parent files (they'll be ignored)
    - Use special characters in category names (use hyphens instead)
    - Forget to include required metadata tags

</content>
