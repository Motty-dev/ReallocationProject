import { LightningElement,track } from 'lwc';

export default class SingleReallocation extends LightningElement {
    @track countryOptions = [];
    @track saBoutiqueOptions = [];
    @track mainSaOptions = [];
    @track selectedCountry;
    @track selectedSaBoutique;
    @track selectedMainSa;

    handleComboboxChange(event) {
        const fieldName = event.target.name;
        const selectedValue = event.detail.value;
        
        if (fieldName === 'country') {
            this.selectedCountry = selectedValue;
        } else if (fieldName === 'saBoutique') {
            this.selectedSaBoutique = selectedValue;
        } else if (fieldName === 'mainSa') {
            this.selectedMainSa = selectedValue;
        }
        // Additional logic for when a combobox value changes
    }

    handleSearch() {
        // Logic to perform the search based on selected values
    }
}