import { getTextByXpath, getNodesByXpath } from './xmlUtils';

/**
 * 段落ノードの配列から整形済みテキストオブジェクトの配列を生成する
 * @param {Node} node - 段落の親となるノード
 * @param {Document} xmlDoc - XML Documentオブジェクト
 * @returns {Array<{number: string, text: string}>} 段落オブジェクトの配列
 */
const getParagraphs = (node, xmlDoc) => {
  if (!node) return [];
  // getNodesByXpathにxmlDocを渡す
  return getNodesByXpath('.//com:P | .//pat:P', node, xmlDoc).map(p => ({
    number: p.getAttribute('com:pNumber'),
    text: p.textContent.trim(),
  }));
};

/**
 * DTDフォーマット用の段落抽出ヘルパー関数
 * @param {Node} parentNode - 段落の親となるノード
 * @param {Document} xmlDoc - XML Documentオブジェクト
 * @returns {Array<{number: string, text: string}>} 段落オブジェクトの配列
 */
const getParagraphsDtd = (parentNode, xmlDoc) => {
  if (!parentNode) return [];
  return getNodesByXpath('.//p', parentNode, xmlDoc).map(p => ({
    number: p.getAttribute('num'),
    text: p.textContent.trim().replace(/\s+/g, ' '),
  }));
};

/**
 * DTDフォーマット用
 * 解析済みのXML Documentオブジェクトから特許データを抽出し、整形されたJSオブジェクトを返す
 * @param {Document} xmlDoc - parseXmlStringによって生成されたXML Documentオブジェクト
 * @returns {object} 整形された特許データオブジェクト
 */
export const extractPatentDataDtd = (xmlDoc) => {

  // --- 各セクションの親ノードを取得 ---
  const biblioData = getNodesByXpath('//bibliographic-data', xmlDoc, xmlDoc)[0];
  const descriptionNode = getNodesByXpath('//description', xmlDoc, xmlDoc)[0];
  const claimsNode = getNodesByXpath('//claims', xmlDoc, xmlDoc)[0];
  const abstractNode = getNodesByXpath('//abstract', xmlDoc, xmlDoc)[0];
  
  if (!biblioData) {
    console.error("DTD format: Bibliographic data section not found.");
    return null;
  }

  // YYYYMMDD形式をYYYY-MM-DD形式に変換するヘルパー関数
  const formatDate = (dateString) => {
    if (!dateString || dateString.length !== 8) return dateString;
    return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
  };

  return {
    // --- 書誌情報 ---
    inventionTitle: getTextByXpath('.//invention-title', biblioData, xmlDoc),
    publicationNumber: getTextByXpath('.//publication-reference/document-id/doc-number', biblioData, xmlDoc),
    publicationDate: formatDate(getTextByXpath('.//publication-reference/document-id/date', biblioData, xmlDoc)),
    applicationNumber: getTextByXpath('.//application-reference/document-id/doc-number', biblioData, xmlDoc),
    filingDate: formatDate(getTextByXpath('.//application-reference/document-id/date', biblioData, xmlDoc)),
    
    // --- 関係者情報 ---
    applicants: getNodesByXpath('.//parties/jp:applicants-agents-article//applicant//name', biblioData, xmlDoc).map(node => node.textContent.trim()),
    inventors: getNodesByXpath('.//parties/inventors//inventor//name', biblioData, xmlDoc).map(node => node.textContent.trim()),
    
    // --- 要約 ---
    abstract: getNodesByXpath('.//p', abstractNode, xmlDoc)
      .map(p => p.textContent.trim().replace(/\s+/g, ' ')).join('\n'),

    // --- 明細書 ---
    description: {
      technicalField: getParagraphsDtd(getNodesByXpath('.//technical-field', descriptionNode, xmlDoc)[0], xmlDoc),
      backgroundArt: getParagraphsDtd(getNodesByXpath('.//background-art', descriptionNode, xmlDoc)[0], xmlDoc),
      inventionSummary: getParagraphsDtd(getNodesByXpath('.//summary-of-invention', descriptionNode, xmlDoc)[0], xmlDoc),
      drawingDescription: getParagraphsDtd(getNodesByXpath('.//description-of-drawings', descriptionNode, xmlDoc)[0], xmlDoc),
      embodimentDescription: getParagraphsDtd(getNodesByXpath('.//description-of-embodiments', descriptionNode, xmlDoc)[0], xmlDoc),
    },

    // --- 請求の範囲 ---
    claims: getNodesByXpath('.//claim', claimsNode, xmlDoc).map(node => ({
      number: node.getAttribute('num'),
      text: getTextByXpath('.//claim-text', node, xmlDoc),
    })),
  };
};

