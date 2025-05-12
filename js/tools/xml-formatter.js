import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';

export class XMLFormatter extends BaseTool {
  constructor() {
    super();
    this.defaultValue = '<note>\n  <to>Tove</to>\n  <from>Jani</from>\n  <heading>Reminder</heading>\n  <body>Don\'t forget me this weekend!</body>\n</note>';
    this.indentSize = 2;
    this.collapseEnabled = false;
  }

  show() {
    this.container.innerHTML = this.createUI()
    
    const input = document.getElementById('input');
    if (input) input.value = this.defaultValue;
    
    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();
  }

  setupSpecificEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const input = document.getElementById('input');
    const output = document.getElementById('output');


    if (processBtn) {
        processBtn.addEventListener('click', () => {
        try {
          const inputText = input.value.trim();
          if (!inputText) {
            output.value = '请输入要格式化的XML代码';
            return;
          }
          
          output.value = this.formatXML(inputText);
        } catch (error) {
          output.value = `XML格式化错误：${error.message}`;
        }
      });
    }

    // 调用父类的通用事件监听器设置
    this.setupCommonEventListeners();
  }


  formatXML(sourceXml)
  {
      var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
      var xsltDoc = new DOMParser().parseFromString([
          // describes how we want to modify the XML - indent everything
          '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
          '  <xsl:strip-space elements="*"/>',
          '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
          '    <xsl:value-of select="normalize-space(.)"/>',
          '  </xsl:template>',
          '  <xsl:template match="node()|@*">',
          '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
          '  </xsl:template>',
          '  <xsl:output indent="yes"/>',
          '</xsl:stylesheet>',
      ].join('\n'), 'application/xml');
  
      var xsltProcessor = new XSLTProcessor();    
      xsltProcessor.importStylesheet(xsltDoc);
      var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
      var resultXml = new XMLSerializer().serializeToString(resultDoc);
      return resultXml;
  }

}