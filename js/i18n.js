// 语言配置文件
const i18n = {
  zh: {
    appTitle: '开发者工具',
    appSubtitle: '助力开发人员和IT工作者',
    menuItems: {
      'jsonformatter': 'JSON转换和格式化',
      'textencryption': '加密/解密文本',
      'base64converter': 'Base64 文件转换器',
      'caseconverter': '大小写转换',
      'texttoascii': '文本到 ASCII 二进制',
      'texttounicode': '文转 Unicode',
      'jsondiff': 'JSON 差异比较',
      'stringreverser': '字符串逆序',
      'textdiff': '文本比较',
      'asciiartgenerator': 'ASCII Art Text Generator',
      'xmlformatter': 'XML 格式化',
      'texticongenerator': '文字图标生成器',
      'base64imageconverter': 'Base64转图片',
      'jsontojavabean': 'JSON转JavaBean'
    },
    tools: {
      'jsonformatter': {
        title: 'JSON转换和格式化',
        description: '格式化和验证JSON数据，提供压缩和美化功能'
      },
      'textencryption': {
        title: '加密/解密文本',
        description: '使用多种加密算法对文本进行加密和解密',
        caesarCipher: '凯撒密码',
        encrypt: '加密',
        decrypt: '解密',
        shiftPlaceholder: '位移量',
        inputRequired: '请输入要加密/解密的文本',
        invalidBase64: '无效的Base64编码'
      },
      'base64converter': {
        title: 'Base64 文件转换器',
        description: '文件与Base64编码之间的转换工具',
        defaultText: '这是一个示例文本，将被转换为Base64编码。',
        selectFile: '选择文件',
        encode: '转换为Base64',
        decode: 'Base64转文件',
        inputRequired: '请输入要转换的文本或选择文件',
        inputBase64Required: '请输入Base64编码',
        invalidBase64: '输入不是有效的Base64编码'
      },
      'caseconverter': {
        title: '大小写转换',
        description: '在不同大小写格式之间转换文本',
        upperCase: '转换为大写',
        lowerCase: '转换为小写',
        titleCase: '首字母大写',
        sentenceCase: '句首大写'
      },
      'texttoascii': {
        title: 'ASCII码转换工具',
        description: '将文本转换为ASCII码或二进制，或将ASCII码转换回文本',
        toAscii: '转换为ASCII',
        toBinary: '转换为二进制',
        toText: '转换为文本',
        invalidAscii: '无效的ASCII码'
      },
      'texttounicode': {
        title: '文本到Unicode转换',
        description: '将文本转换为Unicode编码或将Unicode编码转换为文本',
        defaultText: '请输入要转换的文本',
        toUnicode: '转换为Unicode',
        toText: '转换为文本',
        uFormat: '\\u格式',
        uplusFormat: 'U+格式',
        invalidUnicode: '无效的Unicode编码'
      },
      'jsondiff': {
        title: 'JSON 差异比较',
        description: '比较两个JSON文本之间的差异',
        json1: 'JSON 1',
        json2: 'JSON 2',
        json1Placeholder: '请输入第一个JSON对象...',
        json2Placeholder: '请输入第二个JSON对象...',
        diffResult: '差异结果',
        noDiffFound: '没有发现差异',
        compareError: '比较错误',
        added: '添加',
        removed: '删除',
        typeChanged: '类型改变',
        valueChanged: '值改变',
        unknownChange: '未知改变',
        openInWebsite: '在 jsdiff.com 中打开',
        textView: '文本视图',
        structuredView: '结构化视图'
      },
      'stringreverser': {
        title: '字符串反转工具',
        description: '反转字符串中的字符、单词或句子顺序',
        defaultText: '这是一个示例字符串，用于演示反转功能',
        reverseByChar: '按字符反转',
        reverseByWord: '按单词反转',
        reverseBySentence: '按句子反转'
      },
      'textdiff': {
        title: '文本比较',
        description: '比较两段文本之间的差异',
        character: '字符级别比较',
        word: '单词级别比较',
        line: '行级别比较',
        text1: '文本 1',
        text2: '文本 2',
        text1Placeholder: '请输入第一段文本...',
        text2Placeholder: '请输入第二段文本...',
        diffResult: '差异结果',
        inputRequired: '请输入要比较的两段文本',
        openInWebsite: '在 jsdiff.com 中打开'
      },
      'asciiartgenerator': {
        title: 'ASCII Art Text Generator',
        description: '将普通文本转换为ASCII艺术字体',
        standardFont: '标准字体',
        blockFont: '方块字体',
        simpleFont: '简单字体'
      },
      'xmlformatter': {
        title: 'XML 格式化',
        description: '格式化和验证XML数据'
      },
      'texticongenerator': {
        title: '文字图标生成器',
        description: '生成文字图标',
        standardStyle: '标准样式',
        roundedStyle: '圆角样式',
        outlineStyle: '描边样式',
        textColor: '文字颜色',
        bgColor: '背景颜色',
        iconSize: '图标大小',
        iconPreview: '图标预览'
      },
      'base64imageconverter': {
        title: 'Base64转图片',
        description: '在Base64编码和图片之间转换',
        downloadImage: '下载图片',
        inputBase64ImageRequired: '请输入Base64编码的图片',
        imagePreviewGenerated: '图片预览已生成',
        invalidBase64Image: '无效的Base64图片编码',
        downloadFailed: '图片下载失败'
      }
    },
    buttons: {
      process: '转换',
      copy: '复制结果',
      clear: '清空',
      generate: '生成',
      downloadPNG: '下载PNG'
    },
    messages: {
      inputRequired: '请输入要转换的内容',
      copySuccess: '已复制到剪贴板',
      error: '错误：',
      underDevelopment: '该功能正在开发中...',
      generateError: '生成错误',
      convertError: '转换错误',
      decodeError: '解码错误',
      inputTextRequired: '请输入要转换的文字',
      iconGenerated: '图标已生成，点击下载按钮保存',
      generateFirst: '请先生成图标'
    }
  },
  en: {
    appTitle: 'Developer Tools',
    appSubtitle: 'Empowering Developers and IT Professionals',
    menuItems: {
      'jsonformatter': 'JSON Formatter',
      'textencryption': 'Text Encryption',
      'base64converter': 'Base64 Converter',
      'caseconverter': 'Case Converter',
      'texttoascii': 'Text to ASCII',
      'texttounicode': 'Text to Unicode',
      'jsondiff': 'JSON Diff',
      'stringreverser': 'String Reverse',
      'textdiff': 'Text Diff',
      'asciiartgenerator': 'ASCII Art Text Generator',
      'xmlformatter': 'XML Formatter',
      'texticongenerator': 'Text Icon Generator',
      'base64imageconverter': 'Base64 to Image',
      'jsontojavabean': 'JSON to JavaBean'
    },
    tools: {
      'jsonformatter': {
        title: 'JSON Formatter',
        description: 'Format and validate JSON data with beautification options'
      },
      'textencryption': {
        title: 'Text Encryption',
        description: 'Encrypt and decrypt text using various algorithms',
        caesarCipher: 'Caesar Cipher',
        encrypt: 'Encrypt',
        decrypt: 'Decrypt',
        shiftPlaceholder: 'Shift amount',
        inputRequired: 'Please enter text to encrypt/decrypt',
        invalidBase64: 'Invalid Base64 encoding'
      },
      'base64converter': {
        title: 'Base64 Converter',
        description: 'Convert between files and Base64 encoding',
        defaultText: 'This is a sample text that will be converted to Base64.',
        selectFile: 'Select File',
        encode: 'Convert to Base64',
        decode: 'Base64 to File',
        inputRequired: 'Please enter text or select a file to convert',
        inputBase64Required: 'Please enter Base64 encoding',
        invalidBase64: 'Invalid Base64 encoding'
      },
      'caseconverter': {
        title: 'Case Converter',
        description: 'Convert text between different case formats',
        upperCase: 'To Uppercase',
        lowerCase: 'To Lowercase',
        titleCase: 'Title Case',
        sentenceCase: 'Sentence case'
      },
      'texttoascii': {
        title: 'ASCII Code Converter',
        description: 'Convert text to ASCII codes or binary, and vice versa',
        toAscii: 'To ASCII',
        toBinary: 'To Binary',
        toText: 'To Text',
        invalidAscii: 'Invalid ASCII code'
      },
      'texttounicode': {
        title: 'Text to Unicode Converter',
        description: 'Convert text to Unicode encoding or Unicode to text',
        defaultText: 'Enter text to convert',
        toUnicode: 'Convert to Unicode',
        toText: 'Convert to Text',
        uFormat: '\\u Format',
        uplusFormat: 'U+ Format',
        invalidUnicode: 'Invalid Unicode encoding'
      },
      'jsondiff': {
        title: 'JSON Diff',
        description: 'Compare differences between two JSON texts',
        json1: 'JSON 1',
        json2: 'JSON 2',
        json1Placeholder: 'Enter first JSON object...',
        json2Placeholder: 'Enter second JSON object...',
        diffResult: 'Diff result',
        noDiffFound: 'No differences found',
        compareError: 'Comparison error',
        added: 'Added',
        removed: 'Removed',
        typeChanged: 'Type changed',
        valueChanged: 'Value changed',
        unknownChange: 'Unknown change',
        openInWebsite: 'Open in jsdiff.com',
        textView: 'Text View',
        structuredView: 'Structured View'
      },
      'stringreverser': {
        title: 'String Reverse',
        description: 'Reverse the order of characters, words or sentences in a string',
        defaultText: 'This is a sample string to demonstrate reverse functionality',
        reverseByChar: 'Reverse by character',
        reverseByWord: 'Reverse by word',
        reverseBySentence: 'Reverse by sentence'
      },
      'textdiff': {
        title: 'Text Diff',
        description: 'Compare differences between two text blocks',
        character: 'Character level',
        word: 'Word level',
        line: 'Line level',
        text1: 'Text 1',
        text2: 'Text 2',
        text1Placeholder: 'Enter first text block...',
        text2Placeholder: 'Enter second text block...',
        diffResult: 'Diff result',
        inputRequired: 'Please enter two text blocks to compare',
        openInWebsite: 'Open in jsdiff.com'
      },
      'asciiartgenerator': {
        title: 'ASCII Art Text Generator',
        description: 'Convert plain text into ASCII art fonts',
        standardFont: 'Standard Font',
        blockFont: 'Block Font',
        simpleFont: 'Simple Font'
      },
      'xmlformatter': {
        title: 'XML Formatter',
        description: 'Format and validate XML data with beautification options'
      },
      'texticongenerator': {
        title: 'Text Icon Generator',
        description: 'Generate text-based icons with customizable styles',
        standardStyle: 'Standard style',
        roundedStyle: 'Rounded style',
        outlineStyle: 'Outline style',
        textColor: 'Text color',
        bgColor: 'Background color',
        iconSize: 'Icon size',
        iconPreview: 'Icon preview'
      },
      'base64imageconverter': {
        title: 'Base64 to Image',
        description: 'Convert between Base64 encoding and images',
        downloadImage: 'Download Image',
        inputBase64ImageRequired: 'Please enter Base64 encoded image',
        imagePreviewGenerated: 'Image preview generated',
        invalidBase64Image: 'Invalid Base64 image encoding',
        downloadFailed: 'Image download failed'
      }
    },
    buttons: {
      process: 'Convert',
      copy: 'Copy Result',
      clear: 'Clear',
      generate: 'Generate',
      downloadPNG: 'Download PNG'
    },
    messages: {
      inputRequired: 'Please enter content to convert',
      copySuccess: 'Copied to clipboard',
      error: 'Error: ',
      underDevelopment: 'This feature is under development...',
      generateError: 'Generation error',
      convertError: 'Conversion error',
      decodeError: 'Decoding error',
      inputTextRequired: 'Please enter text to convert',
      iconGenerated: 'Icon generated, click download button to save',
      generateFirst: 'Please generate icon first'
    }
  }
};

export default i18n;