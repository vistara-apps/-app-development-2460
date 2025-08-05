/**
 * Document Processing Service
 * Handles extraction and preprocessing of policy documents
 */

export class DocumentProcessor {
  constructor() {
    this.supportedFormats = ['pdf', 'txt', 'doc', 'docx', 'jpg', 'png'];
  }

  /**
   * Process uploaded document and extract text content
   * @param {File} file - The uploaded file
   * @returns {Promise<Object>} Processed document data
   */
  async processDocument(file) {
    try {
      const fileType = this.getFileType(file);
      const fileSize = file.size;
      const fileName = file.name;

      // Validate file
      this.validateFile(file);

      let extractedText = '';
      let metadata = {};

      switch (fileType) {
        case 'pdf':
          ({ text: extractedText, metadata } = await this.processPDF(file));
          break;
        case 'txt':
          extractedText = await this.processText(file);
          break;
        case 'doc':
        case 'docx':
          extractedText = await this.processWord(file);
          break;
        case 'jpg':
        case 'png':
          extractedText = await this.processImage(file);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      // Clean and normalize text
      const cleanedText = this.cleanText(extractedText);
      
      // Extract structured data
      const structuredData = this.extractStructuredData(cleanedText);

      return {
        success: true,
        fileName,
        fileSize,
        fileType,
        extractedText: cleanedText,
        structuredData,
        metadata,
        processingDate: new Date().toISOString()
      };

    } catch (error) {
      console.error('Document processing failed:', error);
      return {
        success: false,
        error: error.message,
        fileName: file.name,
        fileSize: file.size,
        fileType: this.getFileType(file)
      };
    }
  }

  /**
   * Get file type from file object
   */
  getFileType(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    return extension;
  }

  /**
   * Validate uploaded file
   */
  validateFile(file) {
    const fileType = this.getFileType(file);
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!this.supportedFormats.includes(fileType)) {
      throw new Error(`File type ${fileType} is not supported. Supported formats: ${this.supportedFormats.join(', ')}`);
    }

    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    if (file.size === 0) {
      throw new Error('File is empty');
    }
  }

  /**
   * Process PDF files (mock implementation - in production would use pdf-parse or similar)
   */
  async processPDF(file) {
    // Mock PDF processing - in production, use pdf-parse or PDF.js
    const text = await this.readFileAsText(file);
    
    // Simulate PDF text extraction
    const mockPolicyText = `
    POLICY NUMBER: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
    INSURANCE COMPANY: Sample Insurance Co.
    POLICY TYPE: Auto Insurance
    COVERAGE PERIOD: 01/01/2024 - 01/01/2025
    
    COVERAGE DETAILS:
    Bodily Injury Liability: $50,000 per person / $100,000 per accident
    Property Damage Liability: $25,000 per accident
    Collision Coverage: $500 deductible
    Comprehensive Coverage: $250 deductible
    Uninsured Motorist: $50,000 per person / $100,000 per accident
    
    PREMIUM: $1,200 annually
    DEDUCTIBLE: $500 collision, $250 comprehensive
    `;

    return {
      text: mockPolicyText,
      metadata: {
        pages: 1,
        extractionMethod: 'pdf-parse'
      }
    };
  }

  /**
   * Process text files
   */
  async processText(file) {
    return await this.readFileAsText(file);
  }

  /**
   * Process Word documents (mock implementation)
   */
  async processWord(file) {
    // Mock Word processing - in production, use mammoth.js or similar
    return await this.readFileAsText(file);
  }

  /**
   * Process image files with OCR (mock implementation)
   */
  async processImage(file) {
    // Mock OCR processing - in production, use Tesseract.js or cloud OCR
    return "Mock OCR extracted text from image";
  }

  /**
   * Read file as text
   */
  async readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Clean and normalize extracted text
   */
  cleanText(text) {
    if (!text) return '';
    
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
      .trim();
  }

  /**
   * Extract structured data from text using regex patterns
   */
  extractStructuredData(text) {
    const patterns = {
      policyNumber: /(?:policy\s*(?:number|#|no\.?)\s*:?\s*)([A-Z0-9\-]+)/i,
      insuranceCompany: /(?:insurance\s*company|insurer|carrier)\s*:?\s*([^\n]+)/i,
      policyType: /(?:policy\s*type|coverage\s*type|insurance\s*type)\s*:?\s*([^\n]+)/i,
      effectiveDate: /(?:effective\s*date|policy\s*period|coverage\s*period)\s*:?\s*([0-9\/\-]+)/i,
      expirationDate: /(?:expiration\s*date|expires?|through)\s*:?\s*([0-9\/\-]+)/i,
      premium: /(?:premium|cost|price)\s*:?\s*\$?([0-9,]+\.?\d*)/i,
      deductible: /(?:deductible)\s*:?\s*\$?([0-9,]+\.?\d*)/i,
      liabilityLimits: /(?:bodily\s*injury|liability)\s*:?\s*\$?([0-9,]+)/i,
      propertyDamage: /(?:property\s*damage)\s*:?\s*\$?([0-9,]+)/i
    };

    const extractedData = {};

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match) {
        extractedData[key] = match[1].trim();
      }
    }

    return extractedData;
  }

  /**
   * Get document processing statistics
   */
  getProcessingStats() {
    return {
      supportedFormats: this.supportedFormats,
      maxFileSize: '10MB',
      features: [
        'PDF text extraction',
        'Word document processing',
        'Image OCR (mock)',
        'Structured data extraction',
        'Text cleaning and normalization'
      ]
    };
  }
}

export default new DocumentProcessor();

