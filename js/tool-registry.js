/**
 * 工具注册表：所有工具的 id、图标、分类、加载方式。
 * 菜单与 ToolManager 均以此表为唯一数据源。
 */
import { JSONFormatter } from './tools/json-formatter.js';
import { XMLFormatter } from './tools/xml-formatter.js';
import { TextEncryption } from './tools/text-encrypt.js';
import { Base64Converter } from './tools/base64-converter.js';
import { CaseConverter } from './tools/case-converter.js';
import { TextToASCII } from './tools/text-to-ascii.js';
import { TextToUnicode } from './tools/text-to-unicode.js';
import { JSONDiff } from './tools/json-diff.js';
import { StringReverser } from './tools/string-reverse.js';
import { TextDiff } from './tools/text-diff.js';
import { ASCIIArtGenerator } from './tools/ascii-art.js';
import { TextIconGenerator } from './tools/text-icon-generator.js';
import { Base64ImageConverter } from './tools/base64-image-converter.js';
import { JsonToJavaBean } from './tools/json-to-javabean.js';
import { MermaidViewer } from './tools/mermaid-viewer.js';

/** 分类展示顺序（侧栏分组顺序） */
export const CATEGORY_ORDER = ['format', 'convert', 'crypto', 'diff', 'generate', 'codegen'];

/** 工具注册项：id, icon(MDI 类名如 mdi-code-json), category, loader 返回实例 */
export const TOOL_REGISTRY = [
  { id: 'jsonformatter', icon: 'mdi-code-json', category: 'format', loader: () => new JSONFormatter() },
  { id: 'xmlformatter', icon: 'mdi-xml', category: 'format', loader: () => new XMLFormatter() },
  { id: 'textencryption', icon: 'mdi-shield-key', category: 'crypto', loader: () => new TextEncryption() },
  { id: 'base64converter', icon: 'mdi-file-code', category: 'convert', loader: () => new Base64Converter() },
  { id: 'caseconverter', icon: 'mdi-format-letter-case', category: 'convert', loader: () => new CaseConverter() },
  { id: 'texttoascii', icon: 'mdi-code-array', category: 'convert', loader: () => new TextToASCII() },
  { id: 'texttounicode', icon: 'mdi-translate', category: 'convert', loader: () => new TextToUnicode() },
  { id: 'stringreverser', icon: 'mdi-format-text-rotation-none', category: 'convert', loader: () => new StringReverser() },
  { id: 'jsondiff', icon: 'mdi-file-compare', category: 'diff', loader: () => new JSONDiff() },
  { id: 'textdiff', icon: 'mdi-file-document-multiple', category: 'diff', loader: () => new TextDiff() },
  { id: 'asciiartgenerator', icon: 'mdi-format-text', category: 'generate', loader: () => new ASCIIArtGenerator() },
  { id: 'texticongenerator', icon: 'mdi-format-font', category: 'generate', loader: () => new TextIconGenerator() },
  { id: 'base64imageconverter', icon: 'mdi-image', category: 'generate', loader: () => new Base64ImageConverter() },
  { id: 'mermaidviewer', icon: 'mdi-graph', category: 'generate', loader: () => new MermaidViewer() },
  { id: 'jsontojavabean', icon: 'mdi-language-java', category: 'codegen', loader: () => new JsonToJavaBean() }
];

export default TOOL_REGISTRY;
