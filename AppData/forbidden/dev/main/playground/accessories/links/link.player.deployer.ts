/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// link.player.deployer.ts

interface LinkPlayerDeployerConfig {
    modalId: string;
    overlayClass: string;
    containerClass: string;
    headerClass: string;
    bodyClass: string;
    footerClass: string;
    titleText: string;
    urlPlaceholder: string;
    fileTypes: string[];
    onDeploy: (data: DeployerData) => void;
    onCancel: () => void;
  }
  
  interface DeployerData {
    type: 'url' | 'file';
    url?: string;
    file?: File;
    fileContent?: string;
  }
  
  class LinkPlayerDeployer {
    private config: LinkPlayerDeployerConfig;
    private selectedFile: File | null = null;
    private currentUrl: string = '';
    private isVisible: boolean = false;
  
    // Template placeholders
    private readonly TEMPLATE = {
      MODAL_HTML: `
        <div id="{{MODAL_ID}}" class="{{OVERLAY_CLASS}}">
          <div class="{{CONTAINER_CLASS}}">
            <!-- Header -->
            <div class="{{HEADER_CLASS}}">
              <h2 class="{{TITLE_CLASS}}">{{TITLE_TEXT}}</h2>
              <button class="{{CLOSE_BTN_CLASS}}" data-action="close">
                <img src="{{CLOSE_ICON_SRC}}" alt="Close" class="{{CLOSE_ICON_CLASS}}">
              </button>
            </div>
  
            <!-- Body -->
            <div class="{{BODY_CLASS}}">
              <!-- URL Input Section -->
              <div class="{{INPUT_SECTION_CLASS}}">
                <label class="{{INPUT_LABEL_CLASS}}" for="{{URL_INPUT_ID}}">Video URL</label>
                <input 
                  type="url" 
                  id="{{URL_INPUT_ID}}" 
                  class="{{URL_INPUT_CLASS}}" 
                  placeholder="{{URL_PLACEHOLDER}}"
                  data-input="url"
                >
                <div id="{{URL_ERROR_ID}}" class="{{ERROR_MESSAGE_CLASS}}">Please enter a valid URL</div>
                <div id="{{URL_SUCCESS_ID}}" class="{{SUCCESS_MESSAGE_CLASS}}">✓ Valid URL detected</div>
              </div>
  
              <!-- Divider -->
              <div class="{{DIVIDER_CLASS}}">
                <span>OR</span>
              </div>
  
              <!-- File Upload Section -->
              <div class="{{FILE_UPLOAD_AREA_CLASS}}" data-action="file-upload">
                <div class="{{FILE_UPLOAD_ICON_CLASS}}">📄</div>
                <div class="{{FILE_UPLOAD_TEXT_CLASS}}">Upload a file with video links</div>
                <div class="{{FILE_UPLOAD_HINT_CLASS}}">Supports {{FILE_TYPES}}</div>
                <input 
                  type="file" 
                  id="{{FILE_INPUT_ID}}" 
                  class="{{FILE_INPUT_CLASS}}" 
                  accept="{{FILE_ACCEPT}}"
                  data-input="file"
                  style="opacity: 0; position: absolute; cursor: pointer;"
                >
              </div>
              <div id="{{SELECTED_FILE_ID}}" class="{{SELECTED_FILE_CLASS}}" style="display: none;">
                <span>📎</span>
                <span id="{{FILE_NAME_ID}}"></span>
              </div>
            </div>
  
            <!-- Footer -->
            <div class="{{FOOTER_CLASS}}">
              <button class="{{BTN_CLASS}} {{BTN_CANCEL_CLASS}}" data-action="cancel">Cancel</button>
              <button id="{{GO_BTN_ID}}" class="{{BTN_CLASS}} {{BTN_GO_CLASS}}" data-action="go" disabled>
                <span>🚀</span>
                Go
              </button>
            </div>
          </div>
        </div>
      `,
  
      CSS_CLASSES: {
        // Modal structure
        OVERLAY_CLASS: 'linkPlayerDeployerOverlay',
        CONTAINER_CLASS: 'linkPlayerDeployerContainer',
        HEADER_CLASS: 'linkPlayerDeployerHeader',
        BODY_CLASS: 'linkPlayerDeployerBody',
        FOOTER_CLASS: 'linkPlayerDeployerFooter',
        
        // Header elements
        TITLE_CLASS: 'linkPlayerDeployerTitle',
        CLOSE_BTN_CLASS: 'linkPlayerDeployerCloseBtn',
        CLOSE_ICON_CLASS: 'linkPlayerDeployerCloseIcon',
        
        // Input elements
        INPUT_SECTION_CLASS: 'linkPlayerDeployerInputSection',
        INPUT_LABEL_CLASS: 'linkPlayerDeployerInputLabel',
        URL_INPUT_CLASS: 'linkPlayerDeployerUrlInput',
        ERROR_MESSAGE_CLASS: 'linkPlayerDeployerErrorMessage',
        SUCCESS_MESSAGE_CLASS: 'linkPlayerDeployerSuccessMessage',
        
        // Divider
        DIVIDER_CLASS: 'linkPlayerDeployerDivider',
        
        // File upload
        FILE_UPLOAD_AREA_CLASS: 'linkPlayerDeployerFileUploadArea',
        FILE_UPLOAD_ICON_CLASS: 'linkPlayerDeployerFileUploadIcon',
        FILE_UPLOAD_TEXT_CLASS: 'linkPlayerDeployerFileUploadText',
        FILE_UPLOAD_HINT_CLASS: 'linkPlayerDeployerFileUploadHint',
        FILE_INPUT_CLASS: 'linkPlayerDeployerFileInput',
        SELECTED_FILE_CLASS: 'linkPlayerDeployerSelectedFile',
        
        // Buttons
        BTN_CLASS: 'linkPlayerDeployerBtn',
        BTN_CANCEL_CLASS: 'linkPlayerDeployerBtnCancel',
        BTN_GO_CLASS: 'linkPlayerDeployerBtnGo'
      },
  
      IDS: {
        MODAL_ID: 'linkPlayerDeployerModal',
        URL_INPUT_ID: 'linkPlayerDeployerUrlInput',
        URL_ERROR_ID: 'linkPlayerDeployerUrlError',
        URL_SUCCESS_ID: 'linkPlayerDeployerUrlSuccess',
        FILE_INPUT_ID: 'linkPlayerDeployerFileInput',
        SELECTED_FILE_ID: 'linkPlayerDeployerSelectedFile',
        FILE_NAME_ID: 'linkPlayerDeployerFileName',
        GO_BTN_ID: 'linkPlayerDeployerGoBtn'
      }
    };
  
    constructor(config: Partial<LinkPlayerDeployerConfig> = {}) {
      this.config = {
        modalId: 'linkPlayerDeployerModal',
        overlayClass: 'linkPlayerDeployerOverlay',
        containerClass: 'linkPlayerDeployerContainer',
        headerClass: 'linkPlayerDeployerHeader',
        bodyClass: 'linkPlayerDeployerBody',
        footerClass: 'linkPlayerDeployerFooter',
        titleText: 'Link Player Deployer',
        urlPlaceholder: 'https://youtube.com/watch?v=... or any video URL',
        fileTypes: ['.txt', '.json', '.md'],
        onDeploy: (data) => console.log('Deploy:', data),
        onCancel: () => console.log('Cancelled'),
        ...config
      };
    }
  
    public init(): void {
      this.createModal();
      this.attachEventListeners();
    }
  
    public show(): void {
      const modal = document.getElementById(this.config.modalId);
      if (modal) {
        modal.classList.add('linkPlayerDeployerActive');
        document.body.style.overflow = 'hidden';
        this.isVisible = true;
      }
    }
  
    public hide(): void {
      const modal = document.getElementById(this.config.modalId);
      if (modal) {
        modal.classList.remove('linkPlayerDeployerActive');
        document.body.style.overflow = 'auto';
        this.isVisible = false;
        this.resetForm();
      }
    }
  
    private createModal(): void {
      // Check if modal already exists
      if (document.getElementById(this.config.modalId)) {
        return;
      }
  
      const modalHtml = this.processTemplate(this.TEMPLATE.MODAL_HTML);
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
  
    private processTemplate(template: string): string {
      const replacements = {
        ...this.TEMPLATE.CSS_CLASSES,
        ...this.TEMPLATE.IDS,
        TITLE_TEXT: this.config.titleText,
        URL_PLACEHOLDER: this.config.urlPlaceholder,
        FILE_TYPES: this.config.fileTypes.join(', '),
        FILE_ACCEPT: this.config.fileTypes.join(','),
        CLOSE_ICON_SRC: this.getCloseIconSrc()
      };
  
      let processedTemplate = template;
      Object.entries(replacements).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processedTemplate = processedTemplate.replace(regex, value);
      });
  
      return processedTemplate;
    }
  
    private getCloseIconSrc(): string {
      return "/assets/others/close.png";
    }
  
    private attachEventListeners(): void {
      const modal = document.getElementById(this.config.modalId);
      if (!modal) return;

      // File input and upload area
      const fileInput = document.getElementById(this.TEMPLATE.IDS.FILE_INPUT_ID) as HTMLInputElement;
      const fileUploadArea = modal.querySelector(`.${this.TEMPLATE.CSS_CLASSES.FILE_UPLOAD_AREA_CLASS}`);
      
      if (fileInput && fileUploadArea) {
        // Handle file input change
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Handle click on upload area
        fileUploadArea.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          fileInput.click();
        });

        // Handle drag and drop
        fileUploadArea.addEventListener('dragover', (e) => {
          e.preventDefault();
          fileUploadArea.classList.add('linkPlayerDeployerDragOver');
        });

        fileUploadArea.addEventListener('dragleave', (e) => {
          e.preventDefault();
          fileUploadArea.classList.remove('linkPlayerDeployerDragOver');
        });

        fileUploadArea.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          fileUploadArea.classList.remove('linkPlayerDeployerDragOver');
          
          const dragEvent = e as DragEvent;
          const files = dragEvent.dataTransfer?.files;
          if (files?.[0] && this.isValidFileType(files[0])) {
            this.selectedFile = files[0];
            this.showSelectedFile(files[0].name);
            this.updateGoButton();
            
            // Create a new FileList to set the file input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(files[0]);
            fileInput.files = dataTransfer.files;
          }
        });
      }

      // URL input validation
      const urlInput = document.getElementById(this.TEMPLATE.IDS.URL_INPUT_ID) as HTMLInputElement;
      if (urlInput) {
        ['input', 'paste'].forEach(event => {
          urlInput.addEventListener(event, () => this.validateInput());
        });
      }

      // Modal actions
      modal.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const actionElement = target.closest('[data-action]');
        if (!actionElement) return;

        const action = actionElement.getAttribute('data-action');
        if (action === 'close' || action === 'cancel') {
          e.preventDefault();
          this.handleCancel();
        } else if (action === 'go') {
          e.preventDefault();
          void this.handleDeploy();
        }
      });

      // Close modal on overlay click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.handleCancel();
        }
      });

      // Keyboard events
      document.addEventListener('keydown', (e) => {
        if (this.isVisible && e.key === 'Escape') {
          this.handleCancel();
        }
      });
    }
  
    private validateInput(): void {
      const urlInput = document.getElementById(this.TEMPLATE.IDS.URL_INPUT_ID) as HTMLInputElement;
      const errorDiv = document.getElementById(this.TEMPLATE.IDS.URL_ERROR_ID);
      const successDiv = document.getElementById(this.TEMPLATE.IDS.URL_SUCCESS_ID);
      
      if (!urlInput || !errorDiv || !successDiv) return;
  
      const url = urlInput.value.trim();
  
      if (url === '') {
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';
        this.currentUrl = '';
      } else if (this.isValidUrl(url)) {
        errorDiv.style.display = 'none';
        successDiv.style.display = 'block';
        this.currentUrl = url;
      } else {
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        this.currentUrl = '';
      }
      
      this.updateGoButton();
    }
  
    private isValidUrl(string: string): boolean {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    }
  
  
    private handleFileSelect(event: Event): void {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file && this.isValidFileType(file)) {
        this.selectedFile = file;
        this.showSelectedFile(file.name);
        this.updateGoButton();
      }
    }
  
    private isValidFileType(file: File): boolean {
      const fileName = file.name.toLowerCase();
      return this.config.fileTypes.some(type => fileName.endsWith(type));
    }
  
    private showSelectedFile(fileName: string): void {
      const selectedFileDiv = document.getElementById(this.TEMPLATE.IDS.SELECTED_FILE_ID);
      const fileNameSpan = document.getElementById(this.TEMPLATE.IDS.FILE_NAME_ID);
      
      if (selectedFileDiv && fileNameSpan) {
        fileNameSpan.textContent = fileName;
        selectedFileDiv.style.display = 'flex';
      }
    }
  
    private updateGoButton(): void {
      const goBtn = document.getElementById(this.TEMPLATE.IDS.GO_BTN_ID) as HTMLButtonElement;
      if (goBtn) {
        goBtn.disabled = !this.currentUrl && !this.selectedFile;
      }
    }
  
    private resetForm(): void {
      const urlInput = document.getElementById(this.TEMPLATE.IDS.URL_INPUT_ID) as HTMLInputElement;
      const fileInput = document.getElementById(this.TEMPLATE.IDS.FILE_INPUT_ID) as HTMLInputElement;
      const selectedFileDiv = document.getElementById(this.TEMPLATE.IDS.SELECTED_FILE_ID);
      const errorDiv = document.getElementById(this.TEMPLATE.IDS.URL_ERROR_ID);
      const successDiv = document.getElementById(this.TEMPLATE.IDS.URL_SUCCESS_ID);
  
      if (urlInput) urlInput.value = '';
      if (fileInput) fileInput.value = '';
      if (selectedFileDiv) selectedFileDiv.style.display = 'none';
      if (errorDiv) errorDiv.style.display = 'none';
      if (successDiv) successDiv.style.display = 'none';
  
      this.selectedFile = null;
      this.currentUrl = '';
      this.updateGoButton();
    }
  
    private async handleDeploy(): Promise<void> {
      const deployerData: DeployerData = {
        type: this.currentUrl ? 'url' : 'file',
        url: this.currentUrl || undefined,
        file: this.selectedFile || undefined
      };
  
      // If file is selected, read its content
      if (this.selectedFile) {
        try {
          deployerData.fileContent = await this.readFileContent(this.selectedFile);
        } catch (error) {
          console.error('Error reading file:', error);
          return;
        }
      }
  
      this.config.onDeploy(deployerData);
      this.hide();
    }
  
    private handleCancel(): void {
      this.config.onCancel();
      this.hide();
    }
  
    private readFileContent(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });
    }
  
    // Public methods for external control
    public setConfig(config: Partial<LinkPlayerDeployerConfig>): void {
      this.config = { ...this.config, ...config };
    }
  
    public isOpen(): boolean {
      return this.isVisible;
    }
  
    public destroy(): void {
      const modal = document.getElementById(this.config.modalId);
      if (modal) {
        modal.remove();
      }
    }
  }
  
  // Usage example:
  /*
  const deployer = new LinkPlayerDeployer({
    titleText: 'Video Link Deployer',
    onDeploy: (data) => {
      console.log('Deploying:', data);
      // Handle the deployment logic here
      // data.type will be 'url' or 'file'
      // data.url will contain the URL if type is 'url'
      // data.file and data.fileContent will contain file data if type is 'file'
    },
    onCancel: () => {
      console.log('Deployment cancelled');
    }
  });
  
  deployer.init();
  
  // To show the modal (e.g., when clicking your icon):
  document.getElementById('accessories-link-player-btn')?.addEventListener('click', () => {
    deployer.show();
  });
  */
  
  export default LinkPlayerDeployer;