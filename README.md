# copy-code-as-markdown

It helps you to copy code with markdown fences and filename.

## Usage

Press `F1` or `Ctrl+Shift+P` and execute `Copy selection code as Markdown`.

Your clipboard then get sth like:

````
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


## Shortcut

Assign any shortcut to it at your will. Example:

*c:\Users\<USERNAME>\AppData\Roaming\Code\User\keybindings.json*

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
+ `{lang}`
+ `{text}`

Example:

```
{
    "copyCodeAsMarkdown.template": "```{lang}\n{text}\n```"
}
```