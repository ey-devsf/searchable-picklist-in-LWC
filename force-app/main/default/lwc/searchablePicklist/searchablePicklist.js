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
        
        this.filterOptions();
        this.showDropdown = true;
    }
    
    handleBlur(event) {
        // If we're intentionally moving focus to dropdown, don't close it
        if (this._isMovingFocusToDropdown) {
            this._isMovingFocusToDropdown = false;
            return;
        }
        
        setTimeout(() => {
            const relatedTarget = event.relatedTarget;
            const dropdown = this.template.querySelector('.dropdown-container');
            
            if (!relatedTarget || !dropdown || !dropdown.contains(relatedTarget)) {
                const exactMatch = this.filteredOptions.filter(option => 
                    option.label.toLowerCase() === this.inputText.toLowerCase().trim()
                );
                
                if (exactMatch.length === 1) {
                    this.selectedOption = exactMatch[0];
                    this.inputText = exactMatch[0].label;
                }
                
                this.showDropdown = false;
            }
        }, 150);
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
    
    handleListMouseDown(event) {
        event.preventDefault();
    }
    
    selectOption(option) {
        this.selectedOption = option;
        this.inputText = option.label;
        this.showDropdown = false;
        this._justSelectedOption = true;
        this.focusSearchInput();
        
        this.dispatchEvent(new CustomEvent('optionselected', {
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
