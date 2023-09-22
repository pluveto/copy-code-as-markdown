# copy-code-as-markdown

It helps you to copy code with markdown fences and filename.

## Usage

### Basic

Execute command `copyCodeAsMarkdown: Copy selection code as Markdown`.

Your clipboard then get sth like:

````markdown
*config.yaml*
```yaml
taxonomies:
  category: categories
  tag: tags
  series: series
  author: authors

build:
  useResourceCacheWhen: always
```
````

### Switch between teplates

Execute command `copyCodeAsMarkdown: copyCodeAsMarkdown: Switch using template`.

Here are some of the builtin templates:

```jsonc
{
  "default": "*{filename}* {lineNumber}:\n```{lang}\n{text}\n```",
  "lineRange": "*{filename}* {lineNumber} - {lineNumberEnd}:\n```{lang}\n{text}\n```",
  "onlyCode": "```{lang}\n{text}\n```",
  "onlyPosition": "{filename}:{lineNumber}:{colNumber}",
  "withOutline": "[{filename}#L{lineNumber}](/{filename}#L{lineNumber})\n>{outlinePath}\n```{lang}\n{text}\n```"
}
```

## Shortcut

This extension has no default shortcut. You can set it by yourself.

Edit your keybinding setting via UI,

or edit config file for example *c:\Users\<USERNAME>\AppData\Roaming\Code\User\keybindings.json*

```jsonc
    {
        "key": "ctrl+shift+c",
        "command": "copy-code-as-markdown.CopySelectionAsMarkdown",
        "when": "editorTextFocus"
    },
```

## Custom template

Setting node is `copyCodeAsMarkdown.template`. Available vars:

+ `{filename}`
+ `{lineNumber}`
+ `{lineNumberEnd}`
+ `{colNumber}`
+ `{colNumberEnd}`
+ `{lang}`
+ `{text}`
+ `{outlinePath}`

Example:

```jsonc
{
    "copyCodeAsMarkdown.template": "```{lang}\n{text}\n```"
}
```

## Outline path delimiter

Setting node is `copyCodeAsMarkdown.delimiter`. Default value is `" &raquo; "`