/**
 * ST96フォーマット用
 * 解析済みのXML Documentオブジェクトから特許データを抽出し、整形されたJSオブジェクトを返す
 * @param {Document} xmlDoc - parseXmlStringによって生成されたXML Documentオブジェクト
 * @returns {object} 整形された特許データオブジェクト
 */
const extractPatentDataJppat = (xmlDoc) => {
  const biblioDataXpath = '//jppat:InternationalPatentPublicationBibliographicData | //jppat:UnexaminedPatentPublicationBibliographicData';
  const biblioData = getNodesByXpath(biblioDataXpath, xmlDoc, xmlDoc)[0];
  
  const descriptionNode = getNodesByXpath('//jppat:Description', xmlDoc, xmlDoc)[0];
  const claimsNode = getNodesByXpath('//pat:Claims', xmlDoc, xmlDoc)[0];
  const abstractNode = getNodesByXpath('//pat:Abstract', xmlDoc, xmlDoc)[0];

  return {
    inventionTitle: getTextByXpath('.//pat:InventionTitle', biblioData, xmlDoc),
    publicationNumber: getTextByXpath('.//pat:PublicationNumber', biblioData, xmlDoc),
    publicationDate: getTextByXpath('.//com:PublicationDate', biblioData, xmlDoc),
    applicationNumber: getTextByXpath('.//com:ApplicationNumberText', biblioData, xmlDoc),
    filingDate: getTextByXpath('.//pat:FilingDate', biblioData, xmlDoc),
    
    applicants: getNodesByXpath('.//jppat:Applicant', biblioData, xmlDoc).map(node => 
      getTextByXpath('.//com:EntityName', node, xmlDoc)
    ),
    inventors: getNodesByXpath('.//jppat:Inventor', biblioData, xmlDoc).map(node =>
      getTextByXpath('.//com:EntityName', node, xmlDoc)
    ),

    abstract: getParagraphs(abstractNode, xmlDoc).map(p => p.text).join('\n'),

    description: {
      technicalField: getParagraphs(getNodesByXpath('.//pat:TechnicalField', descriptionNode, xmlDoc)[0], xmlDoc),
      backgroundArt: getParagraphs(getNodesByXpath('.//pat:BackgroundArt', descriptionNode, xmlDoc)[0], xmlDoc),
      inventionSummary: getParagraphs(getNodesByXpath('.//pat:InventionSummary', descriptionNode, xmlDoc)[0], xmlDoc),
      drawingDescription: getParagraphs(getNodesByXpath('.//pat:DrawingDescription', descriptionNode, xmlDoc)[0], xmlDoc),
      embodimentDescription: getNodesByXpath('.//pat:EmbodimentDescription | .//pat:EmbodimentExample', descriptionNode, xmlDoc)
        .flatMap(node => getParagraphs(node, xmlDoc)),
    },

    claims: getNodesByXpath('.//pat:Claim', claimsNode, xmlDoc).map(node => ({
      number: getTextByXpath('.//pat:ClaimNumber', node, xmlDoc),
      text: getTextByXpath('.//pat:ClaimText', node, xmlDoc),
    })),
  };
};

/**
 * 解析済みのXML Documentオブジェクトから特許データを抽出し、整形されたJSオブジェクトを返す
 * @param {Document} xmlDoc - parseXmlStringによって生成されたXML Documentオブジェクト
 * @returns {object} 整形された特許データオブジェクト
 */
export const extractPatentData = (xmlDoc) => {
  if (xmlDoc.documentElement.tagName === 'jp-official-gazette') {
    // ルート要素が <jp-official-gazette> ならDTDフォーマットと判定
    return extractPatentDataDtd(xmlDoc);
  } else {
    // それ以外の場合はST96フォーマットと判定
    return extractPatentDataJppat(xmlDoc);
  }
};
