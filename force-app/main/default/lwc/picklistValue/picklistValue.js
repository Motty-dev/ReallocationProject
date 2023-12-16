import { LightningElement, api, track } from 'lwc';
import  styleCss  from '@salesforce/resourceUrl/styleCss';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class GenericMultiSelectCombobox extends LightningElement {
    @api label; // Label for the combobox
    @api options = []; // Array of options for the combobox
    @track selectedValues = []; // Tracks the selected values
    @track dropdownOpen = false; // State to track if the dropdown is open

    renderedCallback() {
        
        Promise.all([
            loadStyle( this, styleCss )
            ]).then(() => {
                console.log( 'Files loaded' );
            })
            .catch(error => {
                console.log( error.body.message );
        });

    }    // Toggle dropdown
    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
    }

    // Handle option selection
    handleOptionChange(event) {
        const value = event.target.dataset.value;
        const index = this.selectedValues.indexOf(value);
        if (index === -1) {
            this.selectedValues.push(value);
        } else {
            this.selectedValues.splice(index, 1);
        }
    }

    // Handle Apply button click
    handleApply() {
        this.toggleDropdown();
        this.dispatchEvent(new CustomEvent('selectionchange', {
            detail: this.selectedValues
        }));
    }
}
