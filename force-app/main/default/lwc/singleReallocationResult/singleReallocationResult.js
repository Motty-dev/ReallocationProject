import { LightningElement, api, track } from 'lwc';

export default class SingleReallocationResult extends LightningElement {
    
    @api columns;
    @api selectedText;
    pageSize = 20;
    @track lastIndex = this.pageSize;
    _accountsData;
    @track displayedData = [];

    @api
    get accountsData() {
        return this._accountsData;
    }

    set accountsData(value) {
        this._accountsData = value;
        this.lastIndex = this.pageSize;  // Reset lastIndex when new data is received
        this.updateDisplayedData();      
    }

    updateDisplayedData() {
        this.displayedData = this._accountsData ? this._accountsData.slice(0, this.lastIndex) : [];
    }
    
    handleScroll(event) {
        const target = event.target;
        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            if (this.lastIndex < this._accountsData.length) {
                this.lastIndex += this.pageSize;
                this.updateDisplayedData();
            }
        }
    }
    
    handleRowSelection() {
        const selectedRows = this.template.querySelector('lightning-datatable').getSelectedRows();
        const selectedIds = selectedRows.map(row => row.Id);
        this.dispatchEvent(new CustomEvent('rowselection', { detail: selectedIds }));
    }
}
