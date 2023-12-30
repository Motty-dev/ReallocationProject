import { LightningElement, api, track } from 'lwc';

export default class SingleReallocationResult extends LightningElement {
    
    _accountsData;
    searchTimeout;
    pageSize = 20;
    @api columns;
    @api selectedText;
    @track displayedData = [];
    @track lastIndex = this.pageSize;

    
    @api countryOptions = [];
    @api boutiqueOptions = []; 
    @track segmentOptions = []; 
    @api selectedCountry = '';
    @api selectedBoutique = '';
    @track selectedSegment = '';
    
    @api
    get accountsData() {
        return this._accountsData;
    }


    set accountsData(value) {
        this._accountsData = value;
        this.lastIndex = this.pageSize; 
        this.processSegments(); 
        this.updateDisplayedData();     
    }


    updateDisplayedData() {
        this.applyFilters();
    }

    applyFilters() {
        this.displayedData = this._accountsData ? this._accountsData.filter(item =>
            (!this.selectedCountry || item.Country === this.selectedCountry) &&
            (!this.selectedBoutique || item.boutiqueName === this.selectedBoutique) &&
            (!this.selectedSegment || item.Segment__c === this.selectedSegment)
        ).slice(0, this.lastIndex) : [];
    }

    processSegments() {
        const segments = new Set(this._accountsData.map(account => account.Segment__c));
        this.segmentOptions = [{ label: 'None', value: '' }, ...Array.from(segments).map(segment => ({ label: segment, value: segment }))];    }
    
    handleScroll(event) {
        const target = event.target;
        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            if (this.lastIndex < this._accountsData.length) {
                this.lastIndex += this.pageSize;
                this.applyFilters();
            }
        }
    }

    handleRowSelection() {
        const selectedRows = this.template.querySelector('lightning-datatable').getSelectedRows();
        const selectedIds = selectedRows.map(row => row.Id);
        this.dispatchEvent(new CustomEvent('rowselection', { detail: selectedIds }));
    }

    handleSearch(event) {
        clearTimeout(this.searchTimeout);
        const searchTerm = event.target.value.toLowerCase();

        this.searchTimeout = setTimeout(() => {
            this.applyFilters();
            this.displayedData = this.displayedData.filter(item =>
                item.clientName.toLowerCase().includes(searchTerm) ||
                item.Id.toString().toLowerCase().includes(searchTerm)
            );
        }, 200);
    }

    handleCountryChange(event) {
        this.selectedCountry = event.detail.value;
        this.applyFilters();
    }

    handleBoutiqueChange(event) {
        this.selectedBoutique = event.detail.value;
        this.applyFilters();
    }

    handleSegmentChange(event) {
        this.selectedSegment = event.detail.value;
        this.applyFilters();
    }
}

