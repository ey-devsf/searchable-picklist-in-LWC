import { LightningElement, api, track } from 'lwc';

export default class SearchablePicklist extends LightningElement {
    @api options = [];
    @api initValue = '';
    @api initSearchValue = '';
    
    @track inputText = '';
    @track selectedOption = null;
    @track showDropdown = false;
    @track filteredOptions = [];
    
    _isMovingFocusToDropdown = false;
    _justSelectedOption = false;
    _justClosedFromDropdown = false;
    
    // Delay for blur event handlers to allow relatedTarget to be set
    BLUR_DELAY = 150;
    
    connectedCallback() {
        if (this.initSearchValue) {
            this.inputText = this.initSearchValue;
            this.filterOptions();
        }
        
        if (this.initValue && this.options.length > 0) {
            const option = this.options.find(opt => opt.value === this.initValue);
            if (option) {
                this.selectedOption = option;
                this.inputText = option.label;
            }
        }
    }
    
    @api
    getInputText() {
        return this.inputText;
    }
    
    @api
    getSelectedOption() {
        return this.selectedOption;
    }
    
    get hasFilteredOptions() {
        return this.filteredOptions && this.filteredOptions.length > 0;
    }
    
    filterOptions() {
        const searchTerm = this.inputText.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredOptions = [...this.options];
        } else {
            this.filteredOptions = this.options.filter(option => 
                option.label.toLowerCase().includes(searchTerm)
            );
        }
    }
    
    handleFocus() {
        // If we just selected an option, don't reopen the dropdown
        if (this._justSelectedOption) {
            this._justSelectedOption = false;
            return;
        }
        
        // If we just closed from dropdown blur, don't reopen
        if (this._justClosedFromDropdown) {
            this._justClosedFromDropdown = false;
            return;
        }
        
        this.filterOptions();
        this.showDropdown = true;
    }
    
    handleBlur(event) {
        setTimeout(() => {
            // If we're intentionally moving focus to dropdown, don't close it or auto-select
            if (this._isMovingFocusToDropdown) {
                this._isMovingFocusToDropdown = false;
                return;
            }
            
            const relatedTarget = event.relatedTarget;
            const dropdown = this.template.querySelector('.dropdown-container');
            
            // Only close dropdown and auto-select if focus is NOT moving to the dropdown
            if (!relatedTarget || !dropdown || !dropdown.contains(relatedTarget)) {
                const previousSelectedOption = this.selectedOption;
                
                // Auto-select if there's exactly one filtered option
                if (this.filteredOptions.length === 1) {
                    this.selectedOption = this.filteredOptions[0];
                    this.inputText = this.filteredOptions[0].label;
                } else {
                    // Multiple or no options, clear selection
                    this.selectedOption = null;
                }
                
                // Notify parent component if selection state changed
                if (previousSelectedOption !== this.selectedOption) {
                    this.notifySelectionChange();
                }
                
                this.showDropdown = false;
            }
        }, this.BLUR_DELAY);
    }
    
    handleInputChange(event) {
        this.inputText = event.target.value;
        this.filterOptions();
        this.showDropdown = true;
    }
    
    handleInputKeyDown(event) {
        if (event.key === 'Tab' || event.key === 'ArrowDown') {
            if (this.showDropdown && this.filteredOptions.length > 0) {
                event.preventDefault();
                this._isMovingFocusToDropdown = true;
                this.focusFirstOption();
            }
        } else if (event.key === 'Enter') {
            if (this.filteredOptions.length === 1) {
                this.selectOption(this.filteredOptions[0]);
            }
        } else if (event.key === 'Escape') {
            this.showDropdown = false;
        }
    }
    
    handleOptionClick(event) {
        const value = event.currentTarget.dataset.value;
        const label = event.currentTarget.dataset.label;
        
        const option = this.options.find(opt => opt.value === value);
        if (option) {
            this.selectOption(option);
        }
    }
    
    handleOptionKeyDown(event) {
        const currentIndex = parseInt(event.currentTarget.dataset.index, 10);
        const totalOptions = this.filteredOptions.length;
        
        if (event.key === 'Enter') {
            event.preventDefault();
            const value = event.currentTarget.dataset.value;
            const option = this.options.find(opt => opt.value === value);
            if (option) {
                this.selectOption(option);
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (currentIndex === 0) {
                this.focusSearchInput();
            } else {
                this.focusOptionByIndex(currentIndex - 1);
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (currentIndex === totalOptions - 1) {
                this.focusSearchInput();
            } else {
                this.focusOptionByIndex(currentIndex + 1);
            }
        } else if (event.key === 'Tab') {
            event.preventDefault();
            if (event.shiftKey) {
                if (currentIndex === 0) {
                    this.focusSearchInput();
                } else {
                    this.focusOptionByIndex(currentIndex - 1);
                }
            } else {
                if (currentIndex === totalOptions - 1) {
                    this.focusSearchInput();
                } else {
                    this.focusOptionByIndex(currentIndex + 1);
                }
            }
        } else if (event.key === 'Escape') {
            this.showDropdown = false;
            this.focusSearchInput();
        }
    }
    
    handleOptionBlur(event) {
        setTimeout(() => {
            const relatedTarget = event.relatedTarget;
            const dropdown = this.template.querySelector('.dropdown-container');
            const searchInput = this.template.querySelector('[data-id="search-input"]');
            
            // Check if focus is moving to another dropdown item
            const movingToDropdown = dropdown && relatedTarget && dropdown.contains(relatedTarget);
            
            // If focus is leaving the dropdown entirely (not going to another dropdown item)
            if (!movingToDropdown) {
                const previousSelectedOption = this.selectedOption;
                
                // Auto-select if there's exactly one filtered option
                if (this.filteredOptions.length === 1) {
                    this.selectedOption = this.filteredOptions[0];
                    this.inputText = this.filteredOptions[0].label;
                } else {
                    // Multiple or no options, clear selection
                    this.selectedOption = null;
                }
                
                // Notify parent component if selection state changed
                if (previousSelectedOption !== this.selectedOption) {
                    this.notifySelectionChange();
                }
                
                this.showDropdown = false;
                
                // If focus is moving to the input, set flag to prevent reopening
                if (searchInput && relatedTarget === searchInput) {
                    this._justClosedFromDropdown = true;
                }
            }
        }, this.BLUR_DELAY);
    }
    
    handleListMouseDown(event) {
        event.preventDefault();
    }
    
    selectOption(option) {
        this.selectedOption = option;
        this.inputText = option.label;
        this.showDropdown = false;
        this._justSelectedOption = true;
        this.focusSearchInput();
        
        this.notifySelectionChange();
    }
    
    notifySelectionChange() {
        this.dispatchEvent(new CustomEvent('selectionchange', {
            detail: {
                selectedOption: this.selectedOption,
                inputText: this.inputText
            }
        }));
    }

    
    
    focusSearchInput() {
        const input = this.template.querySelector('[data-id="search-input"]');
        if (input) {
            input.focus();
        }
    }
    
    focusFirstOption() {
        const firstOption = this.template.querySelector('.dropdown-item');
        if (firstOption) {
            firstOption.focus();
        }
    }
    
    focusOptionByIndex(index) {
        const options = this.template.querySelectorAll('.dropdown-item');
        if (options && options[index]) {
            options[index].focus();
        }
    }
}
