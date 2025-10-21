"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import dark from "react-syntax-highlighter/dist/esm/styles/prism/dracula";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  const router = useRouter();

  const { html: processedHtml, codeBlockMap } = React.useMemo(() => {
    const blockList = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
      /on\w+="[^"]*"/gi,
    ];

    const codeBlockMap = new Map<string, { lang: string; code: string }>();
    let codeBlockCounter = 0;

    let normalizedContent = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    normalizedContent = normalizedContent.replace(
      /```(\w+)?\n?([\s\S]*?)```/g,
      (match, lang, code) => {
        const language = lang || "text";
        const placeholder = `__CODE_BLOCK_${codeBlockCounter}__`;
        codeBlockMap.set(placeholder, { lang: language, code: code });
        codeBlockCounter++;
        return placeholder;
      }
    );

    // Escape HTML special characters
    normalizedContent = normalizedContent
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    const lines = normalizedContent.split("\n");

    const processLine = (line: string): string => {
      const trimmedLine = line.trim();

      if (trimmedLine === "---") {
        return '<hr class="border-white/10" />';
      }

      if (/^#### (.+)$/.test(trimmedLine)) {
        return trimmedLine.replace(
          /^#### (.+)$/,
          '<h4 class="text-xl font-bold mb-4 mt-4">$1</h4>'
        );
      }
      if (/^### (.+)$/.test(trimmedLine)) {
        return trimmedLine.replace(
          /^### (.+)$/,
          '<h3 class="text-2xl font-bold mb-4 mt-6">$1</h3>'
        );
      }
      if (/^## (.+)$/.test(trimmedLine)) {
        return trimmedLine.replace(
          /^## (.+)$/,
          '<h2 class="text-3xl font-bold mb-4 mt-8">$1</h2>'
        );
      }
      if (/^# (.+)$/.test(trimmedLine)) {
        return trimmedLine.replace(
          /^# (.+)$/,
          '<h1 class="text-4xl font-bold mb-6 mt-8">$1</h1>'
        );
      }

      return line;
    };

    const groupedLines: string[] = [];
    let currentBlockquote: { level: number; lines: string[] } | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      const blockquoteMatch = trimmedLine.match(/^(>+)\s?(.*)$/);

      if (blockquoteMatch) {
        const level = blockquoteMatch[1].length;
        const content = blockquoteMatch[2] || "";

        if (!currentBlockquote || currentBlockquote.level !== level) {
          if (currentBlockquote) {
            const marginClass =
              currentBlockquote.level > 1
                ? ` ml-${currentBlockquote.level * 4}`
                : "";
            groupedLines.push(
              `<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4${marginClass}">${currentBlockquote.lines.join(
                "<br />"
              )}</blockquote>`
            );
          }

          currentBlockquote = { level, lines: [content] };
        } else {
          currentBlockquote.lines.push(content);
        }
      } else {
        if (currentBlockquote) {
          const marginClass =
            currentBlockquote.level > 1
              ? ` ml-${currentBlockquote.level * 4}`
              : "";
          groupedLines.push(
            `<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4${marginClass}">${currentBlockquote.lines.join(
              "<br />"
            )}</blockquote>`
          );
          currentBlockquote = null;
        }

        groupedLines.push(processLine(line));
      }
    }

    if (currentBlockquote) {
      const marginClass =
        currentBlockquote.level > 1 ? ` ml-${currentBlockquote.level * 4}` : "";
      groupedLines.push(
        `<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4${marginClass}">${currentBlockquote.lines.join(
          "<br />"
        )}</blockquote>`
      );
    }

    let html = groupedLines.join("\n");

    // Process inline styles
    html /* Strikethrough */ = html.replace(
      /~~(.+?)~~/g,
      '<del class="line-through">$1</del>'
    );
    html /* Highlight */ = html.replace(
      /==(.+?)==/g,
      '<mark class="bg-yellow-200 px-1">$1</mark>'
    );
    html /* Subscript */ = html.replace(
      /~(.+?)~/g,
      '<sub class="text-xs">$1</sub>'
    );
    html /* Superscript */ = html.replace(
      /\^(.+?)\^/g,
      '<sup class="text-xs">$1</sup>'
    );
    html /* Bold */ = html.replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="font-bold">$1</strong>'
    );
    html /* Italic */ = html.replace(
      /\*(.+?)\*/g,
      '<em class="italic">$1</em>'
    );

    // Links, images, inline links, and internal links
    html /* Image */ = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="my-4 rounded-lg max-w-full" />'
    );

    html /* Internal */ = html.replace(
      /\[\s*<\/([^>\]]+)>([^\]]*)\]/g,
      `<span data-internal-link="/$1" class="internal-link text-[#aac49b] hover:underline cursor-pointer">$2</span>`
    );

    html /* Link */ = html.replace(
      /\[([^\]]+)\]\((\S+?)(?:\s+"([^"]+)")?\)/g,
      (match, text, href, title) => {
        const titleAttr = title ? ` title="${title}"` : "";
        return `<a href="${href}" class="text-[#aac49b] hover:underline"${titleAttr}>${text}</a>`;
      }
    );

    html /* Inline code */ = html.replace(/`([^`\n]+)`/g, (match, code) => {
      return `<code class="bg-gray-200 text-gray-800 px-2 py-1 rounded">${code}</code>`;
    });

    // Prevent XSS by removing blacklisted patterns
    blockList.forEach((pattern) => {
      html = html.replace(pattern, "");
    });

    const htmlLines = html.split("\n");
    const finalLines: string[] = [];
    let currentParagraph: string[] = [];
    let currentUnorderedList: string[] = [];
    let currentOrderedList: string[] = [];
    let currentCheckboxList: string[] = [];
    let currentTable: string[] = [];

    const isBlockElement = (line: string) => {
      const blockTags = [
        "<h1",
        "<h2",
        "<h3",
        "<h4",
        "<h5",
        "<h6",
        "<hr",
        "<pre",
        "<blockquote",
        "<img",
      ];
      return blockTags.some((tag) => line.trim().startsWith(tag));
    };

    const isUnorderedListItem = (line: string) => {
      return /^\s*[\*\-]\s+(.+)$/.test(line);
    };

    const isOrderedListItem = (line: string) => {
      return /^\s*\d+\.\s+(.+)$/.test(line);
    };

    const isCheckboxItem = (line: string) => {
      return /^\s*\[([ xX])\]\s+(.+)$/.test(line);
    };

    const isTableRow = (line: string) => {
      return /^\|(.+)\|$/.test(line.trim());
    };

    const getIndentLevel = (line: string) => {
      const match = line.match(/^(\s*)/);
      return match ? match[1].length : 0;
    };

    const processListItem = (line: string, isOrdered: boolean) => {
      const indent = getIndentLevel(line);
      const level = Math.floor(indent / 2);
      const content = isOrdered
        ? line.replace(/^\s*\d+\.\s+/, "")
        : line.replace(/^\s*[\*\-]\s+/, "");

      const marginStyles: Record<number, string> = {
        0: "",
        1: " ml-6",
        2: " ml-12",
        3: " ml-18",
        4: " ml-24",
      };
      const marginClass = marginStyles[level] || ` ml-${level * 6}`;
      return `<li class="mb-2${marginClass}">${content}</li>`;
    };

    const processCheckboxItem = (line: string) => {
      const match = line.match(/^\s*\[([ xX])\]\s+(.+)$/);
      if (match) {
        const checked = match[1].toLowerCase() === "x";
        const content = match[2];
        const checkboxHtml = checked
          ? '<input type="checkbox" checked disabled class="mr-2 align-middle" />'
          : '<input type="checkbox" disabled class="mr-2 align-middle" />';
        return `<li class="mb-2 flex items-start">${checkboxHtml}<span>${content}</span></li>`;
      }
      return line;
    };

    const processTableRow = (line: string, isHeader: boolean = false) => {
      const cells = line
        .trim()
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((cell) => cell.trim());

      if (isHeader) {
        return cells
          .map(
            (cell) =>
              `<th class="border border-gray-300 px-4 py-2 font-bold">${cell}</th>`
          )
          .join("");
      } else {
        return cells
          .map(
            (cell) =>
              `<td class="border border-gray-300 px-4 py-2">${cell}</td>`
          )
          .join("");
      }
    };

    for (const line of htmlLines) {
      const trimmed = line.trim();

      if (!trimmed) {
        if (currentTable.length > 0) {
          const tableHtml = `<table class="table-auto border-collapse border border-gray-300 my-4 w-full">${currentTable.join(
            ""
          )}</table>`;
          finalLines.push(tableHtml);
          currentTable = [];
        }
        if (currentCheckboxList.length > 0) {
          finalLines.push(
            `<ul class="list-none mb-4 space-y-1">${currentCheckboxList.join(
              ""
            )}</ul>`
          );
          currentCheckboxList = [];
        }
        if (currentUnorderedList.length > 0) {
          finalLines.push(
            `<ul class="list-disc mb-4 space-y-1">${currentUnorderedList.join(
              ""
            )}</ul>`
          );
          currentUnorderedList = [];
        }
        if (currentOrderedList.length > 0) {
          finalLines.push(
            `<ol class="list-decimal mb-4 space-y-1">${currentOrderedList.join(
              ""
            )}</ol>`
          );
          currentOrderedList = [];
        }
        if (currentParagraph.length > 0) {
          finalLines.push(
            `<p class="mb-4">${currentParagraph.join("<br />")}</p>`
          );
          currentParagraph = [];
        }
      } else if (isTableRow(line)) {
        if (currentCheckboxList.length > 0) {
          finalLines.push(
            `<ul class="list-none mb-4 space-y-1">${currentCheckboxList.join(
              ""
            )}</ul>`
          );
          currentCheckboxList = [];
        }
        if (currentUnorderedList.length > 0) {
          finalLines.push(
            `<ul class="list-disc mb-4 space-y-1">${currentUnorderedList.join(
              ""
            )}</ul>`
          );
          currentUnorderedList = [];
        }
        if (currentOrderedList.length > 0) {
          finalLines.push(
            `<ol class="list-decimal mb-4 space-y-1">${currentOrderedList.join(
              ""
            )}</ol>`
          );
          currentOrderedList = [];
        }
        if (currentParagraph.length > 0) {
          finalLines.push(
            `<p class="mb-4">${currentParagraph.join("<br />")}</p>`
          );
          currentParagraph = [];
        }

        if (/^\|\s*[-:]+\s*(\|\s*[-:]+\s*)*\|$/.test(trimmed)) {
        } else if (currentTable.length === 0) {
          currentTable.push(
            `<thead><tr>${processTableRow(line, true)}</tr></thead><tbody>`
          );
        } else {
          currentTable.push(`<tr>${processTableRow(line, false)}</tr>`);
        }
      } else if (isCheckboxItem(line)) {
        if (currentTable.length > 0) {
          const tableHtml = `<table class="table-auto border-collapse border border-gray-300 my-4 w-full">${currentTable.join(
            ""
          )}</table>`;
          finalLines.push(tableHtml);
          currentTable = [];
        }
        if (currentUnorderedList.length > 0) {
          finalLines.push(
            `<ul class="list-disc mb-4 space-y-1">${currentUnorderedList.join(
              ""
            )}</ul>`
          );
          currentUnorderedList = [];
        }
        if (currentOrderedList.length > 0) {
          finalLines.push(
            `<ol class="list-decimal mb-4 space-y-1">${currentOrderedList.join(
              ""
            )}</ol>`
          );
          currentOrderedList = [];
        }
        if (currentParagraph.length > 0) {
          finalLines.push(
            `<p class="mb-4">${currentParagraph.join("<br />")}</p>`
          );
          currentParagraph = [];
        }
        currentCheckboxList.push(processCheckboxItem(line));
      } else if (isUnorderedListItem(line)) {
        if (currentTable.length > 0) {
          const tableHtml = `<table class="table-auto border-collapse border border-gray-300 my-4 w-full">${currentTable.join(
            ""
          )}</table>`;
          finalLines.push(tableHtml);
          currentTable = [];
        }
        if (currentCheckboxList.length > 0) {
          finalLines.push(
            `<ul class="list-none mb-4 space-y-1">${currentCheckboxList.join(
              ""
            )}</ul>`
          );
          currentCheckboxList = [];
        }
        if (currentOrderedList.length > 0) {
          finalLines.push(
            `<ol class="list-decimal mb-4 space-y-1">${currentOrderedList.join(
              ""
            )}</ol>`
          );
          currentOrderedList = [];
        }
        if (currentParagraph.length > 0) {
          finalLines.push(
            `<p class="mb-4">${currentParagraph.join("<br />")}</p>`
          );
          currentParagraph = [];
        }
        currentUnorderedList.push(processListItem(line, false));
      } else if (isOrderedListItem(line)) {
        if (currentTable.length > 0) {
          const tableHtml = `<table class="table-auto border-collapse border border-gray-300 my-4 w-full">${currentTable.join(
            ""
          )}</table>`;
          finalLines.push(tableHtml);
          currentTable = [];
        }
        if (currentCheckboxList.length > 0) {
          finalLines.push(
            `<ul class="list-none mb-4 space-y-1">${currentCheckboxList.join(
              ""
            )}</ul>`
          );
          currentCheckboxList = [];
        }
        if (currentUnorderedList.length > 0) {
          finalLines.push(
            `<ul class="list-disc mb-4 space-y-1">${currentUnorderedList.join(
              ""
            )}</ul>`
          );
          currentUnorderedList = [];
        }
        if (currentParagraph.length > 0) {
          finalLines.push(
            `<p class="mb-4">${currentParagraph.join("<br />")}</p>`
          );
          currentParagraph = [];
        }
        currentOrderedList.push(processListItem(line, true));
      } else if (isBlockElement(line)) {
        if (currentTable.length > 0) {
          const tableHtml = `<table class="table-auto border-collapse border border-gray-300 my-4 w-full">${currentTable.join(
            ""
          )}</table>`;
          finalLines.push(tableHtml);
          currentTable = [];
        }
        if (currentCheckboxList.length > 0) {
          finalLines.push(
            `<ul class="list-none mb-4 space-y-1">${currentCheckboxList.join(
              ""
            )}</ul>`
          );
          currentCheckboxList = [];
        }
        if (currentUnorderedList.length > 0) {
          finalLines.push(
            `<ul class="list-disc mb-4 space-y-1">${currentUnorderedList.join(
              ""
            )}</ul>`
          );
          currentUnorderedList = [];
        }
        if (currentOrderedList.length > 0) {
          finalLines.push(
            `<ol class="list-decimal mb-4 space-y-1">${currentOrderedList.join(
              ""
            )}</ol>`
          );
          currentOrderedList = [];
        }
        if (currentParagraph.length > 0) {
          finalLines.push(
            `<p class="mb-4">${currentParagraph.join("<br />")}</p>`
          );
          currentParagraph = [];
        }
        finalLines.push(line);
      } else {
        currentParagraph.push(line);
      }
    }

    if (currentTable.length > 0) {
      const tableHtml = `<table class="table-auto border-collapse border border-gray-300 my-4 w-full">${currentTable.join(
        ""
      )}</tbody></table>`;
      finalLines.push(tableHtml);
    }
    if (currentCheckboxList.length > 0) {
      finalLines.push(
        `<ul class="list-none mb-4 space-y-1">${currentCheckboxList.join(
          ""
        )}</ul>`
      );
    }
    if (currentUnorderedList.length > 0) {
      finalLines.push(
        `<ul class="list-disc mb-4 space-y-1">${currentUnorderedList.join(
          ""
        )}</ul>`
      );
    }
    if (currentOrderedList.length > 0) {
      finalLines.push(
        `<ol class="list-decimal mb-4 space-y-1">${currentOrderedList.join(
          ""
        )}</ol>`
      );
    }
    if (currentParagraph.length > 0) {
      finalLines.push(`<p class="mb-4">${currentParagraph.join("<br />")}</p>`);
    }

    html = finalLines.join("\n");

    const footnotes: Record<string, string> = {};
    html = html.replace(/\[(\^[\w]+)\]:\s*(.+?)(?=\n|$)/g, (_, ref, text) => {
      footnotes[ref] = text.trim();
      return "";
    });

    html = html.replace(/\[(\^[\w]+)\]/g, (_, ref) => {
      const footnoteText = footnotes[ref] || "";
      if (footnoteText) {
        return `<sup class="text-xs"><a href="#fn${ref}" id="ref${ref}" class="text-[#aac49b] hover:underline">${ref}</a></sup>`;
      }
      return _;
    });

    if (Object.keys(footnotes).length > 0) {
      html += '<hr class="border-white/10 my-8" />';
      html += '<div class="footnotes text-sm text-gray-600">';
      for (const [ref, text] of Object.entries(footnotes)) {
        html += `<p id="fn${ref}" class="mb-2"><sup>${ref}</sup> ${text} <a href="#ref${ref}" class="text-[#aac49b] hover:underline">↩</a></p>`;
      }
      html += "</div>";
    }

    return { html, codeBlockMap };
  }, [content]);

  React.useEffect(() => {
    const handleInternalLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.matches("span[data-internal-link]")) {
        const link = target.getAttribute("data-internal-link");
        if (link) {
          event.preventDefault();
          router.push(link);
        }
      }
    };

    document.addEventListener("click", handleInternalLinkClick);

    return () => {
      document.removeEventListener("click", handleInternalLinkClick);
    };
  }, [router]);

  const renderContent = () => {
    const parts = processedHtml.split(/(__CODE_BLOCK_\d+__)/g);

    return parts.map((part, index) => {
      if (part.match(/^__CODE_BLOCK_\d+__$/)) {
        const codeBlock = codeBlockMap.get(part);

        if (codeBlock) {
          return (
            <div key={index} className="my-4">
              <SyntaxHighlighter
                language={codeBlock.lang}
                style={dark}
                showLineNumbers
              >
                {codeBlock.code.replace(/^\s*\n|\s*$/g, "")}
              </SyntaxHighlighter>
            </div>
          );
        }
      }

      return (
        <div
          key={index}
          className="prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: part }}
        />
      );
    });
  };

  return <>{renderContent()}</>;
}
