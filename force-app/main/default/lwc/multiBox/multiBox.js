import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class MultiBox extends LightningElement {

    @api label; 
    @api options; 
    @api componentId;                     
    @api placeholder;
    @api isinputenabled;
    @track showDropdown = false; 
    
    get myOptions() {
        return this.options ? this.options : [];
    }

    get displayedValues() {
        const temp = this.myOptions.filter(item => item.isChecked).map(item => item.Name).join(', ');
        return temp.length ? temp : '';
    }

    get selectedItems() {
        return this.myOptions.filter(item => item.isChecked).map(item => item.Id);
    }

    get isDisabled() {
        return !this.isinputenabled;
    }

    handleSelection(event) {
        
        const isSelected = event.target.checked;
        const index = event.target.dataset.index;
        
        this.dispatchEvent(new CustomEvent('changebox', {
            detail: {
                index: index,
                checked: isSelected
            }
        }));
    }

    handleApply() {
        if(this.selectedItems.length == 0) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'ERROR',
                message: 'You need to select at least one box !',
                variant: 'error'
            }));
        }
        else {
            this.dispatchEvent(new CustomEvent('clickapply', {
                detail: { 
                    componentId: this.componentId, 
                    selectedValues: this.selectedItems 
                }
            }));
            this.closeDropdown();
        }

        this.selectedItems.forEach(item => console.log(item))
    }
    handleSearch(event) {
        this.dispatchEvent(new CustomEvent('searchbox', {
            detail: {
                search: event.target.value
            }
        }))
    }
    selectAll() {
        this.dispatchEvent(new CustomEvent('selectall', {
            detail: {
                componentId: this.componentId
            }
        }));
    }

    deselectAll() {
        this.dispatchEvent(new CustomEvent('deselectall', {
            detail: {
                componentId: this.componentId
            }
        }));
    }

    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }

    closeDropdown() {
        this.showDropdown = false;
    }
}